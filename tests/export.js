// Export: the view as PNG and SVG, and the findings as CSV and a printable report.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const { DEP, PAGE, OUT } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
const route = async cx => { await cx.route('https://cdn.jsdelivr.net/**', r => { const u = new URL(r.request().url()); r.fulfill({ body: fs.readFileSync(DEP + u.pathname.replace('/npm/three@0.128.0', '')), contentType: 'application/javascript' }); }); await cx.route('https://fonts.**/**', r => r.abort()); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const cx = await b.newContext({ viewport: { width: 1280, height: 720 }, acceptDownloads: true }); await route(cx);
  const pg = await cx.newPage(); pg.on('pageerror', e => errs.push(e.stack));
  await pg.goto(PAGE); await pg.waitForTimeout(2000);
  await pg.click('#wExamples [data-ex="example"]'); await pg.waitForTimeout(1500);
  const pick = async text => { await pg.click('#btnModel'); await pg.waitForTimeout(250); await pg.locator('.ctx button, [role=menuitem]').filter({ hasText: text }).first().click({ force: true }); };
  const grab = async text => { const [d] = await Promise.all([pg.waitForEvent('download', { timeout: 15000 }), pick(text)]); const p = path.join(OUT, d.suggestedFilename()); await d.saveAs(p); return p; };
  // nothing flagged yet
  await pick('Findings table'); await pg.waitForTimeout(400);
  ok(/Nothing has been assessed/.test(await pg.textContent('#toast')), 'with no findings, export says so instead of saving an empty table');
  // flag System Four with evidence
  await pg.click('#btnSide'); await pg.waitForTimeout(300);
  await pg.click('.erow[data-id="s4"] .ecode'); await pg.waitForTimeout(400);
  await pg.click('#iDiag .dchip[data-k="weak"]'); await pg.waitForTimeout(200);
  await pg.fill('#iDiagNote', 'Six people, "R&D" mostly fire-fighting, per COO interview'); await pg.waitForTimeout(200);
  await pg.click('#iClose');
  const png = await grab('(PNG)');
  const buf = fs.readFileSync(png);
  ok(/\.png$/.test(png) && buf.slice(1, 4).toString() === 'PNG' && buf.readUInt32BE(16) >= 1900, 'PNG of the 2D view at twice the size (' + path.basename(png) + ', ' + buf.readUInt32BE(16) + ' px wide)');
  const svg = fs.readFileSync(await grab('(SVG)'), 'utf8');
  ok(/<svg/.test(svg) && /<image/.test(svg) && />City</.test(svg) && /vsm\.closetheloop\.gr/.test(svg), 'SVG keeps the labels as text, over the picture, with the credit');
  const csv = fs.readFileSync(await grab('(CSV)'), 'utf8');
  ok(/^﻿Level,System in focus,Code,Element,Kind,Finding,Evidence/.test(csv) && /Lacks requisite variety/.test(csv) && /"Six people, ""R&D"" mostly fire-fighting, per COO interview"/.test(csv), 'CSV lists the finding with its evidence, quoted safely');
  const html = fs.readFileSync(await grab('(HTML)'), 'utf8');
  ok(/<table>/.test(html) && /data:image\/png;base64/.test(html) && /Level 0/.test(html), 'the report holds the view and a findings table by level');
  // the value network exports as a true vector
  await pg.click('#dNet'); await pg.waitForTimeout(900);
  const nsvg = fs.readFileSync(await grab('(SVG)'), 'utf8');
  ok(/<svg/.test(nsvg) && !/<image/.test(nsvg) && /E-bikes/.test(nsvg) && !/data-handle/.test(nsvg), 'the value network exports as vector SVG without editing handles');
  const npng = await grab('(PNG)');
  ok(fs.readFileSync(npng).slice(1, 4).toString() === 'PNG', 'and as PNG');
  fs.copyFileSync(png, path.join(OUT, 'shots', 'export-2d.png')); fs.copyFileSync(npng, path.join(OUT, 'shots', 'export-net.png'));
  console.log('errors', JSON.stringify(errs));
  await b.close();
})();
