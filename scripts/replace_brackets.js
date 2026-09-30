const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '../elite-toolistic-policy-set/app.js'),
  path.join(__dirname, '../app.js')
];

targetFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // First revert if unescaped
    content = content.replace(/<a href="mailto:support@elietoolistic.org">support@elietoolistic.org<\/a>/g, '<a href=\\"mailto:support@elietoolistic.org\\">support@elietoolistic.org</a>');
    // Replace mark tags with properly escaped quotes inside JSON string
    content = content.replace(/<mark>\[confirm competent court jurisdiction\]<\/mark>/g, '<a href=\\"mailto:support@elietoolistic.org\\">support@elietoolistic.org</a>');
    content = content.replace(/<mark>\[confirm petition period\]<\/mark>/g, '<a href=\\"mailto:support@elietoolistic.org\\">support@elietoolistic.org</a>');
    content = content.replace(/<mark>\[confirm determination period\]<\/mark>/g, '<a href=\\"mailto:support@elietoolistic.org\\">support@elietoolistic.org</a>');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Properly escaped replacement in:', file);
  }
});
