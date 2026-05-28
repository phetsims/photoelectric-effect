// Copyright 2026, University of Colorado Boulder

/**
 * EmitAllAbsorbedPhotonsControl toggles whether every above-threshold photon emits an electron.
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
import PhotoelectricEffectPreferences from '../model/PhotoelectricEffectPreferences.js';

type EmitAllAbsorbedPhotonsControlOptions = WithRequired<PreferencesControlOptions, 'tandem'>;

// TODO: @design What should this preference label be?
const PLACEHOLDER_LABEL = 'PLACEHOLDER Emit all absorbed photons';

// TODO: @design What should this preference description be?
const PLACEHOLDER_DESCRIPTION = 'PLACEHOLDER Every photon with enough energy emits an electron ' +
                                'while preserving an energy distribution.';

export default class EmitAllAbsorbedPhotonsControl extends PreferencesControl {

  public constructor( providedOptions: EmitAllAbsorbedPhotonsControlOptions ) {

    const toggleSwitch = new ToggleSwitch(
      PhotoelectricEffectPreferences.emitAllAbsorbedPhotonsProperty,
      false,
      true,
      combineOptions<ToggleSwitchOptions>(
        {},
        {
          tandem: providedOptions.tandem.createTandem( 'toggleSwitch' ),
          accessibleName: PLACEHOLDER_LABEL
        },
        PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS
      )
    );

    super( combineOptions<PreferencesControlOptions>( {
      labelNode: new Text(
        PLACEHOLDER_LABEL,
        PreferencesDialogConstants.CONTROL_LABEL_OPTIONS
      ),
      descriptionNode: new RichText(
        PLACEHOLDER_DESCRIPTION,
        PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS
      ),
      controlNode: toggleSwitch,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions ) );
  }
}
