// Copyright 2026, University of Colorado Boulder

/**
 * Model for the collector plate that receives emitted electrons.
 * Owns collector-specific behavior like collision handling and current effects.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Electron from './Electron.js';

export default class Collector {

  /**
   * Creates a collector plate at the given x position.
   *
   * @param x - X position of the collector plate center in model coordinates.
   */
  public constructor( public readonly x: number ) {
  }

  /**
   * Returns true when the electron has reached or crossed the collector x position.
   */
  public isHitByElectron( electron: Electron ): boolean {
    return electron.position.x >= this.x;
  }
}