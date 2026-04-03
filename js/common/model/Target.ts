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
  private customMaterial: Material;

  /**
   * Bounds of the target plate in model coordinates.
   * Used for collision detection with incoming photons and emitted electrons.
   */
  public readonly bounds: Bounds2;

  public constructor( tandem: Tandem ) {

    // TODO create an array of all possible materials for this target, to become the validValues.
    this.customMaterial = new Material( MaterialType.CUSTOM );

    this.materialProperty = new Property( new Material( MaterialType.COPPER ) );

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

    // The only material whose workFunction needs to be reset is the custom material.
    // TODO do we want to call reset on customMaterial directly?
    this.customMaterial.workFunctionProperty.reset();
  }
}