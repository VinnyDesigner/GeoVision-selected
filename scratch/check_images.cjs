const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const publicDir = 'c:/Users/SruthikaDoddi/Geovision2/GeoVision-selected/public';
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.png'));

console.log('Found PNG files in public:', files);

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  try {
    const data = fs.readFileSync(filePath);
    const png = PNG.sync.read(data);
    console.log(`${file}: ${png.width}x${png.height}, size: ${data.length}`);
  } catch (err) {
    console.log(`${file}: failed to parse PNG (${err.message})`);
  }
});
