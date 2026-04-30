// Copyright 2026, University of Colorado Boulder

/**
 * PhotonCountModeControl toggles whether the photon source output controls normalized intensity or photon rate.
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

type PhotonCountModeControlOptions = WithRequired<PreferencesControlOptions, 'tandem'>;

export default class PhotonCountModeControl extends PreferencesControl {

  public constructor( providedOptions: PhotonCountModeControlOptions ) {

    const toggleSwitch = new ToggleSwitch( PhotoelectricEffectPreferences.photonCountModeEnabledProperty, false, true, {
      tandem: providedOptions.tandem.createTandem( 'toggleSwitch' ),
      accessibleName: PhotoelectricEffectFluent.preferences.photonCountModeLabelStringProperty
    } );

    super( combineOptions<PreferencesControlOptions>( {
      labelNode: new Text( PhotoelectricEffectFluent.preferences.photonCountModeLabelStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
      descriptionNode: new RichText( PhotoelectricEffectFluent.preferences.photonCountModeDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
      controlNode: toggleSwitch,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions ) );
  }
}
