// Light is the default theme even when the system is dark; the About dialog's hero shows both marks.
const { chromium } = require('playwright'); const fs = require('fs'); const { DEP, PAGE } = require('./lib');
const ok = (c, m) => console.log((c ? 'ok   ' : 'FAIL ') + m);
const route = async cx => { await cx.route('https://cdn.jsdelivr.net/**', r => { const u = new URL(r.request().url()); r.fulfill({ body: fs.readFileSync(DEP + u.pathname.replace('/npm/three@0.128.0', '')), contentType: 'application/javascript' }); }); await cx.route('https://fonts.**/**', r => r.abort()); };
const theme = pg => pg.evaluate(() => document.documentElement.getAttribute('data-theme'));
(async () => {
  const b = await chromium.launch(); const errs = [];
  const cx = await b.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark', deviceScaleFactor: 2 }); await route(cx);
  const pg = await cx.newPage(); pg.on('pageerror', e => errs.push(e.stack));
  await pg.goto(PAGE); await pg.waitForTimeout(2000);
  ok(await theme(pg) === 'light', 'a first visit opens light although the system is dark');
  await pg.keyboard.press('Escape');
  await pg.click('#footAbout'); await pg.waitForTimeout(2200);
  const a = await pg.evaluate(() => { const i = document.getElementById('aboutCtl'), m = document.getElementById('aboutMark').getBoundingClientRect(), c = document.querySelector('#about .modal-card').getBoundingClientRect();
    return { logo: i.getBoundingClientRect().width >= 160 && /close the loop/.test(i.textContent), mark: m.width >= 60, centred: Math.abs((m.left + i.getBoundingClientRect().right) / 2 - (c.left + c.width / 2)) < 12 }; });
  ok(a.logo, 'About shows the Close the Loop mark and wordmark large');
  ok(a.mark && a.centred, 'About shows the explorer mark, and the pair is centred');
  ok(/AGPL/.test(await pg.textContent('#about')), 'About still names the licence');
  await pg.screenshot({ path: process.env.SP + '/shots/about-light.png' });
  await pg.keyboard.press('Escape');
  await pg.evaluate(() => { window.__opened = null; window.open = u => { window.__opened = u; return null; }; });
  await pg.click('#btnModel'); await pg.waitForTimeout(300); await pg.click('#ctx >> text=Close the Loop Studio');
  ok(await pg.evaluate(() => window.__opened) === 'https://studio.closetheloop.gr/', 'off the site, File opens Close the Loop Studio in a new tab');
  await pg.click('#tab-model'); await pg.waitForTimeout(300); await pg.click('#thDark'); await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
  await pg.click('#footAbout'); await pg.waitForTimeout(2200);
  await pg.screenshot({ path: process.env.SP + '/shots/about-dark.png' });
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(400);
  await pg.reload(); await pg.waitForTimeout(1500);
  ok(await theme(pg) === 'dark', 'a theme the visitor chose is kept');
  // storage from before 1.2 saved theme 'auto' without anyone choosing it
  await pg.evaluate(() => { const k = 'vsm-explorer:v1', d = JSON.parse(localStorage.getItem(k)); d.prefs.theme = 'auto'; delete d.prefs.themeChosen; localStorage.setItem(k, JSON.stringify(d)); });
  await pg.reload(); await pg.waitForTimeout(1500);
  ok(await theme(pg) === 'light', 'older storage with the old automatic default opens light');
  await pg.setViewportSize({ width: 390, height: 760 }); await pg.click('#btnModel'); await pg.waitForTimeout(400); await pg.click('#ctx >> text=About and licence'); await pg.waitForTimeout(2200);
  await pg.screenshot({ path: process.env.SP + '/shots/about-phone.png' });
  console.log('errors', errs);
  await b.close();
})();
