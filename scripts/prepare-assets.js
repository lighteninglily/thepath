// Node.js script to copy template assets with clean names
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'src', 'assets');
const targetDir = path.join(__dirname, '..', 'src', 'assets', 'templates');

// Create target directory
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('Created directory:', targetDir);
}

// File mappings
const fileMappings = [
  // BB Series
  ['bb (1).jpg', 'bb-1.jpg'],
  ['bb (2).jpg', 'bb-2.jpg'],
  ['bb (3).jpg', 'bb-3.jpg'],
  ['bb (4).jpg', 'bb-4.jpg'],
  ['bb (5).jpg', 'bb-5.jpg'],
  
  // B&W Series
  ['11 -bw (1).jpg', 'bw-1.jpg'],
  ['11 -bw (2).jpg', 'bw-2.jpg'],
  ['11 -bw (3).jpg', 'bw-3.jpg'],
  
  // RP Series
  ['Rp (1).jpg', 'rp-1.jpg'],
  ['Rp (2).jpg', 'rp-2.jpg'],
  ['Rp (3).jpg', 'rp-3.jpg'],
];

let successCount = 0;
let failCount = 0;

console.log('\nCopying template assets...\n');

fileMappings.forEach(([source, target]) => {
  const sourcePath = path.join(sourceDir, source);
  const targetPath = path.join(targetDir, target);
  
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ ${source} → ${target}`);
      successCount++;
    } else {
      console.log(`❌ NOT FOUND: ${source}`);
      failCount++;
    }
  } catch (error) {
    console.log(`❌ ERROR copying ${source}:`, error.message);
    failCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Copied: ${successCount}/${fileMappings.length}`);
console.log(`   Failed: ${failCount}`);
console.log(`   Target: ${targetDir}`);
