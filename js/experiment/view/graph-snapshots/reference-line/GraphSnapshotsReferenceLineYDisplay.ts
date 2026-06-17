// Copyright 2026, University of Colorado Boulder

/**
 * Per-row y-value readout shown at the center of a graph snapshot plot, aligned with the snapshots reference line.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../../../dot/js/Vector2.js';
import NumberDisplay from '../../../../../../scenery-phet/js/NumberDisplay.js';
import Node from '../../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../../tandem/js/Tandem.js';
import { createGraphSnapshotsReferenceLineNumberDisplayOptions, createGraphSnapshotsReferenceLineValueMapper, type GraphSnapshotsReferenceLineValueDisplayOptions } from './GraphSnapshotsReferenceLineNumberDisplay.js';
import GraphSnapshotRowNode from '../GraphSnapshotRowNode.js';

// Horizontal offset so y-value readouts do not cover the vertical line.
const Y_DISPLAY_X_MARGIN = 8;

export default class GraphSnapshotsReferenceLineYDisplay extends NumberDisplay {

  // Row sampled by this display.
  private readonly snapshotRow: GraphSnapshotRowNode;

  public constructor(
    snapshotRow: GraphSnapshotRowNode,
    referenceLineXProperty: NumberProperty,
    displayOptions: GraphSnapshotsReferenceLineValueDisplayOptions,
    tandem: Tandem
  ) {

    const yValueMapper = createGraphSnapshotsReferenceLineValueMapper( displayOptions );
    const yDisplayProperty = new DerivedProperty(
      [ referenceLineXProperty, snapshotRow.pointsProperty ],
      x => {
        const closestYValue = snapshotRow.getClosestYValue( x );
        return closestYValue === null ? null : yValueMapper( closestYValue );
      }
    );

    super(
      yDisplayProperty,
      displayOptions.displayRange,
      createGraphSnapshotsReferenceLineNumberDisplayOptions( displayOptions, {
        tandem: tandem
      } )
    );

    this.snapshotRow = snapshotRow;
  }

  /**
   * Shows and positions the y readout for this row when a snapshot is visible and has saved points.
   */
  public updateLayout( referenceLineX: number, overlayNode: Node ): void {
    this.visible = this.snapshotRow.visible && this.snapshotRow.pointsProperty.value.length > 0;

    if ( this.visible ) {
      const plotBounds = this.snapshotRow.getPlotBoundsInNode( overlayNode );
      this.leftCenter = new Vector2( referenceLineX + Y_DISPLAY_X_MARGIN, plotBounds.centerY );

      if ( this.right > plotBounds.right ) {
        this.rightCenter = new Vector2( referenceLineX - Y_DISPLAY_X_MARGIN, plotBounds.centerY );
      }
    }
  }
}
