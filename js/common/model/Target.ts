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
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import Electron from './Electron.js';
import Material, { MaterialType } from './Material.js';
import Particle from './Particle.js';
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
      phetioValueType: Material.MaterialIO
    } );

    this.workFunctionProperty = new DynamicProperty( this.materialProperty, {
      derive: 'workFunctionProperty'
    } );

    this.x = PhotoelectricEffectConstants.TARGET_X;
  }

  /**
   * Handles a particle collision with the target.
   * Called when a particle intersects the target bounds.
   */
  public particleCollisions( particle: Particle ): void {
    if ( particle instanceof Photon ) {
      this.handlePhotonCollision( particle );
    }
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
   * @param highestEnergyOnly - When true, uses Java "simple-mode" absorption behavior.
   */
  public handlePhotonCollision( photon: Photon, highestEnergyOnly = false ): Electron | null {
    const photonEnergy = photon.getEnergy();
    const workFunction = this.workFunctionProperty.value;

    let energyAfterCollision = 0;
    if ( highestEnergyOnly ) {

      // Java simple mode emits only when the selected sub-level is the highest-energy band.
      // TODO: See https://github.com/phetsims/photoelectric-effect/issues/33
      // TODO: @design, what is next for this issue?
      energyAfterCollision = dotRandom.nextInt( Material.NUM_SUB_LEVELS ) === 0 ?
                             photonEnergy - workFunction :
                             Number.NEGATIVE_INFINITY;
    }
    else {
      energyAfterCollision = Material.energyAfterPhotonCollision( photonEnergy, workFunction );
    }

    let electron: Electron | null = null;

    // Electrons that do not exceed the minimum electron energy threshold are not emitted, to avoid large numbers of
    // very low energy electrons hanging around the target. These low energy electrons do not have enough velocity
    // to appear as though they are moving and therefore clutter the visual rendering.
    if ( energyAfterCollision > PhotoelectricEffectConstants.MINIMUM_ELECTRON_ENERGY ) {
      const speed = Electron.determineNewElectronSpeed( energyAfterCollision );
      let angle = 0;
      if ( Target.ELECTRON_DISPERSION_ANGLE !== 0 ) {
        angle = dotRandom.nextDouble() * Target.ELECTRON_DISPERSION_ANGLE -
                Target.ELECTRON_DISPERSION_ANGLE / 2;
      }

      const velocity = new Vector2( speed * Math.cos( angle ), speed * Math.sin( angle ) );
      const emissionY = this.getPhotonTargetCrossingY( photon );
      const emissionPosition = new Vector2( this.x + Target.EMISSION_OFFSET, emissionY );
      electron = new Electron( emissionPosition, velocity, new Vector2( 0, 0 ), energyAfterCollision );
    }

    return electron;
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