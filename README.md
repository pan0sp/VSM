# Viable System Explorer

An interactive 2D and 3D explorer for Stafford Beer's Viable System Model (VSM). It draws the canonical diagram, lifts it into a 3D model you can orbit, and lets you label, colour and step through the model's recursive levels to describe a real organization.

Open `index.html` in a recent browser. Everything is in that one file; it loads three.js 0.128 and its OrbitControls from jsDelivr and the Archivo and IBM Plex Mono fonts from Google Fonts. Hosting the repository with GitHub Pages works as is.

## What it does

| Requirement | How the explorer handles it |
| --- | --- |
| Toggle 2D and 3D | The **2D / 3D** switch (or keys `2` and `3`) morphs one scene between the flat canonical diagram and the 3D model, with the camera swinging from face-on to an angled view. |
| 3D navigation | Drag to rotate, right-drag or Shift-drag to pan, scroll or pinch to zoom. **Fit** (`F`) reframes the model. In 2D, dragging pans. |
| Element interaction | Every system, environment and channel is clickable. Hovering shows a tooltip; clicking opens the inspector with Beer's definition, examples, diagnostic questions, common pathologies and the element's connections, and dims everything not connected to it. |
| Custom labels | Rename anything in the inspector or in the **Model** panel's element list. Each element also takes free-text notes. Presets fill in a canonical set of labels or one of two worked examples. |
| Recursion | Every system can be opened as a viable system of its own (double-click it, or use **Open level n** in the inspector, which also previews the subsystem as a small diagram). The breadcrumb trail, the level chip and the **Recursion map** tab always show which level is in focus. **Nested** draws each operation's own VSM inside it. |
| Colours | Change any element's colour in the inspector or element list, and the four group colours (Environment, Operations, Metasystem, Channels) in the Model panel. Child levels inherit their parent's group colours. |
| Data flows | The **Flows** tab names what travels on each channel and in which direction; the moving dots follow those directions, and a coverage bar shows which channels carry nothing. Load the model company, fill gaps with standard flows, or (in the Claude artifact) describe any organization and let Claude map it. |

Labels, colours, notes, levels and view settings are saved in the browser's local storage.

## Fidelity to the canonical diagram

The layout follows Beer's diagram from *Brain of the Firm* and *Diagnosing the System for Organizations*:

- Environments are amoebas on the left: the total environment, the future environment beside System 4, and one operational environment per operation.
- System 1 operations are circles in a column, each with its management square up and to the right.
- The vertical command channel runs from System 3 down through the management squares; System 2 coordination triangles sit to the right with their own channel up to the coordination centre.
- Systems 3, 4 and 5 are squares inside the metasystem rhombus, with the 3–4 homeostat loop between 3 and 4. System 3* is the inverted triangle at the lower left, its audit channel reaching past local management into the operations.
- The algedonic channel runs from the operations around the right side to System 5.
- The System 2 coordination centre sits inside the metasystem.
- System 5 links to System 4 and monitors the 3–4 homeostat; it has no direct line to System 3.
- System 3 reaches each operation only through its management square (the operation's own metasystem) on the command channel. The 3* audit is the sporadic exception that reaches into the operations.

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

Beer's recursion runs through System 1: every operation contains a whole viable system, and its management square becomes that system's metasystem. Opening a management square therefore opens its operation's level. One level down, the operation's environment becomes the total environment and its management square becomes the metasystem, and both labels follow the parent automatically. The explorer also lets you open Systems 2 to 5 as viable systems, for cases where a department carrying out one of those functions is worth modelling on its own; the inspector says so when you do.

## Sources

- Stafford Beer, *Brain of the Firm* (1972; 2nd ed. 1981)
- Stafford Beer, *The Heart of Enterprise* (1979)
- Stafford Beer, *Diagnosing the System for Organizations* (1985)
