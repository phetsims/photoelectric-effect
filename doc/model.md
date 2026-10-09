# Photoelectric Effect - Model

This document is a high-level description of the model for PhET's Photoelectric Effect simulation.

Photoelectric Effect is designed to provide a visualization of the photoelectric effect experiment. Light of adjustable
wavelength and intensity shines on a metal target plate, electrons may be ejected, and a collector plate across the tube
catches them. A central learning goal is to make visible that faster electrons do not mean more current: current depends
on how many electrons arrive per second, not on how fast they travel.

| Screen     | What students explore                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Intro      | Light shines on a metal target. Vary the intensity and wavelength, switch metals, and choose whether the plates are grounded or connected through an ammeter.             |
| Experiment | Adds a battery across the plates and three graphs that fill in as a control is swept, with snapshots for comparing runs.                                                  |
| Energy     | Fires one photon, or a burst of three, at a grounded target and records each photon's energy budget on a bar graph and an energy diagram. Adds a student-set Custom metal. |

## Units and Equations

### Units and Symbols

| Quantity                             | Unit                                                                              |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| Wavelength (λ)                       | nm                                                                                |
| Frequency (f)                        | × 10<sup>15</sup> Hz                                                              |
| Energy (photon E, binding, KE, φ, D) | eV by default; J in scientific notation when chosen in Preferences                |
| Intensity                            | % of the light source's maximum                                                   |
| Voltage (V)                          | V                                                                                 |
| Current (I)                          | µA, shown to three decimal places; smaller non-zero readings show as "< 0.001 µA" |

φ is the work function, D is the band depth, KE is electron kinetic energy, and e is the elementary charge.

### Equations

With energies in eV, wavelengths in nm, and voltages in V:

```text
E            = 1240 / λ                         photon energy
KE           = E − (binding energy)             binding energy lies between φ and φ + D
KE_max       = E − φ                            electron taken from the Fermi level
λ_threshold  = 1240 / φ                         longest wavelength that ejects any electron
V_stop       = KE_max                           stopping potential, numerically equal to KE_max

fraction of photons that eject an electron           = min( (E − φ) / D, 1 )        (0 when E ≤ φ)
fraction of ejected electrons reaching the collector = ( KE_max − |V| ) / min( KE_max, D ), limited to 0..1
                                                       (1 whenever V ≥ 0)
I            = e × (photon rate) × (fraction ejected) × (fraction reaching the collector)
```

Frequency is computed exactly from wavelength (f = c/λ, with c = 299,792,458 m/s), so the Electron Kinetic Energy vs
Light Frequency graph has a slope of Planck's constant and crosses zero at φ/h. With intensity normalized (the
default), 100% intensity is 5 × 10<sup>14</sup> photons per second at every wavelength, so the largest current the
ammeter can read is about 80 µA.

## Model

### Light Source

Wavelength alone sets photon energy, and intensity sets the photon rate. By default the light is drawn as a continuous
beam and the target responds the instant a setting changes. When individual photons are drawn (see Preferences), each
photon on screen stands in for a great many real photons, because a realistic flux would be far too dense to draw.

### Metal

Each metal is defined by two numbers. The work function φ is the energy needed to free the most loosely bound
electron, at the Fermi level. The band depth D is how far below the Fermi level the filled electron states extend.

Work functions are taken from the 107th edition of the CRC Handbook of Chemistry and Physics, except silver, which
uses the polycrystalline value. Band depths are free-electron Fermi energies (s-band only where applicable), except
platinum, whose band is not free-electron-like and whose depth was chosen for behavior. Metals appear in order of
atomic number.

| Metal     | φ (eV) | D (eV) | Longest wavelength that ejects an electron, 1240/φ (nm) | Wavelength below which every photon ejects an electron, 1240/(φ + D) (nm) |
| --------- | -----: | -----: | ------------------------------------------------------: | ------------------------------------------------------------------------: |
| Sodium    |   2.46 |   3.24 |                                                     504 |                                                                       218 |
| Magnesium |   3.66 |   7.08 |                                                     339 |                                                                       115 |
| Potassium |   2.29 |    2.1 |                                                     541 |                                                                       282 |
| Calcium   |   2.87 |   4.69 |                                                     432 |                                                                       164 |
| Copper    |   4.73 |   7.00 |                                                     262 |                                                                       106 |
| Silver    |   4.26 |   5.50 |                                                     291 |                                                                       127 |
| Platinum  |   5.64 |    6.0 |                                                     220 |                                                                       107 |
| Mystery 1 |   3.63 |   9.47 |                                                     342 |                                                         below 100 (never) |

Below the last column's wavelength, shortening the wavelength further no longer increases the current. Mystery 1 never
reaches it within the slider's 100 nm minimum, so its current keeps rising to the end.

Mystery 1 is always in the list and mimics zinc, which is not among the named metals. Two more metals have values set
by the student or teacher rather than fixed:

