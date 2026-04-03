// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Intro screen of the photoelectric effect simulation.
 * Extends the shared photoelectric effect model with accessories like the
 * sink plate, ammeter, and battery.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Ammeter from '../../common/model/Ammeter.js';
import Battery from '../../common/model/Battery.js';
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

  public constructor( providedOptions: PhotoelectricEffectModelOptions ) {

    // TODO: Provide mystery materials here?
    super( [], providedOptions );

    this.sink = new Sink( Bounds2.NOTHING, providedOptions.tandem.createTandem( 'sink' ) );
    this.ammeter = new Ammeter();
    this.battery = new Battery();
  }
}