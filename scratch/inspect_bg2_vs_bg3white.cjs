const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const publicDir = 'c:/Users/SruthikaDoddi/Geovision2/GeoVision-selected/public';
const whiteImg = PNG.sync.read(fs.readFileSync(path.join(publicDir, 'bg3white.png')));
const bg2Dark = PNG.sync.read(fs.readFileSync(path.join(publicDir, 'bg2 (2).png')));
const bg2 = PNG.sync.read(fs.readFileSync(path.join(publicDir, 'bg2.png')));

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
console.log('  bg3white vs bg2 (2):', getRegionDiff(whiteImg, bg2Dark, 50, 50, 400, 400));
console.log('  bg3white vs bg2:', getRegionDiff(whiteImg, bg2, 50, 50, 400, 400));

console.log('Inside triangle (600..900, 250..500):');
console.log('  bg3white vs bg2 (2):', getRegionDiff(whiteImg, bg2Dark, 600, 250, 900, 500));
console.log('  bg3white vs bg2:', getRegionDiff(whiteImg, bg2, 600, 250, 900, 500));
