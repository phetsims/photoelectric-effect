// Copyright 2026, University of Colorado Boulder

/**
 * Simple absorption model where photon energy must exceed the work function.
 *
 * @author Marla A. Schulz (PhET Interactive Simulations)
 */

import EnergyAbsorptionModel from './EnergyAbsorptionModel.js';

export default class SimpleEnergyAbsorptionModel extends EnergyAbsorptionModel {

  /**
   * Subtracts the work function directly from photon energy.
   * This simple model treats all absorbed energy as the work function.
   */
  public energyAfterPhotonCollision( photonEnergy: number, workFunction: number ): number {
    return photonEnergy - workFunction;
  }
}
