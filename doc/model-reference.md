# Photoelectric Effect Simulation: Physics Reference for Developers

This document specifies the physics needed to implement the Photoelectric Effect simulation. Every variable, equation, constant, default value, and algorithm needed to code the simulation is defined here.

The simulation has three screens:

- **Screen 1 (Intro):** simplified view, no voltage control
- **Screen 2 (Experiment):** full setup with retarding potential and graphs
- **Screen 3 (Energy):** single-photon view with energy bar diagram and a custom material

Screens 1 and 2 share the same underlying physics model. Screen 3 uses the same physics but exposes one photon-electron interaction at a time.

---

## 1. The Phenomenon in One Paragraph

When light hits a metal surface, electrons can be ejected. Three experimental facts cannot be explained by treating light as a wave:

1. Below a certain "threshold" frequency of light, **no electrons are ejected, no matter how bright the light.**
2. Above the threshold, the **maximum kinetic energy** of ejected electrons depends only on the **frequency** of light, not the intensity.
3. The **number** of ejected electrons (and thus the current) depends on the **intensity** of light, not its frequency (with caveats discussed in Section 11.4).

Einstein explained this by proposing that light comes in discrete packets (photons), each with energy `E = hf`. The simulation should reproduce these behaviors as emergent consequences of the model, not by hard-coding them.

---

## 2. Notation and Symbols

| Symbol | Meaning | Units |
|--------|---------|-------|
| `f` | Frequency of light | Hz (1/s) |
| `λ` | Wavelength of light | nm in UI, m in calculations |
| `c` | Speed of light | m/s |
| `h` | Planck's constant | J·s or eV·s |
| `E_γ` | Energy of one photon | eV (preferred) or J |
| `φ` | Work function of metal | eV |
| `f_0` | Threshold frequency for a given metal | Hz |
| `λ_0` | Threshold wavelength for a given metal | nm |
| `KE` | Kinetic energy of an ejected electron | eV or J |
| `KE_max` | Maximum possible KE of an ejected electron for given `E_γ` and `φ` | eV |
| `KE_min` | Minimum KE for an ejected electron given `E_γ`, `φ`, `W_band` | eV |
| `E_b` | Binding energy of an electron in the metal (range: `[φ, φ + W_band]`) | eV |
| `V` | Voltage applied across the plates (battery) | V |
| `V_stop` | Stopping potential (magnitude of the retarding voltage at which current just reaches zero) | V |
| `e` | Elementary charge (magnitude) | C |
| `m_e` | Electron mass | kg |
| `v` | Electron speed | m/s |
| `I` | Current in the circuit | A (display in mA or μA) |
| `N_γ` | Photon emission rate | photons/s |
| `W_band` | Effective occupied-band depth (per metal) | eV |
| `η` | Quantum efficiency factor (overall) | dimensionless, 0 to 1 |

**Sign convention for voltage:** `V` is the voltage of the **collector plate (anode) relative to the emitter plate (cathode where light hits)**. Positive `V` accelerates ejected electrons toward the collector. Negative `V` (retarding) decelerates them. The stopping potential occurs at `V = -V_stop` (i.e., `V` is negative).

---

## 3. Physical Constants

Use these exact values throughout the simulation:

```
h    = 6.62607015e-34 J·s          (Planck's constant)
h_eV = 4.135667696e-15 eV·s        (Planck's constant in eV·s)
c    = 2.99792458e8   m/s          (speed of light)
e    = 1.602176634e-19 C           (elementary charge)
m_e  = 9.1093837015e-31 kg         (electron mass)

hc   = 1239.841984 eV·nm           (very useful product)
```

**The single most useful conversion in this whole simulation:**

```
E_photon (in eV) = 1240 / λ (in nm)         [approximate, sufficient for UI]
E_photon (in eV) = 1239.841984 / λ (in nm)  [precise]
```

Examples:

- 100 nm UV → 12.40 eV
- 200 nm UV → 6.20 eV
- 400 nm violet → 3.10 eV
- 550 nm green → 2.25 eV
- 700 nm red → 1.77 eV
- 800 nm near-IR → 1.55 eV

---

## 4. Core Equations

### 4.1 Photon Energy

```
E_γ = h · f = h · c / λ
```

### 4.2 Einstein's Photoelectric Equation

For an electron ejected from a state with binding energy `E_b ≥ φ`:

```
KE = E_γ - E_b
```

The maximum KE occurs when `E_b = φ` (the most weakly bound electron, at the Fermi level):

```
KE_max = E_γ - φ           (only valid when E_γ ≥ φ; otherwise no ejection)
```

### 4.3 Threshold Conditions

If the photon energy is below the work function, no electron is ejected, regardless of intensity:

```
Ejection requires:  E_γ ≥ φ

Threshold frequency:    f_0  = φ / h
Threshold wavelength:   λ_0  = h·c / φ = 1240 / φ(eV)  nm
```

### 4.4 Stopping Potential

The stopping potential is the magnitude of retarding voltage that just prevents the highest-KE electrons from reaching the collector:

```
e · V_stop = KE_max
V_stop = (E_γ - φ) / e   →   numerically:   V_stop (in volts) = KE_max (in eV)
```

(Because 1 eV is exactly the energy gained by an electron crossing a 1 V potential difference, the numbers are equal when KE is in eV and V is in volts.)

### 4.5 Electron Speed

For all photon energies in this simulation (up to ~12.4 eV), electrons are non-relativistic. Use the classical formula:

```
v = sqrt( 2 · KE / m_e )
```

Sample values:

- KE = 0.1 eV → v ≈ 1.88 × 10⁵ m/s
- KE = 1.0 eV → v ≈ 5.93 × 10⁵ m/s
- KE = 10  eV → v ≈ 1.88 × 10⁶ m/s

(Convert KE to joules first: `KE_J = KE_eV * 1.602e-19`.)

For animation purposes, you will scale `v` to a screen velocity. A linear scale is fine. The relative speeds are what matters pedagogically.

---

## 5. Material Properties

Each material has two parameters: a work function `φ` (the minimum energy to liberate an electron from the Fermi level) and an effective occupied-band depth `W_band` (the energy range below the Fermi level over which electrons are uniformly available for photoemission). Both are required by the band model in Section 6.

### 5.1 Material Table

