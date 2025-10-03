/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'public', 'icon.svg');
const publicDir = path.join(__dirname, '..', 'public');

async function generateFavicon() {
  try {
    console.log('🎨 Generating favicon.ico...');

    // Read SVG
    const svgBuffer = fs.readFileSync(svgPath);

    // Generate 32x32 PNG (ICO format)
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));

    console.log('✅ Generated favicon.ico');
  } catch (error) {
    console.error('❌ Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
