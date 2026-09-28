const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (file !== '.git' && file !== 'node_modules') {
                results = results.concat(getHtmlFiles(fullPath));
            }
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    });
    return results;
}

const htmlFiles = getHtmlFiles(rootDir);
let modifiedCount = 0;
let totalMatches = 0;

// Regex to match any <li> containing a link to persona.html, including any classes or spacing
const personaLiRegex = /[ \t]*<li>\s*<a\s+[^>]*href=["'](?:[^"']*\/)?persona\.html["'][^>]*>[\s\S]*?<\/a>\s*<\/li>\r?\n?/gi;

htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (personaLiRegex.test(content)) {
        personaLiRegex.lastIndex = 0;
        const matches = content.match(personaLiRegex);
        totalMatches += (matches ? matches.length : 0);
        content = content.replace(personaLiRegex, '');
        fs.writeFileSync(filePath, content, 'utf-8');
        modifiedCount++;
    }
});

console.log(`Processed ${htmlFiles.length} HTML files.`);
console.log(`Removed ${totalMatches} persona link instances across ${modifiedCount} files.`);

// Also check and delete persona.html itself
const personaFile = path.join(rootDir, 'persona.html');
if (fs.existsSync(personaFile)) {
    fs.unlinkSync(personaFile);
    console.log('Successfully deleted persona.html');
} else {
    console.log('persona.html was not found or already deleted.');
}
