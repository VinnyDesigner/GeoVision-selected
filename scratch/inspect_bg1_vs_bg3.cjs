const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const publicDir = 'c:/Users/SruthikaDoddi/Geovision2/GeoVision-selected/public';
const darkImg = PNG.sync.read(fs.readFileSync(path.join(publicDir, 'bg3dark.png')));
const bg1Dark = PNG.sync.read(fs.readFileSync(path.join(publicDir, 'bg1 (2).png')));
const bg1 = PNG.sync.read(fs.readFileSync(path.join(publicDir, 'bg1.png')));

// Compare outside the triangle region (e.g. x: 50..400, y: 50..400)
function getRegionDiff(imgA, imgB, x1, y1, x2, y2) {
  let totalDiff = 0;
  let count = 0;
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      const idx = (imgA.width * y + x) << 2;
      const dR = Math.abs(imgA.data[idx] - imgB.data[idx]);
      const dG = Math.abs(imgA.data[idx + 1] - imgB.data[idx + 1]);
      const dB = Math.abs(imgA.data[idx + 2] - imgB.data[idx + 2]);
      totalDiff += (dR + dG + dB) / 3;
      count++;
    }
  }
  return (totalDiff / count).toFixed(2);
}

console.log('Outside triangle (50..400, 50..400):');
console.log('  bg3dark vs bg1 (2):', getRegionDiff(darkImg, bg1Dark, 50, 50, 400, 400));
console.log('  bg3dark vs bg1:', getRegionDiff(darkImg, bg1, 50, 50, 400, 400));

console.log('Inside triangle (600..900, 250..500):');
console.log('  bg3dark vs bg1 (2):', getRegionDiff(darkImg, bg1Dark, 600, 250, 900, 500));
console.log('  bg3dark vs bg1:', getRegionDiff(darkImg, bg1, 600, 250, 900, 500));
