// Copyright 2026, University of Colorado Boulder

/**
 * PhotonModeControl toggles how the photon source intensity maps to photon emission rate.
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

type PhotonModeControlOptions = WithRequired<PreferencesControlOptions, 'tandem'>;

export default class PhotonModeControl extends PreferencesControl {

  public constructor( providedOptions: PhotonModeControlOptions ) {

    // TODO: Create a subclass for preferences toggle switch in joist? Or factor one
    //  out in this sim? This combineOptions appears twice currently. May not be worth it.
    const toggleSwitch = new ToggleSwitch(
      PhotoelectricEffectPreferences.photonModeProperty,
      'intensity',
      'count', combineOptions<ToggleSwitchOptions>(
        {},
        {
          tandem: providedOptions.tandem.createTandem( 'toggleSwitch' ),
          accessibleName: PhotoelectricEffectFluent.a11y.photonMode.labelStringProperty
        },
        PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS
      )
    );

    super( combineOptions<PreferencesControlOptions>( {
      labelNode: new Text( PhotoelectricEffectFluent.a11y.photonMode.labelStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
      descriptionNode: new RichText( PhotoelectricEffectFluent.a11y.photonMode.descriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
      controlNode: toggleSwitch,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions ) );
  }
}
