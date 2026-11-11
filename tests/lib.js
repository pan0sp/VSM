// Shared set-up for the browser checks: three.js is served from node_modules instead of the CDN,
// web fonts are skipped, and screenshots and scratch files go to tests/.out (not committed).
const path = require('path'), fs = require('fs');
const OUT = path.join(__dirname, '.out');
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
process.env.SP = OUT;
module.exports = {
  OUT,
  DEP: path.dirname(require.resolve('three/package.json')),
  PAGE: 'file://' + path.resolve(__dirname, '..', 'index.html')
};
