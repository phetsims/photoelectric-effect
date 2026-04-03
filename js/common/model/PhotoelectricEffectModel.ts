// Copyright 2026, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla A. Schulz
 */

import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Material, { MaterialType } from './Material.js';
import Target from './Target.js';

type SelfOptions = {
  //TODO add options that are specific to PhotoelectricEffectModel here
};

export type PhotoelectricEffectModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PhotoelectricEffectModel implements TModel {

  // public readonly photons: Photon[];
  // public readonly electrons: Electron[];

  public readonly target: Target;
  // public readonly sink: Sink;
  // public readonly photonSource: PhotonSource;

  // public readonly currentProperty: TReadOnlyProperty<number>;

  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectModelOptions ) {
    const standardMaterials = [
      new Material( MaterialType.SODIUM ),
      new Material( MaterialType.COPPER ),
      new Material( MaterialType.CALCIUM ),
      new Material( MaterialType.MAGNESIUM ),
      new Material( MaterialType.PLATINUM ),
      new Material( MaterialType.ZINC ),
      new Material( MaterialType.CUSTOM )
    ];

    const allMaterials = [
      ...standardMaterials,
      ...mysteryMaterials
    ];

    this.target = new Target( allMaterials, providedOptions.tandem );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.target.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}
