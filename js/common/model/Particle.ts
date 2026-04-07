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

  /**
   * Current particle position in model coordinates.
   */
  protected position: Vector2;

  /**
   * Current particle velocity in model units per second.
   */
  protected velocity: Vector2;

  /**
   * Current particle acceleration in model units per second squared.
   */
  protected acceleration: Vector2;

  /**
   * Particle position from the previous step.
   */
  protected previousPosition: Vector2;

  /**
   * Creates a particle with initial kinematics.
   */
  protected constructor( position: Vector2, velocity: Vector2, acceleration: Vector2 ) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.previousPosition = position;
  }

  /**
   * Returns the current particle position.
   */
  public getPosition(): Vector2 {
    return this.position;
  }

  /**
   * Returns the previous particle position.
   */
  public getPreviousPosition(): Vector2 {
    return this.previousPosition;
  }

  /**
   * Returns the current particle velocity.
   */
  public getVelocity(): Vector2 {
    return this.velocity;
  }

  /**
   * Advances the particle by one time step using constant acceleration.
   */
  public step( dt: number ): void {
    this.previousPosition = this.position;

    const newVelocity = this.velocity.plus( this.acceleration.timesScalar( dt ) );
    const averageVelocity = this.velocity.plus( newVelocity ).timesScalar( 0.5 );
    this.position = this.position.plus( averageVelocity.timesScalar( dt ) );
    this.velocity = newVelocity;
  }
}