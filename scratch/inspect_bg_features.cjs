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
  'homepage-bg-dark.png',
  'homepage-bg-dark-new.png',
  'homepage-bg-dark (2).png',
  'homepage-bg-dark (3).png',
  'homepage-bg-dark (4).png',
  'homepage-bg-dark (5).png',
];

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (!fs.existsSync(filePath)) return;
  
  const data = fs.readFileSync(filePath);
  const png = PNG.sync.read(data);
  
  let cyanCount = 0;
  let brightGreenCyanCount = 0;
  
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const r = png.data[idx];
      const g = png.data[idx + 1];
      const b = png.data[idx + 2];
      
      // Check for cyan / teal tech line overlay pixels (high G & B, lower R)
      if (g > 160 && b > 160 && r < 100) {
        cyanCount++;
      }
      if (g > 200 && b > 200 && r < 120) {
        brightGreenCyanCount++;
      }
    }
  }
  
  console.log(`${file.padEnd(25)} -> cyanPixels: ${cyanCount.toString().padStart(6)}, brightCyanPixels: ${brightGreenCyanCount.toString().padStart(6)}`);
});
