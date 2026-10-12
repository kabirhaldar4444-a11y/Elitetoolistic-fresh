const https = require('https');
const fs = require('fs');

const url = 'https://api.github.com/repos/balazser/undraw-svg-collection/contents/svgs';

const options = {
  headers: {
    'User-Agent': 'Node-Fetch-Script'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (Array.isArray(json)) {
        const svgFiles = json.map(item => item.name);
        fs.writeFileSync('all_available_svgs.json', JSON.stringify(svgFiles, null, 2));
        console.log(`Successfully found ${svgFiles.length} SVGs!`);
      } else {
        console.log('GitHub response:', json);
      }
    } catch (e) {
      console.error('Error parsing:', e);
    }
  });
}).on('error', err => {
  console.error('Fetch error:', err);
});
