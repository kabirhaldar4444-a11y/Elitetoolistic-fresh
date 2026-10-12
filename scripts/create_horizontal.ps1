Add-Type -AssemblyName System.Drawing

$imgDir = (Resolve-Path "images").Path
$markBmp = [System.Drawing.Bitmap]::FromFile("$imgDir\new_elite_mark.png")
$srcBmp = [System.Drawing.Bitmap]::FromFile("$imgDir\new elite logo.png")

# Extract wordmark transparent
$wordW = (1378 - 164) + 20
$wordH = (837 - 680) + 20
$wordBmp = New-Object System.Drawing.Bitmap($wordW, $wordH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $wordH; $y++) {
    for ($x = 0; $x -lt $wordW; $x++) {
        $p = $srcBmp.GetPixel($x + 154, $y + 670)
        if ($p.R -ge 245 -and $p.G -ge 245 -and $p.B -ge 245) {
            $wordBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } elseif ($p.R -ge 230 -and $p.G -ge 230 -and $p.B -ge 230) {
            $avg = ($p.R + $p.G + $p.B) / 3.0
            $alpha = [int]([Math]::Max(0, [Math]::Min(255, (255 - $avg) * 10)))
            $wordBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
        } else {
            $wordBmp.SetPixel($x, $y, $p)
        }
    }
}
$wordBmp.Save("$imgDir\new_elite_wordmark.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Create horizontal lockup:
# Scale mark so its height matches nicely with wordmark
$targetH = 200
$scaleFactor = $targetH / $markBmp.Height
$scaledMarkW = [int]($markBmp.Width * $scaleFactor)
$scaledWordH = 140
$wordScale = $scaledWordH / $wordBmp.Height
$scaledWordW = [int]($wordBmp.Width * $wordScale)

$gap = 35
$totalW = $scaledMarkW + $gap + $scaledWordW
$horizBmp = New-Object System.Drawing.Bitmap($totalW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($horizBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

# Draw mark
$g.DrawImage($markBmp, 0, 0, $scaledMarkW, $targetH)

# Draw wordmark centered vertically
$wordY = [int](($targetH - $scaledWordH) / 2)
$g.DrawImage($wordBmp, ($scaledMarkW + $gap), $wordY, $scaledWordW, $scaledWordH)

$g.Dispose()
$horizBmp.Save("$imgDir\new_elite_logo_horizontal.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Also let's save this as LOGO.png if it's the ideal navbar logo, or keep LOGO.png as full
# Let's save a copy as LOGO_horizontal.png
$horizBmp.Save("$imgDir\LOGO_horizontal.png", [System.Drawing.Imaging.ImageFormat]::Png)

$markBmp.Dispose()
$srcBmp.Dispose()
$wordBmp.Dispose()
$horizBmp.Dispose()

Write-Output "Horizontal lockup and wordmark generated!"
