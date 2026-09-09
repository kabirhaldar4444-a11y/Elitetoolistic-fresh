Add-Type -AssemblyName System.Drawing
$imgPath = (Resolve-Path "images/new elite logo.png").Path
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)
Write-Output "Dimensions: $($bmp.Width) x $($bmp.Height)"

$counts = @{}
for ($x = 0; $x -lt $bmp.Width; $x += 10) {
    for ($y = 0; $y -lt $bmp.Height; $y += 10) {
        $p = $bmp.GetPixel($x, $y)
        $hex = "#{0:X2}{1:X2}{2:X2}" -f $p.R, $p.G, $p.B
        if ($counts.ContainsKey($hex)) {
            $counts[$hex] = $counts[$hex] + 1
        } else {
            $counts[$hex] = 1
        }
    }
}
$bmp.Dispose()
$counts.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 25 | Format-Table Name, Value
