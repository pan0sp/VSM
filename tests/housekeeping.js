// v1.5.3 housekeeping (Nov 19 2026, from Gemini's review): Beer's canonical wiring by default, three.js from
// beside the page with no network, and mapping by copy and paste where Claude cannot map directly.
const { chromium } = require('playwright'); const { PAGE, settingsOpen } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
(async () => {
  const b = await chromium.launch(); const errs = [], cdn = [];
  const cx = await b.newContext({ viewport: { width: 1280, height: 800 }, permissions: ['clipboard-read', 'clipboard-write'] });
  // no network at all: the page must draw from its own copy of three.js
  await cx.route('https://**/**', r => { if (r.request().url().includes('jsdelivr')) cdn.push(r.request().url()); r.abort(); });
  const pg = await cx.newPage(); pg.on('pageerror', e => errs.push(e.stack));
  await pg.goto(PAGE); await pg.waitForTimeout(2000);
  ok(await pg.evaluate(() => !!(window.THREE && THREE.OrbitControls)), 'three.js and its controls load from vendor/ with the network off');
  ok(!cdn.length, 'jsDelivr is not asked when the local copy is there');
  ok(await pg.isHidden('#fallback'), 'the VSM is drawn, no fallback message');
  await settingsOpen(pg);
  ok(!(await pg.isChecked('#extS4cmd')) && !(await pg.isChecked('#extS14')), 'a first visit shows Beer\'s canonical wiring: both extensions off');
  ok(await pg.evaluate(() => !document.querySelector('#labels .lbl[data-id="s14"], #labels .lbl[data-id="s4cmd"]')), 'no extension channel is labelled');
  // mapping by copy and paste
  await pg.click('#tab-reg'); await pg.waitForTimeout(300);
  ok(await pg.isHidden('#aiBlock') && await pg.isVisible('#aiManual'), 'off claude.ai, the copy-and-paste mapping replaces the Claude block');
  await pg.evaluate(() => { document.getElementById('aiManual').open = true; });
  await pg.click('#amCopy'); await pg.waitForTimeout(200);
  ok(/Describe the organization first/.test(await pg.textContent('#amStatus')), 'copying with no description asks for one');
  await pg.fill('#amBrief', 'A bakery with two shops and a wholesale arm.');
  await pg.click('#amCopy'); await pg.waitForTimeout(300);
  const clip = await pg.evaluate(() => navigator.clipboard.readText().catch(() => ''));
  ok(clip.includes('A bakery with two shops') && clip.includes('Channel ids'), 'the copied prompt holds the description and the channel guide');
  await pg.fill('#amAnswer', 'not json'); await pg.click('#amApply'); await pg.waitForTimeout(200);
  ok(/could not be read/.test(await pg.textContent('#amStatus')), 'an unreadable answer changes nothing and says so');
  const answer = 'Here it is:\n```json\n' + JSON.stringify({ name: 'Crumb and Co', operations: [
    { name: 'High Street shop', environment: 'Walk-in buyers', management: 'Shop lead', antioscillation: 'Bake rota' },
    { name: 'Market shop', environment: 'Market visitors', management: 'Stall lead', antioscillation: 'Stock sheet' },
    { name: 'Wholesale', environment: 'Cafés and grocers', management: 'Trade manager', antioscillation: 'Order book', sub_operations: ['Cafés', 'Grocers'] }],
    labels: { s5: 'Owners', s3: 'Operations manager' }, flows: { eo0: [{ name: 'Bread sold over the counter', dir: 'ba' }] } }) + '\n```';
  await pg.fill('#amAnswer', answer); await pg.click('#amApply'); await pg.waitForTimeout(1200);
  ok(/Mapped Crumb and Co: 3 operations/.test(await pg.textContent('#amStatus')), 'a pasted answer, even in a code fence, maps the level');
  const labels = await pg.evaluate(() => [...document.querySelectorAll('#labels .lbl')].map(l => l.textContent).join('|'));
  ok(labels.includes('Wholesale') && labels.includes('Owners'), 'the diagram shows the mapped labels');
  await pg.screenshot({ path: process.env.SP + '/shots/housekeeping.png' });
  errs.forEach(e => console.log('page error: ' + e));
  await b.close();
})();
