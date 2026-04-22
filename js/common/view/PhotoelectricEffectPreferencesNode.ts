// Copyright 2026, University of Colorado Boulder

/**
 * PhotoelectricEffectPreferencesNode is the set of controls for preferences that appear in the Simulation tab
 * of the Preferences dialog.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PreferencesPanelContentNode, { PreferencesPanelContentNodeOptions } from '../../../../joist/js/preferences/PreferencesPanelContentNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithOptional from '../../../../phet-core/js/types/WithOptional.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import PhotoelectricEffectPreferences from '../model/PhotoelectricEffectPreferences.js';
import MysteryMaterialPreferencesControls from './MysteryMaterialPreferencesControls.js';

type SelfOptions = EmptySelfOptions;

type PhotoelectricEffectPreferencesNodeOptions = SelfOptions &
  StrictOmit<PreferencesPanelContentNodeOptions, 'content'> &
  PickRequired<PreferencesPanelContentNodeOptions, 'tandem'>;

export default class PhotoelectricEffectPreferencesNode extends PreferencesPanelContentNode {

  public constructor( providedOptions: PhotoelectricEffectPreferencesNodeOptions ) {

    // content is required by PreferencesPanelContentNode, but we provide it below, so make it optional here.
    const options = optionize<PhotoelectricEffectPreferencesNodeOptions, SelfOptions, WithOptional<PreferencesPanelContentNodeOptions, 'content'>>()( {
      isDisposable: false,
      fill: 'white'
    }, providedOptions );

    const mysteryMaterial1Controls = new MysteryMaterialPreferencesControls(
      PhotoelectricEffectPreferences.mysteryMaterial1EnabledProperty,
      PhotoelectricEffectPreferences.mysteryMaterial1WorkFunctionProperty,
      PhotoelectricEffectFluent.preferences.mysteryMaterial1LabelStringProperty,
      options.tandem.createTandem( 'mysteryMaterial1Controls' )
    );

    const mysteryMaterial2Controls = new MysteryMaterialPreferencesControls(
      PhotoelectricEffectPreferences.mysteryMaterial2EnabledProperty,
      PhotoelectricEffectPreferences.mysteryMaterial2WorkFunctionProperty,
      PhotoelectricEffectFluent.preferences.mysteryMaterial2LabelStringProperty,
      options.tandem.createTandem( 'mysteryMaterial2Controls' )
    );

    options.content = [
      mysteryMaterial1Controls,
      mysteryMaterial2Controls
    ];

    super( options );
  }
}
