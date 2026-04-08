// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Experiment screen of the photoelectric effect simulation.
 * Currently mirrors the Intro model behavior but keeps a dedicated class for
 * future Experiment-specific state and behavior.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Material from '../../common/model/Material.js';
import { PhotoelectricEffectModelOptions } from '../../common/model/PhotoelectricEffectModel.js';
import IntroModel from '../../intro/model/IntroModel.js';

export default class ExperimentModel extends IntroModel {

  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectModelOptions ) {
    super( mysteryMaterials, providedOptions );
  }
}
