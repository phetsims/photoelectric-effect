// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Energy screen of the photoelectric effect simulation.
 * Adds Energy-specific state to the shared photoelectric effect model.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Material from '../../common/model/Material.js';
import { PhotoelectricEffectModelOptions } from '../../common/model/PhotoelectricEffectModel.js';
import IntroModel from '../../intro/model/IntroModel.js';

export type EnergyGraphDisplayMode = 'barGraph' | 'energyDiagram';
const ENERGY_GRAPH_DISPLAY_MODE_VALUES: EnergyGraphDisplayMode[] = [ 'barGraph', 'energyDiagram' ];

export default class EnergyModel extends IntroModel {
  public readonly emitSinglePhotonProperty: BooleanProperty;

  // Which graph display mode is active on the Energy screen.
  public readonly energyGraphDisplayModeProperty: StringUnionProperty<EnergyGraphDisplayMode>;

    // Whether descriptive labels are visible on the energy diagram.
  public readonly energyDiagramLabelsVisibleProperty: BooleanProperty;

  // Whether the work function label is visible on the energy diagram.
  public readonly energyDiagramWorkFunctionVisibleProperty: BooleanProperty;

  public constructor( mysteryMaterials: Material[], providedOptions: WithRequired<PhotoelectricEffectModelOptions, 'tandem'> ) {
    super( mysteryMaterials, providedOptions );

    this.emitSinglePhotonProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'emitSinglePhotonProperty' )
    } );

    this.energyGraphDisplayModeProperty = new StringUnionProperty( 'barGraph', {
      phetioFeatured: true,
      validValues: ENERGY_GRAPH_DISPLAY_MODE_VALUES,
      tandem: providedOptions.tandem.createTandem( 'energyGraphDisplayModeProperty' ),
      phetioDocumentation: 'Currently selected Energy screen graph display mode'
    } );

    this.energyDiagramLabelsVisibleProperty = new BooleanProperty( true, {
      phetioFeatured: true,
      tandem: providedOptions.tandem.createTandem( 'energyDiagramLabelsVisibleProperty' ),
      phetioDocumentation: 'Whether descriptive labels are visible on the Energy screen energy diagram'
    } );

    this.energyDiagramWorkFunctionVisibleProperty = new BooleanProperty( true, {
      phetioFeatured: true,
      tandem: providedOptions.tandem.createTandem( 'energyDiagramWorkFunctionVisibleProperty' ),
      phetioDocumentation: 'Whether the work function label is visible on the Energy screen energy diagram'
    } );
  }

  /**
   * Resets Energy-specific state in addition to the inherited photoelectric effect state.
   */
  public override reset(): void {
    super.reset();

    this.energyGraphDisplayModeProperty.reset();
    this.energyDiagramLabelsVisibleProperty.reset();
    this.energyDiagramWorkFunctionVisibleProperty.reset();
  }
}
