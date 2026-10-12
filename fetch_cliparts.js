const https = require('https');
const fs = require('fs');
const path = require('path');

const targets = [
  'drone-race.svg',
  'drone-surveillance.svg',
  'science.svg',
  'medicine.svg',
  'finance.svg',
  'logistics.svg',
  'solar-power.svg',
  'circuit.svg',
  'robotics.svg',
  'environmental-study.svg',
  'maker-launch.svg',
  'project-completed.svg'
];

async function download(name) {
  const url = `https://raw.githubusercontent.com/balazser/undraw-svg-collection/master/svgs/${name}`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(path.join(__dirname, name));
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${name}`);
          resolve(true);
        });
      } else {
        console.log(`Failed ${name}: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`Error ${name}:`, err.message);
      resolve(false);
    });
  });
}

(async () => {
  for (const t of targets) {
    await download(t);
  }
})();
