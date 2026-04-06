// Copyright 2026, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla A. Schulz
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import Text from '../../../../scenery/js/nodes/Text.js';

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
        createNode: () => new Text( `Material ${i}` )
      };
    } );

    const materialsComboBox = new ComboBox( model.target.materialProperty, comboBoxItems, this, {
      center: this.layoutBounds.center
    } );

    this.addChild( materialsComboBox );

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
