// Copyright 2026, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla A. Schulz
 */

import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import photoelectricEffect from '../../photoelectricEffect.js';

type SelfOptions = {
  //TODO add options that are specific to PhotoelectricEffectModel here
};

type PhotoelectricEffectModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PhotoelectricEffectModel implements TModel {

  public constructor( providedOptions: PhotoelectricEffectModelOptions ) {
    //TODO
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}

photoelectricEffect.register( 'PhotoelectricEffectModel', PhotoelectricEffectModel );