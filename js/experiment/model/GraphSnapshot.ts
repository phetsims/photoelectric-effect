// Copyright 2026, University of Colorado Boulder

/**
 * Shared snapshot domain types and reusable model slot for experiment graph history. GraphData owns a fixed number
 * of these slots and rewrites their Property values when users save or restore snapshots.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import Material from '../../common/model/Material.js';

/**
 * Metadata captured with each GraphSnapshot. It is tightly coupled with GraphSnapshot so it seems best to keep here
 * instead of in its own file. These values are represented as Properties so reused view rows can stay linked to one
 * metadata instance while PhET-iO state or user actions update that instance in place.
 */
export class GraphSnapshotMetadata {

  // Material active when this snapshot was saved, used for restoring the exact displayed material label.
  public readonly materialProperty: Property<Material>;

  // Operating conditions captured when this metadata is saved.
  public readonly secondValueProperty: NumberProperty;
  public readonly thirdValueProperty: NumberProperty;

  /**
   * Creates metadata with explicit initial values. These values are required because metadata is part of each serialized
   * snapshot, and callers should make the initial material identity and operating conditions visible at construction.
   *
   * @param material - Material active when this snapshot was saved.
   * @param secondValueLabelProperty
   * @param secondValue - Captured second value.
   * @param formatSecondValue - Formatter for the second value shown in snapshot legends.
   * @param thirdValueLabelProperty
   * @param thirdValue - Captured third value.
   * @param formatThirdValue - Formatter for the third value shown in snapshot legends.
   * @param tandem - Used to instrument the metadata Properties.
   */
  public constructor(
    material: Material,
    public readonly secondValueLabelProperty: TReadOnlyProperty<string>,
    secondValue: number,
    public readonly formatSecondValue: ( value: number ) => string,
    public readonly thirdValueLabelProperty: TReadOnlyProperty<string>,
    thirdValue: number,
    public readonly formatThirdValue: ( value: number ) => string,
    tandem: Tandem
  ) {
    this.materialProperty = new Property<Material>( material, {
      tandem: tandem.createTandem( 'materialProperty' ),
      phetioDocumentation: 'The material that was active when this snapshot was taken. Used to display the ' +
                           'correct material label in snapshot rows.',
      phetioValueType: ReferenceIO( Material.MaterialIO ),
      phetioReadOnly: true
    } );
    this.secondValueProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'secondValueProperty' ),
      phetioDocumentation: 'The experimental parameter captured alongside this snapshot. Represents wavelength ' +
                           '(nm) for intensity-current and voltage-current snapshots, or intensity (%) for ' +
                           'frequency-energy snapshots.',
      phetioReadOnly: true
    } );
    this.thirdValueProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'thirdValueProperty' ),
      phetioDocumentation: 'The experimental parameter captured alongside this snapshot. Represents voltage ' +
                           '(V) for intensity-current and frequency-energy snapshots, or intensity (%) for ' +
                           'voltage-current snapshots.',
      phetioReadOnly: true
    } );

    this.setValues( material, secondValue, thirdValue );
  }

  /**
   * Sets all metadata Properties from captured model values.
   */
  public setValues(
    material: Material,
    secondValue: number,
    thirdValue: number
  ): void {
    this.materialProperty.value = material;
    this.secondValueProperty.value = secondValue;
    this.thirdValueProperty.value = thirdValue;
  }
}

type GraphSnapshotOptions = PickRequired<PhetioObjectOptions, 'tandem'>;

/**
 * Reusable snapshot slot: sampled points plus captured model metadata. Properties are individually instrumented so
 * PhET-iO handles state save and restore automatically.
 */
export default class GraphSnapshot extends PhetioObject {

  // Deep-copied data points captured for this snapshot slot.
  public readonly pointsProperty: Property<ReadonlyArray<Vector2>>;

  // Captured material identity and operating conditions for this snapshot slot.
  public readonly metadata: GraphSnapshotMetadata;

  public constructor( initialMaterial: Material,
                      secondValueLabelProperty: TReadOnlyProperty<string>,
                      formatSecondValue: ( value: number ) => string,
                      thirdValueLabelProperty: TReadOnlyProperty<string>,
                      formatThirdValue: ( value: number ) => string,
                      providedOptions: GraphSnapshotOptions ) {

    const options = optionize<GraphSnapshotOptions, EmptySelfOptions, PhetioObjectOptions>()( {
      phetioState: false,
      isDisposable: false
    }, providedOptions );

    super( options );

    this.pointsProperty = new Property<ReadonlyArray<Vector2>>( [], {
      tandem: options.tandem.createTandem( 'pointsProperty' ),
      phetioValueType: ArrayIO( Vector2.Vector2IO ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.metadata = new GraphSnapshotMetadata( initialMaterial,
      secondValueLabelProperty, 0, formatSecondValue,
      thirdValueLabelProperty, 0, formatThirdValue,
      options.tandem
    );
  }

  /**
   * Captures model values into this reusable slot.
   *
   * @param points - Live graph points to deep copy into this slot.
   * @param materialProperty - Material property to capture for this slot's metadata.
   * @param secondValueProperty - Second value property to capture for this slot's metadata.
   * @param thirdValueProperty - Third value property to capture for this slot's metadata.
   */
  public save( points: ReadonlyArray<Vector2>, materialProperty: TReadOnlyProperty<Material>,
               secondValueProperty: TReadOnlyProperty<number>, thirdValueProperty: TReadOnlyProperty<number> ): void {
    this.pointsProperty.value = points.map( point => new Vector2( point.x, point.y ) );
    this.metadata.setValues(
      materialProperty.value,
      secondValueProperty.value,
      thirdValueProperty.value
    );
  }

  /**
   * Clears large saved data from this slot. Scalar values are left in place because snapshotsCountProperty in GraphData
   * is the source of truth for whether this slot is active.
   */
  public clear(): void {
    this.pointsProperty.value = [];
  }
}
