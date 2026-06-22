// Copyright 2026, University of Colorado Boulder

/**
 * MysteryMaterialPreferencesControls groups the mystery material toggle and work function controls.
 * It extends VBox so a full mystery material section can be added to preferences content as a single child.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import type TProperty from '../../../../axon/js/TProperty.js';
import PreferencesControl, { PreferencesControlOptions } from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ToggleSwitch, { ToggleSwitchOptions } from '../../../../sun/js/ToggleSwitch.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import Material from '../model/Material.js';

export default class MysteryMaterialPreferencesControls extends VBox {

  /**
   * @param enabledProperty - Whether mystery material controls should be enabled.
   * @param workFunctionProperty - The mystery material work function, in eV.
   * @param labelStringProperty - Localized label for the mystery material toggle control.
   * @param tandem - Tandem for instrumenting this grouped preferences control.
   */
  public constructor(
    enabledProperty: Property<boolean>,
    workFunctionProperty: NumberProperty,
    labelStringProperty: TProperty<string>,
    tandem: Tandem
  ) {

    // The toggle switch to enable/disable the material.
    const mysteryMaterialControlTandem = tandem.createTandem( 'mysteryMaterialControl' );
    const toggleSwitch = new ToggleSwitch(
      enabledProperty,
      false,
      true,
      combineOptions<ToggleSwitchOptions>(
        {},
        {
          tandem: mysteryMaterialControlTandem.createTandem( 'toggleSwitch' ),
          accessibleName: labelStringProperty
        },
        PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS
      )
    );

    const mysteryMaterialControl = new PreferencesControl( combineOptions<PreferencesControlOptions>( {
      labelNode: new Text( labelStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
      descriptionNode: new RichText(
        PhotoelectricEffectFluent.preferences.mysteryMaterial.descriptionStringProperty,
        PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS
      ),
      controlNode: toggleSwitch,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, {
      tandem: mysteryMaterialControlTandem
    } ) );

    // The work function control.
    const mysteryMaterialWorkFunctionControlTandem = tandem.createTandem( 'mysteryMaterialWorkFunctionControl' );
    const numberControl = new NumberControl( '', workFunctionProperty, Material.WORK_FUNCTION_RANGE, {
      delta: 0.1,
      numberDisplayOptions: {
        decimalPlaces: 1
      },
      tandem: mysteryMaterialWorkFunctionControlTandem.createTandem( 'numberControl' )
    } );

    const mysteryMaterialWorkFunctionControl = new PreferencesControl( combineOptions<PreferencesControlOptions>( {
      labelNode: new Text(
        PhotoelectricEffectFluent.preferences.mysteryMaterial.labelStringProperty,
        PreferencesDialogConstants.CONTROL_LABEL_OPTIONS
      ),
      descriptionNode: new RichText(
        PhotoelectricEffectFluent.preferences.mysteryMaterial.descriptionStringProperty,
        PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS
      ),
      controlNode: numberControl,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, {
      tandem: mysteryMaterialWorkFunctionControlTandem,
      visibleProperty: enabledProperty
    } ) );

    super( {
      children: [ mysteryMaterialControl, mysteryMaterialWorkFunctionControl ],
      spacing: 10,
      excludeInvisibleChildrenFromBounds: false
    } );
  }
}