| Material  | Symbol | `φ` (eV) | `W_band` (eV) | `λ_0` (nm) | `λ_sat` (nm) | Notes |
|-----------|--------|----------|---------------|------------|--------------|-------|
| Sodium    | Na | 2.28 | 3.2 | 544 | 226 | Free-electron-like, narrow s-band |
| Calcium   | Ca | 2.87 | 4.6 | 432 | 166 | s-band with d-states near E_F |
| Magnesium | Mg | 3.66 | 7.1 | 339 | 115 | Broad free-electron-like s-p band |
| Zinc      | Zn | 4.33 | 9.5 | 286 | ~90 | Filled d-band well below E_F + s-p |
| Copper    | Cu | 4.65 | 9.0 | 267 | ~91 | Filled d-band ~2 eV below E_F + s-band below |
| Platinum  | Pt | 6.35 | 9.5 | 195 | ~78 | d-band straddles E_F, deep s-band |

`λ_0 = 1240 / φ` is the threshold wavelength (longest wavelength that can eject any electron).
`λ_sat = 1240 / (φ + W_band)` is the wavelength below which `f_acc = 1` and the per-photon ejection probability saturates.

### 5.2 What `W_band` Represents and How It Affects the Sim

`W_band` is the effective range of binding energies of the electrons participating in photoemission, measured downward from the Fermi level. A photon with energy `E_γ` can in principle eject electrons with binding energies from `φ` (Fermi level) down to `min(E_γ, φ + W_band)` (limited either by photon energy or by the bottom of the band, whichever comes first).

The user-visible consequences of `W_band`:

1. **At constant photon rate (Mode B), the I-vs-frequency curve rises linearly with slope ∝ 1/W_band, then saturates** when `E_γ ≥ φ + W_band`. Smaller `W_band` means a steeper rise to a closer saturation point.
2. **The KE distribution of ejected electrons** is uniform on `[max(0, E_γ - φ - W_band), E_γ - φ]`. For `E_γ - φ ≤ W_band` (typical), KE spans from 0 to KE_max. For `E_γ - φ > W_band`, KE has a nonzero floor.

### 5.3 Pedagogical Behavior of the Six Metals

With these values, the simulation produces this behavior across its 100–800 nm range:

- **Sodium, Calcium, Magnesium**: saturation in the I-vs-f curve is **clearly visible** within the wavelength slider's range (saturation at 226, 166, and 115 nm respectively). Students sweeping the wavelength can see the current rise, then plateau.
- **Zinc, Copper**: saturation occurs near or just below 100 nm, so the plateau appears only at the extreme short-wavelength end of the slider. The current rises across most of the visible/UV range.
- **Platinum**: saturation occurs at ~78 nm, below the slider range. The current rises throughout the entire accessible range without plateauing.

This contrast is itself pedagogically useful: alkali and alkaline-earth metals (with low work functions and narrow bands) cleanly demonstrate the full saturation phenomenon, while transition metals show only the rising regime in the accessible range. This reflects real physics — these are part of the reasons alkali metals were historically chosen for early photoelectric experiments.

### 5.4 Caveats on the Band Depth Values

Real metal band structures are complicated. The "depth" of an occupied band depends on what is included (s-only? s+p? s+p+d?) and on how it is measured (DFT calculation, photoemission spectroscopy, optical methods). Different sources give values that can differ by a few eV, especially for transition metals where the d-band overlaps or sits just below the s-p band.

The values in Section 5.1 are reasonable rounded values consistent with standard solid-state references and chosen primarily to give clean, distinguishable pedagogical behavior across the six metals. They are not meant to be physically exact. If specific values need to be revisited later, it is a one-line change per metal in the materials table.

### 5.5 Custom Material (Screen 3 only)

The custom material allows continuous adjustment of both parameters:

- `φ ∈ [0.10, 10.0]` eV, step 0.01 eV
- `W_band ∈ [0.5, 15.0]` eV, step 0.1 eV (suggested range)
- Recommended defaults: `φ = 3.10 eV`, `W_band = 5.0 eV`

Whether to expose the band depth slider to learners or keep it as an instructor-only control is a UI choice. For introductory use it can be hidden with a fixed default; for more advanced exploration it can be exposed alongside the work function slider.

---

## 6. Band Structure Model

This is the most important modeling decision in the simulation, because it determines the **range of kinetic energies** of ejected electrons and the **probability** that a photon ejects an electron.

### 6.1 Conceptual Picture

Real metals have a continuous band of occupied electron states. The most weakly bound electron has binding energy `φ` (this defines the work function). Electrons can also have larger binding energies, down to the bottom of the conduction band.

A photon with energy `E_γ` can eject **any** electron whose binding energy satisfies `E_b ≤ E_γ`. The ejected electron leaves with KE = `E_γ - E_b`. So:

- A photon ejecting the most weakly bound electron (`E_b = φ`) gives `KE = E_γ - φ` (the maximum).
- A photon ejecting a more deeply bound electron (`E_b` larger) gives less KE.
- A photon cannot eject electrons with `E_b > E_γ`.
- A photon cannot eject electrons with `E_b > φ + W_band` (those states are below the band; no occupied states exist there in the model).

### 6.2 Uniform Density-of-States Approximation

**Model:** Assume the density of occupied electron states is uniform in binding energy from `E_b = φ` to `E_b = φ + W_band`. The value of `W_band` is per-metal (Section 5.1).

This uniform approximation is a deliberate simplification (real metals have non-uniform DOS), but it is sufficient to reproduce the qualitatively correct behaviors: linear rise of current with frequency at constant photon rate, saturation at `E_γ = φ + W_band`, and a uniform spread of ejected-electron kinetic energies.

### 6.3 Quantum Efficiency

Even when a photon has enough energy to eject an electron, not every photon does so in a real experiment. Capture this with a single overall scale factor:

```
η = 0.5    (recommended; tune for visual/pedagogical effect)
```

`η` simply scales the probability of ejection by a constant. It does not change the **shape** of any curve. Adjust if the on-screen current looks too high or too low for typical settings; this is purely a visualization knob.

---

## 7. Light Source Model

### 7.1 Two Control Modes

The simulation supports two ways to control the light source:

**Mode A: Intensity (default).** The user adjusts intensity from 0–100%. Intensity is the energy flux: `I_intensity ∝ N_γ · E_γ`. So at fixed intensity, **changing wavelength changes the photon rate.**

**Mode B: Photon rate.** The user adjusts the photon emission rate `N_γ` directly from 0–100%. At fixed photon rate, **changing wavelength does not change the photon count**, only the energy per photon.

