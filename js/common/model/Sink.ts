// Copyright 2026, University of Colorado Boulder

/**
 * Model for the sink (collector) plate that receives emitted electrons.
 * Owns sink-specific behavior like collision handling and current effects.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import Electron from './Electron.js';
import Particle from './Particle.js';

export default class Sink {

  /**
   * Creates a sink plate at the given x position.
   *
   * @param x - X position of the sink plate center in model coordinates.
   * @param _tandem (TODO, unused for now)
   */
  public constructor( public readonly x: number, _tandem: Tandem ) {
  }

  /**
   * Handles a particle collision with the sink.
   * Called when a particle intersects the sink x position.
   */
  public particleCollisions( _particle: Particle ): void {

    //TODO implement sink collision behavior
  }

  /**
   * Returns true when the electron has reached or crossed the sink x position.
   */
  public isHitByElectron( electron: Electron ): boolean {
    return electron.position.x >= this.x;
  }
}