# Photoelectric Effect — PDOM / Description Design

A holistic view of the Parallel DOM (PDOM) and Interactive Description for Photoelectric Effect.
This document reflects the strings currently in
[`photoelectric-effect-strings_en.yaml`](../photoelectric-effect-strings_en.yaml) (the `a11y:` block)
**plus** recommended additions that close the remaining gaps between what is shown visually and what is
communicated non-visually. The implemented-vs-recommended status and the model-property notes have been
**cross-checked against the simulation code** (`js/`), with `file:line` anchors throughout and in the maintainer
notes.

Read it alongside the [Photoelectric Effect HTML5 design doc](./Photoelectric%20Effect%20HTML5.pdf),
[`model-reference.md`](./model-reference.md), PhET's Description Design Guide (Core), and the
[Core Description Overview](../../phet-info/doc/core-description-overview.md).

## Conventions used in this document

- **Static preview notation.** The sim is currently previewed with **static** description content. Wherever a
  dynamic value would normally be injected, the strings use an **ALL-CAPS token** (for example `MATERIAL`,
  `WAVELENGTH`, `INTENSITY`, `VOLTAGE`, `CURRENT`, `EMISSIONSTATE`, `SPECTRUMREGION`). These render literally in
  the preview and need no Fluent wiring or new model code. The production version replaces each token with a
  Fluent `{ $variable }` backed by a model Property (see §9).
- **Terminology (design doc §2.1–2.3).** Work-function symbol is uppercase **Φ**. "Output" is the light-source
  slider quantity (0–100%); "intensity" is the visible label. Photon energy is E = 1240 / λ(nm) eV.
- **Units.** Wavelength nm (UI 100–850, default 400); voltage V (−8 to +8, default 0); energy eV. The model
  `currentProperty` is in **SI amps** (`PhotoelectricEffectModel.ts:195`); the visual readout and the a11y
  `units.microamperes` pattern convert to **microamperes (μA)** via `ampsToMicroamps()`. The design doc §2.3
  says mA; the implementation is internally consistent at μA — see the maintainer note.
- **Default load.** Lamp **off** (output 0%), 400 nm, Sodium, 0 V, Intro = Grounded representation.
- **Status legend.** ✅ = implemented in the YAML today. 💡 = recommended addition (§8). ✅↺ = a string that
  previously over-shared (revealed a phenomenon or exceeded parity) and has now been **revised** for discovery.

## Contents

