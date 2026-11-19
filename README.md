# Viable System Explorer

An interactive 2D and 3D explorer for Stafford Beer's Viable System Model (VSM). It draws the canonical diagram, lifts it into a 3D model you can orbit, and lets you label, colour and step through the model's recursive levels to describe a real organization.

Made by [Panagiotis Panagiotakopoulos](https://www.linkedin.com/in/panagio) of [Close the Loop](https://closetheloop.gr). The footer of the app carries the same credit, with the Close the Loop logo from its design system.

Open `index.html` in a recent browser. Everything is in that one file except three.js 0.128 and its OrbitControls, which load from `vendor/three/` beside the page (so the app works offline and on locked-down networks) and from jsDelivr when that folder is missing. The fonts come from Google Fonts; without them the system fonts take over. Hosting the repository with GitHub Pages works as is.

## What it does

| Requirement | How the explorer handles it |
| --- | --- |
| Toggle 2D and 3D | The **2D / 3D** switch (or key `D`) morphs one scene between the flat canonical diagram and the 3D model, with the camera swinging from face-on to an angled view. |
| 3D navigation | Drag to rotate, right-drag or Shift-drag to pan, scroll or pinch to zoom. Scrolling zooms about the point under the pointer, which stays put. **Recentre** (bottom-right of the model, the toolbar, or `C`) brings the model back to dead centre, face-on as in 2D; in 3D the depth stays so you can rotate into it again. Click an element to select it, Shift-click to add more, then **Focus** (or `F`) to show only the selection and what connects directly to it; **Show all** or `Esc` brings everything back. Focusing folds the details pane away; closing the pane keeps the selection and focus, and **Show details** in the right-click menu reopens it. While focused, a small chip beside the level chip reads *Focused on …* with **Show all**; there is no other floating bar. In 2D, dragging pans. |
| Element interaction | Every system, environment and channel is clickable. Hovering shows a tooltip; clicking opens the inspector with Beer's definition, examples, diagnostic questions, common pathologies and the element's connections, and dims everything not connected to it. |
| Custom labels | Rename anything in the inspector or in the **Settings** tab's element list. Each element also takes free-text notes. |
| Recursion | Recursion runs only through System One. Each operation holds its own viable system, drawn inside the circle and turned 45 degrees. Scroll toward an operation to zoom into it; past a threshold it becomes the System-in-Focus, and zooming far out rises to the containing level. Double-click or **Open level n** does the same in one step. The breadcrumb trail, the level chip and the **Recursion** view always show which level is in focus. **Nested** keeps the inner systems visible at every zoom. |
| Colours | Change any element's colour in the inspector or element list, and the four group colours (Environment, Operations, Metasystem, Channels) in the Settings tab. Child levels inherit their parent's group colours. |
| Data flows | The **Flows** tab names what travels on each channel and in which direction; the moving dots follow those directions, and a coverage bar shows which channels carry nothing. Load the model company, fill gaps with standard flows, or (in the Claude artifact) describe any organization and let Claude map it. |
| Diagnosis as evidence | Every element and channel starts **not assessed**. Record **no issue found**, or a finding (missing, nominal only, lacking requisite variety, malfunctioning, collapsed, pathologically autopoietic) with its evidence, source, confidence, consequence and status (tentative, under review, agreed, resolved), dated. Settings shows how much of the level has been assessed. Flows added by **Fill gaps** or by Claude are marked **suggested** until someone renames them or marks them observed. |
| Export | **Model › Export**: the current view as PNG (twice screen size) or SVG (the value network as vectors; the VSM views as the picture with live-text labels), each with a footer naming the view; the findings of every level as a CSV table or a printable HTML report with the view, what held up and what nobody has assessed yet. |

Labels, colours, notes, levels and view settings are saved in the browser's local storage.

## Starting, presenting and shortcuts

- **First visit.** A welcome card says what the app is for (the facilitated diagnosis of real organizations with the VSM, not only learning it). The app opens in 2D with the panels closed and offers three ways in: explore the model, map your organization (opens Settings and the Method), or open one of the examples. Later visits return to where you left off. **Start screen** in the **⋯** menu brings the choices back.
- **Focus keys.** `1` to `5` focus Systems One to Five, `*` System Three-Star, `E` the environment (press again for the future environment), `M` the metasystem, `A` the algedonic channel, and `0` shows everything again. `D` switches 2D and 3D, `H` opens the Hemispheres view.
- **Tour.** `PageDown` and `PageUp` step through the environment, Systems One to Five with Three-Star, and the whole model, so a presenter's clicker drives it.
- **Presentation mode** (`P`, or **Present** in the toolbar) hides the toolbar and panels, goes full screen and dark, enlarges labels for a projector at 1280×720, and shows a caption with the name and a one-line description of whatever is in focus. `Esc` leaves focus, then presentation mode.
- **Shortcut sheet.** `?` lists every key. The hint bar at the bottom of the model fades after first use.
- The toolbar is grouped as views, layers and presenting; the theme, the shortcut sheet and **About** sit in the **⋯** menu. Settings lead with the name, purpose and operations; the drawing conventions are folded under **Advanced**.

## Laws

**Laws** in the toolbar (key `L`) lists the laws Beer built the model on, with their sources (quoted from Wikipedia's article *Viable system model* where it states them, otherwise paraphrased): Ashby's Law of Requisite Variety; the four principles of organization, the three axioms of management, the law of cohesion for multiple recursions and the recursive system theorem from *The Heart of Enterprise* (1979); and Conant and Ashby's good regulator theorem. Choosing a law focuses the elements and channels it governs and gives a diagnostic question. The details pane of any element or channel lists the laws that apply there.

## Licence

- **Code:** [GNU Affero General Public License v3.0 or later](LICENSE). Anyone may use, study, change and share it; anyone who offers a changed version to others, including as a hosted web page, must share the changed source under the same licence.
- **Text, examples and documentation** (the knowledge base, guide, examples and this README): [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Quotations from Stafford Beer's books remain under their own copyright.
- **Name and logo:** the name *Viable System Explorer* and the Close the Loop logo are not covered by either licence.

**About and licence** in the footer (also in the **⋯** menu) shows the version, both licences and how to cite the app:

> Panagiotakopoulos, P. (2026). *Viable System Explorer* (Version 1.0) [Computer software]. Close the Loop.

## Models: new, open, save and examples

The **Model** menu at the top left treats the whole model (every level, with its labels, colours, notes, flows, value networks and diagnosis) as one document:

- **New blank model** starts again with Beer's own labels.
- **Save to file** (`Ctrl S`) downloads the model as `name.vsm.json`. The file also carries the drawing conventions (square or diamond, System Two centre, local regulatory centres, the two extensions and how value flows are drawn), so it opens looking as it was saved. Personal settings such as the theme and the current view stay with the browser.
- **Open from file** (`Ctrl O`), or dropping a `.json` file on the page, replaces the model with the saved one. Files are checked and repaired on the way in (missing parts filled, levels that no longer apply dropped); a file that holds no model is refused and nothing changes.
- **Examples** open complete models: the model company with data flows, a regional hospital, a software company, the café with its value network and a lower level for the brewing station, and the same café cut by service (Dine-in, Takeaway, Catering as System One, with the stations as activities inside them).

Each of these replaces the whole model, so each offers **Undo**. **Reset this level** at the bottom of the Settings tab clears only the level in focus. In the Claude artifact, saving asks the viewer to confirm the download.

**Colour scheme** (Settings tab) recolours every level at once: *Environment–Operation–Management* (environment green, operations and the System One circle red, local managements and the metasystem blue) or *One colour per system* (Systems One to Five each keep one colour across levels). Individual colours can still be changed afterwards.

Use **Auto / Light / Dark** in the toolbar to override the system theme.

## Fidelity to the canonical diagram

The layout follows Beer's diagram from *Brain of the Firm* and *Diagnosing the System for Organizations*:

- Environments are amoebas on the left: the total environment, the future environment level with System 4 (so their link runs straight across), and one operational environment per operation.
- The operational elements of System One are circles in a column, each with its local management up and to the right.
- A large circle (a translucent sphere in 3D) encloses all of System One: every operation and its local management. It is sized from the column, so the rows drop below the metasystem and the System Two units and environment move outward as operations are added.
- **Drawing convention** (Settings tab): *Square* draws the metasystem as a square box holding Systems Three, Three-Star, Four, Five and the System Two regulatory centre, with each local management as a square tilted 45 degrees (the next recursion's metasystem seen on the diagonal). *Diamond* draws the metasystem as a rhombus with upright local managements, the form Jon Walker prefers.
- The central command axis is two of Beer's six vertical channels from *Diagnosing the System*: Corporate Intervention (down) and the Resource Bargain with accountability (both ways), from System Three to each local management. The other four are the operational linkages, the environmental intersects, System Two and the audit.
- System Two's anti-oscillation triangles sit beside each local management, linked to the regulatory centre inside the metasystem.
- The Three-Star audit channel reaches the operations directly from the environment side, past local management.
- The algedonic signal branches from every local management and rises parallel to the Resource Bargain, one layer behind Systems Three, Four and Five (in front of the environment in 3D), and breaks through to System Five. The metasystem box is see-through so the signal shows behind it.
- System Five links to System Four and monitors the Three–Four homeostat; it has no direct line to System Three.

Terminology follows Beer's books as collected in the [Pure VSM](https://wiki.cybernetic-futures.org/pure-vsm/) source set: inside-and-now (System Three), outside-and-then (System Four), closure and identity (System Five), anti-oscillation and regulatory centre (System Two), System-in-Focus, local management.

### The Hemispheres view

A 3D alternative beside 2D and 3D in the toolbar (key `H`), after the author's clay and Tinkercad ("VSM 3D-Hemispheres") models:
- **The environment** is a bowl. Each operation's local environment is a cap set in its rim, and the future environment is a faint dome above.
- **System One** lies on a plane inside the bowl. Its operations sit on a ring with their local managements toward the centre, and System Two is a ring running through every local management, joining them as the operational linkages join the operations. Its regulatory centre is a smaller ring hugging the foot of the central column.
- **The metasystem** stands at right angles to that plane: Three at the base, then Four, then Five. Three-Star has no shape of its own here: it is a function of System Three, so its audit lines leave Three and reach each operation directly, passing beside its local management.
- **Lower levels** sit inside each operation that has one, at right angles to the plane: the lower level's System One stands upright in the operation, facing the centre, and its column lies in the local management, pointing inward. **Nested** shows one in every operation.
- **Same model, same look.** Nothing is added: every shape, material and channel is the classic one, only arranged radially, so selection, details, diagnosis, colours and the right-click menu read the same in both views.
- **Navigation.** Double-click an operation to open its level; Up returns.

### Options in the Settings tab

- **System 2 centre: Inside / Bridge.** Bridge draws the centre on the metasystem boundary and, in 3D, puts all of System 2 on its own plane between operations and metasystem. It is an interpretive option, prompted by a Stanford Medicine study (*Nature Neuroscience*, September 2026) reporting that the forebrain and midbrain arise from one progenitor lineage and the hindbrain from another.
- **S4 to command channel** (extension, off by default since 1.5.3): System 4 feeds the command channel, reading the resource bargain as anticipatory.
- **S1 ↔ S4 direct** (extension, off by default since 1.5.3): the operations and System 4 exchange front-line signals and trials.

Neither extension is part of the commonly reproduced diagram, so a first visit shows the canonical form; switch them on in Settings › Advanced. Browsers that saved a setting before 1.5.3 keep it.

The 3D model keeps every x and y position and adds one dimension. The environment sits at the back, the operations in the middle and the metasystem in front, so channels that cross between domains show up as slopes. Each solid is chosen so that seen face-on it is exactly Beer's symbol: spheres for circles, cubes for squares, prisms for triangles, an octahedron for the rhombus and pillowed extrusions for the amoebas. The **Layer depth** slider changes the separation.

## Three views

The toolbar switches between three views of one model: **VSM** (Beer's diagram in 2D or 3D), **Value network** (key `N`) and **Recursion** (key `R`), a top-down hierarchy of viable systems with the System-in-Focus marked. Click a level in the Recursion view to make it the System-in-Focus; dashed operations have no lower level yet, and each node's **⋯** or right-click menu opens it in the VSM or the value network, creates a lower level, or removes it. **Method** (toolbar) shows the four steps beside any view, with the current view's step open: purpose, value network, recursion, VSM. Levels are numbered from the main System-in-Focus, level 0. **+ Level above** (or the top node's menu) adds a supersystem: the old top becomes its first operation and keeps its number, so the new level is −1. Any level's menu can **Set as level 0**. The left panel holds the settings and data: **Settings** (the level, labels, conventions, colours, diagnosis), **Flows** and **Guide**.

## Value network

The **Value network** view (toolbar, or key `N`) maps System One before the VSM is drawn, following a four-step method:

1. **Purpose.** One sentence, in verbs. The purpose of a system is what it does (POSIWID).
2. **Identify and map the S1s.**
   - Each primary activity is a circle inside the System-in-Focus (the *white box*). These are activities, processes or functions, not (yet) roles or departments, and only those the organization performs itself.
   - How fine to cut System One is the modeller's call, a matter of scale. Optionally, an operation can hold the work it does as smaller **activities inside it** (small boxes inside the operation's circle, which grows to hold them; **+ Activity inside it** in the operation's card). They are the operation's workflow, not System Ones: in the VSM their flows count as the operation's, and they never become a lower level by themselves. **Make it an operation** promotes one when the modeller decides it should be a System One of its own.
   - **System One unfolds by** (Settings, optional) names the organising criterion a level is split by: technology, customers and suppliers, geography, time, or other, with a note on why. The recursion tree shows it. After Espejo and Bowling (1999) as used by Panagiotakopoulos (2005, 2008): the criterion carrying more variety partitions at the higher level. The two café examples differ exactly here: stations are a technological unfolding, services a customer one.
   - An operation's details, in both views, offer four optional prompts for where to draw System One: what outcome it produces and for whom, what it decides without escalating, how it regulates and adapts itself, and why this is a useful boundary at this level. They are prompts, not a check.
   - The customers, suppliers and other actors each activity deals with sit outside as amoebas.
   - Wide pale ribbons with broad arrowheads carry what they exchange, money included.
   - The *black box* shows the system as one box in its business context, with only the flows that cross its boundary.
3. **Recursion.** Double-click an activity to map its own value network one level down.
4. **Transfer to the VSM.** There is nothing to copy across, because both views share one model:
   - Each activity is an operation of System One. Adding, renaming or removing one changes the VSM as well.
   - The actors an operation exchanges flows with name its local environment in the VSM.
   - An actor shared by several operations marks an environmental intersect.
   - Flows between activities travel on the operational linkages. The VSM column only joins neighbours, so a flow between distant operations runs along each linkage in between.
   - Flows with actors travel on the environment–operation channels.
   - These flows appear, read-only, in the Flows tab and in the moving dots.
   - In the VSM, a local environment named this way lists its actors as chips, and its details pane lists them with their flows and an **Edit in the value network** button. Once the network has actors, a local environment no actor reaches is drawn faintly: it may be missing from the map, or the operation may not be a primary activity.

In every view, wide pale ribbons are value flows, after the material-flow arrows of value-stream maps, and thin lines are Beer's cybernetic channels; **Value flows** in Settings switches them to thin lines like every other channel. Environmental intersects are drawn as overlap: in 2D and 3D each local environment overlaps its neighbours, symbolically for now (every pair, whether or not they share actors), and translucent so the overlaps read. Drag to move things. To draw a flow, drag the **+** handle on an element to another one, Shift-drag the element, press `L`, or use **Connect** or the right-click menu; dropping into empty space adds a customer (outputs side) or supplier (inputs side) there, already connected. Press Delete to remove the selection (with Undo). Select any activity, actor or flow to change its colour in the card; an activity's colour is its operation's colour in the VSM too. The **Model** menu's café example has a value network, and a lower level for the brewing station.

## Data flows and the model company

Each channel has two sides, A and B, and every flow runs A to B, B to A, or both ways. The element inspector lists what reaches and leaves an element through its channels.

- **Load model company** (also under **Model › Examples**) replaces the model with Larchmere Cycles, a bicycle maker with three divisions. Level 0 flows are mapped by hand; its divisions (and one product line below them) are generated as recursions with standard flows.
- **Fill gaps with standard flows** gives any level a neutral starting point per channel type, marked as suggested until confirmed.
- **Map this level** (Claude artifact only) sends the description you type to Claude, which proposes operations, labels, flows for every channel and sub-operations one level down. Each operation's inspector also offers **Map it with Claude** for its own level, using the flows and names above it as context. Copies of the page opened outside claude.ai hide these buttons and offer **Map an organization with an AI assistant** instead: describe the organization, copy the same prompt into Claude or any other assistant, paste its JSON answer back and map the level. The page sends nothing.

## Recursion notes

Beer's recursion runs only through System One: every operational element contains a whole viable system, and the metasystemic functions follow it down. Opening a local management therefore opens its operation's level. One level down, the operation's environment becomes the environment and its local management becomes the metasystem; both labels follow the parent automatically.

## Map it with Claude, and hosting elsewhere

The **Map** buttons call Claude through the claude.ai artifact runtime (`window.claude.use('sample')`). Each call runs on the viewer's own Claude account after they consent, and the page never holds an API key. A copy served anywhere else (GitHub Pages, a file on disk) has no `window.claude`, so the buttons hide themselves and the copy-and-paste mapping takes their place: the same prompt, run in whatever assistant the viewer uses, with no key and no server. A proxy holding an API key was considered and set aside (Nov 2026): it puts keys and support load on a public teaching site.

## Sources

- Stafford Beer, *Brain of the Firm* (1972; 2nd ed. 1981)
- Stafford Beer, *The Heart of Enterprise* (1979)
- Stafford Beer, *Diagnosing the System for Organizations* (1985)

## Right-click menu, recursion control and diagnosis

- **Right-click** (long-press on touch, or the Menu key) opens a menu. On a touch screen the first tap shows a one-time tip about the long-press. On an element: show details, focus, add to the selection, centre here, rename, open or create its lower level, remove its lower levels, remove the operation, and set its diagnosis. On empty space: centre here, recentre, show all, reframe the focus, switch 2D/3D, nested systems on or off, and up one level.
- **Recursion levels are created on purpose.** Double-click, **Create level** in the details pane, or the menu creates one. Zooming into an operation that has no level yet asks first, unless *Create levels by zooming in* is ticked in the Settings tab.
- **One verb: Remove.** *Remove operation* takes an operation (and everything inside it) out of its level; *Remove lower levels* keeps the operation and clears the levels inside it. Both act at once and show an **Undo** toast. In the Recursion view, every node has a **⋯** menu (or right-click) with the same actions; the operations stepper's **−** removes the last operation.
- **Diagnosis** marks any element or channel with one of Beer's diagnostic states: *Missing*, *Nominal only* (on paper but not "effectively there"), *Lacks requisite variety* (*Insufficient capacity* for channels), *Malfunctioning*, *Collapsed into another system* (for example System Five diving into System Three) and *Pathologically autopoietic* (serving its own continuation). A coloured badge appears beside the element; missing elements are greyed and struck through. Each mark takes a note of the evidence, the Settings tab lists every flag on the level, and the Recursion view counts flags per level.
