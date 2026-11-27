// Clicking a channel whose flows come from the value network must not cover the app (Panos, Nov 19 2026:
// a row's "net" class picked up the value network's full-screen style).
const { chromium } = require('playwright'); const fs = require('fs'); const { DEP, PAGE } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
(async () => {
  const b = await chromium.launch(); const errs = [];
  const cx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  await cx.route('https://cdn.jsdelivr.net/**', r => { const u = new URL(r.request().url()); r.fulfill({ body: fs.readFileSync(DEP + u.pathname.replace('/npm/three@0.128.0', '')), contentType: 'application/javascript' }); }); await cx.route('https://fonts.**/**', r => r.abort());
  const pg = await cx.newPage(); pg.on('pageerror', e => errs.push(e.stack));
  await pg.goto(PAGE); await pg.waitForTimeout(1500);
  await pg.click('#wExamples [data-ex="cafe"]'); await pg.waitForTimeout(1200);
  await pg.click('#btnSide'); await pg.waitForTimeout(200); await pg.click('#tab-reg'); await pg.waitForTimeout(300);
  await pg.locator('details.fch > summary').first().click({ force: true }); await pg.waitForTimeout(800);
  const rows = await pg.$$eval('.frow', rs => rs.map(r => r.getBoundingClientRect().width));
  ok(rows.length && Math.max(...rows) < 400, 'flow rows stay inside their panels (widest ' + Math.round(Math.max(...rows)) + 'px)');
  ok(await pg.evaluate(() => { const r = document.getElementById('side').getBoundingClientRect(); return document.elementFromPoint(r.left + r.width / 2, 200).closest('#side') !== null; }), 'the side panel is still on top where it should be');
  ok(/value network/i.test(await pg.textContent('#iFlows')), 'the details pane lists the flows from the value network');
  console.log(errs.length ? 'page errors:\n' + errs.join('\n') : 'no page errors');
  await b.close();
})();
