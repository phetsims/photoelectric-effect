// Copyright 2026, University of Colorado Boulder

/**
 * Base class for determining initial electron speeds after emission. Subclasses
 * define how available energy maps to the starting speed of an emitted electron.
 *
 * @author Marla A. Schulz (PhET Interactive Simulations)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

// TODO: Is this abstract pattern necessary or overkill?
export default abstract class InitialElectronSpeedModel {

  /**
   * Determines the initial electron speed based on available energy.
   * Implementations choose how to map energy to speed for emission modeling.
   */
  public abstract determineNewElectronSpeed( energy: number ): number;
}

export class UniformElectronSpeedModel extends InitialElectronSpeedModel {

  /**
   * Model that applies a uniform analytic mapping from energy to speed.
   * A scale factor keeps the result aligned with legacy tuning.
   */

  // Scales analytical speed to match the legacy model's simulation units.
  private readonly scaleFactor: number;

  /**
   * @param scaleFactor - multiplies analytic speed into model units
   */
  public constructor( scaleFactor: number ) {
    super();
    this.scaleFactor = scaleFactor;
  }

  /**
   * Computes the electron speed from kinetic energy using a uniform mapping.
   * Uses the analytic kinetic-energy relationship and then applies a scale factor
   * so the resulting speed matches the tuned legacy behavior.
   */
  public determineNewElectronSpeed( energy: number ): number {
    const speed = Math.sqrt( 2 * energy / PhotoelectricEffectConstants.ELECTRON_MASS ) * this.scaleFactor;
    return speed;
  }
}

export class RandomizedElectronSpeedModel extends UniformElectronSpeedModel {

  /**
   * Model that randomizes speed as a fraction of the uniform analytic result.
   * The minimum speed prevents emitted electrons from stalling at the surface.
   */

  // Enforces a lower bound on randomized speeds to avoid non-emission jitter.
  private readonly minimumSpeed: number;

  /**
   * @param scaleFactor - multiplies analytic speed into model units
   * @param minimumSpeed - lower bound on randomized speeds
   */
  public constructor( scaleFactor: number, minimumSpeed: number ) {
    super( scaleFactor );
    this.minimumSpeed = minimumSpeed;
  }

  /**
   * Computes a randomized electron speed between 0 and the uniform speed.
   * Keeps a minimum speed so emitted electrons always move away from the surface.
   */
  public override determineNewElectronSpeed( energy: number ): number {
    const maxSpeed = super.determineNewElectronSpeed( energy );
    let speed = maxSpeed * dotRandom.nextDouble();

    if ( speed < this.minimumSpeed ) {
      speed = this.minimumSpeed;
    }

    return speed;
  }
}
