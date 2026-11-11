const { chromium } = require('playwright'); const fs = require('fs'); const { DEP, PAGE } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
(async () => {
  const b = await chromium.launch(); const cx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await cx.route('https://cdn.jsdelivr.net/**', r => { const u = new URL(r.request().url()); r.fulfill({ body: fs.readFileSync(DEP + u.pathname.replace('/npm/three@0.128.0', '')), contentType: 'application/javascript' }); });
  await cx.route('https://fonts.**/**', r => r.abort());
  const pg = await cx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.stack));
  await pg.goto(PAGE); await pg.waitForTimeout(2500);
  await pg.click('#btnModel'); await pg.click('#ctx button:has-text("Café")'); await pg.waitForTimeout(800);
  await pg.click('#toast button:last-child').catch(() => {});
  await pg.click('#vHemi'); await pg.waitForTimeout(1500);
  ok(await pg.$eval('#btnNested', e => e.getAttribute('aria-pressed')) === 'false', 'Nested off');
  await pg.screenshot({ path: process.env.SP + '/shots/n-off.png', clip: { x: 700, y: 550, width: 400, height: 300 } });
  await pg.click('#btnNested'); await pg.waitForTimeout(700);
  await pg.screenshot({ path: process.env.SP + '/shots/n-on.png', clip: { x: 700, y: 550, width: 400, height: 300 } });
  console.log('errors', errs); await b.close();
})();
