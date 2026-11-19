# Viable System Explorer: notes for Claude

An interactive explorer for Stafford Beer's Viable System Model (VSM). The user, Panos (Close the Loop), teaches the VSM (OCAD University) and uses it in consulting. The README describes what the app does; this file holds what a new session needs to keep working the same way.

## Working with Panos

- Write in Canadian English. Never use the word "delve", and no em dashes in prose (UI text, docs, commit messages, replies).
- After finishing a task, add a short **Forks** section (at most three one-line items) only when one of these happened: you chose between approaches that give meaningfully different results (name the one discarded); you assumed something not stated; something contradicted the request's framing; you noticed something worth doing that was out of scope. Otherwise write nothing.
- Use Beer's own terms. Do not invent labels such as "internal environment" for value-network actors; Panos asked to avoid that unless it has a source.
- Panos often gives feedback as comments on the published artifact. Reply in the comment thread, keep the session message to a line or two, and do not resolve threads unless asked.
- Changes are committed and pushed straight to `main`, the default branch. The repository is public (since Nov 19 2026), so delete working branches once merged. Ask before force-pushing or rewriting history.

## Reference material (outside this repo)

- Panos's VSM skills: GitHub `pan0sp/skills`, the `vsm-*` skills (diagnosis method and nomenclature). The app was reviewed against them; known open conflicts are listed below.
- OCAD VSM lecture notes and slides (Google Drive): the systems mapping / value network method with the café example, and Module 3's "VSM in 3D".
- Tinkercad "VSM 3D-Hemispheres" and the Drive folder "VSM 3D Clay Model": the source concept for the Hemispheres view.

## Shape of the code

