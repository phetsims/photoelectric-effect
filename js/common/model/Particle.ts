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

  protected constructor( protected readonly position: Vector2, protected acceleration: Vector2,
  protected velocity: Vector2 ) {

  }

  public step(): void {
    // Update position, acceleration, and velocity.
  }
}