| Metal     | Where available                            | φ (eV)             | D (eV)               |
| --------- | ------------------------------------------ | ------------------ | -------------------- |
| Mystery 2 | Every screen, once enabled from Preferences | 1 to 10, default 5 | 0.5 to 15, default 5 |
| Custom    | Energy screen only                         | 1 to 10, default 5 | 0.5 to 15, default 5 |

Mystery metals are unlabeled so they can be used for identification activities. The named metals cannot be edited.

### Electron Emission

Electrons in a real metal are not all bound equally. The sim keeps that spread by treating the filled states as
uniformly distributed between φ and φ + D. Each photon that strikes the target picks an electron at random from the
states it has enough energy to reach, so ejected electrons emerge with kinetic energies from E − φ − D (or zero, if the
photon cannot reach the bottom of the band) up to E − φ. On-screen electron speeds are scaled to be watchable; only
relative speeds are meaningful.

### Current

The sim runs two separate models. One animates the photons and electrons drawn on screen. The other computes the
ammeter reading from the control settings (intensity, wavelength, voltage), not by counting drawn electrons (see
Equations). They are kept apart because their scales are so different. Drawn particles are a small, slowed-down sample,
while the current reflects real photon rates and updates instantly. So the ammeter can show current before the first
drawn electron reaches the collector.

## Screens

### Intro

There is no battery, so every ejected electron reaches the collector. In the Grounded setup the screen shows only the
bare phenomenon: light in, electrons out. In the Connected setup the plates are joined through an ammeter, so ejected
electrons register as a current.

When connected, the Highest Energy Only checkbox changes which electrons are drawn: about one in twenty photon strikes
ejects a visible electron, always from the Fermi level, so every visible electron moves at the maximum speed. The
current reading is unaffected.

### Experiment

Graphs plot current, intensity, electron kinetic energy, and light frequency values. Data appears only as the values 
are accessed in the sim, so a plot is a record of measurements taken rather than a curve given in advance. Kinetic 
energy data is recorded only while the light is on. Changing the metal, its work function or band depth, or the 
absorption preference clears the data, since the relationship being plotted has changed.

Each graph can hold up to three snapshots. A snapshot saves the curve revealed so far together with the metal and the
two settings held fixed for that graph, so runs can be compared.

### Energy

There is no intensity control and no battery; the target is grounded, so nothing holds electrons back and there is no
current reading. The light source has three numbered lenses. In Burst mode one photon leaves each lens, timed so all
three reach the target together. In Single mode one photon leaves the next lens in turn, replacing only that shot, so 
up to three shots can be compared side by side.

The three recorded shots are shown in two ways. The Energy Bars view stacks each photon's energy budget on a common
axis where zero is the escape level: binding energy below zero, photon energy and the resulting kinetic energy above
it. The Energy Diagram view draws the metal's states instead: filled states from the Fermi level (at −φ) down to the
bottom of the band (at −φ − D), empty states up to the escape level, and for each shot the electron's starting energy,
the absorbed photon, and, if the electron escaped, its kinetic energy.

## Preferences

The following preferences deliberately change the model:

| Preference                                  | Default | Effect                                                                                                                                                                                                      |
| ------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normalize intensity                         | on      | The intensity slider sets photons per second directly. When off, it sets energy per second, so longer wavelengths produce more but weaker photons. Changes the model.                                         |
| Photons always absorb at Fermi energy level | off     | Removes the band entirely: every above-threshold photon ejects an electron of maximum kinetic energy, and current cuts off abruptly at the stopping potential. Mimics the simplified textbook treatment. Changes the model. |

## Modeling Assumptions

| Assumption                                                                                       | Why it is useful                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------ |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Filled states are uniform between φ and φ + D                                                    | Gives a spread of electron energies with two numbers per metal.                                                                                                                                                                                |
| Ejection probability ramps linearly above threshold                                              | Real photoemission near threshold follows a power law; the ramp has the same qualitative shape (nothing below threshold, a smooth rise, then a plateau) with nothing extra to interpret.                                                       |
| Electrons leave perpendicular to the plate                                                       | Keeps the stopping potential a sharp cutoff on the Current vs Voltage graph.                                                                                                                                                                   |
| Absorption and ejection are instantaneous                                                        | Particle travel is the only delay students see.                                                                                                                                                                                                |
| The field between the plates is uniform                                                          | Electron motion under voltage is easy to read.                                                                                                                                                                                                 |
| Current is computed, not counted                                                                 | Drawn photons and electrons are a sample of real world amounts. The current is derived from the experiment values set in the sim which are instantaneous readings. This was a necessary distinction due to the time based nature of animations |
| Gravity, contact potential, thermal emission, reverse current, and photon scattering are ignored | None of them bears on the relationships the sim teaches, and therefore are not modeled or taken into account for the visualizations.                                                                                                           |

The sim is not meant to reproduce every real-world imperfection of a photoelectric apparatus.
