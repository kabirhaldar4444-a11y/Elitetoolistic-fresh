const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outPng = path.resolve('test_full_clipart.png');
const artifactPng = 'C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\7b163df2-f25d-4bc5-9a62-2c4ec8009b4a\\test_full_clipart.png';

try {
  execSync(`"${edgePath}" --headless --screenshot="${outPng}" --window-size=1280,800 "http://localhost:8080/courses.html"`, { timeout: 8000 });
} catch (e) {
  // Edge may exit on timeout or finish
}

if (fs.existsSync(outPng)) {
  fs.copyFileSync(outPng, artifactPng);
  console.log('SUCCESS: test_full_clipart.png captured!');
} else {
  console.log('File not created yet');
}
