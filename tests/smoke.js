const { chromium } = require('playwright'); const fs = require('fs'); const { DEP, PAGE } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
const route = async cx => { await cx.route('https://cdn.jsdelivr.net/**', r => { const u = new URL(r.request().url()); r.fulfill({ body: fs.readFileSync(DEP + u.pathname.replace('/npm/three@0.128.0', '')), contentType: 'application/javascript' }); }); await cx.route('https://fonts.**/**', r => r.abort()); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const cx = await b.newContext({ viewport: { width: 1440, height: 900 } }); await route(cx);
  const pg = await cx.newPage(); pg.on('pageerror', e => errs.push(e.stack));
  await pg.goto(PAGE); await pg.waitForTimeout(2500);
  for (const st of ['Square', 'Diamond']) {
    await pg.click('text=' + st); await pg.waitForTimeout(500);
    for (const v of ['2', '3']) {
      await pg.keyboard.press(v); await pg.waitForTimeout(1500);
      const y = await pg.evaluate(() => { const g = id => { const n = [...document.querySelectorAll('.lbl')].find(d => d.querySelector('.code') && d.querySelector('.code').textContent === id); const r = n.getBoundingClientRect(); return r.y + r.height / 2; }; return [g('EF'), g('4')]; });
      if (v === '2') ok(Math.abs(y[0] - y[1]) < 14, st + ' 2D: future environment level with System Four (' + y.map(Math.round).join(' vs ') + ')');
    }
  }
  await pg.click('text=Square'); await pg.keyboard.press('2'); await pg.waitForTimeout(1400);
  const p = await pg.evaluate(() => { const n = [...document.querySelectorAll('.lbl')].find(d => d.querySelector('.code') && d.querySelector('.code').textContent === 'EF'); const r = n.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2 + 6]; });
  await pg.mouse.click(p[0], p[1]); await pg.waitForTimeout(500);
  ok(/Outside-and-then link/.test(await pg.textContent('#iLinks')), 'future environment details list the System Four link');
  await pg.click('#btnModel'); await pg.click('#ctx button:has-text("Café")'); await pg.waitForTimeout(800);
  await pg.keyboard.press('n'); await pg.waitForTimeout(500); ok((await pg.$$('g.act')).length === 6, 'value network renders');
  await pg.keyboard.press('r'); await pg.waitForTimeout(500); ok((await pg.$$('.rcard.level')).length === 2, 'recursion renders');
  await pg.keyboard.press('r'); await pg.waitForTimeout(1200);
  const ph = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); await route(ph);
  const pp = await ph.newPage(); pp.on('pageerror', e => errs.push('phone ' + e.stack));
  await pp.goto(PAGE); await pp.waitForTimeout(2500);
  ok(await pp.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'phone: no horizontal scroll');
  await pp.screenshot({ path: process.env.SP + '/shots/smoke-phone.png' });
  console.log('errors', errs);
  await b.close();
})();
