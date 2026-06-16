// Copyright 2026, University of Colorado Boulder

/**
 * Energy diagram display for the Energy screen. Each sample shows an electron's initial energy in the conduction
 * band and its emitted kinetic energy above the zero-energy reference line.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import EnergyGraphData from '../model/EnergyGraphData.js';
import EnergyGraphDisplayProperties from '../model/EnergyGraphDisplayProperties.js';
import EnergyGraphSample from '../model/EnergyGraphSample.js';
import EnergyDiagramSampleMarkerNode from './EnergyDiagramSampleMarkerNode.js';

type SelfOptions = EmptySelfOptions;
export type EnergyDiagramNodeOptions = SelfOptions & NodeOptions;

// View size of the shared chart rectangle.
const CHART_VIEW_WIDTH = 170;
const CHART_VIEW_HEIGHT = 310;

// Horizontal layout in model x coordinates. Sample indices are zero-based, while model x positions are one-based.
const getSampleCenterX = ( sampleIndex: number ): number => sampleIndex + 1;

// Various reused layout constants.
const Y_TICK_LABEL_MARGIN = 5;
const WORK_FUNCTION_MARKER_X = CHART_VIEW_WIDTH + 14;
const WORK_FUNCTION_MARKER_CAP_WIDTH = 12;
const WORK_FUNCTION_MARKER_LINE_WIDTH = 2;

export default class EnergyDiagramNode extends Node {

  // Translates energy and sample coordinates into the shared chart view.
  private readonly chartTransform: ChartTransform;

  // Container for graph decorations that depend on the work function.
  private readonly graphDecorationNode: Node;

  // Filled region between zero energy and the Fermi level, representing empty electron states.
  private readonly emptyStatesNode: Rectangle;

  // Filled region that represents occupied states below the Fermi level.
  private readonly conductionBandNode: Rectangle;

  // Persistent graph decorations that can be repositioned as the work function changes. These are created once
  // to avoid disposing/reconstructing every change.
  private readonly conductionBandBottomLine: Line;
  private readonly fermiLevelLine: Line;
  private readonly zeroEnergyLine: Line;
  private readonly workFunctionMarkerLine: Line;
  private readonly workFunctionMarkerFermiCap: Line;
  private readonly workFunctionMarkerZeroCap: Line;
  private readonly workFunctionLabel: Node;

  // Labels for the special y values shown on the graph.
  private readonly zeroTickLabel: Node;
  private readonly fermiLevelTickLabel: Node;

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
                      private readonly workFunctionProperty: TReadOnlyProperty<number>,
                      private readonly bandDepthProperty: TReadOnlyProperty<number>,
                      private readonly labelsVisibleProperty: TReadOnlyProperty<boolean>,
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

    this.emptyStatesNode = new Rectangle( 0, 0, CHART_VIEW_WIDTH, 0, {
      fill: PhotoelectricEffectColors.emptyStatesEnergyDiagramColorProperty
    } );

    this.conductionBandNode = new Rectangle( 0, 0, CHART_VIEW_WIDTH, 0, {
      fill: PhotoelectricEffectColors.electronColorProperty
    } );

    const energyAxisNode = new ArrowNode( 0, CHART_VIEW_HEIGHT, 0, 0, {
      fill: PhotoelectricEffectColors.iconStrokeColorProperty,
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1,
      tailWidth: 0.5,
      headWidth: 9,
      headHeight: 9
    } );

    this.conductionBandBottomLine = new Line( 0, 0, CHART_VIEW_WIDTH, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1.5,
      lineDash: [ 1, 0.5 ]
    } );

    this.fermiLevelLine = new Line( 0, 0, CHART_VIEW_WIDTH, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1.5,
      lineDash: [ 1, 0.5 ]
    } );

    this.zeroEnergyLine = new Line( 0, 0, CHART_VIEW_WIDTH, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1.5,
      lineDash: [ 2, 1 ]
    } );

    this.workFunctionMarkerLine = new Line( 0, 0, 0, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: WORK_FUNCTION_MARKER_LINE_WIDTH
    } );

    this.workFunctionMarkerFermiCap = new Line( 0, 0, 0, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: WORK_FUNCTION_MARKER_LINE_WIDTH
    } );

    this.workFunctionMarkerZeroCap = new Line( 0, 0, 0, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: WORK_FUNCTION_MARKER_LINE_WIDTH
    } );

    this.workFunctionLabel = new Text( MathSymbols.PHI_SYMBOL, {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      visibleProperty: workFunctionVisibleProperty
    } );

    this.graphDecorationNode = new Node( {
      children: [
        this.emptyStatesNode,
        this.conductionBandNode,
        energyAxisNode,
        this.conductionBandBottomLine,
        this.fermiLevelLine,
        this.zeroEnergyLine,
        new Node( {
          visibleProperty: workFunctionVisibleProperty,
          children: [
            this.workFunctionMarkerLine,
            this.workFunctionMarkerFermiCap,
            this.workFunctionMarkerZeroCap,
            this.workFunctionLabel
          ]
        } )
      ]
    } );

    const sampleMarkerNodes = _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, sampleIndex => {
      return new EnergyDiagramSampleMarkerNode( this.chartTransform, sampleIndex, photonArrowsVisibleProperty );
    } );

    // Link each persistent sample slot to its corresponding markers.
    samples.forEach( ( sample, sampleIndex ) => {
      const sampleMarkerNode = sampleMarkerNodes[ sampleIndex ];

      Multilink.multilink( [
        sample.hasDataProperty,
        sample.potentialEnergyProperty,
        sample.kineticEnergyProperty,
        sample.electronEmittedProperty
      ], ( hasData, potentialEnergy, kineticEnergy, electronEmitted ) => {
        sampleMarkerNode.visible = hasData && electronEmitted;
        sampleMarkerNode.updateMarkerPositions( potentialEnergy, kineticEnergy );
      } );
    } );

    const plotLayer = new Node( {
      children: [
        this.graphDecorationNode,
        ...sampleMarkerNodes
      ]
    } );

    this.zeroTickLabel = new Text( '0', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );

    this.fermiLevelTickLabel = new Text( PhotoelectricEffectFluent.energy.graph.fermiLevelLabelStringProperty, {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      visibleProperty: this.labelsVisibleProperty
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
        this.chartTransform.modelToViewX( getSampleCenterX( sampleIndex ) ),
        CHART_VIEW_HEIGHT + 5
      );
      return label;
    } );

    const chartNode = new Node( {
      children: [
        plotLayer,
        this.zeroTickLabel,
        this.fermiLevelTickLabel,
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

    // Linked eagerly to initialize decoration positions.
    Multilink.multilink( [ workFunctionProperty, bandDepthProperty ], () => {
      this.updateGraphDecorations();
    } );
  }

  /**
   * Repositions graph decorations that depend on the active material's work function.
   */
  private updateGraphDecorations(): void {
    const zeroY = this.chartTransform.modelToViewY( 0 );
    const fermiLevelY = this.chartTransform.modelToViewY( -this.workFunctionProperty.value );
    const unclippedConductionBandBottomY = this.chartTransform.modelToViewY(
      -this.workFunctionProperty.value - this.bandDepthProperty.value
    );

    // TODO: @design Discuss how to represent occupied states when the material band depth extends below the plotted
    //  energy range.
    const conductionBandBottomY = Math.min( unclippedConductionBandBottomY, CHART_VIEW_HEIGHT );

    this.zeroTickLabel.rightCenter = new Vector2( -Y_TICK_LABEL_MARGIN, zeroY );
    this.fermiLevelTickLabel.rightCenter = new Vector2( -Y_TICK_LABEL_MARGIN, fermiLevelY );

    this.conductionBandNode.setRect(
      0,
      fermiLevelY,
      CHART_VIEW_WIDTH,
      conductionBandBottomY - fermiLevelY
    );
    this.emptyStatesNode.setRect(
      0,
      zeroY,
      CHART_VIEW_WIDTH,
      fermiLevelY - zeroY
    );

    this.conductionBandBottomLine.setLine( 0, conductionBandBottomY, CHART_VIEW_WIDTH, conductionBandBottomY );
    this.fermiLevelLine.setLine( 0, fermiLevelY, CHART_VIEW_WIDTH, fermiLevelY );
    this.zeroEnergyLine.setLine( 0, zeroY, CHART_VIEW_WIDTH, zeroY );

    this.workFunctionMarkerLine.setLine( WORK_FUNCTION_MARKER_X, fermiLevelY, WORK_FUNCTION_MARKER_X, zeroY );
    this.workFunctionMarkerFermiCap.setLine(
      WORK_FUNCTION_MARKER_X - WORK_FUNCTION_MARKER_CAP_WIDTH / 2, fermiLevelY,
      WORK_FUNCTION_MARKER_X + WORK_FUNCTION_MARKER_CAP_WIDTH / 2, fermiLevelY
    );
    this.workFunctionMarkerZeroCap.setLine(
      WORK_FUNCTION_MARKER_X - WORK_FUNCTION_MARKER_CAP_WIDTH / 2, zeroY,
      WORK_FUNCTION_MARKER_X + WORK_FUNCTION_MARKER_CAP_WIDTH / 2, zeroY
    );
    this.workFunctionLabel.leftCenter = new Vector2(
      WORK_FUNCTION_MARKER_X + WORK_FUNCTION_MARKER_CAP_WIDTH / 2 + 4,
      ( fermiLevelY + zeroY ) / 2
    );
  }
}
