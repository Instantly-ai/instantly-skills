#!/usr/bin/env bash
# install.sh — installer for the Instantly Skills collection (Model A, personal install).
# Installs a shared core (auth/CLI/config/map) once, plus whichever skills you select. No MCP.
#
# Usage:
#   ./install.sh                      # interactive picker (choose which skills)
#   ./install.sh instantly-gtm [..]   # install named skill(s) + core
#   ./install.sh --all                # install every skill in this repo
#   ./install.sh --list               # list available skills, install nothing
#   ./install.sh --uninstall <name..> # remove named skill(s) (+ their shortcuts); keep core
#   ./install.sh --uninstall --all    # remove all skills; core kept unless --purge
#   ./install.sh --purge              # also remove the shared core (never your config/profile)
# Options: --dir <skills-dir> (default ~/.claude/skills) · --core-dir <dir> (default ~/.instantly-gtm/core)
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="${HOME}/.claude/skills"
CORE_HOME="${HOME}/.instantly-gtm/core"
MODE="install"; PURGE=0; WANT_ALL=0
declare -a NAMES=()

log() { printf '  %s\n' "$*"; }
die() { printf 'install: %s\n' "$*" >&2; exit 1; }

# Replace placeholders in a file, portably (Node is a prereq anyway).
substitute() { # <file> <key> <val> [<key> <val> ...]
  node -e 'const fs=require("fs");const f=process.argv[1];let s=fs.readFileSync(f,"utf8");for(let i=2;i<process.argv.length;i+=2)s=s.split(process.argv[i]).join(process.argv[i+1]);fs.writeFileSync(f,s)' "$@"
}
list_skills() { for d in "$SRC"/skills/*/; do [ -f "$d/skill.json" ] && basename "$d"; done; }
skill_desc() { node -e 'console.log((require(process.argv[1]).description)||"")' "$SRC/skills/$1/skill.json" 2>/dev/null || echo ""; }

# --- args ---
while [ $# -gt 0 ]; do
  case "$1" in
    --list) MODE="list"; shift ;;
    --all) WANT_ALL=1; shift ;;
    --uninstall) MODE="uninstall"; shift ;;
    --purge) PURGE=1; shift ;;
    --dir) SKILLS_DIR="${2:?}"; shift 2 ;;
    --core-dir) CORE_HOME="${2:?}"; shift 2 ;;
    --*) die "unknown option: $1" ;;
    *) NAMES+=("$1"); shift ;;
  esac
done

command -v node >/dev/null 2>&1 || die "Node.js >= 18 is required."
[ "$(node -p 'process.versions.node.split(".")[0]')" -ge 18 ] || die "Node >= 18 required (found $(node -v))."

AVAILABLE=(); while IFS= read -r s; do [ -n "$s" ] && AVAILABLE+=("$s"); done < <(list_skills)

# --- list ---
if [ "$MODE" = "list" ]; then
  echo "Available skills:"; for s in "${AVAILABLE[@]}"; do printf '  %-28s %s\n' "$s" "$(skill_desc "$s")"; done; exit 0
fi

# --- uninstall ---
if [ "$MODE" = "uninstall" ]; then
  # Build targets without expanding a possibly-empty array under `set -u` (macOS bash 3.2 errors on that).
  targets=()
  if [ "$WANT_ALL" = 1 ]; then
    [ "${#AVAILABLE[@]}" -gt 0 ] && targets=("${AVAILABLE[@]}")
  elif [ "${#NAMES[@]}" -gt 0 ]; then
    targets=("${NAMES[@]}")
  fi
  [ "${#targets[@]}" -eq 0 ] && [ "$PURGE" = 0 ] && die "name a skill to uninstall, or --all / --purge."
  i=0; while [ "$i" -lt "${#targets[@]}" ]; do
    name="${targets[$i]}"; i=$((i+1))
    rm -rf "${SKILLS_DIR:?}/${name}"
    for sc in "${SKILLS_DIR}/${name}-"*/; do [ -d "$sc" ] && rm -rf "$sc"; done
    log "removed skill: $name"
  done
  if [ "$PURGE" = 1 ]; then rm -rf "${CORE_HOME:?}"; log "removed shared core: $CORE_HOME (config/profile left intact)"; fi
  exit 0
fi

# --- choose skills to install ---
sel=()
if [ "$WANT_ALL" = 1 ]; then
  [ "${#AVAILABLE[@]}" -gt 0 ] && sel=("${AVAILABLE[@]}")
elif [ "${#NAMES[@]}" -gt 0 ]; then
  sel=("${NAMES[@]}")
fi
if [ "${#sel[@]}" -eq 0 ]; then
  if [ -t 0 ]; then
    echo "Which skills to install? (space-separated numbers, or 'a' for all)"
    i=1; for s in "${AVAILABLE[@]}"; do printf '  %d) %-26s %s\n' "$i" "$s" "$(skill_desc "$s")"; i=$((i+1)); done
    printf 'choice> '; read -r ans
    if [ "$ans" = "a" ] || [ "$ans" = "all" ]; then sel=("${AVAILABLE[@]}");
    else for n in $ans; do idx=$((n-1)); [ "$idx" -ge 0 ] && [ "$idx" -lt "${#AVAILABLE[@]}" ] && sel+=("${AVAILABLE[$idx]}"); done; fi
  else
    echo "No skill selected. Run with a skill name, --all, or --list:"; list_skills; exit 1
  fi
fi
[ "${#sel[@]}" -eq 0 ] && die "nothing selected."

# --- ensure shared core ---
mkdir -p "$CORE_HOME"
cp -R "$SRC"/core/. "$CORE_HOME"/
log "shared core -> $CORE_HOME"

# --- install each selected skill ---
mkdir -p "$SKILLS_DIR"
for name in "${sel[@]}"; do
  [ -f "$SRC/skills/$name/skill.json" ] || { log "warn: unknown skill '$name' (skipping; try --list)"; continue; }
  dest="$SKILLS_DIR/$name"
  rm -rf "$dest"; mkdir -p "$dest"
  # copy everything except the shortcut templates (they expand into siblings, below)
  ( cd "$SRC/skills/$name" && for item in *; do [ "$item" = "shortcuts" ] && continue; cp -R "$item" "$dest/"; done )
  # substitute paths in the skill's markdown
  while IFS= read -r mdfile; do substitute "$mdfile" "__INSTANTLY_CORE__" "$CORE_HOME" "__SKILL_DIR__" "$dest"; done \
    < <(find "$dest" -name '*.md')
  log "installed skill: $name -> $dest"
  # expand shortcuts (chunk 11 templates); skip cleanly if none present
  if [ -d "$SRC/skills/$name/shortcuts" ]; then
    while IFS= read -r suffix; do
      [ -z "$suffix" ] && continue
      tmpl="$SRC/skills/$name/shortcuts/${suffix}.md"
      [ -f "$tmpl" ] || { log "  warn: shortcut template missing: ${suffix}.md"; continue; }
      scdest="$SKILLS_DIR/${name}-${suffix}"; rm -rf "$scdest"; mkdir -p "$scdest"
      cp "$tmpl" "$scdest/SKILL.md"
      substitute "$scdest/SKILL.md" "__INSTANTLY_CORE__" "$CORE_HOME" "__SKILL_DIR__" "$dest"
      log "  shortcut: /${name}-${suffix}"
    done < <(node -e 'const s=require(process.argv[1]).shortcuts||[];for(const x of s)console.log(x.suffix)' "$SRC/skills/$name/skill.json")
  fi
done

cat <<EOF

Installed. Next:
  1. Set your API key:   node "${CORE_HOME}/auth.mjs" setup
  2. Verify:             node "${CORE_HOME}/instantly.mjs" doctor
  3. In your agent, try: "Find 200 <ICP> and run outbound for my <offer>."
No MCP to register. Destructive actions aren't implemented (the CLI refuses them).
EOF
