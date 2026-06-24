// Copyright 2026, University of Colorado Boulder

/**
 * Properties that control how the Energy screen graph is displayed.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export type EnergyGraphDisplayMode = 'barGraph' | 'energyDiagram';

const ENERGY_GRAPH_DISPLAY_MODE_VALUES: EnergyGraphDisplayMode[] = [ 'barGraph', 'energyDiagram' ];

export default class EnergyGraphDisplayProperties {

  // Which graph display mode is active on the Energy screen.
  public readonly displayModeProperty: StringUnionProperty<EnergyGraphDisplayMode>;

  // Whether descriptive labels are visible on the energy diagram.
  public readonly diagramLabelsVisibleProperty: Property<boolean>;

  // Whether the work function label is visible on the energy diagram.
  public readonly workFunctionVisibleProperty: Property<boolean>;

  // Whether photon energy transfer arrows are visible on the energy diagram.
  public readonly diagramPhotonArrowsVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {
    this.displayModeProperty = new StringUnionProperty( 'barGraph', {
      phetioFeatured: true,
      validValues: ENERGY_GRAPH_DISPLAY_MODE_VALUES,
      tandem: tandem.createTandem( 'displayModeProperty' ),
      phetioDocumentation: 'Currently selected Energy screen graph display mode'
    } );

    this.diagramLabelsVisibleProperty = new BooleanProperty( true, {
      phetioFeatured: true,
      tandem: tandem.createTandem( 'diagramLabelsVisibleProperty' ),
      phetioDocumentation: 'Whether descriptive labels are visible on the Energy screen energy diagram'
    } );

    this.workFunctionVisibleProperty = new BooleanProperty( true, {
      phetioFeatured: true,
      tandem: tandem.createTandem( 'workFunctionVisibleProperty' ),
      phetioDocumentation: 'Whether the work function label is visible on the Energy screen energy diagram'
    } );

    this.diagramPhotonArrowsVisibleProperty = new BooleanProperty( true, {
      phetioFeatured: true,
      tandem: tandem.createTandem( 'diagramPhotonArrowsVisibleProperty' ),
      phetioDocumentation: 'Whether photon energy transfer arrows are visible on the Energy screen energy diagram'
    } );
  }

  /**
   * Resets all graph display Properties.
   */
  public reset(): void {
    this.displayModeProperty.reset();
    this.diagramLabelsVisibleProperty.reset();
    this.workFunctionVisibleProperty.reset();
    this.diagramPhotonArrowsVisibleProperty.reset();
  }

  // Fixed model range for energy graph y-axes. Keeps zero, grid lines, and scaling stable as material changes.
  public static readonly MODEL_Y_RANGE = new Range( -12, 12 );
}
