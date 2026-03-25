// Copyright 2024, University of Colorado Boulder
/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 *
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
