const fs = require('fs');

// 1. Process ReadingDoodle.tsx into an SVG
const doodleContent = fs.readFileSync('ReadingDoodle.tsx', 'utf8');
const svgMatch = doodleContent.match(/<svg[\s\S]*<\/svg>/);
if (svgMatch) {
  let svg = svgMatch[0];
  // Replace {accent} and {ink}
  svg = svg.replace(/fill=\{accent\}/g, 'fill="#006cfe"');
  svg = svg.replace(/fill=\{ink\}/g, 'fill="#0f172a"');
  svg = svg.replace(/fillRule/g, 'fill-rule');
  svg = svg.replace(/strokeWidth/g, 'stroke-width');
  fs.writeFileSync('sample_freehand_doodle.svg', svg);
  console.log('Created sample_freehand_doodle.svg');
}

// 2. Customize undraw SVGs with distinct colorful palettes
function colorizeSvg(src, dest, primaryColor, accentColor = '#38bdf8') {
  let content = fs.readFileSync(src, 'utf8');
  content = content.replace(/var\(--primary-svg-color\)/g, primaryColor);
  content = content.replace(/#6c63ff/gi, primaryColor);
  fs.writeFileSync(dest, content);
  console.log(`Created ${dest} with color ${primaryColor}`);
}

if (fs.existsSync('sample_construction.svg')) {
  colorizeSvg('sample_construction.svg', 'art_construction.svg', '#006cfe');
}
if (fs.existsSync('sample_undraw_engineering.svg')) {
  colorizeSvg('sample_undraw_engineering.svg', 'art_engineering.svg', '#0284c7');
}
if (fs.existsSync('sample_building.svg')) {
  colorizeSvg('sample_building.svg', 'art_architecture.svg', '#10b981');
}
if (fs.existsSync('robotics.svg')) {
  colorizeSvg('robotics.svg', 'art_robotics.svg', '#8b5cf6');
}
if (fs.existsSync('drone-surveillance.svg')) {
  colorizeSvg('drone-surveillance.svg', 'art_drone.svg', '#f59e0b');
}
if (fs.existsSync('sample_programming.svg')) {
  colorizeSvg('sample_programming.svg', 'art_coding.svg', '#ec4899');
}
if (fs.existsSync('sample_analytics.svg')) {
  colorizeSvg('sample_analytics.svg', 'art_analytics.svg', '#6366f1');
}
