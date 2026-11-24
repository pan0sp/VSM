// The quick fixes from Astra's review (Nov 19 2026): codes, the details pane, Esc while presenting,
// the operation limit, the Claude block off claude.ai and the model company's value network.
const { chromium } = require('playwright'); const fs = require('fs'); const { DEP, PAGE } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
const route = async cx => { await cx.route('https://cdn.jsdelivr.net/**', r => { const u = new URL(r.request().url()); r.fulfill({ body: fs.readFileSync(DEP + u.pathname.replace('/npm/three@0.128.0', '')), contentType: 'application/javascript' }); }); await cx.route('https://fonts.**/**', r => r.abort()); };
const menuPick = async (pg, text) => { await pg.click('#btnModel'); await pg.waitForTimeout(300); await pg.locator('.ctx button, [role=menuitem]').filter({ hasText: text }).first().click({ force: true }); await pg.waitForTimeout(1300); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const cx = await b.newContext({ viewport: { width: 1280, height: 720 } }); await route(cx);
  const pg = await cx.newPage(); pg.on('pageerror', e => errs.push(e.stack));
  await pg.goto(PAGE); await pg.waitForTimeout(2000);
  await pg.click('#wExamples [data-ex="cafe"]'); await pg.waitForTimeout(1200);
  const codes = await pg.evaluate(() => [...document.querySelectorAll('#labels .lbl .code')].map(c => c.textContent));
  ok(codes.filter(c => c === 'EF').length <= 1 && codes.includes('FE'), 'the future environment is FE, so EF only names a local environment');
  await pg.click('#btnSide'); await pg.waitForTimeout(300);
  await pg.click('#tab-model'); await pg.waitForTimeout(200);
  ok(await pg.isVisible('#opMax') && await pg.isDisabled('#opPlus'), 'at six operations, + is off and a note says why');
  ok(await pg.isHidden('#aiBlock'), 'off claude.ai the Claude mapping block is hidden');
  // the details pane: closed stays closed through view and model changes; a new choice opens it
  await pg.click('.erow[data-id="s3"] .ecode'); await pg.waitForTimeout(400);
  ok(await pg.isVisible('#insp'), 'choosing an element opens its details');
  await pg.click('#iClose'); await pg.waitForTimeout(300);
  for (const v of ['#v3d', '#vHemi', '#v2d', '#dNet', '#dVsm']) { await pg.click(v); await pg.waitForTimeout(1400); }
  ok(await pg.isHidden('#insp'), 'a closed details pane stays closed through view changes');
  await menuPick(pg, 'Model company');
  ok(await pg.isHidden('#insp'), 'and through opening another model');
  await pg.click('.erow[data-id="s4"] .ecode'); await pg.waitForTimeout(400);
  ok(await pg.isVisible('#insp'), 'after a model change, choosing an element opens its details again');
  // the model company has a value network now
  await pg.click('#dNet'); await pg.waitForTimeout(900);
  const nodes = await pg.evaluate(() => document.querySelectorAll('#netSvg .nnode, #netSvg g[data-id]').length);
  ok(nodes >= 9, 'the model company shows its value network (' + nodes + ' nodes)');
  await pg.screenshot({ path: __dirname + '/.out/shots/larchmere-net.png' });
  await pg.click('#dVsm'); await pg.waitForTimeout(900);
  // Esc leaves presentation mode at once, even during the tour
  await pg.keyboard.press('p'); await pg.waitForTimeout(500);
  await pg.keyboard.press('PageDown'); await pg.waitForTimeout(700);
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(500);
  ok(!(await pg.evaluate(() => document.getElementById('app').classList.contains('presenting'))), 'Esc leaves presentation mode in one press, as the bar says');
  console.log('errors', JSON.stringify(errs));
  await b.close();
})();
