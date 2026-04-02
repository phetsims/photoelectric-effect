// Copyright 2026, University of Colorado Boulder

/**
 * Model for an emitted electron in the photoelectric effect simulation.
 * Extends Particle with energy and supports acceleration updates during motion.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Particle from './Particle.js';

export default class Electron extends Particle {

  public constructor( position: Vector2, velocity: Vector2, acceleration: Vector2, public readonly energy: number ) {
    super( position, velocity, acceleration );
  }

  public setAcceleration( acceleration: Vector2 ): void {
    this.acceleration = acceleration;
  }
}
