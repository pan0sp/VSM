const { chromium } = require('playwright'); const fs = require('fs'); const { DEP, PAGE } = require('./lib'); const { settingsOpen } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
(async () => {
  const b = await chromium.launch(); const cx = await b.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  await cx.route('https://cdn.jsdelivr.net/**', r => { const u = new URL(r.request().url()); r.fulfill({ body: fs.readFileSync(DEP + u.pathname.replace('/npm/three@0.128.0', '')), contentType: 'application/javascript' }); });
  await cx.route('https://fonts.**/**', r => r.abort());
  const pg = await cx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.stack));
  await pg.goto(PAGE); await pg.waitForTimeout(2500); await settingsOpen(pg);
  const crumbs = () => pg.textContent('#crumbs');
  const menu = async t => { await pg.click('#btnModel'); await pg.waitForTimeout(150); await pg.click('#ctx button:has-text("' + t + '")'); await pg.waitForTimeout(700); };
  ok(!(await pg.$('#preset')), 'labels preset dropdown removed');
  await pg.click('#btnModel'); await pg.waitForTimeout(200);
  const m = await pg.textContent('#ctx');
  ok(/New blank model/.test(m) && /Open from file/.test(m) && /Save to file/.test(m) && /Café/.test(m) && /Regional hospital/.test(m), 'menu lists actions and examples');
  await pg.screenshot({ path: process.env.SP + '/shots/f-menu.png' });
  await pg.keyboard.press('Escape');
  await menu('Café');
  ok(/Café/.test(await crumbs()), 'café example loads: ' + await crumbs());
  const nLv = await pg.evaluate(() => JSON.parse(localStorage.getItem('vsm-explorer:v1')).db.levels);
  ok(Object.keys(nLv).length === 2, 'café is a complete model with 2 levels');
  // save
  await pg.click('#v2d'); await pg.waitForTimeout(300);
  const [dl] = await Promise.all([pg.waitForEvent('download'), pg.keyboard.press('Control+s')]);
  const path = process.env.SP + '/saved-' + dl.suggestedFilename(); await dl.saveAs(path);
  const saved = JSON.parse(fs.readFileSync(path, 'utf8'));
  ok(dl.suggestedFilename() === 'cafe.vsm.json' && saved.format === 'viable-system-explorer' && saved.levels === 2 && saved.conventions.style, 'saved file: ' + dl.suggestedFilename());
  // new blank, then undo
  await menu('New blank model');
  ok(/Organization/.test(await crumbs()), 'blank model: ' + await crumbs());
  await pg.click('#toast button.go'); await pg.waitForTimeout(700);
  ok(/Café/.test(await crumbs()), 'undo restores café');
  // new, then open the saved file
  await menu('New blank model');
  await pg.click('#stDiamond'); await pg.waitForTimeout(400);
  await pg.setInputFiles('#fileOpen', path); await pg.waitForTimeout(900);
  ok(/Café/.test(await crumbs()), 'opening the file restores café');
  ok(await pg.$eval('#stSquare', e => e.getAttribute('aria-pressed') === 'true'), 'conventions come back with the file');
  ok(/Opened saved-cafe.vsm.json \(2 levels\)/.test(await pg.textContent('#toast')), 'toast: ' + await pg.textContent('#toast'));
  // bad file
  fs.writeFileSync(process.env.SP + '/bad.json', '{"hello":1}');
  await pg.setInputFiles('#fileOpen', process.env.SP + '/bad.json'); await pg.waitForTimeout(500);
  ok(/Could not open bad.json/.test(await pg.textContent('#toast')) && /Café/.test(await crumbs()), 'bad file refused, model kept');
  // broken model inside a valid envelope
  saved.model.levels[saved.model.rootId].opCount = 'x'; saved.model.levels[saved.model.rootId].labels = [1, 2];
  fs.writeFileSync(process.env.SP + '/odd.json', JSON.stringify(saved));
  await pg.setInputFiles('#fileOpen', process.env.SP + '/odd.json'); await pg.waitForTimeout(800);
  ok(/Opened odd.json/.test(await pg.textContent('#toast')), 'odd values are repaired on open');
  await menu('Regional hospital');
  ok(/hospital/i.test(await crumbs()), 'hospital example: ' + await crumbs());
  await menu('Model company');
  ok((await pg.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('vsm-explorer:v1')).db.levels).length)) > 3, 'model company loads its levels');
  await pg.setViewportSize({ width: 390, height: 800 }); await pg.waitForTimeout(500);
  ok(await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'phone: no horizontal scroll');
  await pg.screenshot({ path: process.env.SP + '/shots/f-phone.png' });
  console.log('errors', errs); await b.close();
})();
