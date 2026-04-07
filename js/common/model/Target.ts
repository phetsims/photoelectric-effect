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
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { lineSegmentIntersection } from '../../../../dot/js/util/lineSegmentIntersection.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Electron from './Electron.js';
import EnergyAbsorptionModel from './EnergyAbsorptionModel.js';
import InitialElectronSpeedModel, { RandomizedElectronSpeedModel, UniformElectronSpeedModel } from './InitialElectronSpeedModel.js';
import Material, { MaterialType } from './Material.js';
import MetalEnergyAbsorptionModel from './MetalEnergyAbsorptionModel.js';
import Particle from './Particle.js';
import PhotoelectricEffectModelConfig from './PhotoelectricEffectModelConfig.js';
import PhotoelectricEffectModelConstants from './PhotoelectricEffectModelConstants.js';
import Photon from './Photon.js';

export default class Target {

  private static readonly ELECTRON_DISPERSION_ANGLE = 0;
  private static readonly EMISSION_OFFSET = 1;
  private static readonly EMISSION_VERTICAL_RANGE = 1;

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
   * Bounds of the target plate in model coordinates.
   * Used for collision detection with incoming photons and emitted electrons.
   */
  public readonly bounds: Bounds2;

  /**
   * Energy absorption model for how photons interact with the target.
   */
  public readonly energyAbsorptionModel: EnergyAbsorptionModel;

  private initialElectronSpeedModel: InitialElectronSpeedModel;

  /**
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
      phetioValueType: Material.MaterialIO
    } );

    this.workFunctionProperty = new DynamicProperty( this.materialProperty, {
      derive: 'workFunctionProperty'
    } );

    this.bounds = PhotoelectricEffectModelConfig.TARGET_BOUNDS;

    this.energyAbsorptionModel = new MetalEnergyAbsorptionModel();
    this.initialElectronSpeedModel = new UniformElectronSpeedModel(
      PhotoelectricEffectModelConstants.ELECTRON_SPEED_SCALE_FACTOR
    );
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
   * Determines whether a photon intersects the target bounds.
   */
  public isHitByPhoton( photon: Photon ): boolean {
    return this.bounds.containsPoint( photon.getPosition() ) ||
           this.bounds.containsPoint( photon.getPreviousPosition() );
  }

  /**
   * Returns true when an electron intersects the target bounds.
   */
  public isHitByElectron( electron: Electron ): boolean {
    return this.bounds.containsPoint( electron.getPosition() ) ||
           this.bounds.containsPoint( electron.getPreviousPosition() );
  }

  /**
   * Produces an electron if the photon has enough energy.
   */
  public handlePhotonCollision( photon: Photon ): Electron | null {
    const photonEnergy = photon.getEnergy();
    const workFunction = this.workFunctionProperty.value;
    const energyAfterCollision = this.energyAbsorptionModel.energyAfterPhotonCollision( photonEnergy, workFunction );

    let electron: Electron | null = null;
    if ( energyAfterCollision > 0 ) {
      const speed = this.initialElectronSpeedModel.determineNewElectronSpeed( energyAfterCollision );
      let angle = 0;
      if ( Target.ELECTRON_DISPERSION_ANGLE !== 0 ) {
        angle = dotRandom.nextDouble() * Target.ELECTRON_DISPERSION_ANGLE -
                Target.ELECTRON_DISPERSION_ANGLE / 2;
      }

      const velocity = new Vector2( speed * Math.cos( angle ), speed * Math.sin( angle ) );
      const photonPosition = photon.getPosition();
      const photonPreviousPosition = photon.getPreviousPosition();
      const minX = this.bounds.minX;
      const maxX = this.bounds.maxX;
      const minY = this.bounds.minY;
      const maxY = this.bounds.maxY;
      const intersections = [
        lineSegmentIntersection( photonPreviousPosition.x, photonPreviousPosition.y, photonPosition.x, photonPosition.y,
          minX, minY, maxX, minY ),
        lineSegmentIntersection( photonPreviousPosition.x, photonPreviousPosition.y, photonPosition.x, photonPosition.y,
          maxX, minY, maxX, maxY ),
        lineSegmentIntersection( photonPreviousPosition.x, photonPreviousPosition.y, photonPosition.x, photonPosition.y,
          maxX, maxY, minX, maxY ),
        lineSegmentIntersection( photonPreviousPosition.x, photonPreviousPosition.y, photonPosition.x, photonPosition.y,
          minX, maxY, minX, minY )
      ].filter( intersection => intersection !== null ) as Vector2[];

      let emissionPoint: Vector2 | null = null;
      if ( intersections.length > 0 ) {
        emissionPoint = intersections[ 0 ];
      }

      let emissionY = this.bounds.getCenterY();
      if ( emissionPoint ) {
        emissionY = emissionPoint.y;
      }
      else if ( Target.EMISSION_VERTICAL_RANGE !== 0 ) {
        emissionY = this.bounds.minY +
                    dotRandom.nextDouble() * this.bounds.height * Target.EMISSION_VERTICAL_RANGE;
      }

      const emissionX = emissionPoint ? emissionPoint.x + Target.EMISSION_OFFSET : this.bounds.maxX + Target.EMISSION_OFFSET;
      const emissionPosition = new Vector2( emissionX, emissionY );
      electron = new Electron( emissionPosition, velocity, new Vector2( 0, 0 ), energyAfterCollision );
    }

    return electron;
  }

  public setUniformInitialElectronSpeedModel(): void {
    this.initialElectronSpeedModel = new UniformElectronSpeedModel(
      PhotoelectricEffectModelConstants.ELECTRON_SPEED_SCALE_FACTOR
    );
  }

  public setRandomizedInitialElectronSpeedModel(): void {
    this.initialElectronSpeedModel = new RandomizedElectronSpeedModel(
      PhotoelectricEffectModelConstants.ELECTRON_SPEED_SCALE_FACTOR,
      PhotoelectricEffectModelConstants.MINIMUM_ELECTRON_SPEED
    );
  }

  public reset(): void {
    this.materialProperty.reset();

    // Only custom materials are resettable. The standard set cannot change, mystery materials are controlled globally,
    // PhET-iO customizable materials should not be reset and should only be controlled with PhET-iO.
    this.materials.forEach( material => material.materialType === MaterialType.CUSTOM && material.reset() );
  }
}