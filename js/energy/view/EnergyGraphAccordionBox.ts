// Copyright 2026, University of Colorado Boulder

/**
 * AccordionBox for the energy graph. Contains the active graph display and display mode controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { type NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import type EnergyModel from '../model/EnergyModel.js';
import EnergyBarGraphNode from './barGraph/EnergyBarGraphNode.js';
import EnergyDiagramControlsNode from './energyDiagram/EnergyDiagramControlsNode.js';
import EnergyDiagramNode from './energyDiagram/EnergyDiagramNode.js';
import EnergyGraphDisplayModeRadioButtonGroup from './EnergyGraphDisplayModeRadioButtonGroup.js';
import EnergyGraphLegendNode from './EnergyGraphLegendNode.js';

type SelfOptions = EmptySelfOptions;

export type EnergyGraphAccordionBoxOptions =
  SelfOptions & NodeTranslationOptions & PickRequired<AccordionBoxOptions, 'tandem'>;

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

    const barGraphVisibleProperty = DerivedProperty.valueEqualsConstant( displayProperties.displayModeProperty, 'barGraph' );
    const energyDiagramVisibleProperty = DerivedProperty.valueEqualsConstant( displayProperties.displayModeProperty, 'energyDiagram' );

    const barGraphNode = new EnergyBarGraphNode( model.energyGraphData.samples, model.target.workFunctionProperty, {
      visibleProperty: barGraphVisibleProperty
    } );

    const energyDiagramNode = new EnergyDiagramNode(
      model.energyGraphData.samples,
      model.target.workFunctionProperty,
      model.target.bandDepthProperty,
      displayProperties.diagramLabelsVisibleProperty,
      displayProperties.diagramWorkFunctionVisibleProperty,
      displayProperties.diagramPhotonArrowsVisibleProperty,
      {
        visibleProperty: energyDiagramVisibleProperty
      } );

    // So that the two share the same center and appear in the same position when switching between them.
    barGraphNode.centerX = energyDiagramNode.centerX;

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

    const barGraphControlsNode = new EnergyGraphLegendNode( [
      [
        {
          fill: PhotoelectricEffectColors.bindingEnergyGraphColorProperty,
          labelStringProperty: PhotoelectricEffectFluent.energy.graph.legend.bindingEnergyStringProperty
        },
        {
          fill: PhotoelectricEffectColors.photonEnergyGraphColorProperty,
          labelStringProperty: PhotoelectricEffectFluent.energy.graph.legend.photonEnergyStringProperty
        }
      ],
      [
        {
          fill: PhotoelectricEffectColors.kineticEnergyGraphColorProperty,
          labelStringProperty: PhotoelectricEffectFluent.energy.graph.legend.kineticEnergyStringProperty
        }
      ]
    ], {
      visibleProperty: barGraphVisibleProperty
    } );

    const energyDiagramLegendNode = new EnergyGraphLegendNode( [
      [
        {
          fill: PhotoelectricEffectColors.emptyStatesEnergyDiagramColorProperty,
          labelStringProperty: PhotoelectricEffectFluent.energy.graph.legend.emptyStatesStringProperty
        },
        {
          fill: PhotoelectricEffectColors.electronColorProperty,
          labelStringProperty: PhotoelectricEffectFluent.energy.graph.legend.filledStatesStringProperty
        }
      ]
    ] );

    const energyDiagramControlsNode = new EnergyDiagramControlsNode(
      displayProperties.diagramLabelsVisibleProperty,
      displayProperties.diagramWorkFunctionVisibleProperty,
      displayProperties.diagramPhotonArrowsVisibleProperty, {
        layoutOptions: {
          leftMargin: 6
        },
        tandem: options.tandem.createTandem( 'energyDiagramControlsNode' )
      } );

    const energyDiagramDecorationNode = new VBox( {
      align: 'left',
      spacing: 16,
      children: [
        energyDiagramLegendNode,
        energyDiagramControlsNode
      ],
      visibleProperty: energyDiagramVisibleProperty
    } );

    const graphSpecificControlsNode = new Node( {
      children: [
        barGraphControlsNode,
        energyDiagramDecorationNode
      ]
    } );
    energyDiagramDecorationNode.leftTop = barGraphControlsNode.leftTop;

    const graphDisplayControlsNode = new Node( {
      children: [
        graphSpecificControlsNode,
        displayModeRadioButtonGroup
      ]
    } );

    // The graph-specific controls should stay below the graph and left-aligned, while the display mode controls
    // should align with the right edge of the graph display. The bottom alignment keeps the radio buttons lined up
    // with the checkbox controls in diagram mode, even though the legend sits above the checkboxes.
    // ManualConstraint keeps these relationships updated if bounds change.
    ManualConstraint.create(
      graphDisplayControlsNode,
      [ graphSpecificControlsNode, displayModeRadioButtonGroup ],
      ( graphSpecificControlsProxy, displayModeRadioButtonGroupProxy ) => {
        graphSpecificControlsProxy.left = 0;
        graphSpecificControlsProxy.top = 0;
        displayModeRadioButtonGroupProxy.right = graphDisplayNode.width;
        displayModeRadioButtonGroupProxy.bottom = graphSpecificControlsProxy.bottom;
      }
    );

    const graphControlsNode = new VBox( {
      align: 'center',
      spacing: 8,
      children: [
        graphDisplayNode,
        graphDisplayControlsNode
      ]
    } );

    super( graphControlsNode, options );
  }
}
