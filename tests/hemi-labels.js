const { chromium } = require('playwright'); const fs = require('fs'); const { DEP, PAGE } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
(async () => {
  const b = await chromium.launch(); const cx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await cx.route('https://cdn.jsdelivr.net/**', r => { const u = new URL(r.request().url()); r.fulfill({ body: fs.readFileSync(DEP + u.pathname.replace('/npm/three@0.128.0', '')), contentType: 'application/javascript' }); });
  await cx.route('https://fonts.**/**', r => r.abort());
  const pg = await cx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.stack)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto(PAGE); await pg.waitForTimeout(2500);
  await pg.click('#btnMethod');
  await pg.click('#btnModel'); await pg.click('#ctx button:has-text("Café")'); await pg.waitForTimeout(1000);
  await pg.click('#vHemi'); await pg.waitForTimeout(1500);
  await pg.screenshot({ path: process.env.SP + '/shots/h-3d.png' });
  const n = await pg.$$eval('#hlabels .lbl', x => x.filter(e => e.style.display !== 'none').length);
  ok(n > 10, 'hemi labels visible: ' + n);
  // click on S4 label position -> select
  const s4 = await pg.evaluate(() => { const l = [...document.querySelectorAll('#hlabels .lbl')].find(d => d.querySelector('.code') && d.querySelector('.code').textContent === '4'); const r = l.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2 + 14]; });
  await pg.mouse.click(s4[0], s4[1]); await pg.waitForTimeout(500);
  ok(!(await pg.$eval('#insp', e => e.hidden)), 'clicking near System Four opens details: ' + await pg.textContent('#iKind'));
  await pg.screenshot({ path: process.env.SP + '/shots/h-sel.png' });
  await pg.keyboard.press('Escape'); await pg.keyboard.press('Escape');
  await pg.keyboard.press('2'); await pg.waitForTimeout(1300);
  await pg.screenshot({ path: process.env.SP + '/shots/h-plan.png' });
  await pg.keyboard.press('3'); await pg.waitForTimeout(1300);
  await pg.click('#v3d'); await pg.waitForTimeout(1400);
  ok(await pg.$eval('#hlabels', e => getComputedStyle(e).display === 'none'), 'back to 3D hides hemi labels');
  await pg.screenshot({ path: process.env.SP + '/shots/h-back.png' });
  console.log('errors', errs);
  await b.close();
})();
