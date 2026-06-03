// Copyright 2026, University of Colorado Boulder

/**
 * ShowPhotonsControl toggles whether the light source emits visible photons.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
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

type ShowPhotonsControlOptions = WithRequired<PreferencesControlOptions, 'tandem'>;

export default class ShowPhotonsControl extends PreferencesControl {

  public constructor( providedOptions: ShowPhotonsControlOptions ) {

    const toggleSwitch = new ToggleSwitch(
      PhotoelectricEffectPreferences.showPhotonsProperty,
      false,
      true,
      combineOptions<ToggleSwitchOptions>(
        {},
        {
          tandem: providedOptions.tandem.createTandem( 'toggleSwitch' ),
          accessibleName: PhotoelectricEffectFluent.preferences.showPhotons.labelStringProperty
        },
        PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS
      )
    );

    super( combineOptions<PreferencesControlOptions>( {
      labelNode: new Text(
        PhotoelectricEffectFluent.preferences.showPhotons.labelStringProperty,
        PreferencesDialogConstants.CONTROL_LABEL_OPTIONS
      ),
      descriptionNode: new RichText(
        PhotoelectricEffectFluent.preferences.showPhotons.descriptionStringProperty,
        PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS
      ),
      controlNode: toggleSwitch,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions ) );
  }
}