The user toggles between these via an option (in the original sim it was in the Options menu; in the new version this should be exposed through the same control labels: "Intensity" slider becomes a "Photon rate" slider).

### 7.2 Defining the Reference Photon Rate

Choose a reference photon rate `N_max` that corresponds to **100% on the slider at the reference wavelength** `λ_ref`. Then:

```
λ_ref = 400 nm                        (recommended reference wavelength)
N_max = chosen for visual feel        (e.g. ~200 photons/sec on screen,
                                       higher for current calculation)
```

For two separate uses, you may want two separate values:

- `N_visible`: photons drawn on screen per second (e.g. 100–500). This controls visual density.
- `N_physical`: photons used in the current calculation (e.g. 10⁵–10⁶). This determines the actual ammeter reading.

These two can be decoupled (the visual photons are a sample of the physical ones) as long as the final current displayed is consistent and pedagogically reasonable (Section 10).

### 7.3 Conversion Math

Let `s ∈ [0, 100]` be the slider value (percent).

**Mode A (intensity slider):**

```
N_γ(s, λ) = N_max · (s / 100) · (λ / λ_ref)
```

Because intensity = N_γ · E_γ, and E_γ ∝ 1/λ, holding intensity fixed and increasing λ means more photons each carrying less energy. The factor of `λ / λ_ref` captures this.

**Mode B (photon rate slider):**

```
N_γ(s, λ) = N_max · (s / 100)
```

Photon rate is independent of wavelength.

### 7.4 Pseudocode: Photon Emission

```
function emit_photons(dt, slider_value, wavelength_nm, mode):
    if mode == "intensity":
        rate = N_max * (slider_value / 100) * (wavelength_nm / lambda_ref)
    else:  # mode == "photon_rate"
        rate = N_max * (slider_value / 100)

    expected_count = rate * dt
    # For visual smoothness, sample a Poisson distribution
    # (or just deterministic count for high rates):
    n_photons = poisson_sample(expected_count)

    for i in range(n_photons):
        emit_photon(
            wavelength = wavelength_nm,
            energy_eV  = 1240.0 / wavelength_nm,
            position   = random_point_on_emitter_aperture(),
            direction  = beam_direction
        )
```

---

## 8. Photon-Electron Interaction (Heart of the Simulation)

This is the core algorithm. It is run for each photon that hits the cathode plate.

### 8.1 Step-by-Step Logic

For one photon with energy `E_γ` interacting with a material of work function `φ` and band depth `W_band`:

1. **Threshold check.** If `E_γ ≤ φ`, the photon is absorbed by the metal as heat. No electron is ejected. Done. (Note `≤`, not `<`: at exact threshold `f_acc = 0` and the band model produces no ejection; see Section 8.4.)
2. **Determine accessible band fraction.** A photon can eject any electron with `E_b ≤ E_γ`. The fraction of band electrons accessible is:

   ```
   f_acc = max(0, min(1, (E_γ - φ) / W_band))
   ```

   The `max(0, ...)` guard ensures correct behavior below threshold.
3. **Decide whether ejection actually occurs.** Multiply by the quantum efficiency factor:

   ```
   p_eject = η · f_acc
   ```

   Sample a uniform random number `r ∈ [0, 1)`. If `r > p_eject`, no electron ejected; the photon is absorbed. Done.
4. **Sample the binding energy of the ejected electron.** Uniform over the accessible range:

   ```
   E_b_min = φ
   E_b_max = min(E_γ, φ + W_band)
   E_b     = uniform_random(E_b_min, E_b_max)
   ```

5. **Compute initial kinetic energy:**

   ```
   KE_initial = E_γ - E_b
   ```

    By construction, `KE_initial` lies in the range `[KE_min, KE_max]` where
   `KE_max = E_γ - φ` and `KE_min = max(0, E_γ - φ - W_band)`.

6. **Set initial direction.** Perpendicular to the cathode plate (toward the collector). This is a deliberate model simplification (Section 14).
7. **Set initial speed:** `v_initial = sqrt(2 · KE_initial / m_e)`.

### 8.2 Pseudocode

```
function absorb_photon(photon, material):
    phi      = material.work_function_eV
    W        = material.band_depth_eV          # per-metal value, see Section 5.1
    E_gamma  = photon.energy_eV

    if E_gamma <= phi:
        return None                            # heat only, no electron
                                               # (covers exact threshold: f_acc = 0)

    f_acc    = max(0, min(1, (E_gamma - phi) / W))
    p_eject  = ETA * f_acc                     # ETA = quantum efficiency, e.g. 0.5

    if random_uniform(0, 1) > p_eject:
        return None                            # absorbed but no electron

    E_b_max  = min(E_gamma, phi + W)
    E_b      = random_uniform(phi, E_b_max)

    KE_eV    = E_gamma - E_b                   # in [max(0, E_gamma-phi-W), E_gamma-phi]
    KE_J     = KE_eV * 1.602176634e-19
    v_init   = sqrt(2 * KE_J / 9.1093837e-31)  # m/s

    return Electron(
        position    = photon.hit_position,
        velocity    = v_init * normal_to_plate,
        kinetic_eV  = KE_eV
    )
```

### 8.3 Properties This Reproduces

This algorithm correctly produces all the canonical photoelectric-effect behaviors:

