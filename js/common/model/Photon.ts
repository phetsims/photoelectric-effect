// Copyright 2026, University of Colorado Boulder

/**
 * Model for a photon emitted by the photon source.
 * Extends Particle with wavelength to determine its energy.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import Particle from './Particle.js';
import { wavelengthToEnergy } from './PhotoelectricEffectUtils.js';

export default class Photon extends Particle {

  // Emitted photons should travel perpendicularly to the photon source's pointing direction.
  // This vector will help define the line that each photon should travel on during it's lifecycle.
  public static readonly TRAVEL_DIRECTION = new Vector2(
    -PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION.y, PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION.x );

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
