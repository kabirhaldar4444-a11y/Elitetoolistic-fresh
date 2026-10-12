Add-Type -AssemblyName System.Drawing
$imgPath = (Resolve-Path "images/new elite logo.png").Path
$srcBmp = [System.Drawing.Bitmap]::FromFile($imgPath)

$minX = 164
$maxX = 1378
$minY = 202
$maxY = 837

# Add a little padding (e.g. 15px)
$pad = 15
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($srcBmp.Width - $cropX, ($maxX - $minX) + ($pad * 2))
$cropH = [Math]::Min($srcBmp.Height - $cropY, ($maxY - $minY) + ($pad * 2))

# 1. Clean cropped with white background
$rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$croppedBmp = $srcBmp.Clone($rect, $srcBmp.PixelFormat)
$croppedBmp.Save((Resolve-Path "images").Path + "\new_elite_logo_cropped.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 2. Transparent background version
$transBmp = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $cropH; $y++) {
    for ($x = 0; $x -lt $cropW; $x++) {
        $p = $croppedBmp.GetPixel($x, $y)
        # Check if white/near-white
        if ($p.R -ge 245 -and $p.G -ge 245 -and $p.B -ge 245) {
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } elseif ($p.R -ge 230 -and $p.G -ge 230 -and $p.B -ge 230) {
            # Smooth edge antialiasing
            $avg = ($p.R + $p.G + $p.B) / 3.0
            $alpha = [int]([Math]::Max(0, [Math]::Min(255, (255 - $avg) * 10)))
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
        } else {
            $transBmp.SetPixel($x, $y, $p)
        }
    }
}
$transBmp.Save((Resolve-Path "images").Path + "\new_elite_logo_transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Also save transparent version as LOGO.png so all pages immediately get it
$transBmp.Save((Resolve-Path "images").Path + "\LOGO.png", [System.Drawing.Imaging.ImageFormat]::Png)

$srcBmp.Dispose()
$croppedBmp.Dispose()
$transBmp.Dispose()

Write-Output "Successfully generated cropped and transparent logo files!"
