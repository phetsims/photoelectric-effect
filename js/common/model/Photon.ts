// Copyright 2026, University of Colorado Boulder
/**
 * Photon is a particle emitted by the photon source. It has a wavelength that determines its energy.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 *
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Particle from './Particle.js';

export default class Photon extends Particle {


  public constructor( position: Vector2, acceleration: Vector2, velocity: Vector2, public readonly wavelength: number ) {
    super( position, acceleration, velocity );
  }
}
