// Copyright 2026, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla A. Schulz
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import photoelectricEffect from '../../photoelectricEffect.js';
import PhotoelectricEffectModel from '../model/PhotoelectricEffectModel.js';

type SelfOptions = {
 //TODO add options that are specific to PhotoelectricEffectScreenView here
};

type PhotoelectricEffectScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class PhotoelectricEffectScreenView extends ScreenView {

  public constructor( model: PhotoelectricEffectModel, providedOptions: PhotoelectricEffectScreenViewOptions ) {

    const options = optionize<PhotoelectricEffectScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( options );

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

photoelectricEffect.register( 'PhotoelectricEffectScreenView', PhotoelectricEffectScreenView );