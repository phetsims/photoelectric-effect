// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Intro screen of the photoelectric effect simulation.
 * Extends the shared photoelectric effect model with Intro-specific representation state.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Material from '../../common/model/Material.js';
import PhotoelectricEffectModel, { PhotoelectricEffectModelOptions } from '../../common/model/PhotoelectricEffectModel.js';

export type IntroRepresentation = 'grounded' | 'circuit';

export default class IntroModel extends PhotoelectricEffectModel {

  // Which Intro representation is active: simple grounded plate vs full circuit view.
  public readonly representationProperty: StringUnionProperty<IntroRepresentation>;

  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectModelOptions ) {
    super( mysteryMaterials, null, providedOptions );

    this.representationProperty = new StringUnionProperty( 'grounded', {
      phetioFeatured: true,
      validValues: [ 'grounded', 'circuit' ],
      tandem: providedOptions.tandem.createTandem( 'representationProperty' ),
      phetioDocumentation: 'Currently selected Intro screen representation'
    } );
  }

  /**
   * Resets Intro-specific state in addition to the shared photoelectric effect model.
   */
  public override reset(): void {
    super.reset();

    this.representationProperty.reset();
  }
}