# Viable System Explorer

An interactive 2D and 3D explorer for Stafford Beer's Viable System Model (VSM). It draws the canonical diagram, lifts it into a 3D model you can orbit, and lets you label, colour and step through the model's recursive levels to describe a real organization.

Open `index.html` in a recent browser. Everything is in that one file; it loads three.js 0.128 and its OrbitControls from jsDelivr and the Archivo and IBM Plex Mono fonts from Google Fonts. Hosting the repository with GitHub Pages works as is.

## What it does

| Requirement | How the explorer handles it |
| --- | --- |
| Toggle 2D and 3D | The **2D / 3D** switch (or keys `2` and `3`) morphs one scene between the flat canonical diagram and the 3D model, with the camera swinging from face-on to an angled view. |
| 3D navigation | Drag to rotate, right-drag or Shift-drag to pan, scroll or pinch to zoom. **Recentre** (bottom-right of the model, the toolbar, or `C`) brings the model back to dead centre, face-on as in 2D; in 3D the depth stays so you can rotate into it again. Click an element to select it, Shift-click to add more, then **Focus** (or `F`) to show only the selection and what connects directly to it; **Show all** or `Esc` brings everything back. Focusing folds the details pane away; closing the pane keeps the selection and focus, and **Details** in the focus bar reopens it. In 2D, dragging pans. |
| Element interaction | Every system, environment and channel is clickable. Hovering shows a tooltip; clicking opens the inspector with Beer's definition, examples, diagnostic questions, common pathologies and the element's connections, and dims everything not connected to it. |
| Custom labels | Rename anything in the inspector or in the **Model** panel's element list. Each element also takes free-text notes. Presets fill in a canonical set of labels or one of two worked examples. |
| Recursion | Recursion runs only through System One. Each operation holds its own viable system, drawn inside the circle and turned 45 degrees. Scroll toward an operation to zoom into it; past a threshold it becomes the System-in-Focus, and zooming far out rises to the containing level. Double-click or **Open level n** does the same in one step. The breadcrumb trail, the level chip and the **Recursion** tab always show which level is in focus. **Nested** keeps the inner systems visible at every zoom. |
| Colours | Change any element's colour in the inspector or element list, and the four group colours (Environment, Operations, Metasystem, Channels) in the Model panel. Child levels inherit their parent's group colours. |
| Data flows | The **Flows** tab names what travels on each channel and in which direction; the moving dots follow those directions, and a coverage bar shows which channels carry nothing. Load the model company, fill gaps with standard flows, or (in the Claude artifact) describe any organization and let Claude map it. |

Labels, colours, notes, levels and view settings are saved in the browser's local storage.

**Colour scheme** (Model panel) recolours every level at once: *Environment–Operation–Management* (environment green, operations and the System One circle red, local managements and the metasystem blue) or *One colour per system* (Systems One to Five each keep one colour across levels). Individual colours can still be changed afterwards.

Use **Auto / Light / Dark** in the toolbar to override the system theme.

## Fidelity to the canonical diagram

The layout follows Beer's diagram from *Brain of the Firm* and *Diagnosing the System for Organizations*:

