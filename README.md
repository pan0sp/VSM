# Viable System Explorer

An interactive 2D and 3D explorer for Stafford Beer's Viable System Model (VSM). It draws the canonical diagram, lifts it into a 3D model you can orbit, and lets you label, colour and step through the model's recursive levels to describe a real organization.

Open `index.html` in a recent browser. Everything is in that one file; it loads three.js 0.128 and its OrbitControls from jsDelivr and the Archivo and IBM Plex Mono fonts from Google Fonts. Hosting the repository with GitHub Pages works as is.

## What it does

| Requirement | How the explorer handles it |
| --- | --- |
| Toggle 2D and 3D | The **2D / 3D** switch (or keys `2` and `3`) morphs one scene between the flat canonical diagram and the 3D model, with the camera swinging from face-on to an angled view. |
| 3D navigation | Drag to rotate, right-drag or Shift-drag to pan, scroll or pinch to zoom. Scrolling zooms about the point under the pointer, which stays put. **Recentre** (bottom-right of the model, the toolbar, or `C`) brings the model back to dead centre, face-on as in 2D; in 3D the depth stays so you can rotate into it again. Click an element to select it, Shift-click to add more, then **Focus** (or `F`) to show only the selection and what connects directly to it; **Show all** or `Esc` brings everything back. Focusing folds the details pane away; closing the pane keeps the selection and focus, and **Show details** in the right-click menu reopens it. While focused, a small chip beside the level chip reads *Focused on …* with **Show all**; there is no other floating bar. In 2D, dragging pans. |
| Element interaction | Every system, environment and channel is clickable. Hovering shows a tooltip; clicking opens the inspector with Beer's definition, examples, diagnostic questions, common pathologies and the element's connections, and dims everything not connected to it. |
| Custom labels | Rename anything in the inspector or in the **Settings** tab's element list. Each element also takes free-text notes. Presets fill in a canonical set of labels or one of two worked examples. |
| Recursion | Recursion runs only through System One. Each operation holds its own viable system, drawn inside the circle and turned 45 degrees. Scroll toward an operation to zoom into it; past a threshold it becomes the System-in-Focus, and zooming far out rises to the containing level. Double-click or **Open level n** does the same in one step. The breadcrumb trail, the level chip and the **Recursion** view always show which level is in focus. **Nested** keeps the inner systems visible at every zoom. |
| Colours | Change any element's colour in the inspector or element list, and the four group colours (Environment, Operations, Metasystem, Channels) in the Settings tab. Child levels inherit their parent's group colours. |
| Data flows | The **Flows** tab names what travels on each channel and in which direction; the moving dots follow those directions, and a coverage bar shows which channels carry nothing. Load the model company, fill gaps with standard flows, or (in the Claude artifact) describe any organization and let Claude map it. |

Labels, colours, notes, levels and view settings are saved in the browser's local storage.

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

### The Hemispheres convention

A third drawing convention, after the author's clay and Tinkercad ("VSM 3D-Hemispheres") models:
- **The environment** is a bowl. Each operation's local environment is a cap set in its rim, and the future environment is a faint dome above.
- **System One** lies on a plane inside the bowl. Its operations sit on a ring with their local managements toward the centre, and System Two is a ring of arcs.
- **The metasystem** stands at right angles to that plane: Three at the base, then Four, then Five, with Three-Star beneath Three.
- **Lower levels** sit inside each operation that has one, tilted 45 degrees toward the centre, as in the square convention. The lower level's System One sits in the operation and its column in the local management; **Nested** shows one in every operation.
- **Same model.** It draws the same elements and channels as the classic diagram, so selection, details, diagnosis, colours and the right-click menu all carry over.
- **2D and 3D.** 2D gives the plan from above. Double-click an operation to open its level.

### Options in the Settings tab

- **System 2 centre: Inside / Bridge.** Bridge draws the centre on the metasystem boundary and, in 3D, puts all of System 2 on its own plane between operations and metasystem. It is an interpretive option, prompted by a Stanford Medicine study (*Nature Neuroscience*, September 2026) reporting that the forebrain and midbrain arise from one progenitor lineage and the hindbrain from another.
- **S4 to command channel** (extension, on by default): System 4 feeds the command channel, reading the resource bargain as anticipatory.
- **S1 ↔ S4 direct** (extension, on by default): the operations and System 4 exchange front-line signals and trials.

Neither extension is part of the commonly reproduced diagram; switch both off for the canonical form.

The 3D model keeps every x and y position and adds one dimension. The environment sits at the back, the operations in the middle and the metasystem in front, so channels that cross between domains show up as slopes. Each solid is chosen so that seen face-on it is exactly Beer's symbol: spheres for circles, cubes for squares, prisms for triangles, an octahedron for the rhombus and pillowed extrusions for the amoebas. The **Layer depth** slider changes the separation.

## Three views

