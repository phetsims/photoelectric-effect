// Copyright 2026, University of Colorado Boulder

/**
 * MysteryMaterialControl is a preferences control that toggles the mystery material on and off in the sim.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import PreferencesControl, { PreferencesControlOptions } from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import PhotoelectricEffectPreferences from '../model/PhotoelectricEffectPreferences.js';

type MysteryMaterialControlOptions = WithRequired<PreferencesControlOptions, 'tandem'>;

export default class MysteryMaterialControl extends PreferencesControl {

  public constructor( providedOptions: MysteryMaterialControlOptions ) {

    const toggleSwitch = new ToggleSwitch( PhotoelectricEffectPreferences.mysteryMaterialEnabledProperty, false, true, {
      tandem: providedOptions.tandem.createTandem( 'toggleSwitch' ),
      accessibleName: PhotoelectricEffectFluent.preferences.mysteryMaterialLabelStringProperty
    } );

    super( combineOptions<PreferencesControlOptions>( {
      labelNode: new Text( PhotoelectricEffectFluent.preferences.mysteryMaterialLabelStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
      descriptionNode: new RichText( PhotoelectricEffectFluent.preferences.mysteryMaterialDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
      controlNode: toggleSwitch,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions ) );
  }
}
