Add-Type -AssemblyName System.Drawing
$imgPath = (Resolve-Path "images/new elite logo.png").Path
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)

$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $p = $bmp.GetPixel($x, $y)
        # Check if not pure/near white
        if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$bmp.Dispose()
Write-Output "Content Bounding Box: minX=$minX, maxX=$maxX, minY=$minY, maxY=$maxY"
Write-Output "Content Width = $($maxX - $minX), Content Height = $($maxY - $minY)"