- No ejection below threshold (regardless of intensity), because step 1 fails for all photons.
- `KE_max` linear in frequency: `KE_max = h·f - φ`.
- Number of ejected electrons proportional to intensity at fixed frequency (because each photon has the same `p_eject`, and the number of photons scales with intensity).
- At constant photon rate, current rises linearly with frequency until `E_γ = φ + W_band`, then saturates (because `f_acc` reaches 1).
- Ejection effectively instantaneous on time scales the simulation cares about (each photon either ejects or doesn't, no accumulation).

### 8.4 Behavior at and near threshold

**At exact threshold (`E_γ = φ`):** `f_acc = 0`, so `p_eject = 0`. The model produces zero ejection events. No electron appears on screen, no current contribution. This is the desired behavior. There is no special-case code needed in the visualization layer to suppress a "KE = 0" electron, because the band model never produces an ejection event at exact threshold in the first place.

**Just above threshold (`E_γ` slightly greater than `φ`):** `p_eject` is small but nonzero. When ejection does occur, the sampled `E_b` is uniformly distributed in `[φ, E_γ]`, so `KE_initial` is uniform in `[0, E_γ - φ]`. Sampled KE values can be arbitrarily close to zero. These electrons are physically real and contribute to current at `V ≥ 0`. They drift slowly and may appear nearly stationary on screen.

**Optional visualization filter (representation choice, not physics).** If desired, the rendering layer may filter out electrons whose `KE_initial` falls below some small threshold so they are not drawn (those electrons would barely move on screen anyway). Whether to filter, and what threshold to use, is a UI/representation decision (not a physical truth) and may be revisited based on visual testing. Two principles, regardless of which choice is made:

1. Any such filtering is **purely cosmetic** and applies only to which electrons get rendered as visible sprites.
2. The current calculation in Section 10.3 uses the analytical formula and accounts for **all** physically ejected electrons, including any that the renderer chooses not to draw. The displayed ammeter reading must remain consistent with the full physical model.

### 8.5 A note on the linear `f_acc` ramp (Fowler simplification)

Real photoemission near threshold follows the Fowler-DuBridge law, in which the photoemission yield rises approximately as `(E_γ - φ)^2` near threshold (or as `(E_γ - φ)^(1/2)` in some formulations, depending on the assumed band shape). The linear ramp `f_acc = (E_γ - φ) / W_band` used here corresponds to assuming a uniform density of states in the relevant band. This is a deliberate simplification that produces all the correct qualitative behaviors (zero below threshold, smooth rise, eventual saturation) without introducing a power-law form that students would need extra context to interpret. The choice of `W_band` per metal controls the steepness of the rise and the location of saturation.

---

## 9. Electron Dynamics in the Tube

After ejection, the electron travels from the cathode to the collector under the influence of the applied voltage `V`.

### 9.1 Energy Conservation

Treat the gap between plates as a uniform electric field. As the electron moves from cathode (potential 0) to collector (potential `V`), its potential energy changes by `-e · V` (because the electron carries negative charge `-e`).

```
KE_at_collector = KE_initial + e · V        (V > 0: accelerating; V < 0: decelerating)
```

With KE in eV and V in volts, this becomes simply:

```
KE_at_collector (eV) = KE_initial (eV) + V (V)
```

### 9.2 Three Voltage Regimes

For an electron with initial kinetic energy `KE_initial`:

1. **`V ≥ 0` (accelerating or zero):** electron always reaches collector. Final KE is `KE_initial + V`.
2. **`-KE_initial < V < 0` (mildly retarding):** electron reaches collector but slowed. Final KE is `KE_initial + V > 0`.
3. **`V ≤ -KE_initial` (sufficiently retarding):** electron decelerates to zero, then returns to cathode. Does not contribute to current.

The distance the electron travels before turning around (case 3) is:

```
fraction_traveled = KE_initial / |e · V| = KE_initial(eV) / |V|(V)
```

This is what the simulation should animate: at `V` just barely below `-V_stop` for the highest-KE electrons, those electrons just barely reach the collector and turn around (the visually compelling behavior described in the original PhET notes).

### 9.3 Pseudocode: Electron Update Per Frame

```
function update_electron(electron, V_volts, dt):
    # Acceleration in the gap (uniform field model)
    # Field E = V / gap_distance, force on electron = -e * E (toward cathode if V<0)
    # Acceleration a = -e * E / m_e in the direction from cathode to collector

    a = (e * V_volts) / (m_e * gap_distance)   # SI; positive a means toward collector
    electron.velocity += a * dt
    electron.position += electron.velocity * dt

    if electron.position has reached collector plate:
        register_arrival(electron)             # contributes to current
        remove(electron)
    elif electron.position has returned to cathode:
        remove(electron)                       # absorbed back into cathode, no current
```

Note that `gap_distance` is whatever you choose for the on-screen geometry; it cancels out of the energy-conservation result but matters for the time-of-flight animation.

---

## 10. Current Calculation

### 10.1 Definition

```
I = (rate of electrons arriving at collector) · e
```

Two valid implementations:

**Implementation A: count actual arrivals.** Maintain a sliding-window count of electrons that reach the collector in the last `Δt_window` seconds (e.g. 0.5 s). `I = e · count / Δt_window`.

**Implementation B: analytical (faster).** Compute the expected current directly from the photon rate, ejection probability, and KE distribution. See Section 10.3.

Implementation B gives a smoother, more responsive ammeter readout. Implementation A gives natural noise but jittery readout. **Recommendation: use B for the numeric ammeter display, and let the visual electrons reflect a sampled subset of the actual physical electrons.**

### 10.2 Three Voltage Regimes for Total Current

Let `N_γ` be the photon rate (photons/sec) hitting the cathode. From the band model (Section 6.2), the KE distribution of ejected electrons is **uniform on `[KE_min, KE_max]`** where:

```
KE_max = E_γ - φ
KE_min = max(0, KE_max - W_band) = max(0, E_γ - φ - W_band)
```

`KE_min > 0` whenever `E_γ - φ > W_band`, i.e., when the photon is energetic enough that even the most deeply bound accessible electron carries away non-trivial KE. With per-metal band depths, this condition is reachable in the simulation's wavelength range for several metals (e.g., for Sodium with W_band = 3.2 eV, `E_γ - φ > W_band` whenever λ < 226 nm). When this condition holds, the I-V curve has a flat top extending into negative voltages before the linear ramp begins.

The fraction of ejected electrons that reach the collector at applied voltage `V`:

```
if V ≥ -KE_min:                        # all electrons have enough KE to overcome retardation
    f_reach = 1.0
elif V > -KE_max:                      # i.e. -KE_max < V < -KE_min
    f_reach = (KE_max + V) / (KE_max - KE_min)    # linear ramp
else:  # V ≤ -KE_max
    f_reach = 0.0                      # cutoff
```

When `KE_min = 0` (the typical case for low-energy photons just above threshold), the first condition reduces to `V ≥ 0` and the formula collapses to the simpler form: `f_reach = (KE_max + V) / KE_max` for `-KE_max < V < 0`.

(Because we model perpendicular emission, the cutoff at `V = -V_stop = -KE_max/e` is sharp.)

### 10.3 Analytical Current Formula

```txt
I = e · N_γ · p_eject_avg · f_reach
```

where `p_eject_avg = η · f_acc` (Section 8) and `f_reach` is from Section 10.2.

Substituting:

```txt
         { e · N_γ · η · f_acc                                        if V ≥ -KE_min
I(V,λ) = { e · N_γ · η · f_acc · (KE_max + V) / (KE_max - KE_min)     if -KE_max < V < -KE_min
         { 0                                                          if V ≤ -KE_max

with:
    f_acc   = max(0, min(1, (E_γ - φ) / W_band))   (returns 0 if E_γ ≤ φ)
    KE_max  = E_γ - φ                               (only meaningful if E_γ ≥ φ)
    KE_min  = max(0, KE_max - W_band)
    E_γ     = 1240 / λ(nm)
```

Both `φ` and `W_band` are properties of the currently selected material (Section 5.1).

If `E_γ < φ` (below threshold), `I = 0` regardless of voltage or intensity. If `E_γ = φ` exactly, `f_acc = 0` and again `I = 0`. The band model produces no ejection events at threshold.

### 10.4 Display Units

The actual numerical current depends on the chosen `N_max`. Pick `N_max` so that the ammeter reads a pleasing value at default settings (e.g. 100–200 μA at 100% intensity, 400 nm, Sodium, V = 0). Display μA for small currents and switch to mA for larger ones if needed.

The original sim's screenshots show "Current: 114 mA" at one set of conditions; the absolute scale is a free parameter as long as the relative behaviors are correct.

---

## 11. Expected Graph Behaviors

These are the four standard plots the simulation should produce. Each corresponds to a specific test case for verifying the model.

### 11.1 Current vs Voltage (at fixed wavelength and intensity)

In the typical case (`KE_min = 0`, i.e. `E_γ - φ ≤ W_band`): a linear ramp from `I = 0` at `V = -V_stop` to `I = I_sat` at `V = 0`, then constant at `I_sat` for `V > 0`.

```
I(V):
        |
  I_sat |              _______________
        |             /
        |            /
        |           /
        |          /
      0 |_________/_______________________→ V
              -V_stop      0
```

In the high-photon-energy case (`KE_min > 0`, i.e. `E_γ - φ > W_band`): the plateau extends from `V = 0` down to `V = -KE_min` before the linear ramp begins, ending at `V = -KE_max`:

```
I(V):
        |
  I_sat |        _____________________
        |       /
        |      /
        |     /
        |    /
      0 |___/______________________________→ V
        -KE_max  -KE_min        0
```

This "flat top extending into negative V" is most visible when using high-energy photons on a metal with a narrow band (e.g. Sodium at λ = 150 nm: `KE_max ≈ 6.0 eV`, `KE_min ≈ 2.8 eV`, plateau width ≈ 2.8 V on the negative side).

Key features the user should be able to read off:

- The **stopping potential** `V_stop = KE_max/e` (the x-intercept on the negative side): depends on wavelength and material, but **not** on intensity.
- The **saturation current** `I_sat` (the height of the plateau): depends on intensity, but **not** on voltage in the saturation region.

### 11.2 Current vs Intensity (at fixed wavelength and voltage)

Shape: A straight line through the origin with slope proportional to `f_acc` for the chosen wavelength. If `E_γ < φ`, the line is flat at zero (no matter the intensity).

### 11.3 Electron KE_max vs Frequency

This graph is the most important pedagogical artifact of the simulation: it is the direct visualization of Einstein's equation `KE_max = h·f − φ`, and it lets students measure Planck's constant by hand from the slope.

**Functional form (per material):**

```
KE_max(f) = max(0, h·f - φ)
```

For each material, the curve is zero below the threshold frequency `f_0 = φ/h`, and rises as a straight line above it. **The slope is exactly Planck's constant `h`** (in whatever energy units the y-axis uses; if y-axis is eV and x-axis is Hz, slope = 4.136 × 10⁻¹⁵ eV·s). **The y-intercept of the linear part, extrapolated back to `f = 0`, is `−φ`** (a negative value on the KE axis). **The x-intercept is the threshold frequency `f_0`.**

This graph is independent of `W_band`, intensity, voltage, and `η`. It depends only on `f` and `φ`. The shape and slope are the same for all materials; only the threshold position (`f_0`) and the extrapolated y-intercept (`−φ`) shift between materials.

**Per-metal threshold frequencies and intercepts.** With the work functions from Section 5.1:

| Material | `φ` (eV) | `f_0` (×10¹⁴ Hz) | `λ_0` (nm) | y-intercept at f=0 (eV) |
|----------|----------|------------------|------------|-------------------------|
| Sodium    | 2.28 | 5.51  | 544 | −2.28 |
| Calcium   | 2.87 | 6.94  | 432 | −2.87 |
| Magnesium | 3.66 | 8.85  | 339 | −3.66 |
| Zinc      | 4.33 | 10.47 | 286 | −4.33 |
| Copper    | 4.65 | 11.24 | 267 | −4.65 |
| Platinum  | 6.35 | 15.35 | 195 | −6.35 |

For reference, the simulation's wavelength range of 100–800 nm corresponds to a frequency range of `3.75 × 10¹⁴` to `3.0 × 10¹⁵` Hz (or 0.375 to 3.0 in units of 10¹⁵ Hz, which is the unit used on the original PhET sim's frequency axis).

