// Copyright 2026, University of Colorado Boulder

/**
 * Model for the collector plate that receives emitted electrons.
 * Owns collector-specific behavior like collision handling and current effects.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import Electron from './Electron.js';
import Particle from './Particle.js';

export default class Collector {

  /**
   * Creates a collector plate at the given x position.
   *
   * @param x - X position of the collector plate center in model coordinates.
   * @param _tandem (TODO, unused for now)
   */
  public constructor( public readonly x: number, _tandem: Tandem ) {
  }

  /**
   * Handles a particle collision with the collector.
   * Called when a particle intersects the collector x position.
   */
  public particleCollisions( _particle: Particle ): void {

    //TODO implement collector collision behavior
  }

  /**
   * Returns true when the electron has reached or crossed the collector x position.
   */
  public isHitByElectron( electron: Electron ): boolean {
    return electron.position.x >= this.x;
  }
}