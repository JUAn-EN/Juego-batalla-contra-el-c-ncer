# Script para actualizar menu.js con el nivel de colon
$menuPath = "c:\Users\jenietoo\Documents\Juego\cancer-prevention-game\client\js\menu.js"

# Leer el contenido
$content = Get-Content $menuPath -Raw -Encoding UTF8

# Buscar y reemplazar
$pattern = "case 'pulmon':"
$replacement = @"
case 'colon':
                console.log('🔬 Iniciando nivel de Cáncer de Colon - Nivel Final');
                this.navigateToLevel('colon-cancer-level.html', 'Cáncer de Colon');
                break;
            case 'pulmon':
"@

$newContent = $content -replace [regex]::Escape($pattern), $replacement

# Guardar
$newContent | Out-File -FilePath $menuPath -Encoding UTF8 -NoNewline

Write-Host "✅ menu.js actualizado correctamente" -ForegroundColor Green
