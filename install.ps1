# install.ps1 — installer for the Instantly Skills collection (Windows). Mirrors install.sh.
# Shared core (auth/CLI/config/map) once + whichever skills you select. No MCP.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\install.ps1                  # interactive picker
#   ... .\install.ps1 instantly-gtm            # install named skill(s) + core
#   ... .\install.ps1 -All | -List | -Uninstall <name..> | -Purge
# Options: -Dir <skills-dir> (default ~\.claude\skills) · -CoreDir <dir> (default ~\.instantly-gtm\core)
[CmdletBinding()]
param(
  [Parameter(ValueFromRemainingArguments=$true)] [string[]]$Names,
  [switch]$All, [switch]$List, [switch]$Uninstall, [switch]$Purge,
  [string]$Dir = "$env:USERPROFILE\.claude\skills",
  [string]$CoreDir = "$env:USERPROFILE\.instantly-gtm\core"
)
$ErrorActionPreference = 'Stop'
$Src = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js >= 18 is required.' }
if ([int](node -p "process.versions.node.split('.')[0]") -lt 18) { throw "Node >= 18 required (found $(node -v))." }

function Get-Skills { Get-ChildItem "$Src\skills" -Directory | Where-Object { Test-Path "$($_.FullName)\skill.json" } | ForEach-Object { $_.Name } }
function Get-Desc($n) { try { node -e "console.log((require(process.argv[1]).description)||'')" "$Src\skills\$n\skill.json" } catch { '' } }
function Substitute($file, $core, $skill) {
  node -e "const fs=require('fs');let s=fs.readFileSync(process.argv[1],'utf8');s=s.split('__INSTANTLY_CORE__').join(process.argv[2]).split('__SKILL_DIR__').join(process.argv[3]);fs.writeFileSync(process.argv[1],s)" $file $core $skill
}
$available = @(Get-Skills)

if ($List) { Write-Host "Available skills:"; foreach ($s in $available) { "{0,-28} {1}" -f $s, (Get-Desc $s) }; exit 0 }

if ($Uninstall) {
  $targets = if ($All) { $available } else { $Names }
  foreach ($name in $targets) {
    Remove-Item -Recurse -Force "$Dir\$name" -ErrorAction SilentlyContinue
    Get-ChildItem $Dir -Directory -Filter "$name-*" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
    Write-Host "  removed skill: $name"
  }
  if ($Purge) { Remove-Item -Recurse -Force $CoreDir -ErrorAction SilentlyContinue; Write-Host "  removed shared core (config/profile intact)" }
  exit 0
}

$sel = if ($All) { $available } else { @($Names) }
if ($sel.Count -eq 0) {
  if ([Environment]::UserInteractive) {
    Write-Host "Which skills to install? (space-separated numbers, or 'a' for all)"
    for ($i=0; $i -lt $available.Count; $i++) { "  {0}) {1,-26} {2}" -f ($i+1), $available[$i], (Get-Desc $available[$i]) }
    $ans = Read-Host "choice"
    if ($ans -eq 'a' -or $ans -eq 'all') { $sel = $available }
    else { $sel = @(); foreach ($n in ($ans -split '\s+')) { $idx=[int]$n-1; if ($idx -ge 0 -and $idx -lt $available.Count) { $sel += $available[$idx] } } }
  } else { Write-Host "No skill selected. Use a name, -All, or -List:"; Get-Skills; exit 1 }
}
if ($sel.Count -eq 0) { throw "nothing selected." }

# shared core
New-Item -ItemType Directory -Force -Path $CoreDir | Out-Null
Copy-Item -Recurse -Force "$Src\core\*" $CoreDir
Write-Host "  shared core -> $CoreDir"

New-Item -ItemType Directory -Force -Path $Dir | Out-Null
foreach ($name in $sel) {
  if (-not (Test-Path "$Src\skills\$name\skill.json")) { Write-Host "  warn: unknown skill '$name' (skipping)"; continue }
  $dest = "$Dir\$name"
  Remove-Item -Recurse -Force $dest -ErrorAction SilentlyContinue; New-Item -ItemType Directory -Force -Path $dest | Out-Null
  Get-ChildItem "$Src\skills\$name" -Exclude 'shortcuts' | Copy-Item -Recurse -Force -Destination $dest
  Get-ChildItem $dest -Recurse -Filter *.md | ForEach-Object { Substitute $_.FullName $CoreDir $dest }
  Write-Host "  installed skill: $name -> $dest"
  if (Test-Path "$Src\skills\$name\shortcuts") {
    $shortcuts = node -e "const s=require(process.argv[1]).shortcuts||[];for(const x of s)console.log(x.suffix)" "$Src\skills\$name\skill.json"
    foreach ($suffix in ($shortcuts -split "`n" | Where-Object { $_ })) {
      $tmpl = "$Src\skills\$name\shortcuts\$suffix.md"
      if (-not (Test-Path $tmpl)) { Write-Host "  warn: shortcut template missing: $suffix.md"; continue }
      $scdest = "$Dir\$name-$suffix"; Remove-Item -Recurse -Force $scdest -ErrorAction SilentlyContinue; New-Item -ItemType Directory -Force -Path $scdest | Out-Null
      Copy-Item $tmpl "$scdest\SKILL.md"; Substitute "$scdest\SKILL.md" $CoreDir $dest
      Write-Host "  shortcut: /$name-$suffix"
    }
  }
}

Write-Host ""
Write-Host "Installed. Next:"
Write-Host "  1. Set your API key:   node `"$CoreDir\auth.mjs`" setup"
Write-Host "  2. Verify:             node `"$CoreDir\instantly.mjs`" doctor"
Write-Host "  3. In your agent: 'Find 200 <ICP> and run outbound for my <offer>.'"
