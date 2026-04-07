// Copyright 2026, University of Colorado Boulder

/**
 * Base class for photon energy absorption models.
 * Determines how much energy remains after a photon interacts with the target.
 *
 * @author Marla A. Schulz (PhET Interactive Simulations)
 */

export default abstract class EnergyAbsorptionModel {

  /**
   * Computes the remaining energy after a photon interacts with the material.
   * Implementations encode different material-specific absorption strategies
   * and are used by the model to determine whether an electron is emitted.
   *
   * @param photonEnergy - photon energy in eV
   * @param workFunction - material work function in eV
   * @returns remaining energy in eV; may be negative when emission is not possible
   */
  public abstract energyAfterPhotonCollision( photonEnergy: number, workFunction: number ): number;
}
