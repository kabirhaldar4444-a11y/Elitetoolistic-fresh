const fs = require('fs');
const path = require('path');

const courses = JSON.parse(fs.readFileSync('all_167_courses.json', 'utf8'));

let missing = 0;
const imageSet = new Set();

courses.forEach((c, i) => {
  if (!c.image) {
    console.error(`Course ${i} (${c.name}) has no image!`);
    missing++;
  } else {
    const fullPath = path.join(__dirname, c.image);
    if (!fs.existsSync(fullPath)) {
      console.error(`Image file missing on disk: ${fullPath} for course: ${c.name}`);
      missing++;
    }
    imageSet.add(c.image);
  }
});

console.log('--- VERIFICATION REPORT ---');
console.log(`Total Courses: ${courses.length}`);
console.log(`Unique Image Paths: ${imageSet.size}`);
console.log(`Missing Files on Disk: ${missing}`);

if (courses.length === 167 && imageSet.size === 167 && missing === 0) {
  console.log('STATUS: 100% PERFECT! 167/167 unique, dedicated clip art files verified on disk!');
} else {
  console.log('STATUS: FAILED verification.');
}
