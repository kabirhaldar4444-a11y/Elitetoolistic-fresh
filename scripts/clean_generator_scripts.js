const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const filesToClean = [
    path.join(rootDir, 'check_duplicates.js'),
    path.join(rootDir, 'scripts', 'check_duplicates.js'),
    path.join(rootDir, 'generate_all_courses.js'),
    path.join(rootDir, 'scripts', 'generate_all_courses.js'),
    path.join(rootDir, 'generate_catalog_and_courses.js'),
    path.join(rootDir, 'update_all_images.js'),
    path.join(rootDir, 'generate_all_courses.py'),
    path.join(rootDir, 'scripts', 'generate_all_courses.py'),
    path.join(rootDir, 'generate_courses.py'),
    path.join(rootDir, 'scripts', 'generate_courses.py'),
    path.join(rootDir, 'generate_courses_v2.py'),
    path.join(rootDir, 'scripts', 'generate_courses_v2.py'),
    path.join(rootDir, 'generate_courses_v3.py'),
    path.join(rootDir, 'scripts', 'generate_courses_v3.py')
];

filesToClean.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf-8');
        content = content.replace(/[ \t]*<li>\s*<a\s+[^>]*href=["'](?:[^"']*\/)?persona\.html["'][^>]*>[\s\S]*?<\/a>\s*<\/li>\r?\n?/gi, '');
        content = content.replace(/&& f !== 'persona\.html'/g, '');
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Cleaned ${path.basename(file)}`);
    }
});
