const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const publicDir = 'c:/Users/SruthikaDoddi/Geovision2/GeoVision-selected/public';
const darkImg = PNG.sync.read(fs.readFileSync(path.join(publicDir, 'bg3dark.png')));
const bg1Dark = PNG.sync.read(fs.readFileSync(path.join(publicDir, 'bg1 (2).png')));

console.log('darkImg dimensions:', darkImg.width, 'x', darkImg.height);
console.log('bg1Dark dimensions:', bg1Dark.width, 'x', bg1Dark.height);

// Let's sample pixels in the triangle overlay region in bg3dark.png (e.g. x: 500-1100, y: 150-650)
let diffCount = 0;
let cyanCount = 0;

for (let y = 150; y < 650; y++) {
  for (let x = 500; x < 1100; x++) {
    const idx = (darkImg.width * y + x) << 2;
    const r = darkImg.data[idx];
    const g = darkImg.data[idx + 1];
    const b = darkImg.data[idx + 2];

    const r2 = bg1Dark.data[idx];
    const g2 = bg1Dark.data[idx + 1];
    const b2 = bg1Dark.data[idx + 2];

    const diff = (Math.abs(r - r2) + Math.abs(g - g2) + Math.abs(b - b2)) / 3;
    if (diff > 20) diffCount++;

    // Cyan tech line detection: g & b are high, r is lower
    if (g > 140 && b > 150 && g > r + 30 && b > r + 30) {
      cyanCount++;
    }
  }
}

console.log(`Region (500..1100, 150..650): diffCount=${diffCount}, cyanCount=${cyanCount}`);
