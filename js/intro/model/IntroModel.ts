// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Intro screen of the photoelectric effect simulation.
 * Extends the shared photoelectric effect model with accessories like the
 * collector plate, ammeter, and battery.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Material from '../../common/model/Material.js';
import PhotoelectricEffectModel, { PhotoelectricEffectModelOptions } from '../../common/model/PhotoelectricEffectModel.js';

export type IntroScene = 'grounded' | 'circuit';

export default class IntroModel extends PhotoelectricEffectModel {

  // Which Intro representation is active: simple grounded plate vs full circuit view.
  public readonly sceneProperty: StringUnionProperty<IntroScene>;

  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectModelOptions ) {
    super( mysteryMaterials, providedOptions );

    this.sceneProperty = new StringUnionProperty( 'grounded', {
      validValues: [ 'grounded', 'circuit' ],
      tandem: providedOptions.tandem.createTandem( 'sceneProperty' )
    } );
  }

  /**
   * Resets Intro-specific state in addition to the shared photoelectric effect model.
   */
  public override reset(): void {
    super.reset();

    this.sceneProperty.reset();
  }
}