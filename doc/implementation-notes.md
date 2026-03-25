Model Structure Intro Screen:
- PhotoelectricModel => IntroModel
- Particle => Photon & Electron
- GraphModel???
  - How are these going to behave?
  - Does the PhotoelectricModel need to know about this?
- Plate => Target & Sink
  - We may not need a Plate parent class...

**PhotoelectricModel:**
- target: Target
- photonSource: PhotonSource
- photons: Array<Photon>
- electrons: Array<Electron>
- currentProperty<number>

**IntroModel:**
- sink: Sink
- ammeter: Ammeter
- battery: Battery

## Plates
**Target:**
- workFunctionProperty<number>
- materialProperty
- bounds: Bounds2
- particleCollisions()
  - When it hits the target
  - what happens after it hits

**Sink:**
- bounds: Bounds2
- particleCollisions()???
 - The sink in the java sim doesn't care about this, so maybe we don't need to either? 
 - When it hits the sink plate
 - How that affects the current

## Photon Source
**PhotonSource:**
- intensityProperty<number>
- wavelengthProperty<number>

## Particles
Particle:
- position: Vector2
- acceleration: number
- velocity: number
- step()
    - update position, acceleration, and velocity
  
**Photon:**
- wavelength: number

**Electron:**
- setAcceleration()
- energy: number
  - The amount of energy the electron needed to escape. 

## Graphs


## Accessories?

**Ammeter:**
- 
**Battery:**
-