// Copyright 2026, University of Colorado Boulder

/**
 * Bar graph display for the Energy screen. Each sample plot shows potential, photon, and kinetic energy bars in
 * that order, sharing a common y-axis scale and horizontal grid.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import BarPlot from '../../../../bamboo/js/BarPlot.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import type { PaintableOptions } from '../../../../scenery/js/nodes/Paintable.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel from '../../../../sun/js/Panel.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import EnergyGraphData from '../model/EnergyGraphData.js';
import EnergyGraphDisplayProperties from '../model/EnergyGraphDisplayProperties.js';
import EnergyGraphSample from '../model/EnergyGraphSample.js';

type SelfOptions = EmptySelfOptions;
export type EnergyBarGraphNodeOptions = SelfOptions & NodeOptions;

// View size of the shared chart rectangle.
const CHART_VIEW_WIDTH = 240;
const CHART_VIEW_HEIGHT = 320;

// Bar layout in model x coordinates. Sample indices are zero-based, while model x positions are one-based.
const getSampleCenterX = ( sampleIndex: number ): number => sampleIndex + 1;
const BAR_X_OFFSET = 0.18;
const BAR_WIDTH = 9;

// In-plot message shown when a sample exists, but the photon did not eject an electron. This is in model units.
const NO_ELECTRON_EJECTED_PANEL_CENTER_MODEL_Y = 8.5;

// Segmented zero-energy line layout. One segment is drawn for each sample so space remains between plots.
// This is in model units.
const ZERO_ENERGY_LINE_HALF_WIDTH = 0.32;

// Space around axis labels and sample labels.
const Y_TICK_LABEL_MARGIN = 5;
const X_LABEL_MARGIN = 5;
const Y_AXIS_LABEL_MARGIN = 34;

// Spacing between fixed energy reference lines, in eV.
const GRID_LINE_SPACING = 2;

export default class EnergyBarGraphNode extends Node {

  // Translates energy and sample coordinates into the shared chart view.
  private readonly chartTransform: ChartTransform;

  // Shared custom grid lines, regenerated when the work-function marker changes.
  private readonly gridLineNode: Node;

  // Labels for the special y values shown on the graph.
  private readonly zeroTickLabel: Node;
  private readonly workFunctionTickLabel: Node;

  // Work function source used for the -phi marker.
  private readonly workFunctionProperty: TReadOnlyProperty<number>;

  public constructor( samples: EnergyGraphSample[],
                      workFunctionProperty: TReadOnlyProperty<number>,
                      providedOptions: EnergyBarGraphNodeOptions ) {

    const options = optionize<EnergyBarGraphNodeOptions, SelfOptions, NodeOptions>()( {
      isDisposable: false
    }, providedOptions );

    super( options );

    this.workFunctionProperty = workFunctionProperty;

    this.chartTransform = new ChartTransform( {
      viewWidth: CHART_VIEW_WIDTH,
      viewHeight: CHART_VIEW_HEIGHT,
      modelXRange: new Range( 0.5, EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES + 0.5 ),
      modelYRange: EnergyGraphDisplayProperties.MODEL_Y_RANGE
    } );

    this.gridLineNode = new Node();

    const plotRectangle = new Rectangle( 0, 0, CHART_VIEW_WIDTH, CHART_VIEW_HEIGHT, {
      fill: 'white'
    } );

    // BarPlot keeps a reference to its data set, including each Vector2 in the array. Keep these arrays persistent
    // so sample changes can mutate the existing Vector2 values before BarPlot.update() is called.
    const sampleDataSets = _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, sampleIndex => {
      return EnergyBarGraphNode.createDataSet( sampleIndex );
    } );

    const sampleBarPlots = _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, sampleIndex => {
      return new BarPlot( this.chartTransform, sampleDataSets[ sampleIndex ], {
        barWidth: BAR_WIDTH,
        pointToPaintableFields: point => this.getBarPaintableOptions( sampleIndex, point )
      } );
    } );

    const noElectronEjectedPanels = _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, sampleIndex => {
      return EnergyBarGraphNode.createNoElectronEjectedPanel(
        this.chartTransform.modelToViewX( getSampleCenterX( sampleIndex ) ),
        this.chartTransform.modelToViewY( NO_ELECTRON_EJECTED_PANEL_CENTER_MODEL_Y )
      );
    } );

    // Link each persistent sample slot to its corresponding plot.
    samples.forEach( ( sample, sampleIndex ) => {
      const sampleBarPlot = sampleBarPlots[ sampleIndex ];
      const sampleDataSet = sampleDataSets[ sampleIndex ];
      sample.hasDataProperty.linkAttribute( sampleBarPlot, 'visible' );

      Multilink.multilink( [
        sample.hasDataProperty,
        sample.potentialEnergyProperty,
        sample.photonEnergyProperty,
        sample.kineticEnergyProperty
      ], ( hasData, potentialEnergy, photonEnergy, kineticEnergy ) => {
        noElectronEjectedPanels[ sampleIndex ].visible = hasData && kineticEnergy === 0;

        EnergyBarGraphNode.updateDataSet(
          sampleDataSet,
          potentialEnergy,
          photonEnergy,
          kineticEnergy
        );
        sampleBarPlot.update();
      } );
    } );

    const plotLayer = new Node( {
      clipArea: plotRectangle.getShape(),
      children: [
        this.gridLineNode,
        ...sampleBarPlots,
        ...noElectronEjectedPanels
      ]
    } );

    this.zeroTickLabel = new Text( '0', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );

    this.workFunctionTickLabel = new Text( `-${MathSymbols.PHI}`, {
      font: PhotoelectricEffectConstants.CONTENT_FONT
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
        CHART_VIEW_HEIGHT + X_LABEL_MARGIN
      );
      return label;
    } );

    const chartNode = new Node( {
      children: [
        plotRectangle,
        plotLayer,
        this.zeroTickLabel,
        this.workFunctionTickLabel,
        ...xLabels
      ]
    } );

    yAxisLabel.rightCenter = plotRectangle.leftCenter.minusXY( Y_AXIS_LABEL_MARGIN, 0 );

    const graphNode = new Node( {
      children: [
        yAxisLabel,
        chartNode
      ]
    } );

    this.children = [ graphNode ];

    // Called eagerly to initialize decorations.
    workFunctionProperty.link( () => {
      this.updateGraphDecorations();
    } );
  }

  /**
   * Repositions the y labels and regenerates custom horizontal grid lines. This graph draws grid lines manually
   * instead of using Bamboo's built-in grid support because the Energy screen needs a mix of graph decorations that
   * do not map cleanly to a uniform grid: a dynamic work-function line, fixed reference lines, and segmented zero lines
   * that appear only under each sample group.
   */
  private updateGraphDecorations(): void {
    const zeroY = this.chartTransform.modelToViewY( 0 );
    const workFunctionY = this.chartTransform.modelToViewY( -this.workFunctionProperty.value );

    // Position the custom tick labels for zero energy and the current negative work-function value.
    this.zeroTickLabel.rightCenter = new Vector2( -Y_TICK_LABEL_MARGIN, zeroY );
    this.workFunctionTickLabel.rightCenter = new Vector2( -Y_TICK_LABEL_MARGIN, workFunctionY );

    const gridLines: Line[] = [];
    const gridLineYValues: number[] = [];

    // Add fixed horizontal reference lines, skipping duplicates in view coordinates.
    const addHorizontalGridLine = ( viewY: number ) => {
      if ( !gridLineYValues.some( gridLineY => Math.abs( gridLineY - viewY ) < 1e-6 ) ) {
        gridLineYValues.push( viewY );
        gridLines.push( new Line( 0, viewY, CHART_VIEW_WIDTH, viewY, {
          stroke: 'rgb( 220, 220, 220 )',
          lineDash: [ 4, 4 ]
        } ) );
      }
    };

    // Static grid lines. The zero-energy line is drawn separately as segmented solid lines.
    // TODO: These may not need to be redrawn every change. But putting here is simple. Reconsider once the
    //   look and feel of the plot is solidified.
    const gridLineValues = _.range(
      EnergyGraphDisplayProperties.MODEL_Y_RANGE.min,
      EnergyGraphDisplayProperties.MODEL_Y_RANGE.max + GRID_LINE_SPACING,
      GRID_LINE_SPACING
    ).filter( gridLineValue => gridLineValue !== 0 );
    gridLineValues.forEach( gridValue => addHorizontalGridLine( this.chartTransform.modelToViewY( gridValue ) ) );

    // Draw the dynamic work-function reference line across the full chart width.
    gridLines.push( new Line( 0, workFunctionY, CHART_VIEW_WIDTH, workFunctionY, {
      stroke: 'black',
      lineWidth: 1.5,
      lineDash: [ 4, 4 ]
    } ) );

    // Draw the zero-energy reference as separate solid segments under each sample group.
    _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, sampleIndex => {
      const sampleCenterX = getSampleCenterX( sampleIndex );

      gridLines.push( new Line(
        this.chartTransform.modelToViewX( sampleCenterX - ZERO_ENERGY_LINE_HALF_WIDTH ),
        zeroY,
        this.chartTransform.modelToViewX( sampleCenterX + ZERO_ENERGY_LINE_HALF_WIDTH ),
        zeroY, {
          stroke: 'black',
          lineWidth: 1.5
        } ) );
    } );

    this.gridLineNode.children = gridLines;
  }

  /**
   * Creates the persistent Bamboo data set for one sample, in the required energy order.
   */
  private static createDataSet( sampleIndex: number ): Vector2[] {
    const centerX = getSampleCenterX( sampleIndex );

    return [
      new Vector2( centerX - BAR_X_OFFSET, 0 ),
      new Vector2( centerX, 0 ),
      new Vector2( centerX + BAR_X_OFFSET, 0 )
    ];
  }

  /**
   * Updates one persistent Bamboo data set by mutating the Vector2 instances that BarPlot already references.
   */
  private static updateDataSet( dataSet: Vector2[],
                                potentialEnergy: number,
                                photonEnergy: number,
                                kineticEnergy: number ): void {
    dataSet[ 0 ].setY( potentialEnergy );
    dataSet[ 1 ].setY( photonEnergy );
    dataSet[ 2 ].setY( kineticEnergy );
  }

  /**
   * Creates the in-plot label for a sample that was recorded without electron emission.
   */
  private static createNoElectronEjectedPanel( centerX: number, centerY: number ): Panel {

    const text = new RichText( PhotoelectricEffectFluent.energy.graph.noElectronEjectedStringProperty, {
      font: PhotoelectricEffectConstants.READOUT_FONT,
      lineWrap: 80
    } );

    const panel = new Panel( text, {
      fill: PhotoelectricEffectColors.screenBackgroundColorProperty,
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty.value,
      cornerRadius: 4,
      xMargin: 6,
      yMargin: 6,
      visible: false
    } );
    panel.center = new Vector2( centerX, centerY );

    return panel;
  }

  /**
   * Determines bar colors from the fixed x order for a sample plot.
   */
  private getBarPaintableOptions( sampleIndex: number, point: Vector2 ): PaintableOptions {
    const centerX = getSampleCenterX( sampleIndex );

    // Bars are ordered by x position within each sample group: potential on the left, photon in the center,
    // kinetic on the right.
    const fillProperty = point.x < centerX ? PhotoelectricEffectColors.potentialEnergyGraphColorProperty :
                         point.x > centerX ? PhotoelectricEffectColors.kineticEnergyGraphColorProperty :
                         PhotoelectricEffectColors.photonEnergyGraphColorProperty;

    return {
      fill: fillProperty,
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty
    };
  }
}