**KE_max at λ = 100 nm (the high-frequency end of the slider):**

| Material | `KE_max` at λ=100 nm (eV) |
|----------|---------------------------|
| Sodium    | 10.12 |
| Calcium   | 9.53 |
| Magnesium | 8.74 |
| Zinc      | 8.07 |
| Copper    | 7.75 |
| Platinum  | 6.05 |

These values give the upper-right endpoint of each material's line on the graph and are useful for choosing axis ranges.

**Recommended axis ranges:**

- x-axis (frequency): 0 to 3.0 × 10¹⁵ Hz, OR equivalent. The original PhET sim uses 0 to 3.0 × 10¹⁵ Hz with major gridlines at 0.5 intervals. Showing the axis from 0 (rather than from `f_0`) is essential because students need to extrapolate back to read off the y-intercept.
- y-axis (KE_max): roughly −7 to +11 eV to accommodate all six materials. Showing negative y values is essential because the extrapolated y-intercept `−φ` is negative; students need to see this to read off the work function. The original PhET sim displays the negative-KE region with a clear visual distinction (e.g. dashed extrapolation, or a shaded region) to make clear that no actual electrons exist there.

**Recommended display behavior.**

- Below `f_0` for the currently selected material: the line is **flat at KE = 0** (no electrons emitted, KE_max is undefined; conventionally drawn as zero).
- At and above `f_0`: the solid line follows `h·f − φ`.
- The dashed extrapolation from `f_0` back to the y-axis is optional but pedagogically valuable: it lets students read off `−φ` directly without doing arithmetic. If shown, render it as a clearly distinguishable style (dashed, semi-transparent) so students see the line is a mathematical extrapolation, not a physical prediction.

