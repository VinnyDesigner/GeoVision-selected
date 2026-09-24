const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const publicDir = 'c:/Users/SruthikaDoddi/Geovision2/GeoVision-selected/public';
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.png'));

console.log('Found PNG files in public:', files);

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  const stat = fs.statSync(filePath);
  console.log(`${file}: ${stat.size} bytes`);
});
