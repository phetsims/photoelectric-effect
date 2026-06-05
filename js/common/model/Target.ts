// Copyright 2026, University of Colorado Boulder

/**
 * Model for the target plate that emits electrons when struck by photons.
 * Owns target-specific properties like work function, material choice, and
 * collision handling.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import Electron, { type ElectronStateObject } from './Electron.js';
import Material, { MaterialType } from './Material.js';
import Photon from './Photon.js';

export type PhotonCollisionOutcome =
  'electronEmitted' |
  'photonEnergyInsufficient' |
  'quantumMechanicallyForbidden';

export const PhotonCollisionOutcomeValues: PhotonCollisionOutcome[] = [
  'electronEmitted',
  'photonEnergyInsufficient',
  'quantumMechanicallyForbidden'
];

export type PhotonCollisionResult = {
  photonEnergy: number;
  bindingEnergy: number | null;
  potentialEnergy: number | null;
  kineticEnergy: number;
  outcome: PhotonCollisionOutcome;
  electron: Electron | null;
};

type PhotonCollisionResultStateObject = {
  photonEnergy: number;
  bindingEnergy: number | null;
  potentialEnergy: number | null;
  kineticEnergy: number;
  outcome: PhotonCollisionOutcome;
  electron: ElectronStateObject | null;
};

export default class Target {

  // Electron emission dispersion angle, in radians.
  private static readonly ELECTRON_DISPERSION_ANGLE = 0;

  // Horizontal offset from the target surface for emitted electrons.
  private static readonly EMISSION_OFFSET = 1;

  /**
   * PhET-iO IOType for photon-target collision metadata.
   */
  public static readonly PhotonCollisionResultIO = new IOType<PhotonCollisionResult, PhotonCollisionResultStateObject>(
    'PhotonCollisionResultIO', {
      valueType: Object,
      stateSchema: {
        photonEnergy: NumberIO,
        bindingEnergy: NullableIO( NumberIO ),
        potentialEnergy: NullableIO( NumberIO ),
        kineticEnergy: NumberIO,
        outcome: StringIO,
        electron: NullableIO( Electron.ElectronIO )
      },
      toStateObject: collisionResult => ( {
        photonEnergy: collisionResult.photonEnergy,
        bindingEnergy: collisionResult.bindingEnergy,
        potentialEnergy: collisionResult.potentialEnergy,
        kineticEnergy: collisionResult.kineticEnergy,
        outcome: collisionResult.outcome,
        electron: collisionResult.electron ? Electron.ElectronIO.toStateObject( collisionResult.electron ) : null
      } ),
      fromStateObject: stateObject => ( {
        photonEnergy: stateObject.photonEnergy,
        bindingEnergy: stateObject.bindingEnergy,
        potentialEnergy: stateObject.potentialEnergy,
        kineticEnergy: stateObject.kineticEnergy,
        outcome: stateObject.outcome,
        electron: stateObject.electron ? Electron.ElectronIO.fromStateObject( stateObject.electron ) : null
      } )
    } );

  /**
   * The active material instance, owns the live workFunctionProperty.
   * Created from the selected materialType.
   */
  public readonly materialProperty: Property<Material>;

  /**
   * Convenience property for the active material's work function.
   */
  public readonly workFunctionProperty: DynamicProperty<number, number, Material>;

  /**
   * Convenience property for the active material's occupied-band depth.
   */
  public readonly bandDepthProperty: DynamicProperty<number, number, Material>;

  /**
   * X position of the target plate center in model coordinates.
   * Used for collision detection with incoming photons and emitted electrons.
   */
  public readonly x: number;

  /**
   * Creates a target plate with a selectable set of materials.
   * @param materials - the full list of materials that can exist on this Target
   * @param tandem
   */
  public constructor(
    public readonly materials: Material[],
    tandem: Tandem
  ) {

    this.materialProperty = new Property( materials[ 0 ], {
      validValues: materials,
      tandem: tandem.createTandem( 'materialProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Currently selected target material',
      phetioValueType: ReferenceIO( Material.MaterialIO )
    } );

    this.workFunctionProperty = new DynamicProperty( this.materialProperty, {
      derive: 'workFunctionProperty'
    } );

    this.bandDepthProperty = new DynamicProperty( this.materialProperty, {
      derive: 'bandDepthProperty'
    } );

    this.x = PhotoelectricEffectConstants.TARGET_X;
  }

  /**
   * Determines whether a photon has reached or crossed the target x position.
   */
  public isHitByPhoton( photon: Photon ): boolean {
    return photon.position.x <= this.x || photon.getPreviousPosition().x <= this.x;
  }

  /**
   * Returns true when an electron has reached or crossed back to the target x position.
   */
  public isHitByElectron( electron: Electron ): boolean {
    return electron.position.x <= this.x || electron.getPreviousPosition().x <= this.x;
  }

  /**
   * Handles a photon-target collision, producing an electron and collision metadata when emission occurs.
   *
   * @param photon
   * @param highestEnergyOnly - When true, use the highest available electron energy for emitted particles, matching
   *   Java "simple-mode" absorption behavior. This does not guarantee emission; the normal quantum-efficiency gate
   *   and accessible-band rejection still apply, so the electron rate remains probabilistic.
   * @param emitAllAbsorbedPhotons - When true, bypass the quantum-efficiency gate and sample only from the portion
   *   of the occupied band that can escape. This guarantees emission for every photon above the work-function
   *   threshold while preserving a continuous emitted-energy distribution.
   */
  public handlePhotonCollision(
    photon: Photon,
    highestEnergyOnly: boolean,
    emitAllAbsorbedPhotons: boolean
  ): PhotonCollisionResult {
    const photonEnergy = photon.getEnergy();
    const workFunction = this.workFunctionProperty.value;

    // TODO: @design If emitAllAbsorbedPhotons and highestEnergyOnly are both true, emitAllAbsorbedPhotons wins.
    //  Discuss whether this should instead be represented as mutually exclusive modes. But if so,
    //  how do we reflect that in the user interface?

    // TODO: @design Are we sure that emitAllAbsorbedPhotons doesnt need to change the model for calculating current?
    //  Now we will have far more electrons than we used to. It will be very easy to create many electrons
    //  but have 0 current.

    // TODO: @design Was emitAllAbsorbedPhotons intended only for the 3rd screen? If so, maybe it should be a
    //  checkbox on screen instead of a simulation preference?

    // The emit-all preference bypasses quantum efficiency so that above-threshold photons always emit.
    // Quantum efficiency rejection: even when a photon has enough energy to eject an electron, only a fraction
    // η of such absorptions actually produces one. The remaining fraction is treated as absorbed-to-heat with
    // no electron emitted.
    if ( !emitAllAbsorbedPhotons && dotRandom.nextDouble() > PhotoelectricEffectConstants.QUANTUM_EFFICIENCY ) {
      return Target.createCollisionResult( photonEnergy, null, 'quantumMechanicallyForbidden', null );
    }

    let bindingEnergy: number | null;
    if ( emitAllAbsorbedPhotons ) {
      bindingEnergy = Material.sampleBindingEnergyForGuaranteedPhotonEmission(
        photonEnergy, workFunction, this.bandDepthProperty.value
      );
    }
    else if ( highestEnergyOnly ) {

      // 1/20 is an empirically determined threshold confirmed chosen by design team. Critically, this only
      // affects the electrons that are created for the experiment view. It does not affect the current calculation.
      // It is intended to match the behavior of "Highest Energy Only" in the Java version. Electrons are emitted
      // with the highest possible energy, but we only show about 5% of them as this represents a small sample of the
      // possible energies.
      bindingEnergy = dotRandom.nextDouble() < 1 / 20 ? workFunction : null;
    }
    else {
      bindingEnergy = Material.sampleBindingEnergy( workFunction, this.bandDepthProperty.value );
    }

    if ( bindingEnergy === null ) {
      return Target.createCollisionResult( photonEnergy, null, 'quantumMechanicallyForbidden', null );
    }

    const kineticEnergy = photonEnergy - bindingEnergy;

    // Non-positive kinetic energy means the photon did not leave an electron with enough energy to escape.
    // Treat it as no-emission before computing speed, which requires positive energy.
    if ( kineticEnergy <= 0 ) {
      return Target.createCollisionResult( photonEnergy, bindingEnergy, 'photonEnergyInsufficient', null );
    }

    const speed = Electron.determineNewElectronSpeed( kineticEnergy );
    let angle = 0;
    if ( Target.ELECTRON_DISPERSION_ANGLE !== 0 ) {
      angle = dotRandom.nextDouble() * Target.ELECTRON_DISPERSION_ANGLE -
              Target.ELECTRON_DISPERSION_ANGLE / 2;
    }

    const velocity = new Vector2( speed * Math.cos( angle ), speed * Math.sin( angle ) );
    const emissionY = this.getPhotonTargetCrossingY( photon );
    const emissionPosition = new Vector2( this.x + Target.EMISSION_OFFSET, emissionY );
    const electron = new Electron( emissionPosition, velocity, new Vector2( 0, 0 ), kineticEnergy );

    return Target.createCollisionResult( photonEnergy, bindingEnergy, 'electronEmitted', electron );
  }

  /**
   * Creates collision metadata for both electron-emitting and no-electron outcomes.
   */
  private static createCollisionResult(
    photonEnergy: number,
    bindingEnergy: number | null,
    outcome: PhotonCollisionOutcome,
    electron: Electron | null
  ): PhotonCollisionResult {
    return {
      photonEnergy: photonEnergy,
      bindingEnergy: bindingEnergy,
      potentialEnergy: bindingEnergy === null ? null : -bindingEnergy,
      kineticEnergy: electron ? electron.energy : 0,
      outcome: outcome,
      electron: electron
    };
  }

  /**
   * Interpolates the y coordinate where the photon crossed the target x position.
   * Falls back to the photon's current y if no clean crossing is detected.
   */
  private getPhotonTargetCrossingY( photon: Photon ): number {
    const currentPosition = photon.position;
    const previousPosition = photon.getPreviousPosition();

    // If the photon crossed the target x this step (moved from right to left across this.x), linearly interpolate
    // to find the y coordinate at the exact crossing point. interpolationFraction is the fraction of the step at
    // which the crossing occurred, ranging from 0 (start of step) to 1 (end of step).
    if ( previousPosition.x > this.x && currentPosition.x <= this.x ) {
      const interpolationFraction = ( this.x - previousPosition.x ) / ( currentPosition.x - previousPosition.x );
      return previousPosition.y + interpolationFraction * ( currentPosition.y - previousPosition.y );
    }
    return currentPosition.y;
  }

  /**
   * Resets the target material selection and custom material state.
   */
  public reset(): void {
    this.materialProperty.reset();

    // Only custom materials are resettable. The standard set cannot change, mystery materials are controlled globally,
    // PhET-iO customizable materials should not be reset and should only be controlled with PhET-iO.
    this.materials.forEach( material => material.materialType === MaterialType.CUSTOM && material.reset() );
  }
}