**Multi-material overlay.** A particularly powerful pedagogical use of this graph is overlaying lines for multiple materials simultaneously. With the camera/snapshot icon (Section 12.2), users can save the curve for one material, change material, and see the new curve drawn on top. The expected behavior:

1. **All lines should have the same slope (`h`).** This is the most important visual takeaway: Planck's constant is universal, independent of which metal is used. If the slopes appear different, something is wrong.
2. **Each material's line crosses the x-axis at a different point (`f_0`).** Materials with higher work functions have their threshold farther to the right.
3. **The dashed extrapolations all converge to `−φ` on the y-axis at `f = 0`.** Each material's extrapolation hits a different y-intercept, equal to the negative of its work function.
4. **The lines are parallel.** Vertical separation between any two lines equals the difference in their work functions, constant across all frequencies.

This overlay makes the linear, universal-slope, work-function-shifted nature of the photoelectric equation immediately visible. It is also the cleanest way to determine Planck's constant: pick any two points on a single line, compute rise/run, and you have `h` to within reading precision.

**Edge case: simultaneous display below all thresholds.** If the user is viewing a frequency range where `f < f_0` for all displayed materials, all visible lines are flat at zero. The dashed extrapolations are still informative (they show where each material's line *would* be if extended), so they should remain visible even when the solid line is at zero.

### 11.4 Current vs Frequency

This graph behaves **differently from what most textbooks show**, and the difference is pedagogically important. With per-metal `W_band` values, the saturation behavior is now visible within the simulation's wavelength range for several metals.

In the simulation's default mode (Mode A, fixed intensity), the current as a function of frequency is the product of two competing effects: `f_acc` rises linearly with `f` (more band accessible) while `N_γ` falls as `1/f` (fewer photons at higher energy per fixed intensity).

```
I(f) ∝ N_γ(f) · f_acc(f) ∝ (1/f) · (h·f − φ) / W_band   (in the rising regime)
                          = (h − φ/f) / W_band
```

This is **concave** in frequency. The slope is `dI/df ∝ φ/f²`, positive but decreasing. Three regions:

1. Below `f_0 = φ/h`: zero current.
2. Between `f_0` and `f_sat = (φ + W_band)/h`: current rises with positive but diminishing slope.
3. Above `f_sat` (i.e., `E_γ > φ + W_band`): `f_acc` saturates at 1, so current falls as `1/f`.

The maximum of the I-vs-f curve occurs at `f_sat`. **The same data plotted as I vs λ is two straight line segments meeting at λ_sat** (because `I ∝ N_γ · f_acc ∝ (λ/λ_ref) · (1/W_band) · (hc/λ − φ)` is linear in λ in the rising regime). Some textbook treatments plot I vs λ for this reason.

In Mode B (fixed photon rate), `N_γ` is independent of frequency, so:

1. Below `f_0`: zero current.
2. Between `f_0` and `f_sat`: current rises **linearly** in `f` (only `f_acc` varies).
3. Above `f_sat`: current saturates at `I = e · N_γ · η`.

**Saturation visibility for the six metals.** With the per-metal `W_band` values from Section 5.1, the wavelength at which saturation begins is:

| Metal | λ_sat | Saturation visible in 100–800 nm slider? |
|-------|-------|------------------------------------------|
| Sodium    | 226 nm | Yes, clearly |
| Calcium   | 166 nm | Yes |
| Magnesium | 115 nm | Yes, near the short-wavelength end |
| Zinc      | ~90 nm  | No (just below slider range) |
| Copper    | ~91 nm  | No (just below slider range) |
| Platinum  | ~78 nm  | No |

For Sodium, Calcium, and Magnesium, students can sweep wavelength and clearly observe the I-vs-f curve plateau (Mode B) or peak-and-fall (Mode A). For Zinc, Copper, and Platinum, the curve is still rising at the short-wavelength end of the slider; saturation is implied but not reached.

---

## 12. Screen-Specific Models

### 12.1 Screen 1 (Intro)

- Material selector: 6 metals (no custom)
- Wavelength slider: 100–800 nm
- Intensity / Photon rate slider: 0–100%, with mode toggle in options
- **No voltage control** (V = 0, internally)
- Visible electrons toggle (default ON)
- "Highest energy only" toggle (when ON, sample only `E_b = φ` instead of from the full range)
- Single graph option (or no graphs by default; check the exact UI)

The "Highest energy only" toggle is a pedagogical simplification. Internally:

```
if highest_energy_only:
    E_b = phi              # always the most weakly bound
else:
    E_b = uniform_random(phi, min(E_gamma, phi + W_band))
```

This affects visible electrons only. The current is always computed from the full distribution (per the original sim's design note).

### 12.2 Screen 2 (Experiment)

Everything from Screen 1, plus:

- Voltage slider: -8 V to +8 V (in 0.01 V steps)
- Three graphs: Current vs Voltage, Current vs Intensity, Electron KE_max vs Frequency
- Camera/snapshot icon to save graph states
- Pause/Step controls

### 12.3 Screen 3 (Energy)

Different interaction model: emit one photon (or burst) at a time, see the energy bookkeeping for each.

- Single/Burst toggle
- "Fire" button to emit photons on demand
- Wavelength slider (no intensity slider)
- Material selector includes a **Custom** option with continuously-adjustable `φ` (0.1 to 10 eV) and optionally `W_band` (0.5 to 15 eV); see Section 5.5
- Energy bar diagram per fired photon showing:
  - Photon energy `E_γ`
  - Binding energy of the absorbed electron (or "no electron ejected")
  - Resulting kinetic energy
  - Work function level shown as a dashed reference line at `-φ` (or 0, depending on chosen zero)
  - Optionally, a band depth indicator showing `-φ - W_band` to make the accessible-states region visible
- Vectors toggle: show velocity arrows on emitted electrons

For each fired photon on Screen 3, run the same algorithm from Section 8.2 once and display the result. The "Burst" mode fires N photons (e.g., 3–10) in quick succession so the user can see the variation in outcomes.

---

## 13. Recommended Defaults and Ranges

| Parameter | Default | Min | Max | Notes |
|-----------|---------|-----|-----|-------|
| Wavelength `λ` | 400 nm | 100 nm | 800 nm | Step: 1 nm |
| Intensity slider | 100% | 0% | 100% | Step: 1% |
| Voltage `V` (Screen 2) | 0.00 V | -8.00 V | +8.00 V | Step: 0.01 V |
| Material (Screens 1, 2) | Sodium | N/A | N/A | 6 fixed options |
| Custom `φ` (Screen 3) | 3.10 eV | 0.10 eV | 10.0 eV | Step: 0.01 eV |
| Custom `W_band` (Screen 3) | 5.0 eV | 0.5 eV | 15.0 eV | Step: 0.1 eV; UI exposure optional |
| `W_band` (fixed metals) | per-metal | N/A | N/A | See Section 5.1 |
| `η` (quantum efficiency) | 0.5 | (fixed) | (fixed) | Tune for visual feel |
| `λ_ref` | 400 nm | (fixed) | (fixed) | Internal constant |
| `KE_visual_threshold` (optional) | not set | 0 | N/A | Filters very-low-KE electrons from being drawn. See Section 8.4. Set to 0 to disable. |
| `N_max` (physical photon rate at 100%) | tune | N/A | N/A | Pick to give ~200 μA at default settings |
| `N_visible` (drawn photons per second) | ~150 | N/A | N/A | Visual only |
| `Δt_window` (current averaging) | 0.5 s | N/A | N/A | If using count-based current |

**Default scenario sanity check.** With Sodium (φ = 2.28 eV, W_band = 3.2 eV), λ = 400 nm (E_γ = 3.10 eV), V = 0, intensity = 100%:

- `KE_max = 0.82 eV` (small, all electrons make it across)
- `KE_min = max(0, 0.82 - 3.2) = 0` (so KE distribution is uniform on [0, 0.82] eV)
- `V_stop = 0.82 V` (the user can find this on Screen 2 by sweeping V negative)
- `f_acc = 0.82 / 3.2 = 0.256` (about 26% of band electrons accessible)

To see saturation on Sodium: sweep λ from 800 nm down to 100 nm in Mode B. Current is zero until λ = 544 nm (threshold), then rises linearly with frequency until λ = 226 nm (`E_γ = 5.48 eV = φ + W_band`), then plateaus at the saturation value for shorter wavelengths.

To see the "flat top" I-V curve: select Sodium, set λ = 150 nm (`E_γ ≈ 8.27 eV`, `KE_max ≈ 5.99 eV`, `KE_min ≈ 2.79 eV`). Sweep V negative; the current stays at the plateau value until V = -2.79 V, then ramps linearly down to zero at V = -5.99 V.

---

## 14. Model Simplifications and Caveats

These are deliberate departures from the full physics. They simplify the model without harming the pedagogical goals.

1. **Electrons ejected perpendicular to the plate.** Real electrons leave at a range of angles. Modeling angles would round off the sharp shoulder of the I-V curve at the saturation edge (giving Fig. 4C in the McKagan paper instead of Fig. 4B). The simplification is acceptable because the perpendicular-only model still produces all the qualitatively correct behaviors. Students do sometimes ask about it; that is fine, the answer is "yes, this is a simplification."

2. **Uniform density of states from `φ` to `φ + W_band`.** Real metals have non-uniform DOS, often with sharp peaks (e.g., d-band features in transition metals). The uniform approximation is sufficient to reproduce the linear-rise-then-saturate behavior in the current-vs-frequency curve.

3. **Per-metal `W_band` values are approximate.** Real band depths depend on which states are included in the count, the measurement method, and the level of theory. The values in Section 5.1 are reasonable rounded values chosen to give clean pedagogical behavior; they should not be treated as exact spectroscopic data.

4. **No relativistic corrections.** Maximum KE in the sim is ~10 eV, which corresponds to v/c ≈ 0.006, non-relativistic by any reasonable standard.

5. **Ignored:** contact potential, thermionic emission, reverse current, photon scattering, secondary electron emission, image-charge effects. None matter at the level of this introduction.

6. **Instantaneous interactions.** The photon-absorption-to-electron-ejection step is treated as instantaneous. (In reality there is a sub-femtosecond delay. This is well below any time scale the sim animates.)

7. **Uniform field between plates.** The E-field between cathode and collector is treated as uniform (parallel-plate capacitor). Edge effects ignored.

8. **Linear `f_acc` ramp instead of Fowler `(E_γ - φ)^n` form.** See Section 8.5.

---

## 15. Validation Test Cases

Use these to verify the implementation. Each should produce the exact behavior listed.

### Test 1: Threshold check

- Sodium (φ = 2.28 eV), λ = 600 nm (E_γ = 2.07 eV)
- **Expected:** zero current at any intensity, any voltage. Zero electrons emitted on screen.

### Test 2: Just above threshold

- Sodium, λ = 540 nm (E_γ = 2.30 eV, just above φ)
- **Expected:** very small current. KE_max ≈ 0.02 eV (very slow electrons). `f_acc ≈ 0.02/3.2 ≈ 0.006`.

### Test 3: Stopping potential

- Sodium, λ = 400 nm (E_γ = 3.10 eV), so KE_max = 0.82 eV, KE_min = 0
- Sweep V from 0 to -8 V
- **Expected:** current is constant `I_sat` for V ≥ 0, drops linearly from V = 0 to V = -0.82 V, then is zero for V < -0.82 V. The intercept on the V axis is the stopping potential.

### Test 4: Intensity independence of stopping potential

- Same as Test 3, but at 50% intensity instead of 100%
- **Expected:** `I_sat` is half as large, but `V_stop` is unchanged at -0.82 V.

### Test 5: Saturation in current vs frequency (photon-rate mode)

- Sodium (W_band = 3.2 eV), photon-rate mode at 100%, V = +5 V
- Sweep λ across the full slider range
- **Expected:** current is zero for λ > 544 nm (below threshold); rises **linearly** in frequency from λ = 544 nm down to λ = 226 nm (where `E_γ = 5.48 eV = φ + W_band`); then plateaus at the saturation value `I_sat = e · N_γ · η` for λ < 226 nm. The plateau is clearly visible and flat across the 100–225 nm range.

### Test 5b: Saturation visibility across metals (photon-rate mode)

- Photon-rate mode at 100%, V = +5 V, sweep λ across full range
- **Expected:** Sodium plateaus at λ = 226 nm (clearly visible). Calcium plateaus at λ = 166 nm (visible). Magnesium plateaus at λ = 115 nm (visible near short-wavelength end). Zinc, Copper plateau just below 100 nm (curve still rising at λ = 100 nm, no plateau visible). Platinum: no plateau in range (curve still rising).

### Test 6: Determining h

- Pick any material. Vary λ across several values above threshold. Read `KE_max` from the third graph.
- Plot `KE_max` vs `f` and fit a line.
- **Expected:** slope is `h = 4.136 × 10⁻¹⁵ eV·s`. Y-intercept is `-φ` for the chosen material. Slope is independent of `W_band`.

### Test 7: Material change at fixed light

- λ = 250 nm (E_γ = 4.96 eV), intensity 100%, V = 0
- Try each material in turn.
- **Expected:** Sodium, Calcium, Magnesium, Zinc all produce current (E_γ > φ for all four). Copper produces a small current (E_γ slightly above φ_Cu = 4.65 eV). Platinum produces zero current (E_γ < φ_Pt = 6.35 eV).

### Test 8: Highest-energy-only toggle

- Sodium, λ = 400 nm, V = 0, with "Highest energy only" ON vs OFF.
- **Expected:** ON: all visible electrons move at the same speed (corresponding to KE = KE_max = 0.82 eV). OFF: visible electrons have a range of speeds from near-zero up to the same maximum. The displayed current is the same in both cases.

### Test 9: Stopping-potential visual

- Sodium, λ = 400 nm, V slowly decreased from 0 toward -0.82 V
- **Expected:** at V = -0.81 V, the highest-KE electrons just barely reach the collector before turning around. At V = -0.83 V, no electrons reach. The "almost making it" visual is the key pedagogical moment; verify it works cleanly.

### Test 10: Custom material at exact threshold (Screen 3)

- Custom material with φ = 3.10 eV, λ = 400 nm (E_γ = 3.10 eV exactly)
- Fire single photons.
- **Expected:** no electrons are ejected, ever. With the band model, `f_acc = (E_γ - φ)/W_band = 0` at exact threshold, so `p_eject = 0` and every fired photon is absorbed without ejection. The Energy bar diagram should display "no electron ejected" for each shot. Setting φ slightly above 3.10 eV → still no ejection. Setting φ slightly below 3.10 eV (e.g., 3.05 eV) → occasional ejections with KE distributed in `[0, 0.05]` eV, so electrons emerging at near-zero speed.

This test confirms the desired visualization behavior: the simulation never displays an electron with KE = 0 emerging at threshold, because the model never produces such an electron in the first place. No special-case visualization filtering at threshold is needed.

### Test 11: Flat-top I-V curve at high photon energy

- Sodium (W_band = 3.2 eV), λ = 150 nm (E_γ ≈ 8.27 eV), intensity 100%
- Compute: KE_max ≈ 5.99 eV, KE_min ≈ 2.79 eV
- Sweep V from +5 V down to -8 V
- **Expected:** current is constant at `I_sat` from V = +5 V down to V = -2.79 V (the plateau extends into negative voltages because all ejected electrons have KE ≥ 2.79 eV). From V = -2.79 V to V = -5.99 V, current ramps linearly down to zero. For V < -5.99 V, current is zero. The "flat top into negative V" shape is the diagnostic feature here and confirms the `KE_min > 0` regime is implemented correctly.

---

## Appendix A: Quick Lookup Table

For developers debugging:

| λ (nm) | E_γ (eV) | Ejects from Na (φ=2.28, W=3.2)? | Ejects from Pt (φ=6.35, W=9.5)? |
|--------|----------|----------------------------------|----------------------------------|
| 100 | 12.40 | Yes (KE_max=10.12, KE_min=6.92, f_acc=1) | Yes (KE_max=6.05, KE_min=0, f_acc=0.637) |
| 150 |  8.27 | Yes (KE_max=5.99, KE_min=2.79, f_acc=1) | No |
| 200 |  6.20 | Yes (KE_max=3.92, KE_min=0.72, f_acc=1) | No |
| 226 |  5.49 | Yes (KE_max=3.21, KE_min=0.01, f_acc≈1) [saturation onset] | No |
| 300 |  4.13 | Yes (KE_max=1.85, KE_min=0, f_acc=0.578) | No |
| 400 |  3.10 | Yes (KE_max=0.82, KE_min=0, f_acc=0.256) | No |
| 500 |  2.48 | Yes (KE_max=0.20, KE_min=0, f_acc=0.063) | No |
| 600 |  2.07 | No | No |
| 800 |  1.55 | No | No |

## Appendix B: Common Implementation Pitfalls

1. **Don't compute current as `e · N_γ`.** Many photons don't eject electrons; many ejected electrons don't reach the collector. Always include both factors (`p_eject` and `f_reach`).
2. **Don't assume all electrons have the same KE.** This produces a step-function I-V curve (Fig. 4A in the McKagan paper) which is wrong. The KE distribution must span `[KE_min, KE_max]` for the I-V curve to have the correct linear ramp.
3. **Do compute `f_acc` even for the simple "highest energy only" toggle.** That toggle only changes the *visible* electrons, not the current calculation.
4. **Don't apply Ohm's law (V = IR).** The photoelectric circuit is not an ohmic conductor. Voltage controls *whether* electrons reach the collector, not how much current flows when they do. (This is one of the documented student misconceptions; the sim should not reinforce it.)
5. **Sign of voltage.** Double-check: positive V (collector higher than emitter) accelerates electrons toward the collector. Negative V retards them. The stopping potential is reached at V = -V_stop, i.e., V is negative.
6. **Wavelength/frequency in graph axes.** The `KE_max vs frequency` graph uses frequency on the x-axis (so it shows the linear `KE = hf - φ` relationship clearly). The current vs intensity graph uses wavelength as a fixed parameter set by the wavelength slider. Don't mix these up.
7. **Below threshold, current is exactly zero.** Don't let numerical noise produce a tiny nonzero current. Clamp to zero when `E_γ < φ`.
8. **Each material has its own `W_band`.** Pull both `φ` and `W_band` from the material data structure for every calculation. Hard-coding a single global `W_band` (the original recommendation in this document, now superseded) breaks the saturation behavior for narrow-band metals.
9. **Don't forget `KE_min` in the I-V calculation.** When `E_γ - φ > W_band`, the I-V curve has a flat plateau extending into negative voltages before the ramp begins. Using the simpler `f_reach = (KE_max + V) / KE_max` formula (which assumes `KE_min = 0`) will give incorrect results for high-energy photons on narrow-band metals.
