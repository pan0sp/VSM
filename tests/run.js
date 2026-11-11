// Runs every check in this folder and exits non-zero if any line reports FAIL or a page error.
const { execFileSync } = require('child_process'), fs = require('fs'), path = require('path');
const only = process.argv.slice(2);
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.js') && !['lib.js', 'run.js'].includes(f) && (!only.length || only.some(o => f.includes(o))));
let failed = 0;
for (const f of files) {
  console.log('== ' + f);
  let out = '';
  try { out = execFileSync(process.execPath, [path.join(__dirname, f)], { encoding: 'utf8', timeout: 180000 }); }
  catch (e) { out = (e.stdout || '') + (e.stderr || ''); failed++; }
  process.stdout.write(out);
  // fonts are aborted on purpose, so a failed font load is not an error
  const errLine = (out.match(/^errors (.*)$/m) || [])[1] || '[]';
  if (/^FAIL /m.test(out) || errLine.replace(/'Failed to load resource: net::ERR_FAILED',?\s*/g, '').replace(/\s/g, '') !== '[]') failed++;
}
console.log(failed ? '\n' + failed + ' check file(s) failed' : '\nall checks passed');
process.exit(failed ? 1 : 0);
