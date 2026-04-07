// Copyright 2026, University of Colorado Boulder

/**
 * Metal absorption model that distributes electron energy across sub-levels.
 * Mirrors the legacy metal absorption strategy.
 *
 * @author Marla A. Schulz (PhET Interactive Simulations)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import EnergyAbsorptionModel from './EnergyAbsorptionModel.js';

export default class MetalEnergyAbsorptionModel extends EnergyAbsorptionModel {

  // Number of sub-levels used to distribute absorption depth.
  public static readonly NUM_SUB_LEVELS = 20;

  // Total depth, in eV, over which absorption levels are distributed.
  public static readonly TOTAL_ENERGY_DEPTH = 4;

  /**
   * Chooses a random sub-level and subtracts the corresponding energy requirement.
   * This mirrors the legacy model by spreading absorbed energy across discrete levels.
   */
  public energyAfterPhotonCollision( photonEnergy: number, workFunction: number ): number {
    const level = dotRandom.nextInt( MetalEnergyAbsorptionModel.NUM_SUB_LEVELS );
    const energyRequired = workFunction + ( level * ( MetalEnergyAbsorptionModel.TOTAL_ENERGY_DEPTH /
                                                     MetalEnergyAbsorptionModel.NUM_SUB_LEVELS ) );
    return photonEnergy - energyRequired;
  }
}
