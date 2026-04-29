// Copyright 2026, University of Colorado Boulder

/**
 * Abstract base class for particles in the photoelectric effect simulation.
 * Provides shared kinematics state (position, velocity, acceleration) and a
 * common stepping interface for derived particle types like electrons and photons.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2, { type Vector2StateObject } from '../../../../dot/js/Vector2.js';

export type ParticleStateObject = {
  position: Vector2StateObject;
  velocity: Vector2StateObject;
  acceleration: Vector2StateObject;
  previousPosition: Vector2StateObject;
};

export default abstract class Particle {

  public static readonly PARTICLE_STATE_SCHEMA = {
    position: Vector2.Vector2IO,
    velocity: Vector2.Vector2IO,
    acceleration: Vector2.Vector2IO,
    previousPosition: Vector2.Vector2IO
  };

  protected toStateObject(): ParticleStateObject {
    return {
      position: Vector2.Vector2IO.toStateObject( this.position ),
      velocity: Vector2.Vector2IO.toStateObject( this.getVelocity() ),
      acceleration: Vector2.Vector2IO.toStateObject( this.getAcceleration() ),
      previousPosition: Vector2.Vector2IO.toStateObject( this.getPreviousPosition() )
    };
  }

  /**
   * Creates the kinematic values from a state object. Does not create a Particle, but is used in subclasses
   * to prepare values for construction.
   */
  protected static kinematicsFromStateObject( stateObject: ParticleStateObject ): {
    position: Vector2;
    velocity: Vector2;
    acceleration: Vector2;
    previousPosition: Vector2;
  } {
    return {
      position: Vector2.fromStateObject( stateObject.position ),
      velocity: Vector2.fromStateObject( stateObject.velocity ),
      acceleration: Vector2.fromStateObject( stateObject.acceleration ),
      previousPosition: Vector2.fromStateObject( stateObject.previousPosition )
    };
  }

  /**
   * Creates a particle with initial kinematics.
   *
   * @param position - Current particle position in model coordinates.
   * @param velocity - Current particle velocity in model units per second.
   * @param acceleration - Current particle acceleration in model units per second squared.
   * @param previousPosition - Particle position from the previous step. This is optional for normal runtime
   *                           construction and mainly provided so PhET-iO state restore can recreate particles with
   *                           correct crossing/interpolation history on the first step after load.
   */
  protected constructor(
    public position: Vector2,
    protected velocity: Vector2,
    protected acceleration: Vector2,
    protected previousPosition: Vector2 = position
  ) {
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
   * Returns the current particle acceleration.
   */
  public getAcceleration(): Vector2 {
    return this.acceleration;
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