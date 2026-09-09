Add-Type -AssemblyName System.Drawing
$imgPath = (Resolve-Path "images/new elite logo.png").Path
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)

for ($y = 200; $y -lt 850; $y += 5) {
    $nonWhiteCount = 0
    for ($x = 160; $x -lt 1380; $x += 5) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
            $nonWhiteCount++
        }
    }
    Write-Output "Y=${y} NonWhite=${nonWhiteCount}"
}
$bmp.Dispose()
