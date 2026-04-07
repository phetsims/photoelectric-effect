// Copyright 2026, University of Colorado Boulder

/**
 * Model for the sink (collector) plate that receives emitted electrons.
 * Owns sink-specific behavior like collision handling and current effects.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Electron from './Electron.js';
import Particle from './Particle.js';

export default class Sink {

  /**
   * Bounds of the sink plate in model coordinates.
   * Used for collision detection with emitted electrons.
   */
  public readonly bounds: Bounds2;

  public constructor( bounds: Bounds2, _tandem: Tandem ) {
    this.bounds = bounds;
  }

  /**
   * Handles a particle collision with the sink.
   * Called when a particle intersects the sink bounds.
   */
  public particleCollisions( _particle: Particle ): void {
    //TODO implement sink collision behavior
  }

  /**
   * Returns true when the electron intersects the sink bounds.
   */
  public isHitByElectron( electron: Electron ): boolean {
    // TODO: Consider segment intersection against sink bounds to avoid tunneling at larger dt.
    return this.bounds.containsPoint( electron.getPosition() );
  }
}