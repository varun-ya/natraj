# Teacher Dark Mode Fix Script
# This script replaces all hardcoded teacher colors with CSS variables

$componentsPath = "C:\Users\varun\OneDrive\Documents\hg-new\hg-app\src\components"

# Define replacements
$replacements = @{
    # Background colors
    'background: "#FEFCFA"' = 'background: "var(--teacher-bg)"'
    "background: '#FEFCFA'" = "background: 'var(--teacher-bg)'"
    'background: isTeacher \? "#FEFCFA"' = 'background: isTeacher ? "var(--teacher-bg)"'
    "background: isTeacher \? '#FEFCFA'" = "background: isTeacher ? 'var(--teacher-bg)'"
    
    # Primary container (peach)
    'background: "#FFE2CE"' = 'background: "var(--teacher-primary-container)"'
    "background: '#FFE2CE'" = "background: 'var(--teacher-primary-container)'"
    'background: isTeacher \? "#FFE2CE"' = 'background: isTeacher ? "var(--teacher-primary-container)"'
    "background: isTeacher \? '#FFE2CE'" = "background: isTeacher ? 'var(--teacher-primary-container)'"
    '\{ background: "#FFE2CE" \}' = '{ background: "var(--teacher-primary-container)" }'
    "\{ background: '#FFE2CE' \}" = "{ background: 'var(--teacher-primary-container)' }"
    
    # Orange accent
    'color: "#D86C23"' = 'color: "var(--teacher-orange)"'
    "color: '#D86C23'" = "color: 'var(--teacher-orange)'"
    'background: "#D86C23"' = 'background: "var(--teacher-orange)"'
    "background: '#D86C23'" = "background: 'var(--teacher-orange)'"
    'borderColor: "#D86C23"' = 'borderColor: "var(--teacher-orange)"'
    "borderColor: '#D86C23'" = "borderColor: 'var(--teacher-orange)'"
    'border: "#D86C23"' = 'border: "var(--teacher-orange)"'
    "border: '#D86C23'" = "border: 'var(--teacher-orange)'"
    
    # Text on peach
    'color: "#1A1A1A"' = 'color: "var(--teacher-on-primary-container)"'
    "color: '#1A1A1A'" = "color: 'var(--teacher-on-primary-container)'"
    
    # Text on orange (white)
    'isTeacher \? "#FFFFFF"' = 'isTeacher ? "var(--on-primary)"'
    "isTeacher \? '#FFFFFF'" = "isTeacher ? 'var(--on-primary)'"
}

# Get all .tsx files recursively
$files = Get-ChildItem -Path $componentsPath -Filter *.tsx -Recurse

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $fileReplacements = 0
    
    foreach ($pattern in $replacements.Keys) {
        $replacement = $replacements[$pattern]
        $matches = [regex]::Matches($content, $pattern)
        if ($matches.Count -gt 0) {
            $content = $content -replace $pattern, $replacement
            $fileReplacements += $matches.Count
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalFiles++
        $totalReplacements += $fileReplacements
        Write-Host "Updated: $($file.Name) - $fileReplacements replacements"
    }
}

Write-Host "`nTotal files updated: $totalFiles"
Write-Host "Total replacements made: $totalReplacements"
