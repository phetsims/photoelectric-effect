// Copyright 2026, University of Colorado Boulder

/**
 * Abstract base class for particles in the photoelectric effect simulation.
 * Provides shared kinematics state (position, velocity, acceleration) and a
 * common stepping interface for derived particle types like electrons and photons.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';

export default abstract class Particle {

  protected previousPosition: Vector2;

  protected constructor( protected position: Vector2, protected velocity: Vector2, protected acceleration: Vector2 ) {
    this.previousPosition = position;
  }

  public getPosition(): Vector2 {
    return this.position;
  }

  public getPreviousPosition(): Vector2 {
    return this.previousPosition;
  }

  public getVelocity(): Vector2 {
    return this.velocity;
  }

  public step( dt: number ): void {
    this.previousPosition = this.position;

    const newVelocity = this.velocity.plus( this.acceleration.timesScalar( dt ) );
    const averageVelocity = this.velocity.plus( newVelocity ).timesScalar( 0.5 );
    this.position = this.position.plus( averageVelocity.timesScalar( dt ) );
    this.velocity = newVelocity;
  }
}