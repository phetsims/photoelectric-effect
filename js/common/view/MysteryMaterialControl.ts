// Copyright 2026, University of Colorado Boulder

/**
 * MysteryMaterialControl is a preferences control that toggles the mystery material on and off in the sim.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import PreferencesControl, { PreferencesControlOptions } from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

type MysteryMaterialControlOptions = WithRequired<PreferencesControlOptions, 'tandem'>;

export default class MysteryMaterialControl extends PreferencesControl {

  /**
   * @param enabledProperty - Whether mystery material is enabled in the sim.
   * @param labelStringProperty - Localized label used for the control text and accessible name.
   * @param providedOptions - Preferences control options, with required tandem for instrumentation.
   */
  public constructor(
    enabledProperty: Property<boolean>,
    labelStringProperty: TReadOnlyProperty<string>,
    providedOptions: MysteryMaterialControlOptions
  ) {

    const toggleSwitch = new ToggleSwitch( enabledProperty, false, true, {
      tandem: providedOptions.tandem.createTandem( 'toggleSwitch' ),
      accessibleName: labelStringProperty
    } );

    super( combineOptions<PreferencesControlOptions>( {
      labelNode: new Text( labelStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
      descriptionNode: new RichText( PhotoelectricEffectFluent.preferences.mysteryMaterialDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
      controlNode: toggleSwitch,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions ) );
  }
}
