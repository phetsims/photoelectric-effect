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
import PhotoelectricEffectMysteryMaterials from '../model/PhotoelectricEffectMysteryMaterials.js';
import MysteryMaterialPreferencesControls from './MysteryMaterialPreferencesControls.js';
import PhotonModeControl from './PhotonModeControl.js';

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

    // TODO: Now that there is only one of these, consider deleting class MysteryMaterialPreferencesControls
    //   and inlining here. But the design of Preferences is still a work in progress so come back to this.
    const mysteryMaterial2Controls = new MysteryMaterialPreferencesControls(
      PhotoelectricEffectMysteryMaterials.PREFERENCES_MYSTERY_MATERIAL_2.enabledProperty,
      PhotoelectricEffectMysteryMaterials.PREFERENCES_MYSTERY_MATERIAL_2.workFunctionProperty,
      PhotoelectricEffectFluent.preferences.mysteryMaterial2LabelStringProperty,
      options.tandem.createTandem( 'mysteryMaterial2Controls' )
    );

    const photonModeControl = new PhotonModeControl( {
      tandem: options.tandem.createTandem( 'photonModeControl' )
    } );

    options.content = [
      photonModeControl,
      mysteryMaterial2Controls
    ];

    super( options );
  }
}
