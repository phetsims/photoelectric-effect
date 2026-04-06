// Copyright 2026, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla A. Schulz
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import Material, { MaterialType } from '../../common/model/Material.js';
import PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

type SelfOptions = {
 //TODO add options that are specific to PhotoelectricEffectScreenView here
};

type PhotoelectricEffectScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class IntroScreenView extends ScreenView {

  public constructor( model: PhotoelectricEffectModel, providedOptions: PhotoelectricEffectScreenViewOptions ) {

    const options = optionize<PhotoelectricEffectScreenViewOptions, SelfOptions, ScreenViewOptions>()( {
    }, providedOptions );

    super( options );

    // TODO: Toggle comboBox item visibility based on PhotoelectricEffectPreferences.mysteryMaterialEnabledProperty, see https://github.com/phetsims/photoelectric-effect/issues/5
    const comboBoxItems = model.target.materials.map( ( material, i ) => {
      return {
        value: material,
        createNode: () => new Text( `Material ${i}, ${material.materialType}` )
      };
    } );

    const materialsComboBox = new ComboBox( model.target.materialProperty, comboBoxItems, this, {
      center: this.layoutBounds.center
    } );

    this.addChild( materialsComboBox );

    const workFunctionProperty = new DynamicProperty<number, number, Material>( model.target.materialProperty, {
      bidirectional: true,
      derive: 'workFunctionProperty'
    } );
    const customMaterialSelectedProperty = new DerivedProperty( [ model.target.materialProperty ],
      material => material.materialType === MaterialType.CUSTOM );

    const workFunctionControl = new NumberControl(
      PhotoelectricEffectFluent.introScreen.workFunction.labelStringProperty,
      workFunctionProperty,
      new Range( 0, 10 ),
      {
        delta: 0.1,
        numberDisplayOptions: {
          decimalPlaces: 1
        },
        visibleProperty: customMaterialSelectedProperty,
        tandem: options.tandem.createTandem( 'workFunctionControl' )
      }
    );
    workFunctionControl.centerX = materialsComboBox.centerX;
    workFunctionControl.top = materialsComboBox.bottom + 20;
    this.addChild( workFunctionControl );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //TODO
  }
}
