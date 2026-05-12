// Copyright 2026, University of Colorado Boulder

/**
 * AccordionBox for the energy graph. Contains the active graph display and display mode controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import Node, { type NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import EnergyGraphData, { EnergyGraphSampleState } from '../model/EnergyGraphData.js';
import type EnergyModel from '../model/EnergyModel.js';
import EnergyBarGraphNode from './EnergyBarGraphNode.js';
import EnergyDiagramControlsNode from './EnergyDiagramControlsNode.js';
import EnergyDiagramNode from './EnergyDiagramNode.js';
import EnergyGraphDisplayModeRadioButtonGroup from './EnergyGraphDisplayModeRadioButtonGroup.js';
import EnergyGraphLegendNode from './EnergyGraphLegendNode.js';

type SelfOptions = EmptySelfOptions;

export type EnergyGraphAccordionBoxOptions =
  SelfOptions & NodeTranslationOptions & PickRequired<AccordionBoxOptions, 'tandem'>;

// Vertical spacing between the plot and display mode controls.
const GRAPH_SECTION_SPACING = 8;

// Horizontal spacing between graph-specific controls and display mode controls.
const BOTTOM_CONTROLS_SPACING = 24;

// Random sample data range, in eV. These values match the fixed graph range used by the Energy graph views.
const MIN_POTENTIAL_ENERGY = -8;
const MAX_PHOTON_ENERGY = 7;

export default class EnergyGraphAccordionBox extends AccordionBox {

  public constructor( model: EnergyModel, providedOptions: EnergyGraphAccordionBoxOptions ) {

    const options = optionize<EnergyGraphAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      isDisposable: false,
      buttonXMargin: 10,
      buttonYMargin: 10,
      contentXMargin: 10,
      contentYMargin: 10,
      fill: PhotoelectricEffectColors.screenBackgroundColorProperty,

      titleNode: new Text( PhotoelectricEffectFluent.screen.energyStringProperty, {
        font: PhotoelectricEffectConstants.PANEL_TITLE_FONT
      } )
    }, providedOptions );

    const displayProperties = model.energyGraphDisplayProperties;

    const barGraphVisibleProperty = new DerivedProperty(
      [ displayProperties.displayModeProperty ],
      displayMode => displayMode === 'barGraph'
    );

    const energyDiagramVisibleProperty = new DerivedProperty(
      [ displayProperties.displayModeProperty ],
      displayMode => displayMode === 'energyDiagram'
    );

    const barGraphNode = new EnergyBarGraphNode( model.target.workFunctionProperty, {
      visibleProperty: barGraphVisibleProperty
    } );

    const energyDiagramNode = new EnergyDiagramNode(
      model.target.workFunctionProperty,
      displayProperties.diagramLabelsVisibleProperty,
      displayProperties.diagramWorkFunctionVisibleProperty,
      {
        visibleProperty: energyDiagramVisibleProperty
      } );

    barGraphNode.left = energyDiagramNode.left;

    const displayModeRadioButtonGroup = new EnergyGraphDisplayModeRadioButtonGroup(
      displayProperties.displayModeProperty, {
        tandem: options.tandem.createTandem( 'displayModeRadioButtonGroup' )
      } );

    const graphDisplayNode = new Node( {
      children: [
        barGraphNode,
        energyDiagramNode
      ]
    } );

    const barGraphControlsNode = new EnergyGraphLegendNode( {
      visibleProperty: barGraphVisibleProperty
    } );

    const energyDiagramControlsNode = new EnergyDiagramControlsNode(
      displayProperties.diagramLabelsVisibleProperty,
      displayProperties.diagramWorkFunctionVisibleProperty, {
        visibleProperty: energyDiagramVisibleProperty,
        tandem: options.tandem.createTandem( 'energyDiagramControlsNode' )
      } );

    const graphSpecificControlsNode = new Node( {
      children: [
        barGraphControlsNode,
        energyDiagramControlsNode
      ]
    } );
    energyDiagramControlsNode.center = barGraphControlsNode.center;

    const syncGraphDisplays = () => {
      for ( let sampleIndex = 0; sampleIndex < EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES; sampleIndex++ ) {
        const sampleState = model.energyGraphData.getSampleState( sampleIndex );

        barGraphNode.setSampleData( sampleIndex, sampleState );
        energyDiagramNode.setSampleData( sampleIndex, sampleState );
      }
    };
    model.energyGraphData.dataChangedEmitter.addListener( syncGraphDisplays );
    syncGraphDisplays();

    const bottomControlsNode = new HBox( {
      align: 'center',
      spacing: BOTTOM_CONTROLS_SPACING,
      children: [
        graphSpecificControlsNode,
        displayModeRadioButtonGroup
      ]
    } );

    const graphControlsNode = new VBox( {
      align: 'center',
      spacing: GRAPH_SECTION_SPACING,
      children: [
        graphDisplayNode,
        bottomControlsNode
      ]
    } );

    super( graphControlsNode, options );

    // TODO: Just for debugging until the model produces energy from events.
    KeyboardListener.createGlobal( this, {
      keys: [ 'r' ],
      overlapBehavior: 'allow',
      fire: () => {
        model.energyGraphData.setSampleStates(
          _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, () => EnergyGraphAccordionBox.createRandomSampleState() )
        );
      }
    } );
  }

  /**
   * Creates temporary randomized sample data for graph development.
   */
  private static createRandomSampleState(): EnergyGraphSampleState {
    const potentialEnergy = MIN_POTENTIAL_ENERGY * dotRandom.nextDouble();
    const photonEnergy = MAX_PHOTON_ENERGY * dotRandom.nextDouble();

    return {
      potentialEnergy: potentialEnergy,
      photonEnergy: photonEnergy,
      kineticEnergy: Math.max( 0, potentialEnergy + photonEnergy )
    };
  }
}
