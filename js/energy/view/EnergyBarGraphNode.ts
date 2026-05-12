// Copyright 2026, University of Colorado Boulder

/**
 * Bar graph display for the Energy screen. Each sample plot shows potential, photon, and kinetic energy bars in
 * that order, sharing a common y-axis scale and horizontal grid.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import BarPlot from '../../../../bamboo/js/BarPlot.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import type { PaintableOptions } from '../../../../scenery/js/nodes/Paintable.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel from '../../../../sun/js/Panel.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import EnergyGraphLegendNode from './EnergyGraphLegendNode.js';

export type EnergyBarGraphSampleData = {
  potentialEnergy: number;
  photonEnergy: number;
  kineticEnergy: number;
};

// A recorded sample can have energy data, no data yet, or a photon that did not eject an electron.
export type EnergyBarGraphSampleState = EnergyBarGraphSampleData | 'no-emit' | null;

type SelfOptions = EmptySelfOptions;
export type EnergyBarGraphNodeOptions = SelfOptions & NodeOptions;

// Number of sample plots shown in the Energy bar graph.
// TODO: This will come from the model somewhere, as we will be tracking 3 electron events.
const NUMBER_OF_SAMPLE_PLOTS = 3;

// View size of the shared chart rectangle.
const CHART_VIEW_WIDTH = 240;
const CHART_VIEW_HEIGHT = 280;

// Bar layout in model x coordinates. Sample indices are zero-based, while model x positions are one-based.
const getSampleCenterX = ( sampleIndex: number ): number => sampleIndex + 1;
const BAR_X_OFFSET = 0.18;
const BAR_WIDTH = 9;

// In-plot message shown when a sample exists, but the photon did not eject an electron. This is in model units.
const NO_ELECTRON_EJECTED_PANEL_CENTER_MODEL_Y = 3.5;

// Segmented zero-energy line layout. One segment is drawn for each sample so space remains between plots.
// This is in model units.
const ZERO_ENERGY_LINE_HALF_WIDTH = 0.32;

// Space around axis labels and sample labels.
const Y_TICK_LABEL_MARGIN = 5;
const X_LABEL_MARGIN = 5;
const Y_AXIS_LABEL_MARGIN = 34;

// Vertical spacing between the graph legend and plot.
const LEGEND_GRAPH_SPACING = 18;

// Fixed model range for the y-axis. Keeps zero, grid lines, and bar scaling stable as material changes.
// The lower bound is fixed so y positions remain stable when material changes.
// The upper bound keeps the graph focused on the active energy bars.
const MODEL_Y_RANGE = new Range( -14, 10 );

// Fixed energy reference lines.
const GRID_LINE_VALUES = [ -14, -12, -10, -8, -6, -4, -2, 2, 4, 6, 8, 10 ];

export default class EnergyBarGraphNode extends Node {

  // Translates energy and sample coordinates into the shared chart view.
  private readonly chartTransform: ChartTransform;

  // Bamboo plots for samples 1, 2, and 3.
  private readonly sampleBarPlots: BarPlot[];

  // Overlays for samples where no electron was ejected. Hidden for empty plots and normal bar plots.
  private readonly noElectronEjectedPanels: Panel[];

  // Shared custom grid lines, regenerated when the work-function marker changes.
  private readonly gridLineNode: Node;

  // Labels for the special y values shown on the graph.
  private readonly zeroTickLabel: Text;
  private readonly workFunctionTickLabel: Text;

  // Listener retained so it can be removed on disposal.
  private readonly workFunctionListener: () => void;

  // Work function source used for the -phi marker.
  private readonly workFunctionProperty: TReadOnlyProperty<number>;

  public constructor( workFunctionProperty: TReadOnlyProperty<number>, providedOptions: EnergyBarGraphNodeOptions ) {

    const options = optionize<EnergyBarGraphNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions );

    super( options );

    this.workFunctionProperty = workFunctionProperty;

    this.chartTransform = new ChartTransform( {
      viewWidth: CHART_VIEW_WIDTH,
      viewHeight: CHART_VIEW_HEIGHT,
      modelXRange: new Range( 0.5, 3.5 ),
      modelYRange: MODEL_Y_RANGE
    } );

    this.gridLineNode = new Node();

    const plotRectangle = new Rectangle( 0, 0, CHART_VIEW_WIDTH, CHART_VIEW_HEIGHT, {
      fill: 'white'
    } );

    this.sampleBarPlots = _.times( NUMBER_OF_SAMPLE_PLOTS, sampleIndex => {
      return new BarPlot( this.chartTransform, [], {
        barWidth: BAR_WIDTH,
        pointToPaintableFields: point => this.getBarPaintableOptions( sampleIndex, point )
      } );
    } );

    this.noElectronEjectedPanels = _.times( NUMBER_OF_SAMPLE_PLOTS, sampleIndex => {
      return EnergyBarGraphNode.createNoElectronEjectedPanel(
        this.chartTransform.modelToViewX( getSampleCenterX( sampleIndex ) ),
        this.chartTransform.modelToViewY( NO_ELECTRON_EJECTED_PANEL_CENTER_MODEL_Y )
      );
    } );

    const plotLayer = new Node( {
      clipArea: plotRectangle.getShape(),
      children: [
        this.gridLineNode,
        ...this.sampleBarPlots,
        ...this.noElectronEjectedPanels
      ]
    } );

    this.zeroTickLabel = new Text( '0', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );

    this.workFunctionTickLabel = new Text( `-${MathSymbols.PHI}`, {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );

    // TODO: i18n
    const yAxisLabel = new Text( 'Energy (eV)', {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      rotation: -Math.PI / 2
    } );

    const xLabels = _.times( NUMBER_OF_SAMPLE_PLOTS, sampleIndex => {
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

    this.children = [
      new VBox( {
        align: 'left',
        spacing: LEGEND_GRAPH_SPACING,
        children: [
          new EnergyGraphLegendNode(),
          graphNode
        ]
      } )
    ];

    this.workFunctionListener = () => {
      this.updateGraphDecorations();
    };
    workFunctionProperty.link( this.workFunctionListener );

    this.updateGraphDecorations();
  }

  /**
   * Sets or clears one sample plot. Null means there is no sample data yet. The 'no-emit' state means the sample
   * exists, but no electron was ejected.
   */
  public setSampleData( sampleIndex: number, sampleState: EnergyBarGraphSampleState ): void {
    assert && assert( sampleIndex >= 0 && sampleIndex < NUMBER_OF_SAMPLE_PLOTS, 'sampleIndex out of range' );

    const noElectronEjected = sampleState === 'no-emit';
    this.noElectronEjectedPanels[ sampleIndex ].visible = noElectronEjected;

    if ( sampleState === null || noElectronEjected ) {
      this.sampleBarPlots[ sampleIndex ].setDataSet( [] );
    }
    else {
      this.sampleBarPlots[ sampleIndex ].setDataSet( EnergyBarGraphNode.createDataSet( sampleIndex, sampleState ) );
    }
  }

  /**
   * Clears all sample plots.
   */
  public clearSampleData(): void {
    for ( let sampleIndex = 0; sampleIndex < NUMBER_OF_SAMPLE_PLOTS; sampleIndex++ ) {
      this.setSampleData( sampleIndex, null );
    }
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

    // Static grid lines.
    // TODO: These may not need to be redrawn every change. But putting here is simple. Reconsider once the
    //   look and feel of the plot is solidified.
    GRID_LINE_VALUES.forEach( gridValue => addHorizontalGridLine( this.chartTransform.modelToViewY( gridValue ) ) );

    // Draw the dynamic work-function reference line across the full chart width.
    gridLines.push( new Line( 0, workFunctionY, CHART_VIEW_WIDTH, workFunctionY, {
      stroke: 'black',
      lineWidth: 1.5,
      lineDash: [ 4, 4 ]
    } ) );

    // Draw the zero-energy reference as separate solid segments under each sample group.
    _.times( NUMBER_OF_SAMPLE_PLOTS, sampleIndex => {
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
   * Creates the Bamboo data set for one sample, in the required energy order.
   */
  private static createDataSet( sampleIndex: number, data: EnergyBarGraphSampleData ): Vector2[] {
    const centerX = getSampleCenterX( sampleIndex );

    return [
      new Vector2( centerX - BAR_X_OFFSET, data.potentialEnergy ),
      new Vector2( centerX, data.photonEnergy ),
      new Vector2( centerX + BAR_X_OFFSET, data.kineticEnergy )
    ];
  }

  /**
   * Creates the in-plot label for a sample that was recorded without electron emission.
   */
  private static createNoElectronEjectedPanel( centerX: number, centerY: number ): Panel {

    // TODO: 18n
    const text = new RichText( 'No electron ejected', {
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

  public override dispose(): void {
    this.workFunctionProperty.unlink( this.workFunctionListener );
    super.dispose();
    this.chartTransform.dispose();
  }
}
