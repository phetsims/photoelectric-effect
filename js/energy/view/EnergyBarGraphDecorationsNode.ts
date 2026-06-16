// Copyright 2026, University of Colorado Boulder

/**
 * Custom y-axis labels and horizontal reference lines for the Energy screen bar graph.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import EnergyGraphData from '../model/EnergyGraphData.js';
import EnergyGraphDisplayProperties from '../model/EnergyGraphDisplayProperties.js';

// Space between y-axis tick labels and the plot area.
const Y_TICK_LABEL_MARGIN = 5;

// Spacing between fixed energy reference lines, in eV.
const GRID_LINE_SPACING = 2;

// Segmented zero-energy line layout. One segment is drawn for each sample so space remains between plots.
// This is in model units.
const ZERO_ENERGY_LINE_HALF_WIDTH = 0.4;

// Sample indices are zero-based, while model x positions are one-based.
const getSampleCenterX = ( sampleIndex: number ): number => sampleIndex + 1;

export default class EnergyBarGraphDecorationsNode extends Node {

  // Translates energy and sample coordinates into the shared chart view.
  private readonly chartTransform: ChartTransform;

  // Shared custom grid lines, regenerated when the work-function marker changes.
  private readonly gridLineNode: Node;

  // Labels for fixed y values shown on the graph.
  private readonly minimumEnergyTickLabel: Node;
  private readonly zeroTickLabel: Node;
  private readonly maximumEnergyTickLabel: Node;

  // Label for the dynamic work-function value shown on the graph.
  private readonly workFunctionTickLabel: Node;

  public constructor( chartTransform: ChartTransform, workFunctionProperty: TReadOnlyProperty<number> ) {
    super();

    this.chartTransform = chartTransform;

    this.gridLineNode = new Node();

    this.minimumEnergyTickLabel = EnergyBarGraphDecorationsNode.createEnergyTickLabel(
      EnergyGraphDisplayProperties.MODEL_Y_RANGE.min
    );
    this.zeroTickLabel = EnergyBarGraphDecorationsNode.createEnergyTickLabel( 0 );
    this.maximumEnergyTickLabel = EnergyBarGraphDecorationsNode.createEnergyTickLabel(
      EnergyGraphDisplayProperties.MODEL_Y_RANGE.max
    );

    this.workFunctionTickLabel = new Text( `-${MathSymbols.PHI_SYMBOL}`, {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );

    this.children = [
      this.gridLineNode,
      this.minimumEnergyTickLabel,
      this.zeroTickLabel,
      this.maximumEnergyTickLabel,
      this.workFunctionTickLabel
    ];

    // Called eagerly to initialize decorations.
    workFunctionProperty.link( workFunction => {
      this.updateGraphDecorations( workFunction );
    } );
  }

  /**
   * Repositions the y labels and regenerates custom horizontal grid lines. This graph draws grid lines manually
   * instead of using Bamboo's built-in grid support because the Energy screen needs a mix of graph decorations that
   * do not map cleanly to a uniform grid: a dynamic work-function line, fixed reference lines, and segmented zero lines
   * that appear only under each sample group.
   */
  private updateGraphDecorations( workFunction: number ): void {
    const zeroY = this.chartTransform.modelToViewY( 0 );
    const minimumEnergyY = this.chartTransform.modelToViewY( EnergyGraphDisplayProperties.MODEL_Y_RANGE.min );
    const maximumEnergyY = this.chartTransform.modelToViewY( EnergyGraphDisplayProperties.MODEL_Y_RANGE.max );
    const workFunctionY = this.chartTransform.modelToViewY( -workFunction );

    // Position the custom tick labels for fixed energy values and the current negative work-function value.
    this.minimumEnergyTickLabel.rightCenter = new Vector2( -Y_TICK_LABEL_MARGIN, minimumEnergyY );
    this.zeroTickLabel.rightCenter = new Vector2( -Y_TICK_LABEL_MARGIN, zeroY );
    this.maximumEnergyTickLabel.rightCenter = new Vector2( -Y_TICK_LABEL_MARGIN, maximumEnergyY );
    this.workFunctionTickLabel.rightCenter = new Vector2( -Y_TICK_LABEL_MARGIN, workFunctionY );

    const gridLines: Line[] = [];
    const gridLineYValues: number[] = [];

    // Add fixed horizontal reference lines, skipping duplicates in view coordinates.
    const addHorizontalGridLine = ( viewY: number ) => {
      if ( !gridLineYValues.some( gridLineY => Math.abs( gridLineY - viewY ) < 1e-6 ) ) {
        gridLineYValues.push( viewY );
        gridLines.push( new Line( 0, viewY, this.chartTransform.viewWidth, viewY, {
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
    gridLines.push( new Line( 0, workFunctionY, this.chartTransform.viewWidth, workFunctionY, {
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
          lineWidth: 2
        } ) );
    } );

    this.gridLineNode.children = gridLines;
  }

  /**
   * Creates one numeric y-axis tick label for an energy value.
   */
  private static createEnergyTickLabel( energy: number ): Text {
    return new Text( energy, {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );
  }
}
