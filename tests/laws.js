// The welcome's positioning line, the Laws layer and "Laws that apply here" in the details pane.
const { chromium } = require('playwright'); const fs = require('fs'); const { DEP, PAGE } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
const route = async cx => { await cx.route('https://cdn.jsdelivr.net/**', r => { const u = new URL(r.request().url()); r.fulfill({ body: fs.readFileSync(DEP + u.pathname.replace('/npm/three@0.128.0', '')), contentType: 'application/javascript' }); }); await cx.route('https://fonts.**/**', r => r.abort()); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const cx = await b.newContext({ viewport: { width: 1280, height: 720 } }); await route(cx);
  const pg = await cx.newPage(); pg.on('pageerror', e => errs.push(e.stack));
  await pg.goto(PAGE); await pg.waitForTimeout(2000);
  ok(/facilitated diagnosis of real organizations/.test(await pg.textContent('#welcome .about-tag')), 'welcome says it is for the facilitated diagnosis of real organizations');
  await pg.screenshot({ path: process.env.SP + '/shots/laws-welcome.png' });
  await pg.click('#wExamples [data-ex="example"]'); await pg.waitForTimeout(1200);
  await pg.click('#toast button:last-child').catch(() => {});
  await pg.keyboard.press('l'); await pg.waitForTimeout(700);
  ok(await pg.isVisible('#lawsCard') && await pg.isHidden('#methodCard'), 'key L opens the Laws card in place of the Method card');
  ok(await pg.evaluate(() => document.querySelectorAll('#lawsCard [data-law]').length) === 11, 'eleven laws listed');
  await pg.click('#lawsCard [data-law="a2"]'); await pg.waitForTimeout(900);
  const f = await pg.evaluate(() => ({ bar: document.getElementById('focusBar').textContent, body: (document.querySelector('#lawsCard .law.cur .lbody') || {}).textContent || '' }));
  ok(/Second axiom/.test(f.bar), 'choosing a law focuses where it acts');
  ok(/System Four/.test(f.body), 'the law opens with where it acts and a question');
  const clear = await pg.evaluate(() => { const c = document.getElementById('lawsCard').getBoundingClientRect(); return [...document.querySelectorAll('#labels .lbl')].filter(d => d.style.visibility !== 'hidden' && !d.classList.contains('off') && /^(3|4)$/.test((d.querySelector('.code') || {}).textContent)).every(d => d.getBoundingClientRect().right <= c.left); });
  ok(clear, 'the focused systems stay clear of the Laws card');
  await pg.screenshot({ path: process.env.SP + '/shots/laws-axiom.png' });
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(700);
  ok(await pg.isHidden('#focusBar'), 'Esc shows everything again');
  // details pane
  await pg.keyboard.press('l'); await pg.waitForTimeout(400);
  await pg.evaluate(() => { if (document.getElementById('app').classList.contains('side-closed')) document.getElementById('btnSide').click(); document.getElementById('tab-details').click(); }); await pg.waitForTimeout(300); // the panel opens on the Register; these checks use Settings
  await pg.$eval('.erow[data-id="s4"] .ecode', e => e.click()); await pg.waitForTimeout(600);
  const ins = await pg.evaluate(() => [...document.querySelectorAll('#iLaws [data-law]')].map(b => b.dataset.law));
  ok(ins.includes('a2') && ins.includes('gr'), 'System Four lists the laws that apply to it (' + ins.join(',') + ')');
  await pg.screenshot({ path: process.env.SP + '/shots/laws-details.png' });
  await pg.click('#iLaws [data-law="gr"]'); await pg.waitForTimeout(800);
  ok(/Good regulator/.test(await pg.textContent('#focusBar')) && await pg.isVisible('#lawsCard'), 'a law in the details opens it in the Laws layer');
  await pg.click('#vHemi'); await pg.waitForTimeout(1200);
  await pg.click('#lawsCard [data-law="rs"]'); await pg.waitForTimeout(900);
  ok(/Recursive/.test(await pg.textContent('#focusBar')), 'laws work in the Orthogonal view');
  const body = await pg.textContent('#lawsCard .law.cur .lbody');
  ok(/“In a recursive organizational structure any viable system contains, and is contained in, a viable system\.”/.test(body) && /quoted from Wikipedia/.test(body), 'a law Wikipedia states is quoted exactly and credited');
  await pg.click('#lawsCard [data-law="gr"]'); await pg.waitForTimeout(600);
  ok(/paraphrased/.test(await pg.textContent('#lawsCard .law.cur .lbody')), 'a law it does not state says it is paraphrased');
  await pg.screenshot({ path: process.env.SP + '/shots/laws-hemi.png' });
  await pg.click('#lawsCard [data-lclose]'); await pg.waitForTimeout(500);
  ok(await pg.isHidden('#lawsCard') && await pg.isHidden('#focusBar'), 'closing the card ends the law focus');
  console.log(errs.length ? 'page errors:\n' + errs.join('\n') : 'no page errors');
  await b.close();
})();
