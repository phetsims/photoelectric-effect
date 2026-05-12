// Copyright 2026, University of Colorado Boulder

/**
 * State for the Energy screen's recorded graph samples.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { type PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import SchemaOrientedIOType from '../../../../tandem/js/types/SchemaOrientedIOType.js';

export type EnergyGraphSampleData = {
  potentialEnergy: number;
  photonEnergy: number;
  kineticEnergy: number;
};

// A recorded sample can have energy data, or no data yet.
export type EnergyGraphSampleState = EnergyGraphSampleData | null;

type SelfOptions = EmptySelfOptions;
export type EnergyGraphDataOptions = SelfOptions &
  PickRequired<PhetioObjectOptions, 'tandem'> &
  PickOptional<PhetioObjectOptions, 'phetioDocumentation'>;

type EnergyGraphDataStateObject = {
  sampleStates: EnergyGraphSampleState[];
};


/**
 * Owns the fixed set of recorded Energy-screen samples and serializes them for PhET-iO state.
 * The graph views observe dataChangedEmitter and redraw from this model state.
 */
export default class EnergyGraphData extends PhetioObject {

  // Recorded samples shown in the bar graph and energy diagram. Null means no sample has been recorded for that slot.
  private sampleStates: EnergyGraphSampleState[];

  // Fires when any sample slot changes, clears, or is restored from PhET-iO state.
  public readonly dataChangedEmitter = new Emitter();

  // Number of sample plots shown in the Energy graph displays.
  public static readonly NUMBER_OF_ENERGY_GRAPH_SAMPLES = 3;

  public constructor( providedOptions: EnergyGraphDataOptions ) {
    const options = optionize<EnergyGraphDataOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: EnergyGraphData.EnergyGraphDataIO,
      phetioState: true
    }, providedOptions );

    super( options );

    this.sampleStates = EnergyGraphData.createEmptySampleStates();
  }

  /**
   * Replaces all recorded samples.
   */
  public setSampleStates( sampleStates: EnergyGraphSampleState[] ): void {
    EnergyGraphData.validateSampleStates( sampleStates );

    this.sampleStates = sampleStates.map( sampleState => EnergyGraphData.copySampleState( sampleState ) );
    this.dataChangedEmitter.emit();
  }

  /**
   * Returns the recorded sample for one slot. Null means there is no sample data yet.
   */
  public getSampleState( sampleIndex: number ): EnergyGraphSampleState {
    this.validateSampleIndex( sampleIndex );

    const sampleState = this.sampleStates[ sampleIndex ];
    return EnergyGraphData.copySampleState( sampleState );
  }

  /**
   * Clears all recorded samples.
   */
  public clear(): void {
    this.sampleStates = EnergyGraphData.createEmptySampleStates();
    this.dataChangedEmitter.emit();
  }

  private validateSampleIndex( sampleIndex: number ): void {
    affirm( sampleIndex >= 0 && sampleIndex < EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES,
      'sampleIndex out of range' );
  }

  private static createEmptySampleStates(): EnergyGraphSampleState[] {
    return _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, () => null );
  }

  /**
   * Returns a defensive copy so outside references cannot mutate recorded samples.
   */
  private static copySampleState( sampleState: EnergyGraphSampleState ): EnergyGraphSampleState {
    return sampleState === null ? null : {
      potentialEnergy: sampleState.potentialEnergy,
      photonEnergy: sampleState.photonEnergy,
      kineticEnergy: sampleState.kineticEnergy
    };
  }

  private static validateSampleStates( sampleStates: EnergyGraphSampleState[] ): void {
    affirm(
      sampleStates.length === EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES,
      `EnergyGraphData state must have ${EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES} sample slots`
    );
  }

  /**
   * Serializes all recorded sample slots for PhET-iO.
   */
  private toStateObject(): EnergyGraphDataStateObject {
    return {
      sampleStates: EnergyGraphData.SAMPLE_STATES_IO.toStateObject( this.sampleStates )
    };
  }

  /**
   * Restores recorded sample slots from PhET-iO state.
   */
  private applyState( stateObject: EnergyGraphDataStateObject ): void {
    this.setSampleStates( EnergyGraphData.SAMPLE_STATES_IO.fromStateObject( stateObject.sampleStates ) );
  }

  private static readonly SAMPLE_DATA_IO = new SchemaOrientedIOType<
    EnergyGraphSampleData,
    {
      potentialEnergy: typeof NumberIO;
      photonEnergy: typeof NumberIO;
      kineticEnergy: typeof NumberIO;
    }
  >( 'EnergyGraphSampleDataIO', {
    stateSchema: {
      potentialEnergy: NumberIO,
      photonEnergy: NumberIO,
      kineticEnergy: NumberIO
    },
    documentation: 'Energy values for one recorded Energy screen graph sample, in electron volts.'
  } );

  private static readonly SAMPLE_STATES_IO = ArrayIO( NullableIO( EnergyGraphData.SAMPLE_DATA_IO ) );

  /**
   * PhET-iO IOType for the Energy screen's recorded graph samples.
   */
  public static readonly EnergyGraphDataIO = new IOType<EnergyGraphData, EnergyGraphDataStateObject>(
    'EnergyGraphDataIO', {
      valueType: EnergyGraphData,
      stateSchema: {
        sampleStates: EnergyGraphData.SAMPLE_STATES_IO
      },
      toStateObject: energyGraphData => energyGraphData.toStateObject(),
      applyState: ( energyGraphData, stateObject ) => energyGraphData.applyState( stateObject )
    } );
}
