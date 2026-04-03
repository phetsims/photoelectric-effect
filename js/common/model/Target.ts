// Copyright 2026, University of Colorado Boulder

/**
 * Model for the target plate that emits electrons when struck by photons.
 * Owns target-specific properties like work function, material choice, and
 * collision handling.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Material, { MaterialType } from './Material.js';
import Particle from './Particle.js';

export default class Target {


  /**
   * The active material instance, owns the live workFunctionProperty.
   * Created from the selected materialType.
   */
  public readonly materialProperty: Property<Material>;

  /**
   * Bounds of the target plate in model coordinates.
   * Used for collision detection with incoming photons and emitted electrons.
   */
  public readonly bounds: Bounds2;

  /**
   * @param allMaterials - the full list of materials that can exist on this Target
   * @param tandem
   */
  public constructor(
    private readonly allMaterials: Material[],
    tandem: Tandem
  ) {

    this.materialProperty = new Property( allMaterials[ 0 ], {
      validValues: allMaterials,
      tandem: tandem.createTandem( 'materialProperty' )
    } );

    // TODO: Determine correct model bounds, see #5.
    this.bounds = new Bounds2( 0, 0, 25, 25 );
  }

  /**
   * Handles a particle collision with the target.
   * Called when a particle intersects the target bounds.
   */
  public particleCollisions( _particle: Particle ): void {
    //TODO implement collision behavior
  }

  public reset(): void {
    this.materialProperty.reset();

    // Only custom materials are resettable. The standard set cannot change, mystery materials are controlled globally,
    // PhET-iO customizable materials should not be reset and should only be controlled with PhET-iO.
    this.allMaterials.forEach( material => material.materialType === MaterialType.CUSTOM && material.reset() );
  }
}