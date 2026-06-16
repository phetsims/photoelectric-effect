// Copyright 2026, University of Colorado Boulder

/**
 * Helpers for creating and disposing the tick, tick-label, and grid-line sets used by experiment graph plot areas.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Range from '../../../../dot/js/Range.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';

export type GraphPlotTickSetGroup = {
  xTickLabelSet: TickLabelSet;
  yTickLabelSet: TickLabelSet;
  xTickMarkSet: TickMarkSet;
  yTickMarkSet: TickMarkSet;
};

export type GraphPlotGridLineSetGroup = {
  verticalGridLineSet: GridLineSet;
  horizontalGridLineSet: GridLineSet;
};

// Shared visual style for chart grid lines.
const GRID_LINE_OPTIONS = {
  stroke: PhotoelectricEffectColors.graphGridLineColorProperty,
  lineDash: [ 4, 4 ]
};

// Tick mark length extending away from chart edges.
const TICK_MARK_EXTENT = 8;

// Tick mark stroke width.
const TICK_MARK_LINE_WIDTH = 3;

export default class GraphPlotAxisSets {

  /**
   * Creates grid line sets whose spacing matches the tick spacing for each axis.
   * In this design, spacing is derived from the active displayed ranges (not from chartTransform alone), so these
   * sets must be recreated whenever zoom changes.
   */
  public static createGridLineSets(
    chartTransform: ChartTransform,
    xRange: Range,
    yRange: Range,
    xTickCount: number,
    yTickCount: number
  ): GraphPlotGridLineSetGroup {
    const xSpacing = GraphPlotAxisSets.createTickSpacing( xRange, xTickCount );
    const ySpacing = GraphPlotAxisSets.createTickSpacing( yRange, yTickCount );

    return {
      verticalGridLineSet: new GridLineSet( chartTransform, Orientation.VERTICAL, ySpacing, GRID_LINE_OPTIONS ),
      horizontalGridLineSet: new GridLineSet( chartTransform, Orientation.HORIZONTAL, xSpacing, GRID_LINE_OPTIONS )
    };
  }

  /**
   * Creates tick marks and labels for both chart axes for one zoom range preset.
   * In this design, tick spacing and labeled values are derived from the active displayed ranges, so these sets must
   * be recreated whenever zoom changes.
   */
  public static createTickSets(
    chartTransform: ChartTransform,
    xRange: Range,
    yRange: Range,
    xTickCount: number,
    yTickCount: number,
    xTickLabelFormatter: ( ( value: number ) => string ) | null,
    yTickLabelFormatter: ( ( value: number ) => string ) | null
  ): GraphPlotTickSetGroup {
    const xSpacing = GraphPlotAxisSets.createTickSpacing( xRange, xTickCount );
    const ySpacing = GraphPlotAxisSets.createTickSpacing( yRange, yTickCount );

    const xTickLabelSet = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, xSpacing, {
      edge: 'min',
      origin: xRange.min,
      createLabel: GraphPlotAxisSets.createEdgeLabel( xRange, xTickLabelFormatter )
    } );

    const yTickLabelSet = new TickLabelSet( chartTransform, Orientation.VERTICAL, ySpacing, {
      edge: 'min',
      origin: yRange.min,
      createLabel: GraphPlotAxisSets.createEdgeLabel( yRange, yTickLabelFormatter )
    } );

    const xTickMarkSet = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, xSpacing, {
      edge: 'min',
      origin: xRange.min,
      extent: TICK_MARK_EXTENT,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );

    const yTickMarkSet = new TickMarkSet( chartTransform, Orientation.VERTICAL, ySpacing, {
      edge: 'min',
      origin: yRange.min,
      extent: TICK_MARK_EXTENT,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );

    return {
      xTickLabelSet: xTickLabelSet,
      yTickLabelSet: yTickLabelSet,
      xTickMarkSet: xTickMarkSet,
      yTickMarkSet: yTickMarkSet
    };
  }

  /**
   * Disposes every tick label and tick mark set in a group.
   */
  public static disposeTickSets( tickSets: GraphPlotTickSetGroup ): void {
    tickSets.xTickLabelSet.dispose();
    tickSets.yTickLabelSet.dispose();
    tickSets.xTickMarkSet.dispose();
    tickSets.yTickMarkSet.dispose();
  }

  /**
   * Disposes every grid line set in a group.
   */
  public static disposeGridLineSets( gridLineSets: GraphPlotGridLineSetGroup ): void {
    gridLineSets.verticalGridLineSet.dispose();
    gridLineSets.horizontalGridLineSet.dispose();
  }

  /**
   * Creates one tick label node for a numeric axis value.
   */
  private static createTickLabel( value: number, formatter: ( ( value: number ) => string ) | null ): Text {

    // Tolerate floating-point noise when deciding whether to display integer formatting.
    const isInteger = Math.abs( value - roundSymmetric( value ) ) < 1e-6;
    const label = formatter ? formatter( value ) : toFixed( value, isInteger ? 0 : 2 );
    return new Text( label, {
      font: PhotoelectricEffectConstants.GRAPH_TICK_LABEL_FONT
    } );
  }

  /**
   * Creates evenly spaced major tick intervals for a displayed range.
   */
  private static createTickSpacing( range: Range, tickCount: number ): number {
    return range.getLength() / ( Math.max( tickCount, 2 ) - 1 );
  }

  /**
   * Creates a label factory that only labels the min, midpoint, and max ticks of a range.
   */
  private static createEdgeLabel( range: Range, formatter: ( ( value: number ) => string ) | null ): ( value: number ) => Text | null {
    const min = range.min;
    const max = range.max;
    const mid = range.getCenter();

    // Tolerance avoids missing edge/mid labels due to floating-point rounding in generated tick values.
    const tolerance = Math.max( range.getLength() * 1e-6, 1e-9 );

    return ( value: number ): Text | null => {
      const isEdge = Math.abs( value - min ) <= tolerance ||
                     Math.abs( value - mid ) <= tolerance ||
                     Math.abs( value - max ) <= tolerance;
      return isEdge ? GraphPlotAxisSets.createTickLabel( value, formatter ) : null;
    };
  }
}
