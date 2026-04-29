// Copyright 2026, University of Colorado Boulder

/**
 * Model for an emitted electron in the photoelectric effect simulation.
 * Extends Particle with energy and supports acceleration updates during motion.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import Particle, { type ParticleStateObject } from './Particle.js';

export type ElectronStateObject = {
  energy: number;
} & ParticleStateObject;

export default class Electron extends Particle {

  /**
   * Creates an electron with initial kinematics and energy.
   *
   * @param position - Initial position in model coordinates.
   * @param velocity - Initial velocity in model coordinates.
   * @param acceleration - Initial acceleration in model coordinates.
   * @param energy - Energy of the electron in model units.
   * @param previousPosition - Particle position from the previous step. This is optional for normal runtime
   *                           construction and mainly provided so PhET-iO state restore preserves collision behavior
   *                           that depends on prior-step position.
   */
  public constructor(
    position: Vector2,
    velocity: Vector2,
    acceleration: Vector2,
    public readonly energy: number,
    previousPosition?: Vector2
  ) {
    super( position, velocity, acceleration, previousPosition );
  }

  /**
   * Updates the electron acceleration for subsequent motion updates.
   */
  public setAcceleration( acceleration: Vector2 ): void {
    this.acceleration = acceleration;
  }

  /**
   * Computes the electron speed from kinetic energy using a uniform mapping.
   * Uses the analytic kinetic-energy relationship and then applies a scale factor
   * so the resulting speed matches the tuned legacy behavior.
   */
  public static determineNewElectronSpeed( energy: number ): number {
    const scaleFactor = PhotoelectricEffectConstants.ELECTRON_SPEED_SCALE_FACTOR;
    return Math.sqrt( 2 * energy / PhotoelectricEffectConstants.ELECTRON_MASS ) * scaleFactor;
  }

  protected override toStateObject(): ElectronStateObject {
    return Object.assign( super.toStateObject(), {
      energy: this.energy
    } );
  }

  protected static fromStateObject( stateObject: ElectronStateObject ): Electron {
    const kinematics = Particle.kinematicsFromStateObject( stateObject );
    return new Electron(
      kinematics.position,
      kinematics.velocity,
      kinematics.acceleration,
      stateObject.energy,
      kinematics.previousPosition
    );
  }

  private static readonly ELECTRON_STATE_SCHEMA = Object.assign( {}, Particle.PARTICLE_STATE_SCHEMA, {
    energy: NumberIO
  } );

  public static readonly ElectronIO = new IOType<Electron, ElectronStateObject>( 'ElectronIO', {
    valueType: Electron,
    stateSchema: Electron.ELECTRON_STATE_SCHEMA,
    toStateObject: electron => electron.toStateObject(),
    fromStateObject: stateObject => Electron.fromStateObject( stateObject )
  } );
}
