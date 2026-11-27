// System One at the modeller's scale: activities inside an operation in the network view, the café cut by service,
// the VSM reading an activity's flows as its operation's, and the optional boundary prompts.
const { chromium } = require('playwright'); const fs = require('fs'); const { DEP, PAGE, OUT } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
const route = async cx => { await cx.route('https://cdn.jsdelivr.net/**', r => { const u = new URL(r.request().url()); r.fulfill({ body: fs.readFileSync(DEP + u.pathname.replace('/npm/three@0.128.0', '')), contentType: 'application/javascript' }); }); await cx.route('https://fonts.**/**', r => r.abort()); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const cx = await b.newContext({ viewport: { width: 1280, height: 800 } }); await route(cx);
  const pg = await cx.newPage(); pg.on('pageerror', e => errs.push(e.stack));
  await pg.goto(PAGE); await pg.waitForTimeout(2000);
  const stored = () => pg.evaluate(() => { const d = JSON.parse(localStorage.getItem('vsm-explorer:v1')).db; return d.levels[d.currentId]; });
  ok(await pg.$('#wExamples [data-ex="cafe"]') && await pg.$('#wExamples [data-ex="cafeServices"]'), 'both cafés are offered as examples');
  await pg.click('#wExamples [data-ex="cafeServices"]'); await pg.waitForTimeout(1500);
  let r = await stored();
  ok(r.opCount === 3 && r.labels.o0 === 'Dine-in' && r.labels.o2 === 'Catering', 'the café by service has Dine-in, Takeaway and Catering as System One');
  ok(r.net.actors.filter(a => a.kind === 'act').length === 11 && Object.keys(r.children).length === 0, 'the stations are activities, and no lower level was made from them');
  await pg.click('#dNet'); await pg.waitForTimeout(1000);
  ok(await pg.locator('#netSvg .nn.act.big').count() === 3, 'each service is its own circle, enlarged to hold its activities');
  ok(await pg.locator('#netSvg .nn.actv').count() === 11, 'activities are drawn as small boxes');
  await pg.screenshot({ path: OUT + '/shots/activities-net.png' });
  // the VSM sees an activity's flows as its operation's: Guests become Dine-in's environment
  const env = await pg.evaluate(() => { const d = JSON.parse(localStorage.getItem('vsm-explorer:v1')).db; return d; });
  // select Dine-in and read its card
  await pg.click('#netSvg .nn.act[data-id="o0"]', { force: true }); await pg.waitForTimeout(400);
  const card = await pg.textContent('#netCard');
  ok(/Table ordering/.test(card) && /Guests/.test(card), 'the operation card lists its activities and takes Guests as its local environment');
  ok(/Where to draw System One \(optional\)/.test(card), 'the boundary prompts are offered, folded, in the operation card');
  // add an activity, then promote it
  await pg.click('#nAddAct'); await pg.waitForTimeout(400);
  ok(/Activity/.test(await pg.textContent('#netCard')) && !/\bActor\b/.test(await pg.textContent('#netCard')), 'a new activity is called an activity, not an actor');
  ok(/Activity/.test(await pg.textContent('#netSvg')), 'an unnamed activity reads "Activity" in the network');
  await pg.fill('#nName', 'Drive-through window'); await pg.press('#nName', 'Tab'); await pg.waitForTimeout(300);
  r = await stored();
  const added = r.net.actors.find(a => a.name === 'Drive-through window');
  ok(added && added.kind === 'act' && added.op === 'o0', 'a new activity sits inside the operation it was added to');
  await pg.click('#nPromote'); await pg.waitForTimeout(800);
  r = await stored();
  ok(r.opCount === 4 && r.labels.o3 === 'Drive-through window' && !r.net.actors.some(a => a.id === added.id), 'an activity can be made an operation when the modeller decides');
  ok(errs.length === 0 || errs.every(e => /font/i.test(e)), 'no page errors');
  // the VSM: Dine-in's details carry the prompts, hidden for other elements
  await pg.click('#dVsm'); await pg.waitForTimeout(900);
  await pg.click('#btnSide'); await pg.waitForTimeout(300);
  await pg.click('#tab-details'); await pg.waitForTimeout(200); // the panel opens on the Register; these checks use Settings
  await pg.$eval('.erow[data-id="o0"] .ecode', e => e.click()); await pg.waitForTimeout(400);
  ok(await pg.isVisible('#iBoundarySec') && !(await pg.getAttribute('#iBoundarySec', 'open')), 'an operation\'s details offer the prompts, closed by default');
  const fl = await pg.textContent('#insp');
  await pg.$eval('.erow[data-id="s3"] .ecode', e => e.click()); await pg.waitForTimeout(400);
  ok(await pg.isHidden('#iBoundarySec'), 'other elements do not show them');
  await pg.screenshot({ path: OUT + '/shots/activities-vsm.png' });
  // the organising criterion: a label on the level, shown on the recursion tree
  await pg.click('#iClose').catch(() => {}); await pg.waitForTimeout(300);
  ok(await pg.inputValue('#levelUnfold') === 'customer' && await pg.isVisible('#levelUnfoldSrc'), 'the café by service unfolds by customers, with the source named');
  await pg.selectOption('#levelUnfold', 'geo'); await pg.waitForTimeout(600);
  r = await stored();
  ok(r.unfold && r.unfold.by === 'geo' && /tables/.test(r.unfold.why || ''), 'changing the criterion keeps its note (' + JSON.stringify(r.unfold) + ')');
  await pg.click('#dRec'); await pg.waitForTimeout(600);
  ok(/Unfolds by geography/i.test(await pg.textContent('#tree')), 'the recursion tree shows how the level unfolds');
  await pg.screenshot({ path: OUT + '/shots/activities-rec.png' });
  await pg.selectOption('#levelUnfold', '').catch(() => {});
  console.log(errs.length ? 'page errors:\n' + errs.join('\n') : 'no page errors');
  await b.close();
})();
