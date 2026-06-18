// Copyright 2026, University of Colorado Boulder

/**
 * State for the Energy screen's recorded graph samples.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { type PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import EnergyGraphSample from './EnergyGraphSample.js';

type SelfOptions = EmptySelfOptions;
export type EnergyGraphDataOptions = SelfOptions &
  PickRequired<PhetioObjectOptions, 'tandem'> &
  PickOptional<PhetioObjectOptions, 'phetioDocumentation'>;

/**
 * Owns the fixed set of recorded Energy-screen sample slots.
 * Each slot is a persistent model object with observable Properties for graph rendering and PhET-iO state.
 */
export default class EnergyGraphData extends PhetioObject {

  // Recorded sample slots shown in the bar graph and energy diagram.
  public readonly samples: EnergyGraphSample[];

  // Number of sample plots shown in the Energy graph displays.
  public static readonly NUMBER_OF_ENERGY_GRAPH_SAMPLES = 3;

  public constructor( providedOptions: EnergyGraphDataOptions ) {
    const options = optionize<EnergyGraphDataOptions, SelfOptions, PhetioObjectOptions>()( {
      isDisposable: false,

      // Child sample Properties own serialized state.
      phetioState: false
    }, providedOptions );

    super( options );

    this.samples = _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, sampleIndex => new EnergyGraphSample( {
      tandem: options.tandem.createTandem( `sample${sampleIndex}` )
    } ) );
  }

  /**
   * Records energy values for one sample slot.
   */
  public setSampleData(
    sampleIndex: number,
    bindingEnergy: number,
    photonEnergy: number,
    kineticEnergy: number,
    electronEmitted: boolean
  ): void {
    affirm( sampleIndex >= 0 && sampleIndex < EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES,
      'sampleIndex out of range' );
    this.samples[ sampleIndex ].setData( bindingEnergy, photonEnergy, kineticEnergy, electronEmitted );
  }

  /**
   * Clears all recorded samples.
   */
  public clear(): void {
    this.samples.forEach( sample => sample.clear() );
  }
}
