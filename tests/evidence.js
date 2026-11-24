// Diagnosis as evidence: "not assessed" apart from "no issue", the grounds of each finding, suggested flows,
// the findings export, and files from before these fields still opening.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { DEP, PAGE, OUT } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
const route = async cx => { await cx.route('https://cdn.jsdelivr.net/**', r => { const u = new URL(r.request().url()); r.fulfill({ body: fs.readFileSync(DEP + u.pathname.replace('/npm/three@0.128.0', '')), contentType: 'application/javascript' }); }); await cx.route('https://fonts.**/**', r => r.abort()); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const cx = await b.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true }); await route(cx);
  const pg = await cx.newPage(); pg.on('pageerror', e => errs.push(e.stack));
  await pg.goto(PAGE); await pg.waitForTimeout(2000);
  await pg.click('#wExamples [data-ex="example"]'); await pg.waitForTimeout(1500);
  const stored = () => pg.evaluate(() => { const d = JSON.parse(localStorage.getItem('vsm-explorer:v1')).db; return d.levels[d.rootId]; });
  const pick = async text => { await pg.click('#btnModel'); await pg.waitForTimeout(250); await pg.locator('.ctx button, [role=menuitem]').filter({ hasText: text }).first().click({ force: true }); };
  const grab = async text => { const [d] = await Promise.all([pg.waitForEvent('download', { timeout: 15000 }), pick(text)]); const p = path.join(OUT, 'ev-' + d.suggestedFilename()); await d.saveAs(p); return fs.readFileSync(p, 'utf8'); };
  await pg.click('#btnSide'); await pg.waitForTimeout(300);
  await pg.click('#tab-model'); await pg.waitForTimeout(200); // the panel opens on the Register; these checks use Settings
  ok(/Nothing assessed yet/.test(await pg.textContent('#diagList')), 'a fresh level says nothing has been assessed');
  // System Five: assessed, no issue
  await pg.click('.erow[data-id="s5"] .ecode'); await pg.waitForTimeout(400);
  ok(/Not assessed/.test(await pg.textContent('#iDiag')) && await pg.getAttribute('#iDiag .dchip[data-k=""]', 'aria-pressed') === 'true', 'details start at "Not assessed"');
  await pg.click('#iDiag .dchip[data-k="ok"]'); await pg.waitForTimeout(200);
  await pg.fill('#iDiagNote', 'Board minutes for 2025 reviewed'); await pg.selectOption('#iDiagSrc', 'document');
  ok(await pg.isHidden('#iDiagCons'), '"No issue" asks for evidence, not a consequence');
  // System Four: a finding with its grounds
  await pg.click('.erow[data-id="s4"] .ecode'); await pg.waitForTimeout(400);
  await pg.click('#iDiag .dchip[data-k="weak"]'); await pg.waitForTimeout(200);
  await pg.fill('#iDiagNote', 'Two of six people on warranty fixes'); await pg.selectOption('#iDiagSrc', 'interview');
  await pg.click('#iDiag [data-conf="medium"]'); await pg.fill('#iDiagCons', 'No one scans battery rules ahead'); await pg.selectOption('#iDiagSt', 'review');
  await pg.waitForTimeout(400);
  await pg.evaluate(() => { const b = document.querySelector('#iDiag'); b.scrollIntoView(); });
  await pg.screenshot({ path: OUT + '/shots/evidence-details.png' });
  let r = await stored();
  ok(r.diag.s4.s === 'weak' && r.diag.s4.note && r.diag.s4.src === 'interview' && r.diag.s4.conf === 'medium' && r.diag.s4.cons && r.diag.s4.st === 'review' && /^\d{4}-\d\d-\d\d$/.test(r.diag.s4.at), 'a finding keeps evidence, source, confidence, consequence, status and date');
  ok(r.diag.s5.s === 'ok' && r.diag.s5.src === 'document', '"no issue" is stored apart from "not assessed"');
  await pg.click('#iDiag .dchip[data-k="malfunction"]'); await pg.waitForTimeout(200);
  r = await stored();
  ok(r.diag.s4.s === 'malfunction' && r.diag.s4.note === 'Two of six people on warranty fixes' && r.diag.s4.conf === 'medium', 'changing the judgement keeps its grounds');
  const list = await pg.textContent('#diagList');
  ok(/2 of \d+ assessed · 1 finding · 1 with no issue/.test(list) && /Under review · Medium confidence/.test(list), 'the Settings list shows coverage, status and confidence (' + list.slice(0, 60) + ')');
  ok(await pg.evaluate(() => [...document.querySelectorAll('#labels .lbl .dg')].some(d => d.textContent === '✓' && d.classList.contains('ok'))), 'the model marks what was assessed with no issue');
  await pg.click('#iDiag .dchip[data-k=""]'); await pg.waitForTimeout(200);
  ok(!(await stored()).diag.s4, '"Not assessed" removes the mark');
  await pg.click('#iDiag .dchip[data-k="weak"]'); await pg.fill('#iDiagNote', 'Two of six people on warranty fixes'); await pg.waitForTimeout(200);
  await pg.click('#iClose');
  // exports
  const csv = await grab('(CSV)');
  ok(/Evidence,Source,Confidence,Consequence,Status,Recorded/.test(csv) && /Assessed: no issue found,Board minutes for 2025 reviewed,Document or report/.test(csv), 'CSV holds the new columns and the "no issue" rows');
  const html = await grab('(HTML)');
  ok(/Not yet assessed/.test(html) && /Assessed, no issue found/.test(html) && /Tentative/.test(html), 'the report lists findings, what held up and what nobody has assessed');
  // suggested flows, on a blank model where every channel is empty
  await pick('New blank model'); await pg.waitForTimeout(1200);
  await pg.click('#tab-flows'); await pg.waitForTimeout(300);
  await pg.click('#btnSuggest'); await pg.waitForTimeout(300);
  r = await stored();
  const sugCh = Object.keys(r.flows).find(k => r.flows[k].every(f => f.sug));
  ok(!!sugCh, 'standard flows are stored as suggested (' + sugCh + ')');
  ok(/only suggested/.test(await pg.textContent('#covTx')), 'coverage separates suggested from observed flows');
  await pg.locator('#flowList details[data-ch="' + sugCh + '"] summary').click(); await pg.waitForTimeout(400);
  await pg.locator('#iFlows .fok').first().click(); await pg.waitForTimeout(200);
  await pg.waitForTimeout(300); r = await stored();
  ok(!r.flows[sugCh][0].sug, '"Mark as observed" confirms a suggested flow');
  // an older file: marks with only a state and a note, plus one the explorer never knew
  const old = { format: 'viable-system-explorer', version: 1, model: { seq: 1, rootId: 'L1', currentId: 'L1', levels: { L1: { id: 'L1', depth: 0, name: 'Old Co', opCount: 3, labels: {}, colors: {}, notes: {}, flows: { c2: [{ name: 'Rota', dir: 'ab' }] }, children: {}, diag: { s3: { s: 'weak', note: 'old note' }, s4: { s: 'bogus' } } } } } };
  fs.writeFileSync(path.join(OUT, 'old.vsm.json'), JSON.stringify(old));
  await pg.setInputFiles('#fileOpen', path.join(OUT, 'old.vsm.json')); await pg.waitForTimeout(1200);
  r = await stored();
  ok(r.name === 'Old Co' && r.diag.s3.s === 'weak' && r.diag.s3.note === 'old note' && !r.diag.s4 && !r.flows.c2[0].sug, 'an older file opens: its marks keep their notes, unknown states are dropped, its flows count as observed');
  await pg.click('#tab-settings').catch(() => {}); await pg.waitForTimeout(300);
  ok(/Tentative · confidence not set/.test(await pg.textContent('#diagList')), 'an older mark reads as tentative, with confidence not set');
  console.log('errors', JSON.stringify(errs));
  await b.close();
})();
