const fs = require('fs');
const path = require('path');

function updateDir(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  let count = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf-8');
    const navLogoRegex = /<a href="index\.html" class="nav-logo">[\s\S]*?<\/a>/;
    const match = content.match(navLogoRegex);
    if (match) {
      const isSubdir = dir !== '.';
      const imgSrc = isSubdir ? '../images/new_elite_logo_transparent.png' : 'images/new_elite_logo_transparent.png';
      const replacement = `<a href="index.html" class="nav-logo">
    <img src="${imgSrc}" alt="Elite Toolistic" />
    <div class="nav-brand-title">
      <span class="brand-name">ELITE TOOLISTIC</span>
      <span class="brand-sub">Academy of Certified Mastery</span>
    </div>
  </a>`;
      if (match[0] !== replacement) {
        content = content.replace(match[0], replacement);
        fs.writeFileSync(fullPath, content, 'utf-8');
        count++;
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
  return count;
}

const rootCount = updateDir('.');
let coursesCount = 0;
if (fs.existsSync('courses')) {
  coursesCount = updateDir('courses');
}
console.log(`Updated ${rootCount} root files and ${coursesCount} courses files.`);
