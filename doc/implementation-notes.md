## Photoelectric Effect - Implementation Notes

This document describes design decisions and cross-cutting patterns that are not easy to discover by reading individual
source files. See [model.md](model.md) for a description of the physics. Start with
`PhotoelectricEffectModel` and `PhotoelectricEffectScreenView`, which are shared by all screens and documented in place.

## Glossary

- **plate setup**: The apparatus that may consist of a target plate, collector plate, ammeter, vacuum tube, battery.
  Every screen has a plate setup, but each screen's setup may have a different configuration.
- **target plate**: The plate and accompanying material that is illuminated by the light source. The material is a metal
  with a work function and band depth.
- **collector plate**: The plate that collects electrons ejected from the target plate.
- **light source**: The source of photons that illuminate the target plate. The light source behaves differently on the
  Energy screen than on the other two screens.
- **bin**: A range of values for a quantity that is being measured. The Experiment screen graphs are binned, so each bin
  represents a range of values and the graph shows the number of measurements that fell into each bin.
- **snapshot**: A record of the current state of a graph. Snapshots are taken when the user clicks the camera button on
  a graph, and are stored in a list for later viewing.

## General Considerations

### Memory Management

Everything in this sim is created at startup and exists for the lifetime of the sim, so nothing needs to be disposed.
Photons and electrons are plain objects that are garbage collected when culled from the model arrays. Components
deliberately do not set `isDisposable: false` individually.

One exception: the Experiment screen graph axes recreate their bamboo tick-mark, tick-label, and grid-line sets whenever
the displayed range changes (zoom), disposing the previous sets to release their axon listeners.

### Coordinate Frames

For the apparatus in the simulation, the model origin is at the target plate (vertically centered as the location the
light beam is pointing towards), with +x toward the collector and +y up. A model-view transform is used so that each
screen can shift the entire apparatus horizontally with the `targetViewX` option without moving controls anchored to the
layout bounds.

The graphs use a different coordinate frame, with +x to the right and +y up. The model-view transform is implemented
using bamboo's `ChartTransform`, which is used to convert between model and view coordinates.

### Current is analytic, particles are visual

The ammeter current and the particles on screen are computed independently. `currentProperty` is derived analytically
from the model settings. The photons and electrons on screen are a sampled visual representation and do not feed into
the current value. When changing one, check whether the other needs a matching change so they stay consistent.

### Reset policy for metals

Global metals are shared across screens and never reset. Screen-owned metals, like the Energy screen's custom metal,
reset with Reset All. Mystery metals are configured from Preferences or PhET-iO and are deliberately excluded from reset
so a teacher's setup survives student resets.

### Debugging

Run with `?dev` to show a panel of model values next to the photon source control. Run with `?expandGraphs` to start the
Experiment screen graphs expanded, which reduces clicking during testing.

## Sim Hierarchy

All three screens rely on the same model and view framework using subclasses of `PhotoelectricEffectModel` and
`PhotoelectricEffectScreenView`. The screens differ in the configuration of the apparatus, the light source, and the
graphs. There are no significant differences in how the model powers the physics and behavior of each screen.

### Graphs

The graphs in the experiment screen all use `GraphPlotAreaNode` and pass in the associated model data for each graph
type through subclasses of `GraphAssemblyAccordionBox`. Each visual graph is powered by an instance of `GraphData`,
which is a model-only class that computes the data to be displayed on the graph as well as stores any metadata needed
for display.

## PhET-iO

In general PhET-iO instrumentation follows a standard pattern. There are a couple of PhET-iO specific implementation
details that are worth calling out here:

- Photons and electrons are transient and are not individually instrumented. The model serializes them in bulk with
  `ReferenceArrayIO`, which mutates the existing arrays on restore so the view keeps observing the same array instances.
- Experiment graph data serializes only the revealed bin indices; y-values are recomputed from model state on restore.