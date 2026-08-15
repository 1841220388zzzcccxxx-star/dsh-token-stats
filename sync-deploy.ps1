# 一键把本插件源码同步到 DSH profile 插件目录
# 用法：.\sync-deploy.ps1
# 说明：pnpm 对 file: 依赖在 package.json 未变化时会跳过刷新副本，
#       因此本脚本先直接复制源码文件到 node_modules，再跑 pnpm install 保持一致。
param()

$src = $PSScriptRoot
$profileDir = 'C:\Users\18412\.dsh\profiles\web'
$dst = Join-Path $profileDir 'node_modules\dsh-token-stats'

if (-not (Test-Path "$profileDir\package.json")) {
    Write-Host "未找到 DSH profile 目录：$profileDir" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $dst)) {
    Write-Host "未找到插件副本目录：$dst，请先在 profile 中 pnpm install 一次" -ForegroundColor Red
    exit 1
}

Write-Host "正在刷新 $dst 的 dsh-token-stats 副本..." -ForegroundColor Cyan
foreach ($file in @('index.js', 'client.js', 'package.json', 'cordis.patch.yml')) {
    Copy-Item -Path (Join-Path $src $file) -Destination (Join-Path $dst $file) -Force
}

Push-Location $profileDir
try {
    pnpm install
    if ($LASTEXITCODE -ne 0) { Write-Host "pnpm install 失败" -ForegroundColor Red; exit 1 }
} finally {
    Pop-Location
}

Write-Host "已同步。提示：index.js / client.js / cordis.patch.yml 改动需重启 dsh web 生效。" -ForegroundColor Green
