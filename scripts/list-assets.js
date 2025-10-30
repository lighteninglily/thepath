// List all files in assets directory to check actual filenames
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'src', 'assets');

console.log('Assets directory:', assetsDir);
console.log('\nAll files:\n');

const files = fs.readdirSync(assetsDir);

// Filter to only JPG files that might be templates
const templateFiles = files.filter(f => 
  f.toLowerCase().endsWith('.jpg') && 
  (f.startsWith('bb') || f.startsWith('11') || f.startsWith('Rp'))
);

templateFiles.sort().forEach(file => {
  const fullPath = path.join(assetsDir, file);
  const stats = fs.statSync(fullPath);
  console.log(`${file} (${stats.size} bytes)`);
});

console.log(`\nTotal template images: ${templateFiles.length}`);
