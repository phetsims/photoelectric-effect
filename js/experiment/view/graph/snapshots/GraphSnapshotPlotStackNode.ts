// Copyright 2026, University of Colorado Boulder

/**
 * GraphSnapshotPlotStackNode owns the reusable snapshot rows in the snapshots dialog. It updates row visibility,
 * synchronizes zoom level, and keeps x-axis labels visible only on the last active row.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../../../dot/js/Range.js';
import VBox from '../../../../../../scenery/js/layout/nodes/VBox.js';
import GraphData from '../../../model/GraphData.js';
import type { GraphPlotAreaNodeOptions } from '../GraphPlotAreaNode.js';
import GraphSnapshotRowNode from './GraphSnapshotRowNode.js';

export default class GraphSnapshotPlotStackNode extends VBox {

  // Rows that provide plot geometry and nearest-point sampling for the reference line.
  public readonly snapshotRows: GraphSnapshotRowNode[];

  // Source of snapshot slots and active snapshot count.
  private readonly graphData: GraphData;

  /**
   * @param graphData - Model that owns reusable snapshot slots.
   * @param xRange - Shared x range used by each snapshot plot.
   * @param yZoomRanges - Y zoom presets used by each snapshot plot.
   * @param snapshotPlotOptions - Options used for each snapshot chart's plot area.
   */
  public constructor(
    graphData: GraphData,
    xRange: Range,
    yZoomRanges: Range[],
    snapshotPlotOptions: GraphPlotAreaNodeOptions
  ) {
    const snapshotRows = graphData.snapshots.map( ( snapshot, i ) => {
      return new GraphSnapshotRowNode( xRange, yZoomRanges, i + 1, snapshot, snapshotPlotOptions );
    } );

    super( {
      spacing: 4,
      children: snapshotRows
    } );

    this.graphData = graphData;
    this.snapshotRows = snapshotRows;
  }

  /**
   * Redraws snapshot rows from model data. Rows remain in a fixed order, and the last active row shows the x-axis
   * labels for the visible snapshot stack.
   */
  public updateSnapshotPlots(): void {
    const count = this.graphData.snapshotsCountProperty.value;
    this.snapshotRows.forEach( ( snapshotRowNode, i ) => {
      if ( i < count ) {
        snapshotRowNode.setSnapshot();
      }
      else {
        snapshotRowNode.clearSnapshot();
      }
      snapshotRowNode.setShowXLabels( i === count - 1 );
    } );
  }

  /**
   * Syncs every snapshot row to the shared dialog zoom level.
   */
  public setZoomLevel( zoomLevel: number ): void {
    this.snapshotRows.forEach( snapshotRowNode => {
      snapshotRowNode.setZoomLevel( zoomLevel );
    } );
  }
}
