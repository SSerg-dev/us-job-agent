param([ValidateSet('dev','build','test','serve')][string]$Mode = 'dev')
$ErrorActionPreference = 'Stop'
$bundled = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$node = if (Test-Path -LiteralPath $bundled) { $bundled } else { (Get-Command node -ErrorAction Stop).Source }
$version = & $node -p 'process.versions.node'
if ([version]$version -lt [version]'24.15.0' -or ([version]$version).Major -ne 24) { throw 'Use Node 24.15+ (tested with 24.19.0). System Node is not changed by this launcher.' }
$env:NG_CLI_ANALYTICS = 'false'
Push-Location -LiteralPath $PSScriptRoot
try {
  if (-not (Test-Path -LiteralPath 'node_modules')) { throw 'Dependencies are missing. Install with npm ci using Node 24 first.' }
  switch ($Mode) {
    'dev' { & $node 'scripts/dev.mjs' }
    'serve' { & $node 'dist-server/src/server/main.js' }
    'build' {
      & $node 'node_modules/@angular/cli/bin/ng.js' build
      if ($LASTEXITCODE -ne 0) { throw 'Angular build failed.' }
      & $node 'node_modules/typescript/bin/tsc' -p tsconfig.server.json
    }
    'test' {
      & $node 'node_modules/typescript/bin/tsc' -p tsconfig.server.json
      if ($LASTEXITCODE -ne 0) { throw 'Server compilation failed.' }
      & $node --test 'dist-server/tests/*.test.js'
      if ($LASTEXITCODE -ne 0) { throw 'Server tests failed.' }
      & $node 'node_modules/@angular/cli/bin/ng.js' test --watch=false
    }
  }
  if ($LASTEXITCODE -ne 0) { throw "Command failed ($LASTEXITCODE)." }
} finally { Pop-Location }
