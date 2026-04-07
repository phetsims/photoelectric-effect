// Copyright 2026, University of Colorado Boulder

/**
 * Model for an emitted electron in the photoelectric effect simulation.
 * Extends Particle with energy and supports acceleration updates during motion.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import Particle from './Particle.js';

export default class Electron extends Particle {

  /**
   * Energy of the electron in model units.
   */
  public readonly energy: number;

  /**
   * Creates an electron with initial kinematics and energy.
   */
  public constructor( position: Vector2, velocity: Vector2, acceleration: Vector2, energy: number ) {
    super( position, velocity, acceleration );
    this.energy = energy;
  }

  /**
   * Updates the electron acceleration for subsequent motion updates.
   */
  public setAcceleration( acceleration: Vector2 ): void {
    this.acceleration = acceleration;
  }

    /**
   * Computes the electron speed from kinetic energy using a uniform mapping.
   * Uses the analytic kinetic-energy relationship and then applies a scale factor
   * so the resulting speed matches the tuned legacy behavior.
   */
  public static determineNewElectronSpeed( energy: number ): number {
    const scaleFactor = PhotoelectricEffectConstants.ELECTRON_SPEED_SCALE_FACTOR;
    return Math.sqrt( 2 * energy / PhotoelectricEffectConstants.ELECTRON_MASS ) * scaleFactor;
  }
}
