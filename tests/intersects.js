// v1.6 environmental intersects (channel iv): suggested by shared actors in the value network, set by hand
// with a reason, symbolic between neighbours when there is no network.
const { chromium } = require('playwright'); const fs = require('fs'); const { DEP, PAGE, settingsOpen } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
(async () => {
  const b = await chromium.launch(); const errs = [];
  const cx = await b.newContext({ viewport: { width: 1360, height: 860 } });
  await cx.route('https://fonts.**/**', r => r.abort());
  const pg = await cx.newPage(); pg.on('pageerror', e => errs.push(e.stack));
  await pg.goto(PAGE); await pg.waitForTimeout(1800);
  const envBox = async () => pg.evaluate(() => {
    const out = {};
    document.querySelectorAll('#labels .lbl').forEach(l => { const id = l.dataset.id; if (/^e\d$/.test(id)) out[id] = l.getBoundingClientRect().top; });
    return out;
  });
  const state = async (a, b2) => pg.evaluate(([a, b2]) => window.__vsmIsect ? window.__vsmIsect(a, b2) : null, [a, b2]);
  // the café by service: Dine-in, Takeaway, Catering, with a value network
  await pg.click('#wExamples [data-ex="cafeServices"]'); await pg.waitForTimeout(1500);
  await settingsOpen(pg);
  await pg.click('.erow[data-id="e0"] .ecode'); await pg.waitForTimeout(500);
  ok(await pg.isVisible('#iIsecSec'), 'a local environment\'s details list its intersects');
  const rows = await pg.$$eval('#iIsec .isx-row', rs => rs.map(r => r.textContent));
  ok(rows.length === 2, 'one row for each other operation (' + rows.length + ')');
  console.log('     ' + rows.map(r => r.replace(/\s+/g, ' ').slice(0, 140)).join('\n     '));
  ok(rows.every(r => /value network|Set by hand/.test(r)), 'with a value network the intersects follow its actors');
  await pg.screenshot({ path: process.env.SP + '/shots/isect-cafe.png' });
  // set Dine-in and Takeaway apart, with a reason
  const before = await pg.evaluate(() => document.querySelector('#iIsec .isx-row').textContent);
  await pg.click('#iIsec .isx-row:first-child [data-on="false"]'); await pg.waitForTimeout(800);
  ok(/Set by hand/.test(await pg.textContent('#iIsec .isx-row:first-child')), 'Apart marks the pair as set by hand');
  await pg.fill('#iIsec .isx-row:first-child input', 'Different customers and suppliers');
  await pg.waitForTimeout(400);
  const saved = await pg.evaluate(() => JSON.parse(localStorage.getItem('vsm-explorer:v1')).db);
  const lv = saved.levels[saved.currentId];
  ok(lv.isect && lv.isect['0-1'] && lv.isect['0-1'].on === false && lv.isect['0-1'].why === 'Different customers and suppliers', 'the choice and its reason are saved with the level');
  await pg.click('#iIsec .isx-row:first-child [data-on="true"]'); await pg.waitForTimeout(800);
  await pg.screenshot({ path: process.env.SP + '/shots/isect-set.png' });
  await pg.click('#iIsec .isx-row:first-child [data-on="auto"]'); await pg.waitForTimeout(800);
  ok(/value network/.test(await pg.textContent('#iIsec .isx-row:first-child')), 'As found hands the pair back to the value network');
  // no value network: neighbours overlap symbolically
  await pg.click('#btnModel'); await pg.waitForTimeout(300);
  await pg.locator('.ctx button, [role=menuitem]').filter({ hasText: 'Regional hospital' }).first().click({ force: true }); await pg.waitForTimeout(1500);
  await pg.click('.erow[data-id="e1"] .ecode'); await pg.waitForTimeout(500);
  const hr = await pg.$$eval('#iIsec .isx-row', rs => rs.map(r => r.textContent.replace(/\s+/g, ' ')));
  console.log('     ' + hr.join('\n     '));
  ok(hr.length === 3 && hr.filter(r => /symbolically/.test(r) && /IntersectAs found/.test(r)).length === 2, 'without a network, neighbours intersect symbolically and others stay apart');
  await pg.click('#iIsec .isx-row:nth-child(2) [data-on="false"]'); await pg.waitForTimeout(900);
  await pg.screenshot({ path: process.env.SP + '/shots/isect-apart.png' });
  // removing an operation keeps the right pairs
  errs.forEach(e => console.log('page error: ' + e));
  await b.close();
})();
