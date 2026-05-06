$f = 'C:\Users\varun\OneDrive\Documents\hg-new\hg-app\src\app\[role]\dashboard\search\page.tsx'
$lines = [System.IO.File]::ReadAllLines($f, [System.Text.Encoding]::UTF8)

# Find the grid start and end lines
$gridStart = -1
$gridEnd = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match 'FUSION GRID') { $gridStart = $i - 1 }
  if ($gridStart -gt 0 -and $i -gt $gridStart -and $lines[$i].Trim() -eq ')}') {
    $gridEnd = $i
    break
  }
}

Write-Output "Grid start: $gridStart, Grid end: $gridEnd"
