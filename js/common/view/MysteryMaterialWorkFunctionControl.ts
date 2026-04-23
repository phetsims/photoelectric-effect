// Copyright 2026, University of Colorado Boulder

/**
 * MysteryMaterialWorkFunctionControl is a preferences control that lets the user set the work function
 * of the mystery material via a NumberControl.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PreferencesControl, { PreferencesControlOptions } from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

type MysteryMaterialWorkFunctionControlOptions = WithRequired<PreferencesControlOptions, 'tandem'>;

export default class MysteryMaterialWorkFunctionControl extends PreferencesControl {

  /**
   * @param workFunctionProperty - The mystery material work function, in eV.
   * @param providedOptions - Preferences control options, with required tandem for instrumentation.
   */
  public constructor( workFunctionProperty: NumberProperty, providedOptions: MysteryMaterialWorkFunctionControlOptions ) {

    // TODO: Do we want to add a title?
    const numberControl = new NumberControl( '', workFunctionProperty, workFunctionProperty.range, {
      delta: 0.1,
      numberDisplayOptions: {
        decimalPlaces: 1
      },
      sliderOptions: {
        tandem: providedOptions.tandem.createTandem( 'slider' )
      },
      tandem: providedOptions.tandem.createTandem( 'numberControl' )
    } );

    super( combineOptions<PreferencesControlOptions>( {
      labelNode: new Text( PhotoelectricEffectFluent.preferences.mysteryMaterialWorkFunctionLabelStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
      descriptionNode: new RichText( PhotoelectricEffectFluent.preferences.mysteryMaterialWorkFunctionDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
      controlNode: numberControl,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions ) );
  }
}
