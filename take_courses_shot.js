const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outPng = path.resolve('courses_paginated.png');
const artifactPng = 'C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\7b163df2-f25d-4bc5-9a62-2c4ec8009b4a\\courses_paginated.png';

const cmd = `"${edgePath}" --headless --screenshot="${outPng}" --window-size=1280,950 --virtual-time-budget=2000 "http://localhost:8080/courses.html"`;

exec(cmd, { timeout: 10000 }, (err) => {
  if (fs.existsSync(outPng)) {
    fs.copyFileSync(outPng, artifactPng);
    console.log('Saved screenshot successfully!');
  } else {
    console.log('No screenshot produced');
  }
});
