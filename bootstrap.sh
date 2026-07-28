#!/usr/bin/env bash
# bootstrap.sh — one-line installer for the Instantly Skills collection.
# Usage (from anywhere):
#   curl -fsSL https://raw.githubusercontent.com/Instantly-ai/instantly-skills/main/bootstrap.sh | bash                 # installs instantly-gtm + shared core
#   curl -fsSL https://raw.githubusercontent.com/Instantly-ai/instantly-skills/main/bootstrap.sh | bash -s -- --all     # installs every skill
#   curl -fsSL https://raw.githubusercontent.com/Instantly-ai/instantly-skills/main/bootstrap.sh | bash -s -- <name..>  # installs named skill(s)
# Clones the repo, runs install.sh, and points you at key setup. Re-runnable (pulls latest).
# Override the source for testing: INSTANTLY_SKILLS_REPO=<url|path> INSTANTLY_SKILLS_SRC=<dir>
set -euo pipefail

REPO="${INSTANTLY_SKILLS_REPO:-https://github.com/Instantly-ai/instantly-skills.git}"   # the collection repo (override via INSTANTLY_SKILLS_REPO for local testing)
SRC="${INSTANTLY_SKILLS_SRC:-$HOME/.instantly-skills-src}"

die(){ printf 'bootstrap: %s\n' "$*" >&2; exit 1; }
command -v git  >/dev/null 2>&1 || die "git is required."
command -v node >/dev/null 2>&1 || die "Node.js 18+ is required (https://nodejs.org)."
[ "$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null)" -ge 18 ] 2>/dev/null || die "Node 18+ required (found $(node -v 2>/dev/null))."

if [ -d "$SRC/.git" ]; then
  echo "Updating $SRC"
  git -C "$SRC" pull --ff-only --quiet || die "could not update $SRC (resolve manually, or delete it and re-run)."
else
  echo "Cloning into $SRC"
  git clone --depth 1 --quiet "$REPO" "$SRC" || die "clone failed from $REPO"
fi

cd "$SRC"
if [ "$#" -gt 0 ]; then ./install.sh "$@"; else ./install.sh instantly-gtm; fi

cat <<'EOF'

Next: set your Instantly API key
  node ~/.instantly-gtm/core/auth.mjs setup
Then verify the connection:
  node ~/.instantly-gtm/core/instantly.mjs doctor
EOF
