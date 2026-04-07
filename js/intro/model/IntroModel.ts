// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Intro screen of the photoelectric effect simulation.
 * Extends the shared photoelectric effect model with accessories like the
 * sink plate, ammeter, and battery.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Ammeter from '../../common/model/Ammeter.js';
import Battery from '../../common/model/Battery.js';
import Electron from '../../common/model/Electron.js';
import Material from '../../common/model/Material.js';
import PhotoelectricEffectModelConfig from '../../common/model/PhotoelectricEffectModelConfig.js';
import PhotoelectricEffectModel, { PhotoelectricEffectModelOptions } from '../../common/model/PhotoelectricEffectModel.js';
import Sink from '../../common/model/Sink.js';

export default class IntroModel extends PhotoelectricEffectModel {

  /**
   * Collector plate that receives emitted electrons.
   * Used to determine current flow in the intro screen.
   */
  public readonly sink: Sink;

  /**
   * Accessory that measures current through the circuit.
   * Reads current derived from the motion of emitted electrons.
   */
  public readonly ammeter: Ammeter;

  /**
   * Battery that sets the potential difference between plates.
   * Controls the electric field that accelerates or decelerates electrons.
   */
  public readonly battery: Battery;

  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectModelOptions ) {
    super( mysteryMaterials, providedOptions );

    this.sink = new Sink( PhotoelectricEffectModelConfig.SINK_BOUNDS, providedOptions.tandem.createTandem( 'sink' ) );
    this.ammeter = new Ammeter();
    this.battery = new Battery( this.voltageProperty );
  }

  public override reset(): void {
    super.reset();
    this.ammeter.reset();
    this.battery.reset();
  }

  protected override stepMeters( dt: number ): void {
    super.stepMeters( dt );
    this.ammeter.step( dt );
  }

  protected override handleElectronSinkCollision( electron: Electron ): boolean {
    const absorbed = this.sink.isHitByElectron( electron );
    if ( absorbed ) {
      console.log( 'HIT DETECTED!' );
      this.ammeter.recordElectron();
    }
    return absorbed;
  }
}