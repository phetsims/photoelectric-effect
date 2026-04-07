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
import dotRandom from '../../../../dot/js/dotRandom.js';
import { lineSegmentIntersection } from '../../../../dot/js/util/lineSegmentIntersection.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Electron from './Electron.js';
import Material, { MaterialType } from './Material.js';
import Particle from './Particle.js';
import PhotoelectricEffectModelConfig from './PhotoelectricEffectModelConfig.js';
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
   * Bounds of the target plate in model coordinates.
   * Used for collision detection with incoming photons and emitted electrons.
   */
  public readonly bounds: Bounds2;

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
      phetioValueType: Material.MaterialIO
    } );

    this.workFunctionProperty = new DynamicProperty( this.materialProperty, {
      derive: 'workFunctionProperty'
    } );

    this.bounds = PhotoelectricEffectModelConfig.TARGET_BOUNDS;
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
    const intersections = this.getPhotonBoundaryIntersections( photon );
    const photonPosition = photon.getPosition();
    const photonPreviousPosition = photon.getPreviousPosition();
    return intersections.length > 0 ||
           this.bounds.containsPoint( photonPosition ) ||
           this.bounds.containsPoint( photonPreviousPosition );
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
    const energyAfterCollision = Material.energyAfterPhotonCollision( photonEnergy, workFunction );

    let electron: Electron | null = null;
    if ( energyAfterCollision > 0 ) {
      const speed = Electron.determineNewElectronSpeed( energyAfterCollision );
      let angle = 0;
      if ( Target.ELECTRON_DISPERSION_ANGLE !== 0 ) {
        angle = dotRandom.nextDouble() * Target.ELECTRON_DISPERSION_ANGLE -
                Target.ELECTRON_DISPERSION_ANGLE / 2;
      }

      const velocity = new Vector2( speed * Math.cos( angle ), speed * Math.sin( angle ) );
      const intersections = this.getPhotonBoundaryIntersections( photon );

      let emissionPosition: Vector2;
      if ( intersections.length > 0 ) {
        const intersectionPoint = intersections[ 0 ];
        emissionPosition = new Vector2( intersectionPoint.x + Target.EMISSION_OFFSET, intersectionPoint.y );
      }
      else {
        emissionPosition = new Vector2( this.bounds.maxX + Target.EMISSION_OFFSET, this.bounds.minY + dotRandom.nextDouble() * this.bounds.height );
      }

      electron = new Electron( emissionPosition, velocity, new Vector2( 0, 0 ), energyAfterCollision );
    }

    return electron;
  }

  /**
   * Returns the intersection points where a photon path crosses the target bounds.
   */
  private getPhotonBoundaryIntersections( photon: Photon ): Vector2[] {
    const photonPosition = photon.getPosition();
    const photonPreviousPosition = photon.getPreviousPosition();
    const minX = this.bounds.minX;
    const maxX = this.bounds.maxX;
    const minY = this.bounds.minY;
    const maxY = this.bounds.maxY;
    return [
      lineSegmentIntersection( photonPreviousPosition.x, photonPreviousPosition.y, photonPosition.x, photonPosition.y,
        minX, minY, maxX, minY ),
      lineSegmentIntersection( photonPreviousPosition.x, photonPreviousPosition.y, photonPosition.x, photonPosition.y,
        maxX, minY, maxX, maxY ),
      lineSegmentIntersection( photonPreviousPosition.x, photonPreviousPosition.y, photonPosition.x, photonPosition.y,
        maxX, maxY, minX, maxY ),
      lineSegmentIntersection( photonPreviousPosition.x, photonPreviousPosition.y, photonPosition.x, photonPosition.y,
        minX, maxY, minX, minY )
    ].filter( intersection => intersection !== null );
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