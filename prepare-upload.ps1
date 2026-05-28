# Prepare for GitHub Upload - "Last Peace of Art"

$source = "C:\Users\Admin\Desktop\the last peace of art\last-peace-of-art"
$dest   = "C:\Users\Admin\Desktop\last-peace-of-art-UPLOAD"

$include = @(
    "src\app", "src\components", "src\lib", "src\proxy.ts",
    "prisma\schema.prisma", "prisma.config.ts",
    "next.config.ts", "tsconfig.json", "package.json",
    "postcss.config.mjs", "eslint.config.mjs",
    ".gitignore", "vercel.json", "playwright.config.ts",
    "vitest.config.ts", "tests",
    "public\favicon.ico"
)

Write-Host "Copying project files to: $dest" -ForegroundColor Green

if (Test-Path $dest) {
    Remove-Item -Recurse -Force $dest
}

$total = 0
foreach ($item in $include) {
    $srcPath = Join-Path $source $item
    $destPath = Join-Path $dest $item
    $parent = Split-Path $destPath -Parent
    
    if (Test-Path $srcPath) {
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Path $parent -Force | Out-Null
        }
        
        $isDir = (Get-Item $srcPath) -is [System.IO.DirectoryInfo]
        if ($isDir) {
            Copy-Item -Path $srcPath -Destination $destPath -Recurse
            $cnt = (Get-ChildItem -Path $srcPath -Recurse -File | Measure-Object).Count
            $total = $total + $cnt
            Write-Host ("  OK " + $item + " (" + $cnt + " files)") -ForegroundColor Gray
        } else {
            Copy-Item -Path $srcPath -Destination $destPath
            $total = $total + 1
            Write-Host ("  OK " + $item) -ForegroundColor Gray
        }
    } else {
        Write-Host ("  MISSING " + $item) -ForegroundColor Red
    }
}

Write-Host ""
Write-Host ("Done! Copied " + $total + " files to: " + $dest) -ForegroundColor Green
Write-Host ""
Write-Host "Next:" -ForegroundColor Yellow
Write-Host "1. Open that folder" -ForegroundColor Cyan
Write-Host "2. Drag ALL files/folders into GitHub upload page" -ForegroundColor Cyan
Write-Host "   (or use GitHub Desktop for easier workflow)" -ForegroundColor Cyan
