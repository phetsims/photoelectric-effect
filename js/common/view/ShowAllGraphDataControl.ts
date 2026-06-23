// Copyright 2026, University of Colorado Boulder

/**
 * ShowAllGraphDataControl toggles whether experiment graphs display every data point.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PreferencesControl, { PreferencesControlOptions } from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ToggleSwitch, { ToggleSwitchOptions } from '../../../../sun/js/ToggleSwitch.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import PhotoelectricEffectPreferences from '../model/PhotoelectricEffectPreferences.js';

type ShowAllGraphDataControlOptions = WithRequired<PreferencesControlOptions, 'tandem'>;

export default class ShowAllGraphDataControl extends PreferencesControl {

  public constructor( providedOptions: ShowAllGraphDataControlOptions ) {

    const toggleSwitch = new ToggleSwitch(
      PhotoelectricEffectPreferences.showAllGraphDataProperty,
      false,
      true,
      combineOptions<ToggleSwitchOptions>(
        {},
        {
          tandem: providedOptions.tandem.createTandem( 'toggleSwitch' ),
          accessibleName: PhotoelectricEffectFluent.preferences.showAllGraphData.labelStringProperty
        },
        PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS
      )
    );

    super( combineOptions<PreferencesControlOptions>( {
      labelNode: new Text(
        PhotoelectricEffectFluent.preferences.showAllGraphData.labelStringProperty,
        PreferencesDialogConstants.CONTROL_LABEL_OPTIONS
      ),
      descriptionNode: new RichText(
        PhotoelectricEffectFluent.preferences.showAllGraphData.descriptionStringProperty,
        PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS
      ),
      controlNode: toggleSwitch,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions ) );
  }
}