- The app is one file, `index.html` (about 6,100 lines): CSS, markup, then one classic `<script>`. three.js r128 and OrbitControls load from cdn.jsdelivr; nothing else is external. No build step.
- The script is split by banner comments (`/* ===== … */`). In order: Helpers; Knowledge base (`KB`, what each element and channel is, after Beer); Canonical layout (`buildLayout`, 2D world units reused by 3D); Model data (`db`, levels, `load`/`save`/`normaliseDb`); Data flows (standard flows, the model company `EXAMPLE`, `PRESETS`); Theme; 3D scene (`buildScene`, `updateGeometry`, `refreshVisuals`); Labels overlay; Camera and view transitions (`setView`, `camTween`, `fitState`); Hemispheres (`buildHemi`, `hemiRefresh`, `HG` geometry constants); Picking; Recursion (`dive`, `goToLevel`, zoom-through); Panels; Wiring (event listeners, the Model menu, Claude mapping); Value network (SVG); Export (`offerFile`, `viewPng`/`viewSvg` read the WebGL picture plus the label overlay word by word, `netSvgText` inlines the network's styles, `findingsRows` feeds the CSV and the HTML report); Start, presenting and shortcuts (welcome, About, focus keys, tour, presentation mode); Boot.
- State: `db = { seq, rootId, currentId, scheme, levels }`. Each level has `opCount`, `labels`, `colors`, `groupColors`, `notes`, `flows`, `diag`, `children` (keyed by operation id `o0`…), optional `net` (value network) and `purpose`. Element ids: `o0…` operations, `m0…` local managements, `a0…` local System Two units, `e0…` local environments, `s2 s3 s3s s4 s5`, `env`, `fut`, `meta`, `sys1`. Channel ids are in `buildLayout`.
- `prefs` (view, diagram, theme, conventions) and `db` are saved together in localStorage under `vsm-explorer:v1`. Saved files (`*.vsm.json`, format `viable-system-explorer` v1) carry `model` plus `conventions` (style, s2mode, localS2, extS4cmd, extS14, valueFlows). Old storage must keep loading: add migrations in `load`/`normaliseDb`, never break the format.
- Views: `prefs.diagram` is `vsm | net | rec`; within VSM, `prefs.view` is `2d | 3d | hemi`. Hemispheres has its own scene (`hscene`/`hroot`) built from clones of the classic elements.

## Design decisions already agreed (do not undo without asking)

- **Hemispheres re-interprets, it does not add.** Shapes are clones of the classic elements with their materials; channels keep the classic widths. Panos rejected an earlier version with "pipes", a rim, a wire dome and extra rods. Nested models sit perpendicular. The future-environment dome stays (faint).
- **System Two in Hemispheres** is a ring through every local management (always drawn, local regulatory centres on or off); its regulatory centre is a smaller ring hugging the central column.
- **System Three-Star in Hemispheres** has no triangle: its audit lines run from System Three straight to each operation, arching past the local managements. 2D/3D keep Beer's triangle.
- **Value flows** (operational linkages `oo`, operation–environment `eo`) are drawn as wide pale ribbons with broad arrowheads in every view, after value-stream maps; cybernetic channels stay thin lines. Settings › Value flows switches to lines. Beer's squiggles were removed on purpose. Environmental intersects (`ee`) are not drawn until overlap has a form of its own.
- Linkages between operations are representative (each operation to its neighbour), not a copy of every value-network flow. Hemispheres closes the ring.
- Nested models show only when Nested is on.
- Recursion runs only through System One. Level numbers are relative to the level set as L0 (`db.refId`).
- Examples are complete models under the Model menu; each replacement of the model offers Undo.
- Licence (decided Nov 2026): code AGPL-3.0-or-later (`LICENSE`), own text and examples CC BY-SA 4.0, name and logo reserved. No sign-in gate. About dialog holds version (`APP_VERSION`), licences and citation; bump the version there when releasing.
- **Brand (Nov 19 2026):** the app wears Close the Loop's brand (skill `close-the-loop-design` in `pan0sp/skills`): navy `#141b38`, gold `#eeba2b` (gold text on light is `#a07a0e`), off-white; Raleway display, Open Sans body, Comfortaa only for the wordmark (Panos agreed: too wide for small UI text); IBM Plex Mono stays for codes. Light is the default theme when none was chosen (`prefs.themeChosen`). The app mark is E-O-M (Environment, Operations, Management): nested in the toolbar, opening out with double arrows in the About pop-up beside the vector Close the Loop C mark. No gradient backgrounds (brand rule).
- First visit opens in 2D with panels closed and the welcome card (three entry choices). Keys: `1`–`5`, `*`, `E` (twice: future), `M`, `A`, `0` focus systems; `D` toggles 2D/3D (no longer `2`/`3`); `PageUp`/`PageDown` tour; `P` presentation mode (dark, full screen, caption, larger labels; Esc leaves at once); `?` shortcut sheet. Toolbar groups: views, layers, present plus a ⋯ menu (theme, shortcuts, start screen, about).
- Laws are paraphrased, each with its source; do not add a law without a source. Welcome card states the positioning: a tool for the facilitated diagnosis of real organizations, not only to learn the VSM (Astra, Nov 19: keep "facilitated" until the evidence workflow is strong).
- Framing (`fitState`, `hemiFit`) keeps the model clear of the Method card, level chip, hint bar and caption via `stageCover()`.

## Checks

```
npm install          # three@0.128.0, served to the page in place of the CDN
npm test             # runs every check in tests/, or: node tests/run.js hemi
```

The checks drive the real page with Playwright (not listed in package.json, because the cloud containers ship their own Chromium and Playwright and a second copy breaks them). On your own machine run `npm i --no-save playwright && npx playwright install chromium` once. Each check prints `ok`/`FAIL` lines and the page errors; a failed font load is expected (fonts are blocked). Screenshots land in `tests/.out/shots/`. `node --check` cannot parse the HTML; for a quick syntax check extract the script: `node -e "const s=require('fs').readFileSync('index.html','utf8');new Function(s.match(/<script>([\s\S]*)<\/script>/)[1])"`.

Look at screenshots after visual changes: most regressions here are visual.

## Publishing

- GitHub: `pan0sp/VSM` (public), branch `main`. About links to it.
- Cloudflare Workers Builds deploys `main` as the Worker `vsm`, as static assets (`wrangler.jsonc`, with `.assetsignore` keeping tests, docs and `node_modules` out). Without `wrangler.jsonc` the build fails and every branch shows a red check.
- Claude artifact: https://claude.ai/artifact/U5ejpELi2QeGq4FzHMDKLx. It is updated by publishing a copy of `index.html` from a Claude session that has the Artifact tool (Claude Code on the web does). Declare the capabilities `{ "sample": {}, "downloads": true }`: `sample` powers "Map this level with Claude", `downloads` lets Save to file work inside claude.ai. Outside claude.ai the Claude buttons hide themselves and saving uses a normal browser download.

## Open work

Agreed next steps, in order (Panos chose on Nov 19 2026 to put the response to Astra's external review ahead of Variety; context in the project file `research/explorer-strategy-notes.md`):
1. Astra's review, step 1, quick fixes (done Nov 19, v1.2.1): future environment coded `FE` (local environments keep `EA`…); closing the details pane clears the selection outside focus, and model or level changes reset it; Esc leaves presentation mode in one press; a note explains the six-operation limit; the Claude mapping block shows only where Claude can map; welcome says "facilitated diagnosis"; the model company (Larchmere) has a value network, and its value-flow channels take their flows from it.
2. Astra's step 2 (done Nov 19, v1.2.2): Model menu › Export: the view as PNG (twice the screen size) or SVG (the network as true vectors; the VSM views as the rendered picture with every label as live text), each with a footer naming the view and crediting the explorer; findings of every level as CSV or a printable HTML report with the view. The recursion view has no image export.
3. Astra's step 3: diagnosis as evidence: each mark gets evidence, confidence, consequence and status; "not assessed" distinct from "assessed, fine"; flows marked suggested or observed. Older files must still load.
4. Astra's step 4: System One boundary check (four questions: what outcome, for whom; what it decides without escalating; how it regulates and adapts itself; why this is the useful recursion boundary). Panos decided: re-cut the café's System One into dine-in, takeaway and catering, keep the stations as activities in the value network; the Network view works at every recursion level; a visual language tells System Ones from activities (mock up for his approval first).
5. Then the Variety layer, then Measures (the triple index in System One; check *Brain of the Firm* pp. 163-166).
6. Hemispheres step 2: continuous zoom-through recursion. Then step 3, diagnosis silhouettes and the homeostat balance; step 4, live channels and algedonic latency; step 5, operations-room cameras; step 6, printable export.
7. App foundations, as proposed (Panos has not yet picked one): a library of several models in the browser; splitting `index.html` into modules with a build that still emits one file; running `npm test` in GitHub Actions. Other review ideas not yet built: a privacy-light visit counter. Not adopted from Astra: full mobile editing (read-only review at most); a worked diagnostic case needs a real anonymized case from Panos, never an invented one.

Done from the November 2026 review: licence, fixes, presentation mode and shortcuts, the Laws layer (`LAWS` in the "Laws" section before Boot, key `L`).

Open questions and known issues:
- Overlapping local environments: operations are spaced evenly round the ring, which will not fit overlaps. One idea is to order operations by shared actors. Undecided.
- Against the skills and lecture notes: lecture slide 10 labels conflict with the skills; recursion numbering differs; the two extension channels are on by default; Beer's archetypes are missing. The `vsm-display` skill's spec still codes the future environment `EF`.
- The "dive to L1" timing in some checks can be flaky.
