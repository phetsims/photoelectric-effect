// Copyright 2026, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla A. Schulz
 */

import TModel from '../../../../joist/js/TModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
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

  /**
   * @param mysteryMaterials - mystery materials owned by PhotoelectricEffectPreferencesModel and passed down.
   *   One entry for the user-configurable mystery material; additional entries can be added in the future
   *   for PhET-iO clients to manipulate.
   * @param providedOptions
   */
  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectModelOptions ) {

    const options = optionize<PhotoelectricEffectModelOptions, SelfOptions, PhetioObjectOptions>()( {
    }, providedOptions );

    const standardMaterials = [
      new Material( MaterialType.SODIUM, options.tandem ),
      new Material( MaterialType.COPPER, options.tandem ),
      new Material( MaterialType.CALCIUM, options.tandem ),
      new Material( MaterialType.MAGNESIUM, options.tandem ),
      new Material( MaterialType.PLATINUM, options.tandem ),
      new Material( MaterialType.ZINC, options.tandem ),
      new Material( MaterialType.CUSTOM, options.tandem )
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
