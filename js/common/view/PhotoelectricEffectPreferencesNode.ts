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
import EmitAllAbsorbedPhotonsControl from './EmitAllAbsorbedPhotonsControl.js';
import MysteryMaterialPreferencesControls from './MysteryMaterialPreferencesControls.js';
import PhotonModeControl from './PhotonModeControl.js';
import ShowPhotonsControl from './ShowPhotonsControl.js';

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

    const mysteryMaterialControls = new MysteryMaterialPreferencesControls(
      PhotoelectricEffectMysteryMaterials.PREFERENCES_MYSTERY_MATERIAL_2.enabledProperty,
      PhotoelectricEffectMysteryMaterials.PREFERENCES_MYSTERY_MATERIAL_2.workFunctionProperty,
      PhotoelectricEffectMysteryMaterials.PREFERENCES_MYSTERY_MATERIAL_2.bandDepthProperty,
      PhotoelectricEffectFluent.preferences.mysteryMaterial.labelStringProperty,
      options.tandem.createTandem( 'mysteryMaterialControls' )
    );

    const photonModeControl = new PhotonModeControl( {
      tandem: options.tandem.createTandem( 'photonModeControl' )
    } );

    const emitAllAbsorbedPhotonsControl = new EmitAllAbsorbedPhotonsControl( {
      tandem: options.tandem.createTandem( 'emitAllAbsorbedPhotonsControl' )
    } );

    const showPhotonsControl = new ShowPhotonsControl( {
      tandem: options.tandem.createTandem( 'showPhotonsControl' )
    } );

    options.content = [
      photonModeControl,
      emitAllAbsorbedPhotonsControl,
      showPhotonsControl,
      mysteryMaterialControls
    ];

    super( options );
  }
}
