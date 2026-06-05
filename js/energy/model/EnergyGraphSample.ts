// Copyright 2026, University of Colorado Boulder

/**
 * One persistent sample slot for the Energy screen graph displays.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { type PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';

type SelfOptions = EmptySelfOptions;
type EnergyGraphSampleOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

/**
 * Holds the energy values for one recorded electron event. The slot remains stable for the lifetime of the model,
 * while its Properties change as events are matched with graph entries or cleared.
 */
export default class EnergyGraphSample extends PhetioObject {

  // Whether this sample slot currently contains an event to render.
  public readonly hasDataProperty: Property<boolean>;

  // Energy before photon absorption, in eV.
  public readonly potentialEnergyProperty: Property<number>;

  // Energy delivered by the photon, in eV.
  public readonly photonEnergyProperty: Property<number>;

  // Emitted electron kinetic energy, in eV.
  public readonly kineticEnergyProperty: Property<number>;

  // Whether this sample produced an emitted electron.
  public readonly electronEmittedProperty: Property<boolean>;

  public constructor( providedOptions: EnergyGraphSampleOptions ) {

    const options = optionize<EnergyGraphSampleOptions, SelfOptions, PhetioObjectOptions>()( {

      // This is intended to be persistent - the sample is created once and updated to drive the diagrams.
      isDisposable: false,

      // Child Properties own serialized state for this persistent sample slot.
      phetioState: false
    }, providedOptions );

    super( options );

    this.hasDataProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'hasDataProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Whether this Energy screen graph sample slot currently contains recorded event data'
    } );

    this.potentialEnergyProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'potentialEnergyProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'Potential energy for this Energy screen graph sample, in electron volts'
    } );

    this.photonEnergyProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'photonEnergyProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'Photon energy for this Energy screen graph sample, in electron volts'
    } );

    this.kineticEnergyProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'kineticEnergyProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true,
      phetioDocumentation: 'Kinetic energy for this Energy screen graph sample, in electron volts'
    } );

    this.electronEmittedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'electronEmittedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Whether this Energy screen graph sample produced an emitted electron'
    } );
  }

  /**
   * Records energy values for this sample slot.
   */
  public setData(
    potentialEnergy: number,
    photonEnergy: number,
    kineticEnergy: number,
    electronEmitted: boolean
  ): void {
    this.potentialEnergyProperty.value = potentialEnergy;
    this.photonEnergyProperty.value = photonEnergy;
    this.kineticEnergyProperty.value = kineticEnergy;
    this.electronEmittedProperty.value = electronEmitted;
    this.hasDataProperty.value = true;
  }

  /**
   * Clears this sample slot and resets stored energy values.
   */
  public clear(): void {
    this.hasDataProperty.value = false;
    this.potentialEnergyProperty.reset();
    this.photonEnergyProperty.reset();
    this.kineticEnergyProperty.reset();
    this.electronEmittedProperty.reset();
  }
}
