// Copyright 2026, University of Colorado Boulder

/**
 * Model for a photon emitted by the photon source.
 * Extends Particle with wavelength to determine its energy.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Particle from './Particle.js';
import { wavelengthToEnergy } from './PhotoelectricEffectUtils.js';

export default class Photon extends Particle {

  /**
   * Creates a photon with initial kinematics and wavelength.
   *
   * @param position
   * @param velocity
   * @param acceleration
   * @param wavelength - Wavelength of the photon in nanometers.
   */
  public constructor(
    position: Vector2,
    velocity: Vector2,
    acceleration: Vector2,
    public readonly wavelength: number
  ) {
    super( position, velocity, acceleration );
  }

  /**
   * Returns the photon energy in electron volts.
   */
  public getEnergy(): number {
    return wavelengthToEnergy( this.wavelength );
  }
}
