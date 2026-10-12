const { execSync } = require('child_process');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outPng = path.resolve('courses_unique_cliparts.png');
const artifactPng = 'C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\7b163df2-f25d-4bc5-9a62-2c4ec8009b4a\\courses_unique_cliparts.png';

try {
  execSync(`"${edgePath}" --headless --screenshot="${outPng}" --window-size=1280,1100 "http://localhost:8080/courses.html"`, { timeout: 15000 });
  const fs = require('fs');
  if (fs.existsSync(outPng)) {
    fs.copyFileSync(outPng, artifactPng);
    console.log('Courses screenshot saved successfully!');
  }
} catch (e) {
  console.log('Screenshot finished:', e.message);
}
