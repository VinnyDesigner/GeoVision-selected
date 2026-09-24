const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const publicDir = 'c:/Users/SruthikaDoddi/Geovision2/GeoVision-selected/public';
const files = [
  'bg1.png',
  'bg1 (2).png',
  'bg2.png',
  'bg2 (2).png',
  'bg3dark.png',
  'bg3white.png',
  'homepage bg dark.png',
  'homepage-bg-dark (4).png',
  'homepage-bg-dark (5).png',
];

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (!fs.existsSync(filePath)) return;
  
  const data = fs.readFileSync(filePath);
  const png = PNG.sync.read(data);
  
  let totalBrightness = 0;
  let pixelCount = png.width * png.height;
  
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i];
    const g = png.data[i + 1];
    const b = png.data[i + 2];
    totalBrightness += (r + g + b) / 3;
  }
  
  const avgBrightness = (totalBrightness / pixelCount).toFixed(2);
  console.log(`${file.padEnd(25)} -> avgBrightness: ${avgBrightness}`);
});
