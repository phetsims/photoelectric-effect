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
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import Electron from './Electron.js';
import Material, { MaterialType } from './Material.js';
import Photon from './Photon.js';

export default class Target {

  // Electron emission dispersion angle, in radians.
  private static readonly ELECTRON_DISPERSION_ANGLE = 0;

  // Horizontal offset from the target surface for emitted electrons.
  private static readonly EMISSION_OFFSET = 1;

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
   * Convenience property for the active material's occupied-band width.
   */
  public readonly bandWidthProperty: DynamicProperty<number, number, Material>;

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

    this.bandWidthProperty = new DynamicProperty( this.materialProperty, {
      derive: 'bandWidthProperty'
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
   * Produces an electron if the photon has enough energy.
   *
   * @param photon
   * @param highestEnergyOnly - When true, use the highest available electron energy for emitted particles, matching
   *   Java "simple-mode" absorption behavior. This does not guarantee emission; the normal quantum-efficiency gate
   *   and accessible-band rejection still apply, so the electron rate remains probabilistic.
   * @param emitAllAbsorbedPhotons - When true, bypass the quantum-efficiency gate and sample only from the portion
   *   of the occupied band that can escape. This guarantees emission for every photon above the work-function
   *   threshold while preserving a continuous emitted-energy distribution.
   */
  public handlePhotonCollision( photon: Photon, highestEnergyOnly: boolean, emitAllAbsorbedPhotons: boolean ): Electron | null {
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
      return null;
    }

    let energyAfterCollision: number;
    if ( emitAllAbsorbedPhotons ) {
      energyAfterCollision = Material.energyAfterGuaranteedPhotonEmission(
        photonEnergy, workFunction, this.bandWidthProperty.value
      );
    }
    else if ( highestEnergyOnly ) {

      // Eject from the Fermi level only (maximum KE), but use the same accessible band fraction
      // probability as the normal path so the visual electron rate still reflects the bandwidth.
      const bandWidth = this.bandWidthProperty.value;
      const accessibleBandFraction = Math.min( 1, Math.max( 0, ( photonEnergy - workFunction ) / bandWidth ) );
      energyAfterCollision = dotRandom.nextDouble() < accessibleBandFraction ?
                             photonEnergy - workFunction :
                             Number.NEGATIVE_INFINITY;
    }
    else {
      energyAfterCollision = Material.energyAfterPhotonCollision(
        photonEnergy, workFunction, this.bandWidthProperty.value
      );
    }

    // Non-positive kinetic energy means the photon did not leave an electron with enough energy to escape.
    // Treat it as no-emission before computing speed, which requires positive energy.
    if ( energyAfterCollision <= 0 ) {
      return null;
    }

    const speed = Electron.determineNewElectronSpeed( energyAfterCollision );
    let angle = 0;
    if ( Target.ELECTRON_DISPERSION_ANGLE !== 0 ) {
      angle = dotRandom.nextDouble() * Target.ELECTRON_DISPERSION_ANGLE -
              Target.ELECTRON_DISPERSION_ANGLE / 2;
    }

    const velocity = new Vector2( speed * Math.cos( angle ), speed * Math.sin( angle ) );
    const emissionY = this.getPhotonTargetCrossingY( photon );
    const emissionPosition = new Vector2( this.x + Target.EMISSION_OFFSET, emissionY );
    return new Electron( emissionPosition, velocity, new Vector2( 0, 0 ), energyAfterCollision );
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