The toolbar switches between three views of one model: **VSM** (Beer's diagram in 2D or 3D), **Value network** (key `N`) and **Recursion** (key `R`), a top-down hierarchy of viable systems with the System-in-Focus marked. Click a level in the Recursion view to make it the System-in-Focus; dashed operations have no lower level yet, and each node's **⋯** or right-click menu opens it in the VSM or the value network, creates a lower level, or removes it. **Method** (toolbar) shows the four steps beside any view, with the current view's step open: purpose, value network, recursion, VSM. Levels are numbered from the main System-in-Focus, level 0. **+ Level above** (or the top node's menu) adds a supersystem: the old top becomes its first operation and keeps its number, so the new level is −1. Any level's menu can **Set as level 0**. The left panel holds the settings and data: **Settings** (the level, labels, conventions, colours, diagnosis), **Flows** and **Guide**.

## Value network

The **Value network** view (toolbar, or key `N`) maps System One before the VSM is drawn, following a four-step method:

1. **Purpose.** One sentence, in verbs. The purpose of a system is what it does (POSIWID).
2. **Identify and map the S1s.**
   - Each primary activity is a circle inside the System-in-Focus (the *white box*). These are activities, processes or functions, not (yet) roles or departments, and only those the organization performs itself.
   - The customers, suppliers and other actors each activity deals with sit outside as amoebas.
   - Squiggly lines carry what they exchange, money included.
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

Squiggly lines are value flows; the straight lines of the VSM are its cybernetic channels. Drag to move things. To draw a flow, drag the **+** handle on an element to another one, Shift-drag the element, press `L`, or use **Connect** or the right-click menu; dropping into empty space adds a customer (outputs side) or supplier (inputs side) there, already connected. Press Delete to remove the selection (with Undo). Select any activity, actor or flow to change its colour in the card; an activity's colour is its operation's colour in the VSM too. The **Labels preset** menu has a café example, with its value network and a lower level for the brewing station.

## Data flows and the model company

Each channel has two sides, A and B, and every flow runs A to B, B to A, or both ways. The element inspector lists what reaches and leaves an element through its channels.

- **Load model company** fills the model with Larchmere Cycles, a bicycle maker with three divisions. Level 0 flows are mapped by hand; its divisions (and one product line below them) are generated as recursions with standard flows.
- **Fill gaps with standard flows** gives any level a neutral starting point per channel type.
- **Map this level** (Claude artifact only) sends the description you type to Claude, which proposes operations, labels, flows for every channel and sub-operations one level down. Each operation's inspector also offers **Map it with Claude** for its own level, using the flows and names above it as context. Copies of the page opened outside claude.ai hide these buttons.

## Recursion notes

Beer's recursion runs only through System One: every operational element contains a whole viable system, and the metasystemic functions follow it down. Opening a local management therefore opens its operation's level. One level down, the operation's environment becomes the environment and its local management becomes the metasystem; both labels follow the parent automatically.

## Map it with Claude, and hosting elsewhere

The **Map** buttons call Claude through the claude.ai artifact runtime (`window.claude.use('sample')`). Each call runs on the viewer's own Claude account after they consent, and the page never holds an API key. A copy served anywhere else (GitHub Pages, a file on disk) has no `window.claude`, so the buttons hide themselves and the model company and standard flows remain. Making mapping work on a public site needs a small server-side proxy that holds an Anthropic API key and forwards the same prompt.

## Sources

- Stafford Beer, *Brain of the Firm* (1972; 2nd ed. 1981)
- Stafford Beer, *The Heart of Enterprise* (1979)
- Stafford Beer, *Diagnosing the System for Organizations* (1985)

## Right-click menu, recursion control and diagnosis

- **Right-click** (long-press on touch, or the Menu key) opens a menu. On a touch screen the first tap shows a one-time tip about the long-press. On an element: show details, focus, add to the selection, centre here, rename, open or create its lower level, remove its lower levels, remove the operation, and set its diagnosis. On empty space: centre here, recentre, show all, reframe the focus, switch 2D/3D, nested systems on or off, and up one level.
- **Recursion levels are created on purpose.** Double-click, **Create level** in the details pane, or the menu creates one. Zooming into an operation that has no level yet asks first, unless *Create levels by zooming in* is ticked in the Settings tab.
- **One verb: Remove.** *Remove operation* takes an operation (and everything inside it) out of its level; *Remove lower levels* keeps the operation and clears the levels inside it. Both act at once and show an **Undo** toast. In the Recursion view, every node has a **⋯** menu (or right-click) with the same actions; the operations stepper's **−** removes the last operation.
- **Diagnosis** marks any element or channel with one of Beer's diagnostic states: *Missing*, *Nominal only* (on paper but not "effectively there"), *Lacks requisite variety* (*Insufficient capacity* for channels), *Malfunctioning*, *Collapsed into another system* (for example System Five diving into System Three) and *Pathologically autopoietic* (serving its own continuation). A coloured badge appears beside the element; missing elements are greyed and struck through. Each mark takes a note of the evidence, the Settings tab lists every flag on the level, and the Recursion view counts flags per level.