- Environments are amoebas on the left: the total environment, the future environment beside System 4, and one operational environment per operation.
- The operational elements of System One are circles in a column, each with its local management up and to the right.
- A large circle (a translucent sphere in 3D) encloses all of System One: every operation and its local management. It is sized from the column, so the rows drop below the metasystem and the System Two units and environment move outward as operations are added.
- **Drawing convention** (Model panel): *Square* draws the metasystem as a square box holding Systems Three, Three-Star, Four, Five and the System Two regulatory centre, with each local management as a square tilted 45 degrees (the next recursion's metasystem seen on the diagonal). *Diamond* draws the metasystem as a rhombus with upright local managements, the form Jon Walker prefers.
- The central command axis is two of Beer's six vertical channels from *Diagnosing the System*: Corporate Intervention (down) and the Resource Bargain with accountability (both ways), from System Three to each local management. The other four are the operational linkages, the environmental intersects, System Two and the audit.
- System Two's anti-oscillation triangles sit beside each local management, linked to the regulatory centre inside the metasystem.
- The Three-Star audit channel reaches the operations directly from the environment side, past local management.
- The algedonic signal branches from every local management and rises parallel to the Resource Bargain, one layer behind Systems Three, Four and Five (in front of the environment in 3D), and breaks through to System Five. The metasystem box is see-through so the signal shows behind it.
- System Five links to System Four and monitors the Three–Four homeostat; it has no direct line to System Three.

Terminology follows Beer's books as collected in the [Pure VSM](https://wiki.cybernetic-futures.org/pure-vsm/) source set: inside-and-now (System Three), outside-and-then (System Four), closure and identity (System Five), anti-oscillation and regulatory centre (System Two), System-in-Focus, local management.

### Options in the Model panel

- **System 2 centre: Inside / Bridge.** Bridge draws the centre on the metasystem boundary and, in 3D, puts all of System 2 on its own plane between operations and metasystem. It is an interpretive option, prompted by a Stanford Medicine study (*Nature Neuroscience*, September 2026) reporting that the forebrain and midbrain arise from one progenitor lineage and the hindbrain from another.
- **S4 to command channel** (extension, on by default): System 4 feeds the command channel, reading the resource bargain as anticipatory.
- **S1 ↔ S4 direct** (extension, on by default): the operations and System 4 exchange front-line signals and trials.

Neither extension is part of the commonly reproduced diagram; switch both off for the canonical form.

The 3D model keeps every x and y position and adds one dimension. The environment sits at the back, the operations in the middle and the metasystem in front, so channels that cross between domains show up as slopes. Each solid is chosen so that seen face-on it is exactly Beer's symbol: spheres for circles, cubes for squares, prisms for triangles, an octahedron for the rhombus and pillowed extrusions for the amoebas. The **Layer depth** slider changes the separation.

## Data flows and the model company

Each channel has two sides, A and B, and every flow runs A to B, B to A, or both ways. The element inspector lists what reaches and leaves an element through its channels.

- **Load model company** fills the model with Larchmere Cycles, a bicycle maker with three divisions. Level 0 flows are mapped by hand; its divisions (and one product line below them) are generated as recursions with standard flows.
- **Fill gaps with standard flows** gives any level a neutral starting point per channel type.
- **Map this level** (Claude artifact only) sends the description you type to Claude, which proposes operations, labels, flows for every channel and sub-operations one level down. Each operation's inspector also offers **Map it with Claude** for its own level, using the flows and names above it as context. Copies of the page opened outside claude.ai hide these buttons.

## Recursion notes

Beer's recursion runs only through System One: every operational element contains a whole viable system, and the metasystemic functions follow it down. Opening a local management therefore opens its operation's level. One level down, the operation's environment becomes the environment and its local management becomes the metasystem; both labels follow the parent automatically.

## Map it with Claude, and hosting elsewhere

The **Map** buttons call Claude through the claude.ai artifact runtime (`window.claude.use('sample')`). Each call runs on the viewer's own Claude account after they consent, and the page never holds an API key. A copy served anywhere else (GitHub Pages, a file on disk) has no `window.claude`, so the buttons hide themselves and the model company and standard flows remain. Making mapping work on a public site needs a small server-side proxy that holds an Anthropic API key and forwards the same prompt. The explorer also lets you open Systems 2 to 5 as viable systems, for cases where a department carrying out one of those functions is worth modelling on its own; the inspector says so when you do.

## Sources

- Stafford Beer, *Brain of the Firm* (1972; 2nd ed. 1981)
- Stafford Beer, *The Heart of Enterprise* (1979)
- Stafford Beer, *Diagnosing the System for Organizations* (1985)
