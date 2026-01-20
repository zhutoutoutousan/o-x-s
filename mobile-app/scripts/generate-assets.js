const fs = require('fs');
const path = require('path');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Generate a simple SVG icon
const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#d4af37;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ff6b9d;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c77dff;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="200" fill="url(#grad1)"/>
  <text x="512" y="600" font-family="Arial" font-size="400" font-weight="bold" fill="white" text-anchor="middle">💕</text>
</svg>`;

// Generate splash screen SVG
const splashSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="2048" height="2732" viewBox="0 0 2048 2732" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="2048" height="2732" fill="url(#splashGrad)"/>
  <text x="1024" y="1200" font-family="Arial" font-size="300" font-weight="bold" fill="#d4af37" text-anchor="middle">💕</text>
  <text x="1024" y="1600" font-family="Arial" font-size="120" fill="#d4af37" text-anchor="middle">Love AI Messenger</text>
</svg>`;

// Generate adaptive icon SVG
const adaptiveIconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="adaptiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="200" fill="url(#adaptiveGrad)"/>
  <text x="512" y="600" font-family="Arial" font-size="400" font-weight="bold" fill="#d4af37" text-anchor="middle">💕</text>
</svg>`;

// Write SVG files
fs.writeFileSync(path.join(assetsDir, 'icon.svg'), iconSvg);
fs.writeFileSync(path.join(assetsDir, 'splash.svg'), splashSvg);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.svg'), adaptiveIconSvg);

console.log('✅ Asset SVG files generated!');
console.log('Note: For production, convert these SVG files to PNG using a tool like ImageMagick or an online converter.');
console.log('For now, Expo will use default assets.');
