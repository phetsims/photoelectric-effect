// Copyright 2026, University of Colorado Boulder

/**
 * Energy diagram display for the Energy screen. Each sample shows an electron's initial energy in the conduction
 * band and its emitted kinetic energy above the zero-energy reference line.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import type { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../../dot/js/Range.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import Node, { type NodeOptions } from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectConstants from '../../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../../PhotoelectricEffectFluent.js';
import EnergyGraphData from '../../model/EnergyGraphData.js';
import EnergyGraphDisplayProperties from '../../model/EnergyGraphDisplayProperties.js';
import EnergyGraphSample from '../../model/EnergyGraphSample.js';
import EnergyDiagramDecorationsNode from './EnergyDiagramDecorationsNode.js';
import EnergyDiagramSampleMarkerNode from './EnergyDiagramSampleMarkerNode.js';
import EnergyGraphLayout from '../EnergyGraphLayout.js';

type SelfOptions = EmptySelfOptions;
export type EnergyDiagramNodeOptions = SelfOptions & NodeOptions;

// View size of the shared chart rectangle.
const CHART_VIEW_WIDTH = 170;
const CHART_VIEW_HEIGHT = 310;

export default class EnergyDiagramNode extends Node {

  // Translates energy and sample coordinates into the shared chart view.
  private readonly chartTransform: ChartTransform;

  /**
   * @param samples - Persistent sample slots whose Properties drive the marker positions.
   * @param workFunctionProperty - Work function source used for the Fermi level marker.
   * @param bandDepthProperty - Occupied-band depth source used for the lower edge of the filled states.
   * @param labelsVisibleProperty - Whether Fermi level labels are visible.
   * @param workFunctionVisibleProperty - Whether the work function label is visible.
   * @param photonArrowsVisibleProperty - Whether arrows showing photon energy transfer are visible.
   * @param providedOptions
   */

  public constructor( samples: EnergyGraphSample[],
                      workFunctionProperty: TReadOnlyProperty<number>,
                      bandDepthProperty: TReadOnlyProperty<number>,
                      labelsVisibleProperty: TReadOnlyProperty<boolean>,
                      workFunctionVisibleProperty: TReadOnlyProperty<boolean>,
                      photonArrowsVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions: EnergyDiagramNodeOptions ) {

    const options = optionize<EnergyDiagramNodeOptions, SelfOptions, NodeOptions>()( {
      isDisposable: false
    }, providedOptions );

    super( options );

    this.chartTransform = new ChartTransform( {
      viewWidth: CHART_VIEW_WIDTH,
      viewHeight: CHART_VIEW_HEIGHT,
      modelXRange: new Range( 0.5, EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES + 0.5 ),
      modelYRange: EnergyGraphDisplayProperties.MODEL_Y_RANGE
    } );

    const decorationsNode = new EnergyDiagramDecorationsNode(
      this.chartTransform,
      workFunctionProperty,
      bandDepthProperty,
      labelsVisibleProperty,
      workFunctionVisibleProperty
    );

    const sampleMarkerNodes = _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, sampleIndex => {
      return new EnergyDiagramSampleMarkerNode( this.chartTransform, sampleIndex, photonArrowsVisibleProperty );
    } );

    // Link each persistent sample slot to its corresponding markers.
    samples.forEach( ( sample, sampleIndex ) => {
      const sampleMarkerNode = sampleMarkerNodes[ sampleIndex ];

      Multilink.multilink( [
        sample.hasDataProperty,
        sample.bindingEnergyProperty,
        sample.kineticEnergyProperty,
        sample.electronEmittedProperty
      ], ( hasData, bindingEnergy, kineticEnergy, electronEmitted ) => {
        sampleMarkerNode.visible = hasData && electronEmitted;
        sampleMarkerNode.updateMarkerPositions( bindingEnergy, kineticEnergy );
      } );
    } );

    const plotLayer = new Node( {
      children: [
        decorationsNode,
        ...sampleMarkerNodes
      ]
    } );

    const yAxisLabel = new Text( PhotoelectricEffectFluent.energy.graph.yAxisLabelStringProperty, {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      rotation: -Math.PI / 2
    } );

    const xLabels = _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, sampleIndex => {
      const label = new Text( `${sampleIndex + 1}`, {
        font: PhotoelectricEffectConstants.CONTENT_FONT
      } );
      label.centerTop = new Vector2(
        this.chartTransform.modelToViewX( EnergyGraphLayout.getSampleCenterX( sampleIndex ) ),
        CHART_VIEW_HEIGHT + EnergyGraphLayout.X_TICK_LABEL_MARGIN
      );
      return label;
    } );

    const chartNode = new Node( {
      children: [
        plotLayer,
        ...xLabels
      ]
    } );

    yAxisLabel.rightCenter = new Vector2( -96, CHART_VIEW_HEIGHT / 2 );

    this.children = [
      new Node( {
        children: [
          yAxisLabel,
          chartNode
        ]
      } )
    ];
  }
}
