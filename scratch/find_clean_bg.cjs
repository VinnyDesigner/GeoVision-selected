const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const publicDir = 'c:/Users/SruthikaDoddi/Geovision2/GeoVision-selected/public';
const bg3darkData = fs.readFileSync(path.join(publicDir, 'bg3dark.png'));
const bg3darkObj = PNG.sync.read(bg3darkData);

const candidates = [
  'bg1.png',
  'bg1 (2).png',
  'bg2.png',
  'bg2 (2).png',
  'homepage bg dark.png',
  'homepage-bg-dark.png',
  'homepage-bg-dark-new.png',
  'homepage-bg-dark (2).png',
  'homepage-bg-dark (3).png',
  'homepage-bg-dark (4).png',
  'homepage-bg-dark (5).png',
];

candidates.forEach(cand => {
  const filePath = path.join(publicDir, cand);
  if (!fs.existsSync(filePath)) return;
  const data = fs.readFileSync(filePath);
  const png = PNG.sync.read(data);

  let diffPixelCount = 0;
  let totalDiff = 0;

  for (let i = 0; i < png.data.length; i += 4) {
    const rDiff = Math.abs(png.data[i] - bg3darkObj.data[i]);
    const gDiff = Math.abs(png.data[i + 1] - bg3darkObj.data[i + 1]);
    const bDiff = Math.abs(png.data[i + 2] - bg3darkObj.data[i + 2]);
    const pDiff = (rDiff + gDiff + bDiff) / 3;

    if (pDiff > 15) {
      diffPixelCount++;
      totalDiff += pDiff;
    }
  }

  console.log(`${cand.padEnd(25)} -> diffPixels: ${diffPixelCount.toString().padStart(8)}, avgDiffOnDiffs: ${(diffPixelCount > 0 ? totalDiff / diffPixelCount : 0).toFixed(2)}`);
});
