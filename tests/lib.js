// Shared set-up for the browser checks: three.js is served from node_modules instead of the CDN,
// web fonts are skipped, and screenshots and scratch files go to tests/.out (not committed).
const path = require('path'), fs = require('fs');
const OUT = path.join(__dirname, '.out');
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
process.env.SP = OUT;
module.exports = {
  OUT,
  DEP: path.dirname(require.resolve('three/package.json')),
  // a first visit opens on the welcome card with the panels closed, and the panel opens on the Register;
  // the older checks expect the Settings tab open with its advanced conventions showing, so close the card and open both
  settingsOpen: async pg => {
    await pg.keyboard.press('Escape');
    await pg.evaluate(() => { if (document.getElementById('app').classList.contains('side-closed')) document.getElementById('btnSide').click(); document.getElementById('tab-details').click(); });
    await pg.waitForTimeout(300);
  },
  PAGE: 'file://' + path.resolve(__dirname, '..', 'index.html')
};
