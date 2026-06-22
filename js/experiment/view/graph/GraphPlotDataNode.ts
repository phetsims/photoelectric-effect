// Copyright 2026, University of Colorado Boulder

/**
 * GraphPlotDataNode renders the plotted data for an experiment graph. It owns the line plot and optional current-point
 * marker, while GraphPlotAreaNode owns the chart transform and GraphPlotAxesNode owns axes, ticks, and grid lines.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import LinePlot, { type LinePlotOptions } from '../../../../../bamboo/js/LinePlot.js';
import ScatterPlot, { type ScatterPlotOptions } from '../../../../../bamboo/js/ScatterPlot.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Shape from '../../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Color from '../../../../../scenery/js/util/Color.js';
import type TColor from '../../../../../scenery/js/util/TColor.js';

export type GraphPlotDataNodeOptions = {

  // Base color for the data line stroke and the latest-point marker fill (marker is darkened).
  fill: TColor;

  // Line plot styling overrides (stroke comes from fill above).
  linePlotOptions: StrictOmit<LinePlotOptions, 'stroke'>;

  // When true, a scatter plot marks the current operating point above the line; when false, no scatter layer is created.
  showCurrentPointMarker: boolean;
};

export default class GraphPlotDataNode extends Node {

  // Plot rendering for the data set.
  private readonly linePlot: LinePlot;

  // Single-point scatter plot marking the current operating point; omitted when showCurrentPointMarker is false.
  private readonly currentPointPlot: ScatterPlot | null;

  /**
   * @param chartTransform - Translates model coordinates to chart view coordinates.
   * @param chartContentClipArea - Clip applied so plotted data stays inside the chart rectangle.
   * @param options
   */
  public constructor(
    chartTransform: ChartTransform,
    chartContentClipArea: Shape,
    options: GraphPlotDataNodeOptions
  ) {
    const linePlot = new LinePlot( chartTransform, [], combineOptions<LinePlotOptions>( {}, options.linePlotOptions, {
      stroke: options.fill
    } ) );

    const currentPointPlot = options.showCurrentPointMarker ? new ScatterPlot(
      chartTransform,
      [],
      combineOptions<ScatterPlotOptions>( {}, {
        radius: 4,
        fill: Color.toColor( options.fill ).darkerColor()
      } )
    ) : null;

    super( {
      clipArea: chartContentClipArea,
      children: currentPointPlot ? [ linePlot, currentPointPlot ] : [ linePlot ]
    } );

    this.linePlot = linePlot;
    this.currentPointPlot = currentPointPlot;
  }

  /**
   * Updates the line plot data set only.
   *
   * Sorting by x ensures line joins/caps render consistently even when the data is captured in interaction order
   * rather than model order.
   *
   * @param dataSet - Model data points in chart coordinates.
   */
  public setLineDataSet( dataSet: Vector2[] ): void {
    const sortedDataSet = dataSet.slice().sort( ( a, b ) => a.x - b.x );
    this.linePlot.setDataSet( sortedDataSet );
  }

  /**
   * Updates the current-point scatter marker when showCurrentPointMarker is true; no-op otherwise.
   *
   * @param point - Model coordinates for the marker, or null to hide it.
   */
  public setCurrentPointMarker( point: Vector2 | null ): void {
    if ( this.currentPointPlot ) {
      this.currentPointPlot.setDataSet( point ? [ point ] : [] );
    }
  }
}
