// Copyright 2026, University of Colorado Boulder

/**
 * Model for a photon emitted by the photon source.
 * Extends Particle with wavelength to determine its energy.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import Particle, { type ParticleStateObject } from './Particle.js';
import { wavelengthToEnergy } from './PhotoelectricEffectUtils.js';

// PhET-iO serialized state for a photon.
export type PhotonStateObject = {
  wavelength: number;
} & ParticleStateObject;

export default class Photon extends Particle {

  // Emitted photons should travel perpendicularly to the photon source's pointing direction.
  // This vector will help define the line that each photon should travel on during it's lifecycle.
  public static readonly TRAVEL_DIRECTION = new Vector2(
    -PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION.y, PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION.x );

  /**
   * Creates a photon with initial kinematics and wavelength.
   *
   * @param position
   * @param velocity
   * @param acceleration
   * @param wavelength - Wavelength of the photon in nanometers.
   * @param previousPosition - Particle position from the previous step. This is optional for normal runtime
   *                           construction and mainly provided so PhET-iO state restore preserves target-crossing
   *                           interpolation behavior on the first step after load.
   */
  public constructor(
    position: Vector2,
    velocity: Vector2,
    acceleration: Vector2,
    public readonly wavelength: number,
    previousPosition?: Vector2
  ) {
    super( position, velocity, acceleration, previousPosition );
  }

  /**
   * Returns the photon energy in electron volts.
   */
  public getEnergy(): number {
    return wavelengthToEnergy( this.wavelength );
  }

  /**
   * Serializes this photon for PhET-iO, including particle kinematics from the superclass and wavelength.
   */
  protected override toStateObject(): PhotonStateObject {
    return Object.assign( super.toStateObject(), {
      wavelength: this.wavelength
    } );
  }

  /**
   * Creates a photon from PhET-iO state.
   */
  protected static fromStateObject( stateObject: PhotonStateObject ): Photon {
    const kinematics = Particle.kinematicsFromStateObject( stateObject );
    return new Photon(
      kinematics.position,
      kinematics.velocity,
      kinematics.acceleration,
      stateObject.wavelength,
      kinematics.previousPosition
    );
  }

  /**
   * PhET-iO state schema.
   */
  private static readonly PHOTON_STATE_SCHEMA = Object.assign( {}, Particle.PARTICLE_STATE_SCHEMA, {
    wavelength: NumberIO
  } );

  /**
   * PhET-iO IOType for an emitted photon.
   */
  public static readonly PhotonIO = new IOType<Photon, PhotonStateObject>( 'PhotonIO', {
    valueType: Photon,
    stateSchema: Photon.PHOTON_STATE_SCHEMA,
    toStateObject: photon => photon.toStateObject(),
    fromStateObject: stateObject => Photon.fromStateObject( stateObject )
  } );
}
