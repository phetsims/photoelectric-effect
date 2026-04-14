// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Intro screen of the photoelectric effect simulation.
 * Extends the shared photoelectric effect model with accessories like the
 * sink plate, ammeter, and battery.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Material from '../../common/model/Material.js';
import PhotoelectricEffectModel, { PhotoelectricEffectModelOptions } from '../../common/model/PhotoelectricEffectModel.js';

export default class IntroModel extends PhotoelectricEffectModel {
  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectModelOptions ) {
    super( mysteryMaterials, providedOptions );
  }
}