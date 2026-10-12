const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Clean Clip Art & Freehand Drawing Style Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      padding: 40px;
    }
    .header {
      text-align: center;
      margin-bottom: 36px;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .header p {
      color: #64748b;
      font-size: 15px;
      margin-top: 6px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .card {
      background: #ffffff;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.03);
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .badge {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 5px 12px;
      border-radius: 100px;
      margin-bottom: 16px;
    }
    .badge-freehand { background: #eff6ff; color: #2563eb; }
    .badge-vector { background: #f0fdf4; color: #16a34a; }
    .badge-tech { background: #faf5ff; color: #9333ea; }
    .img-wrap {
      width: 100%;
      height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      background: #f8fafc;
      border-radius: 14px;
      overflow: hidden;
    }
    .img-wrap img {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
    }
    .card-title {
      font-size: 17px;
      font-weight: 700;
      margin-top: 16px;
      color: #1e293b;
      text-align: center;
    }
    .card-desc {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Clean Clip Art & Freehand Drawing Art Styles</h1>
    <p>Hand-drawn lineart, clean vector clip arts, vibrant curated brand colors</p>
  </div>
  <div class="grid">
    <div class="card">
      <span class="badge badge-freehand">Style A: Freehand Sketch Doodle</span>
      <div class="img-wrap">
        <img src="sample_freehand_doodle.svg" alt="Freehand Drawing">
      </div>
      <div class="card-title">Sketchy Freehand Drawing</div>
      <div class="card-desc">Organic hand-drawn ink strokes with soft modern colored fills</div>
    </div>
    <div class="card">
      <span class="badge badge-vector">Style B: Clean Vector Clip Art</span>
      <div class="img-wrap">
        <img src="art_construction.svg" alt="Construction Clip Art">
      </div>
      <div class="card-title">Civil & Construction Clip Art</div>
      <div class="card-desc">Crisp vector shapes, construction cranes, blueprints & workers</div>
    </div>
    <div class="card">
      <span class="badge badge-vector">Style B: Clean Vector Clip Art</span>
      <div class="img-wrap">
        <img src="art_engineering.svg" alt="Engineering Clip Art">
      </div>
      <div class="card-title">Engineering & Architecture</div>
      <div class="card-desc">Clean modern vector characters collaborating on project schematics</div>
    </div>
    <div class="card">
      <span class="badge badge-tech">Style C: Modern Tech & Robotics</span>
      <div class="img-wrap">
        <img src="art_robotics.svg" alt="Robotics Clip Art">
      </div>
      <div class="card-title">Robotics & AI Clip Art</div>
      <div class="card-desc">Vibrant technology clip art with clean geometric character art</div>
    </div>
    <div class="card">
      <span class="badge badge-tech">Style C: Modern Tech & Aviation</span>
      <div class="img-wrap">
        <img src="art_drone.svg" alt="Drone Clip Art">
      </div>
      <div class="card-title">Drone & Aviation Clip Art</div>
      <div class="card-desc">Clean aerospace drone illustration with warm amber color palette</div>
    </div>
    <div class="card">
      <span class="badge badge-vector">Style B: Clean Vector Clip Art</span>
      <div class="img-wrap">
        <img src="art_coding.svg" alt="Coding Clip Art">
      </div>
      <div class="card-title">IT, Cloud & Software</div>
      <div class="card-desc">Developer clip art with vibrant multi-colored workspace accents</div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('clipart_preview.html', htmlContent);
console.log('Created clipart_preview.html');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlFile = path.resolve('clipart_preview.html');
const outPng = path.resolve('clean_clipart_preview.png');
const artifactPng = 'C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\7b163df2-f25d-4bc5-9a62-2c4ec8009b4a\\clean_clipart_preview.png';

const cmd = `"${edgePath}" --headless --screenshot="${outPng}" --window-size=1280,960 "file:///${htmlFile.replace(/\\\\/g, '/')}"`;
console.log('Running:', cmd);
execSync(cmd);
console.log('Screenshot taken!');

fs.copyFileSync(outPng, artifactPng);
console.log('Copied to artifact dir:', artifactPng);
