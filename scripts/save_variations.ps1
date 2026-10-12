Add-Type -AssemblyName System.Drawing
$imgPath = (Resolve-Path "images/new elite logo.png").Path
$srcBmp = [System.Drawing.Bitmap]::FromFile($imgPath)

# Helper function to save transparent cropped region
function Save-TransparentCropped($bmp, $x1, $y1, $x2, $y2, $outPath) {
    $w = ($x2 - $x1) + 1
    $h = ($y2 - $y1) + 1
    $target = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $p = $bmp.GetPixel($x + $x1, $y + $y1)
            if ($p.R -ge 245 -and $p.G -ge 245 -and $p.B -ge 245) {
                $target.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
            } elseif ($p.R -ge 230 -and $p.G -ge 230 -and $p.B -ge 230) {
                $avg = ($p.R + $p.G + $p.B) / 3.0
                $alpha = [int]([Math]::Max(0, [Math]::Min(255, (255 - $avg) * 10)))
                $target.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
            } else {
                $target.SetPixel($x, $y, $p)
            }
        }
    }
    $target.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $target.Dispose()
    Write-Output "Saved: $outPath ($w x $h)"
}

# 1. Full Stacked Logo (X: 164..1378, Y: 202..837)
$imgDir = (Resolve-Path "images").Path
Save-TransparentCropped $srcBmp 154 192 1388 847 "$imgDir\LOGO.png"
Save-TransparentCropped $srcBmp 154 192 1388 847 "$imgDir\new_elite_logo_transparent.png"

# 2. ET Monogram Mark (find X bounds for Y between 200 and 630)
$markMinX = 1536
$markMaxX = 0
for ($y = 202; $y -le 630; $y++) {
    for ($x = 0; $x -lt $srcBmp.Width; $x++) {
        $p = $srcBmp.GetPixel($x, $y)
        if ($p.R -lt 240 -or $p.G -lt 240 -or $p.B -lt 240) {
            if ($x -lt $markMinX) { $markMinX = $x }
            if ($x -gt $markMaxX) { $markMaxX = $x }
        }
    }
}
Write-Output "Mark X bounds: $markMinX to $markMaxX"
$pad = 10
Save-TransparentCropped $srcBmp ($markMinX - $pad) (202 - $pad) ($markMaxX + $pad) (630 + $pad) "$imgDir\new_elite_mark.png"

$srcBmp.Dispose()
Write-Output "All logo variations saved successfully!"
