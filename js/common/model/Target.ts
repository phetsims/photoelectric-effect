// Copyright 2026, University of Colorado Boulder

/**
 * Model for the target plate that emits electrons when struck by photons.
 * Owns target-specific properties like work function, material choice, and
 * collision handling.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Material from './Material.js';
import Particle from './Particle.js';

export default class Target {

  /**
   * Currently selected target material.
   * Used by the UI to select presets and by the model to determine work function.
   */
  public readonly materialProperty: TProperty<Material>;

  /**
   * Bounds of the target plate in model coordinates.
   * Used for collision detection with incoming photons and emitted electrons.
   */
  public readonly bounds: Bounds2;

  public constructor( tandem: Tandem ) {
    this.materialProperty = new EnumerationProperty( Material.COPPER, {
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
}