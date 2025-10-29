const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const index = path.join(dist, 'index.html');
const to404 = path.join(dist, '404.html');
const to200 = path.join(dist, '200.html');

try {
  if (fs.existsSync(index)) {
    fs.copyFileSync(index, to404);
    fs.copyFileSync(index, to200);
    console.log('Created SPA fallbacks: 404.html and 200.html');
  } else {
    console.warn('index.html not found in dist. Skipping SPA fallback copies.');
  }
} catch (e) {
  console.error('Failed to create SPA fallback files:', e.message);
  process.exitCode = 0; // non-fatal
}

