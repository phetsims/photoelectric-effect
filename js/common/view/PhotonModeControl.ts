// Copyright 2026, University of Colorado Boulder

/**
 * PhotonModeControl toggles how the photon source output maps to photon emission rate.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
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

type PhotonModeControlOptions = WithRequired<PreferencesControlOptions, 'tandem'>;

export default class PhotonModeControl extends PreferencesControl {

  public constructor( providedOptions: PhotonModeControlOptions ) {

    const toggleSwitch = new ToggleSwitch( PhotoelectricEffectPreferences.photonModeProperty, 'intensity', 'count', {
      tandem: providedOptions.tandem.createTandem( 'toggleSwitch' ),
      accessibleName: PhotoelectricEffectFluent.preferences.photonModeLabelStringProperty
    } );

    super( combineOptions<PreferencesControlOptions>( {
      labelNode: new Text( PhotoelectricEffectFluent.preferences.photonModeLabelStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
      descriptionNode: new RichText( PhotoelectricEffectFluent.preferences.photonModeDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
      controlNode: toggleSwitch,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions ) );
  }
}