- §1 — [Learning goals the PDOM must serve](#1-learning-goals-the-pdom-must-serve)
- ★ — [Design philosophy: enable discovery, don't give it away](#design-philosophy-enable-discovery-dont-give-it-away) *(read before §7 and §8)*
- §2 — [PDOM heading structure](#2-pdom-heading-structure)
- §3 — [Screen summaries](#3-screen-summaries)
- §4 — [Home-screen button help text](#4-home-screen-button-help-text)
- §5 — [Play Area — interactive objects](#5-play-area--interactive-objects)
- §6 — [Control Area — interactive objects](#6-control-area--interactive-objects)
- §7 — [Graph and apparatus state descriptions](#7-graph-and-apparatus-state-descriptions)
- §8 — [Recommended additions](#8-recommended-additions)
- §9 — [Model properties the descriptions depend on](#9-model-properties-the-descriptions-depend-on)

---

## 1. Learning goals the PDOM must serve

From design doc §1.1. The descriptions are designed to make these reachable non-visually:

- **G1** Visualize and describe the photoelectric-effect experiment.
- **G2** Correctly predict results: how changing the **intensity**, **wavelength**, **applied voltage**, and
  **target material** affects the **current** and the **energy of ejected electrons**.
- **G3** Describe how these results lead to the **photon model of light** — argue that only a photon model
  explains why, when light shines but no current flows, increasing the **frequency** produces a current while
  increasing the **intensity** or **voltage** does not.
- **Stretch** Quantitative use: measure the stopping potential, extract Planck's constant from KE_max-vs-
  frequency, estimate the work function from the y-intercept; connect the KE distribution to band structure
  (Energy screen).

Every one of G1–G3 is framed as something the learner **predicts and discovers**. That is exactly why the
description must not pre-state the threshold, the intensity-vs-energy distinction, or the stopping voltage — see
the philosophy section next.

---

## Design philosophy: enable discovery, don't give it away

> Read this section before §7 and §8.

PhET's design philosophy is to **enable exploration and student inquiry, not to hand over the result** — and
this applies to the non-visual experience as much as the visual one. The Photoelectric Effect's payoff (G3) is
that the learner *discovers* that light ejects electrons only above a frequency threshold, that the threshold
depends on frequency (not intensity or voltage), and that intensity changes the *number* of electrons but not
their *energy*. A paragraph that states any of these has handed a screen-reader user the conclusion the sim is
built to let them find — a conclusion a sighted peer is not handed either.

Two channels carry most of the graph-discovery load non-visually — but in this sim **both live only inside the
saved-graphs comparison dialog**, not on the live graphs. There are **three such dialogs**, one per graph type
(Intensity vs. Current, Frequency vs. Energy, Voltage vs. Current); each compares the 3–4 snapshots a learner has
saved of that graph under different conditions (design doc §6.4–6.5).

- **Graph sonification (planned)** plays the **shape** of a saved graph — delivered in the dialog as buttons to
  play through each saved snapshot, or sliders to scrub the range and hear it. Prose should **not** narrate the
  shape (the linear rise of current with output, the flat-then-rising KE-versus-frequency line, the I–V curve
  that drops to zero); it points the learner to the dialog.
- **The Reference Line** (design doc §6.5) reads **quantitative values** at a position across the stacked
  snapshots, so a learner can compare the same graph under different conditions. It too lives only in the dialog.

So the **live graphs** are explored by **sweeping the controls** (scrub-to-reveal, design doc §6.3) and reading
the **current operating point**; the **analysis** — comparing values and shapes across conditions — happens in
the dialog. The **ammeter** and the **electron beam** are the two primary *live* observables, and these we *do*
describe — they are parity with what a sighted learner sees, and they are the data the learner collects.

### Provide vs. withhold (Photoelectric Effect)

**Provide:**

- **Orientation** — what each graph plots (its axes), and what controls and tools exist.
- **Current control values** — material, output %, wavelength (+ UV / visible / IR region), battery voltage.
- **Observables** — the ammeter current value; whether electrons are being ejected (on / off) and a qualitative
  count (none / a few / many); whether they reach the collector or are turned back.
- **Status / feedback** — the representation switch reveals the ammeter; graphs clear on a material change; a
  snapshot was saved.

**Withhold** (these *are* the learning goals — let exploration, sonification, and the Reference Line reveal
them):

- The **threshold** itself: that emission needs photon energy above the work function / frequency above a
  threshold (G3).
- That **intensity** changes the number/current but **not** the electron energy (G2/G3).
- That **maximum kinetic energy rises linearly with frequency** (slope = Planck's constant) (G2, stretch).
- That a **retarding voltage stops the current** at the stopping voltage (G2, stretch).
- That **different materials have different thresholds** (G2).

### A quick test for any description

1. Is this the *answer* to a learning goal (a relationship to predict)? → **withhold**; make it explorable.
2. Is it orientation, a current control value, or a direct observable (ammeter, beam)? → **provide**.
3. Is it a graph's *shape* (sonification) or a *point value* (Reference Line)? → **don't narrate it; point to the comparison dialog**, where both live.
4. Is it otherwise-invisible status/feedback? → **provide**.

### Why some information is still necessary (not a giveaway)

- **The ammeter current value** is the experiment's primary measurement. A sighted learner reads it directly;
  sonification (graph shape) and the beam description do not convey the precise number. Provide it as the
  ammeter's object response.
- **Emission state (on/off) + a qualitative electron count** are the central observable — the PE analog of the
  "node count" that Quantum Bound States provides. A sighted learner sees the beam; with no beam sonification,
  text is the only channel. This is the *observation* the learner records, not the *relationship* — providing it
  enables the inquiry rather than resolving it. (One observation at one setting does not reveal G3; the learner
  still has to vary frequency, intensity, and voltage and compare.)
- **Orientation and current values** are parity with the visible controls and axes; without them the
  sonification and Reference Line are not interpretable.

### Where photon energy and work function belong

Photon energy (E = 1240/λ) and the material work function are deliberately **surfaced on the Energy screen**,
where the band diagram and bar chart make them visually central and the screen's whole purpose is to reveal the
energy budget. They are **withheld from the Intro/Experiment screen summaries**, because reporting both numbers
there pre-assembles the threshold comparison that those screens are built to let the learner discover. (This is
why the Intro/Experiment Current Details were trimmed — see §3.)

---

## 2. PDOM heading structure

Headings create the navigable information relationships (WCAG 1.3.1 / 2.4.6). Implemented today is sparse:

```text
H1  {Screen Name}                              (joist screen)
  Screen Summary                               (joist)
    Play Area / Control Area                   (joist boiler-plate)
  ── Play Area ───────────────────────────────
  H?  Light Source                             ✅ photonSourcePanel.accessibleHeading
  H?  Intensity vs. Current Graph              ✅ intensityCurrentGraphNode.accessibleHeading   (Experiment)
  H?  Frequency vs. Energy Graph               ✅ frequencyEnergyGraphNode.accessibleHeading     (Experiment)
  H?  Voltage vs. Current Graph                ✅ voltageCurrentGraphNode.accessibleHeading       (Experiment)
```

💡 **Recommended new headings:** an **Electron Beam** heading over the emission description (§8.1), an **Energy
Diagram** heading on the Energy screen (§8.4), and a **Control Area** grouping heading for the Show-Electrons /
time controls. The Target Material, Representation, Battery Voltage, and Ammeter currently have accessible
**names** but no surrounding heading.

---

## 3. Screen summaries

Each summary has a static **Play Area** overview, static **Control Area** overview, dynamic **Current Details**,
and a static **Interaction Hint**. Per the Core Description overview, Current Details are kept **simple** — current
settings plus the key binary observable (electron emission on/off), with derived quantities left for discovery.

### 3.1 Intro ✅ / ✅↺ (current details trimmed)

- **Play Area** ✅↺ — "A light source shines light onto a metal target. Adjust the output and wavelength of the
  light, and choose the target material, to explore when light ejects electrons from the metal. A representation
  toggle switches between a Grounded target and a full Circuit with an ammeter that reads the current." (Poses
  the inquiry — "explore when" — without stating what triggers emission.)
- **Control Area** ✅↺ — Show/hide ejected electrons, show only highest-energy electrons, time controls, Reset All.
- **Current Details** (tokens): `MATERIAL`, `REPRESENTATION`, `INTENSITY`, `WAVELENGTH`, `SPECTRUMREGION`,
  `EMISSIONSTATE`. *(The work-function value and the derived photon-energy line were removed — together they
  pre-assembled the G3 threshold; see the philosophy section. They live on the Energy screen instead.)*
- **Interaction Hint** — "Turn up the light source output, then adjust the wavelength to find when electrons
  start to fly off the metal." (Matches the survey-validated "ramp up to reveal" scaffolding; default output is
  0%. Poses the inquiry without answering it.)

### 3.2 Experiment ✅ / ✅↺ (current details trimmed)

- **Play Area** ✅↺ — "A light source shines light onto a metal target inside a circuit. Adjust the output and
  wavelength of the light, choose the target material, and set the battery voltage across the plates to explore
  what affects the current and the energy of the ejected electrons. Three graphs plot intensity versus current,
  frequency versus electron energy, and voltage versus current, and you can capture snapshots to compare
  experiments." (Graph **axes** are named — orientation — but no trend is stated.)
- **Control Area** ✅↺ — Same as Intro.
- **Current Details** (tokens): `MATERIAL`, `INTENSITY`, `WAVELENGTH`, `SPECTRUMREGION`, `VOLTAGE`,
  `EMISSIONSTATE`, `CURRENT`. *(Work-function and photon-energy numbers removed, as on Intro.)*
- **Interaction Hint** — "Turn up the light source output and adjust the wavelength, voltage, and material to
  start collecting data in the graphs."

### 3.3 Energy 💡 (not yet in the strings file)

The Energy screen (design doc §7) has **no `a11y` screen summary or component strings** today — a clear gap.
Recommended content is in §8.4. This is the screen where photon energy and the work-function gap are surfaced
(they are visually central in the band diagram and bar chart).

---

## 4. Home-screen button help text 💡

The strings file has **no** screen-button help text (unlike Quantum Bound States, which has
`screenButtonsHelpText`). Recommended additions name the **topic** of each screen without stating the outcome:

| Screen | Accessible name (auto) | Recommended help text |
|---|---|---|
| Intro | Intro | Explore when light ejects electrons from a metal, with no circuit to manage. |
| Experiment | Experiment | Measure current versus voltage, intensity, and frequency, and test the photon model. |
| Energy | Energy | Fire single photons and follow the energy budget of each ejected electron. |

---

## 5. Play Area — interactive objects

PDOM order roughly: Light Source (output, wavelength) → Target Material → Representation (Intro) / Battery
Voltage (Experiment) → apparatus/ammeter → graphs (Experiment).

### 5.1 Light Source ✅ (heading + wavelength name) / ⚠ (output-slider name unwired) / 💡 (help + responses)

- **Heading:** Light Source ✅ (`PhotonSourceControl.ts:38`).
- **Output / Intensity** slider — ⚠ **accessible name is currently unwired.** `PhotonSourceOutputSlider` sets no
  `accessibleName`, and the Fluent key `a11y.photonSourcePanel.intensitySlider.accessibleName` ("Intensity") is
  **defined but never consumed** (dangling). This is the primary light control and is presently nameless in the
  PDOM — wire it (name: "Intensity" to match the visible label, or "Light Source Output" to match what it sets,
  0–100%). 💡 *discovery-safe* help text (orientation only): "Change how much light shines on the target." **Do
  not** state that output changes the number of electrons but not their energy — that is the G2/G3 discovery.
- **Wavelength** number control — accessible name "Wavelength" ✅ (`LabeledWavelengthNumberControl.ts:112`). 💡
  help text (orientation only): "Change the wavelength of the light, from ultraviolet through visible to
  infrared." **Do not** state that wavelength sets photon energy or crosses an ejection threshold (G3).

### 5.2 Target Material ✅ (name) / 💡 (help + response)

- **`materialsComboBox`** — accessible name "Target Material". 💡 help text (orientation): "Choose the metal the
  light shines on." 💡 context response on change (§8.2): name the new material and note graphs cleared — **do
  not** report the work-function value or imply a threshold ranking (G2). (Custom material is Energy-screen only;
  selecting it reveals the Material Properties accordion — §8.4.)

### 5.3 Representation — Intro only ✅ (names) / 💡 (response)

- **`representationRadioButtonGroup`** "Representation"; **Grounded** / **Circuit** radio buttons. 💡 context
  response (UI status): Circuit reveals the ammeter and the Show-Electrons controls; Grounded hides them.

### 5.4 Battery Voltage — Experiment only ✅ (name) / 💡 (help + response)

- **`voltageNumberControl`** — accessible name "Battery Voltage". 💡 help text (orientation only): "Set the
  voltage across the plates, positive or negative." Context response reports the value only (§8.2). **Do not**
  describe accelerating/retarding or the stopping voltage — those are the G2/stretch discovery (read instead
  from the electron beam and the I–V graph).

### 5.5 Ammeter ✅ (name) / 💡 (object response)

- **`ammeterDisplayPanel`** — accessible name "Ammeter" ✅ (`AmmeterDisplayPanel.ts:50`), but it has **no object
  response** today, so the live current never reaches the PDOM. 💡 add an **object response** that formats
  `currentProperty` (SI amps) to μA via `ampsToMicroamps()` — e.g. "1.2 microamperes". The ammeter is the
  primary quantitative readout and a sighted learner reads it directly (§8.1). This is provided — it is the
  measurement, not the relationship.

### 5.6 Graphs — Experiment only ✅ (names) / 💡 (paragraphs + responses)

Three graph assemblies, each with a heading and a button column. Implemented names (made **unique per graph**
per the design guide):

| Button | Intensity vs. Current | Frequency vs. Energy | Voltage vs. Current |
|---|---|---|---|
| Expand/collapse | `Intensity vs. Current` | `Frequency vs. Energy` | `Voltage vs. Current` |
| Camera | `Save Snapshot, Intensity vs. Current` | `Save Snapshot, Frequency vs. Energy` | `Save Snapshot, Voltage vs. Current` |
| Trash | `Clear Snapshots, Intensity vs. Current` | `Clear Snapshots, Frequency vs. Energy` | `Clear Snapshots, Voltage vs. Current` |
| Gallery | `View Snapshots, Intensity vs. Current` | `View Snapshots, Frequency vs. Energy` | `View Snapshots, Voltage vs. Current` |

- Gallery **help text** (shared): "Compare your saved snapshots of this graph side by side." ✅ — this button
  opens the comparison dialog, which is the **only** home of the Reference Line and sonification (§8.3b).
- 💡 each *live* graph needs an **accessibleParagraph** that *orients* and gives the **current operating point**,
  then invites saving a snapshot and opening the comparison dialog (§8.3a); plus camera/trash **context
  responses** ("Snapshot saved.", "Snapshots cleared."). The live-graph paragraph does **not** narrate the trend
  and does **not** reference a Reference Line or sonification — neither exists on the live graph.

---

## 6. Control Area — interactive objects

None of these have strings today; all are 💡 recommendations. Keep help text and context responses
discovery-safe (operational, not outcome-stating).

- **Show Electrons** checkbox (Intro + Experiment, via `PhotonBeamScreenView`) — ⚠ currently has **no accessible
  name/help/response** (`PhotonBeamScreenView.ts:61-70`; relies on a visual `Text` label only). 💡 name "Show
  Electrons"; checked/unchecked context responses ("Electrons shown." / "Electrons hidden."); help text "Show or
  hide the electrons ejected from the metal."
- **Highest Energy Only** checkbox (child of Show Electrons, Intro + Experiment) — ⚠ also unnamed
  (`PhotonBeamScreenView.ts:73-86`). 💡 name "Highest Energy Only"; help text "Show a simplified model where
  every ejected electron carries the maximum kinetic energy." Context responses confirm the toggle only
  ("Showing only the highest energy electrons." / "Showing all ejected electrons.") — **do not** add "the
  current is unchanged" (a model gloss; and per §7.1 the current genuinely does not depend on this toggle).
- *(The Energy screen extends the base view directly, not `PhotonBeamScreenView`, so it has its own controls —
  Velocity Vectors and the diagram checkboxes below — rather than Show Electrons / Highest Energy Only.)*
- **Velocity Vectors** toggle (Energy screen) — 💡 name "Velocity Vectors"; context responses shown/hidden.
- **Photon-absorption-arrow** checkbox (Energy band diagram) — 💡 name + context responses.
- **Play / Pause / Step** — scenery-phet common code (built-in descriptions).
- **Reset All** — common code; always last in the Control Area.

---

## 7. Graph and apparatus state descriptions

Implemented today: graph **headings** and snapshot-button **names** only (§5.6). There is **no** accessible text
yet for the plotted data, the electron beam, the ammeter value, or the Energy-screen diagrams — these are the
largest non-visual gaps and are specified, discovery-safe, in §8. The guiding rule: live-graph prose
**orients and gives the current operating point**, and points to the **saved-graphs comparison dialog** (the
only home of the Reference Line and sonification); **describe the live observables** (beam, ammeter); and
**withhold the trend**.

### 7.1 Model note: current is decoupled from the visible electrons (design the beam and ammeter separately)

A code review surfaced a model fact that shapes these descriptions: `currentProperty` is an analytic
`DerivedProperty` of voltage, photon rate, wavelength, work function, and band depth — it does **not** depend on
the `electrons[]` particle array (`PhotoelectricEffectModel.ts:180-198`). Three consequences:

- **Derive "emission" from the analytic model, not from `electrons.length`.** The on-screen electrons are a
  sampled visual subset (and can be sparse even when current flows), so an emission on/off flag and the
  "no / a few / many" count should come from the analytic quantities, not from counting particles.
- **There are two distinct observables, and the descriptions keep them separate.** Electrons are *ejected from
  the target* when photon energy exceeds the work function (threshold-gated); current *at the ammeter*
  additionally requires those electrons to overcome the retarding voltage and reach the collector
  (voltage-gated). The code mirrors this split — `stepElectrons` culls turned-back electrons by bounds
  (`PhotoelectricEffectModel.ts:421-453`) while the current is computed analytically — so the **Electron Beam
  paragraph** (emission + reach/turned-back, §8.1) and the **Ammeter object response** (current, §5.5/§8.1)
  describe different things and must not be collapsed into one.
- **`showHighestEnergyOnlyProperty` is not a dependency of `currentProperty`**, so toggling it does not change
  the current — which is why the §8.2 context response confirms the toggle only and does not mention current.

---

## 8. Recommended additions

The Core Description overview asks for accessible paragraphs that describe state and graphics — but, per the
**Design philosophy** section, they must orient and grant access **without delivering the relationship the
learner is meant to discover**. All examples use the static ALL-CAPS preview notation and could be added without
model changes for the preview; production binds the tokens to §9 properties.

### 8.1 Electron-beam paragraph + ammeter object response 💡

The core phenomenon — whether and how electrons leave the metal — is currently invisible. These are the key
**observables** (provided), under an "Electron Beam" heading in the play area:

```yaml
electronBeam:
  accessibleHeading: Electron Beam
  accessibleParagraph: >-
    Light is EMISSIONSTATE ejecting electrons from the target. ELECTRONCOUNT electrons travel toward the
    collector. COLLECTORSTATE
    # EMISSIONSTATE: "" / "not" ; ELECTRONCOUNT: "No" / "A few" / "Many" ;
    # COLLECTORSTATE: "They reach the collector." / "They are turned back before the collector."
ammeterDisplayPanel:
  accessibleObjectResponse: CURRENT      # e.g. "1.2 microamperes"
```

These are observations (what is happening now), not relationships. "Turned back before the collector" describes
what a sighted learner sees; it does **not** name the stopping voltage or assert the I–V relationship.

### 8.2 Context responses for changes 💡

Confirm **the control value that changed** and any **UI status**. The observables — emission and current — live
in the electron-beam paragraph (§8.1) and the ammeter object response, so the learner reads the *result* there
rather than being told the causal link in the response stream.

| Interaction | Recommended context response (static preview) | Withheld (why) |
|---|---|---|
| Wavelength change | `Wavelength is now WAVELENGTH nanometers, in the SPECTRUMREGION region.` | photon energy and the threshold verdict (G3) |
| Intensity (output) change | `Light source output is now INTENSITY percent.` | "more electrons / current rises / energy unchanged" (G2/G3) |
| Battery voltage change | `Battery voltage is now VOLTAGE volts.` | accelerating / retarding / stopping voltage (G2) |
| Target material change | `Target material is now MATERIAL. Graphs cleared.` | the work-function value and threshold ranking (G2) |
| Representation (Intro) | `Circuit shown. Ammeter and electron controls available.` / `Grounded shown. No ammeter.` | — (UI status) |
| Show Electrons | `Electrons shown.` / `Electrons hidden.` | — (UI status) |
| Highest Energy Only | `Showing only the highest energy electrons.` / `Showing all ejected electrons.` | "the current is unchanged" (model gloss) |
| Camera / Trash | `Snapshot saved.` / `Snapshots cleared.` | — (status) |
| Fire (Energy screen) | `Photon fired.` (the outcome is read from the bar chart and beam — §8.4) | — (Energy screen is the mechanism screen; the per-fire outcome is an observable there) |

### 8.3 Graphs — live paragraphs and the comparison dialog 💡

**(a) Live graph paragraph.** On the live graph the learner reveals data by sweeping a control (scrub-to-reveal,
design doc §6.3; `?showAllGraphData` overrides to the full curve). The paragraph **orients** (what is plotted)
and gives the **current operating point** — already a Property, `GraphData.currentPointProperty`
(`GraphData.ts:128`), so it is wireable today with no new model work — then invites capturing a snapshot and
opening the comparison dialog. It does **not** narrate the trend, and it does **not** point to a Reference Line
or sonification — neither exists on the live graph (a full-tree search found no reference-line or sonification
code).

```yaml
intensityCurrentGraphNode:
  accessibleParagraph: >-
    This graph plots current against light output. The current operating point is at INTENSITY percent output,
    CURRENT. Save a snapshot, then open the comparison dialog to explore your saved graphs.
frequencyEnergyGraphNode:
  accessibleParagraph: >-
    This graph plots the maximum kinetic energy of ejected electrons against light frequency. The current point
    is at FREQUENCY, KEMAX electron volts. Save a snapshot, then open the comparison dialog to explore your
    saved graphs.
voltageCurrentGraphNode:
  accessibleParagraph: >-
    This graph plots current against battery voltage. The current point is at VOLTAGE volts, CURRENT. Save a
    snapshot, then open the comparison dialog to explore your saved graphs.
```

> The previously-recommended live-graph paragraphs ("current rises in proportion…", "below threshold no
> electrons… above threshold KE rises in a straight line with frequency", "current falls to zero at the stopping
> voltage") are **not recommended** — they state the proportionality, the threshold, the Planck slope, and the
> stopping voltage, which are precisely the G2/G3/stretch discoveries.

**(b) Saved-graphs comparison dialog** (one per graph type — **three dialogs**, `GraphSnapshotsDialog`, created
per accordion). This is the intended home of the Reference Line and sonification — but **note both are
design-ahead: neither exists in the code yet** (a full-tree search found no reference-line or sonification/sound
implementation). The dialog stacks up to **3** saved snapshots of one graph type (the camera disables at 3), each
already carrying its conditions as metadata (`GraphSnapshotMetadata`: material plus two values such as wavelength
and output), so the learner can compare the *same* graph across *different* conditions — the core analysis
activity.

```yaml
graphSnapshotsDialog:
  accessibleHeading: Saved GRAPHTYPE Graphs          # e.g. "Saved Voltage vs. Current Graphs"
  accessibleParagraph: >-
    NUMSNAPSHOTS saved graphs of this type are stacked for comparison, sharing one horizontal axis. Each is
    labeled with the material, wavelength, and output in effect when it was saved.
  referenceLine:
    accessibleName: Reference Line
    accessibleHelpText: Move across the stacked graphs to compare values at the same position.
    accessibleObjectResponse: AXISVALUE, then one reading per saved graph
    # e.g. "2.0 volts; graph 1, 0.8 microamperes; graph 2, 0 microamperes; graph 3, 1.4 microamperes"
  sonification:
    # delivered as play-through buttons (one per saved graph) and/or a scrub slider per saved graph
    playButton:
      accessibleName: Play SNAPSHOTLABEL             # e.g. "Play graph 1"
    scrubSlider:
      accessibleName: SNAPSHOTLABEL                  # the saved graph being scrubbed
      accessibleHelpText: Move across the range to hear the shape of this saved graph.
```

The trend the learner is after — proportionality (intensity), the Planck line and threshold (frequency-energy),
the stopping voltage (voltage-current) — emerges from **comparing the saved graphs** here, via the Reference
Line (values across conditions) and sonification (shape). Prose still does not state it; the dialog's Reference
Line is exactly what the stretch-goal quantitative reads (Planck's constant, stopping potential) rely on.

### 8.4 Energy screen — full screen summary + diagram descriptions 💡

The Energy screen is the **mechanism / explanatory** screen: its band diagram and bar chart exist to make the
energy budget inspectable. Describing what they explicitly show is parity (a sighted learner sees the labeled
gap and the stacked bars), so this screen carries **more** description than Intro/Experiment — including photon
energy and the work-function gap. Even here, describe the **shown values and the per-fire outcome** (observables)
rather than stating a cross-configuration rule.

> ⚠ **Decomposition mismatch to resolve first.** The code's bar chart and legend use **Potential / Photon /
> Kinetic energy** (`EnergyGraphSample.potentialEnergyProperty / photonEnergyProperty / kineticEnergyProperty`;
> legend strings `energy.graph.legend.potentialEnergy / photonEnergy / kineticEnergy`), whereas design doc §7.6.2
> calls for an **initial / photon / final** decomposition. The strings below follow the **implemented** legend;
> if the design-doc relabel wins, update the code and these descriptions together.

```yaml
energyScreen:
  screenSummary:
    playArea: >-
      Fire single photons at a metal target and follow the energy budget of each one. A band-structure diagram
      shows the filled and empty electron states in the metal and the work-function gap between the top of the
      filled states and the energy needed to escape. A bar chart breaks each fired photon into potential
      energy, photon energy, and kinetic energy.
    controlArea: >-
      Choose Single or Burst firing, show or hide velocity vectors and the photon-absorption arrow, choose the
      target material, and for a Custom material set its work function and band depth. Time controls and Reset
      All are also here.
    currentDetails:
      leadingParagraph: >-
        Currently,

          The target material is MATERIAL, with a work function of WORKFUNCTION electron volts.
          Wavelength is WAVELENGTH nanometers, so each photon carries PHOTONENERGY electron volts.
          Firing mode is FIREMODE.
    interactionHint: Press Fire to send a photon at the metal and follow where its energy goes.

energyDiagram:
  accessibleHeading: Energy Diagram
  bandStructure:
    accessibleParagraph: >-
      The vertical energy axis runs from below the metal's filled states up past the escape level at zero.
      Filled states sit below the Fermi level; empty states run from the Fermi level up to the escape level. The
      work-function gap is WORKFUNCTION electron volts.
  barChart:
    accessibleParagraph: >-
      For photon SLOT: potential energy POTENTIALENERGY, photon energy PHOTONENERGY, kinetic energy
      KINETICENERGY electron volts. OUTCOME
      # OUTCOME (the observed result of this fire):
      #   "An electron is ejected." (kinetic energy > 0) /
      #   "No electron ejected." (the on-screen message; photon absorbed but no electron escaped) /
      #   "No interaction occurs." (no bar drawn)
```

Note the bar-chart `OUTCOME` reports the **observed result of the current fire** (the bar is above/below the
zero line, and an electron does or does not appear) — parity with the visuals — rather than stating the general
rule "electrons eject whenever photon energy exceeds the work function," which the learner assembles across
fires and materials.

### 8.5 Altitude / placement and channel guidance

- Keep the **screen-summary Current Details** simple (settings + the binary emission observable), as in §3.
- Put orientation-level dynamic descriptions in `accessibleParagraph`s **next to the objects** (the electron
  beam, each graph), where the Core Description overview places them and where they map to Voicing reading
  blocks later.
- The **two discovery channels live in the saved-graphs comparison dialog** (one per graph type), **not** on the
  live graphs: **sonification** plays a saved graph's *shape*, the **Reference Line** reads *values* across the
  stacked snapshots. The trend (proportionality, the Planck slope and threshold, the stopping voltage) emerges
  from comparing saved graphs there. Live-graph prose orients and gives the current point, and points to the
  dialog; it does not duplicate or pre-empt it.

---

## 9. Model properties the descriptions depend on

| Property | Used by | Provide / withhold |
|---|---|---|
| `currentProperty` (analytic current; SI amps, display μA) | Ammeter object response; graph current-point | **Provide** — the primary measurement; exists (`PhotoelectricEffectModel.ts:180`) |
| Emission state (on/off) + qualitative electron count (none/few/many) | Electron-beam paragraph; Current Details | **Provide** — the central observable (qualitative OK per design doc §2.8) |
| Electrons reach collector vs. turned back (zero-crossing thresholds) | Electron-beam paragraph (retarding case) | **Provide** as observation; **open question** how to threshold it (design doc §8.9) |
| Wavelength region (UV / visible / IR) | Current Details / wavelength response `SPECTRUMREGION` | **Provide** — orientation, parity with UV/IR labels |
| Photon energy E = 1240/λ (eV) | Energy-screen band diagram & bar chart only | **Provide on Energy screen**; **withhold** from Intro/Experiment summaries |
| Active material work function Φ (eV) | Energy-screen band diagram; Custom-material control | **Provide on Energy screen**; **withhold** the number from Intro/Experiment |
| Above-threshold boolean (E_photon > Φ) | Drives the emission state internally | **Withhold** as prose — surfacing it states G3; the learner sees emission instead |
| Current operating point — `GraphData.currentPointProperty` (per live graph) | Live graph paragraph | **Provide** — exists (`GraphData.ts:128`) |
| Maximum kinetic energy KE_max; stopping voltage | Reference-Line readouts **in the comparison dialog** | **Provide as point values in the dialog**; **withhold** as a stated trend |
| Reference-line position + per-snapshot value at it | Comparison-dialog Reference Line (3 dialogs) | **Provide** — dialog only |
| Per-snapshot sonification (shape) + condition labels | Comparison-dialog play buttons / scrub sliders | **Provide** — dialog only |
| Per-slot potential / photon / kinetic energy (`EnergyGraphSample`), band depth, Fermi level | Energy-screen diagrams | **Provide** — the Energy screen's explicit content; exists (`EnergyGraphSample.ts:62-81`) |

**Readiness (from the code review).** Most rows are already exposed and wireable today: `wavelengthProperty`,
`normalizedOutputPercentProperty`, `battery.voltageProperty`, `target.materialProperty` / `workFunctionProperty`,
`currentProperty`, `GraphData.currentPointProperty`, and the Energy-screen `EnergyGraphSample` energies plus
`emitSinglePhotonProperty`. The derived items (spectrum region, photon energy, above-threshold, KE_max, emission
on/off + qualitative count, reach-vs-turned-back, stopping voltage) need small read-only `DerivedProperty`s and
**no new physics** — `getCurrentForSystem` already computes `photonEnergyBeyondWorkFunction`,
`electronRateAsFractionOfPhotonRate`, and `fractionMoreEnergeticThanRetardingVoltage`
(`PhotoelectricEffectModel.ts:507-531`); surfacing those backs the electron-beam paragraph and the
threshold/retarding context responses directly.

The PE analog of Quantum Bound States' "node count" is the **emission state + qualitative electron count**: a
discrete observable a sighted learner gets at a glance, poorly served by graph sonification, and the datum the
learner records. Providing it enables the photon-model inquiry (G3) without resolving it; the **above-threshold
boolean is intentionally not surfaced as prose**.

---

**Maintainer notes** — items 1–9 are code-review findings cross-checked against the implementation; 10–11 are
editing history / production.

1. **Output / intensity slider name is unwired.** `PhotonSourceOutputSlider` sets no `accessibleName`, and the
   Fluent key `a11y.photonSourcePanel.intensitySlider.accessibleName` is defined but never consumed — the
   primary light control is nameless in the PDOM. Wire it (§5.1).
2. **Ammeter has no object response** — name only (`AmmeterDisplayPanel.ts:50`); add a response that formats
   `currentProperty` (amps) to μA (§5.5, §8.1).
3. **Show Electrons / Highest Energy Only are unnamed** (`PhotonBeamScreenView.ts:61-86`); they exist on Intro +
   Experiment only (the Energy screen uses Velocity Vectors instead) (§6).
4. **Energy screen has zero a11y**, its `pdomOrder` is a TODO (`EnergyScreenView.ts:61`), and the Material
   Properties accordion title is hardcoded / not internationalized (`MaterialPropertiesAccordionBox.ts:51`)
   (§3.3, §8.4).
5. **Energy bar-chart decomposition mismatch.** Code uses Potential / Photon / Kinetic energy; design doc §7.6.2
   calls for initial / photon / final. §8.4 follows the code; resolve before implementing.
6. **Reference Line and sonification do not exist in the code yet** (design-ahead); the live-graph operating
   point, however, is already `GraphData.currentPointProperty` (§8.3). Max snapshots per dialog is **3**.
7. **Current units:** model `currentProperty` is SI amps (`PhotoelectricEffectModel.ts:195`); the readout and
   a11y pattern convert to μA via `ampsToMicroamps()`. Design doc §2.3 says mA — implementation is internally
   consistent at μA.
8. **Current is decoupled from the visible electrons** — derive emission/count analytically, and keep the beam
   and ammeter descriptions separate (§7.1).
9. **Misplaced preference strings:** a11y-nested `workFunction` and `photonMode` (with a `# TODO: @design`
   comment) are not consumed as a11y; relocate to top-level `preferences:` and remove from the `a11y:` block.
10. **This pass (static preview):** filled the Intro/Experiment Play/Control overviews and the three gallery
    buttons; trimmed the Current Details (removed the work-function and photon-energy numbers that pre-assembled
    the threshold); rewrote the §8 recommendations discovery-safe; scoped the Reference Line and sonification to
    the comparison dialog. YAML re-generated (`modulify`) and type-checks.
11. **To production:** replace each ALL-CAPS token with a Fluent `{ $variable }` bound to the §9 property, then
    run `bin/grunt modulify --targets=strings --repo=photoelectric-effect` and type-check.
