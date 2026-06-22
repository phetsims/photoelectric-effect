// Copyright 2026, University of Colorado Boulder

/**
 * GraphSnapshotStatusNode displays snapshot count and save confirmation feedback over the graph plot area.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import ManualConstraint from '../../../../../scenery/js/layout/constraints/ManualConstraint.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectConstants from '../../../common/PhotoelectricEffectConstants.js';
import GraphData from '../../model/GraphData.js';
import GraphSnapshotSavedMessageNode from './GraphSnapshotSavedMessageNode.js';

// Padding from the chart border for the snapshot count readout.
const SNAPSHOT_READOUT_MARGIN = 4;

// Padding from the chart border for the "Saved!" message.
const SNAPSHOT_SAVED_MESSAGE_MARGIN = 4;

export default class GraphSnapshotStatusNode extends Node {

  /**
   * @param graphData - Source of snapshot count changes.
   * @param plotBounds - Chart bounds used to position status content.
   */
  public constructor( graphData: GraphData, plotBounds: Bounds2 ) {
    const snapshotCountReadoutText = new Text(
      new DerivedProperty( [ graphData.snapshotsCountProperty ], count => `${count}/${GraphData.MAX_SNAPSHOTS}` ),
      { font: PhotoelectricEffectConstants.CONTENT_FONT }
    );

    const snapshotSavedMessageNode = new GraphSnapshotSavedMessageNode();

    super( {
      isDisposable: false,
      children: [
        snapshotSavedMessageNode,
        snapshotCountReadoutText
      ]
    } );

    // Manual constraints keep the labels in the same place as strings change.
    ManualConstraint.create( this, [ snapshotCountReadoutText ], readout => {
      readout.right = plotBounds.right - SNAPSHOT_READOUT_MARGIN;
      readout.top = plotBounds.top + SNAPSHOT_READOUT_MARGIN;
    } );
    ManualConstraint.create( this, [ snapshotSavedMessageNode ], savedMessageNode => {
      savedMessageNode.centerX = plotBounds.centerX;
      savedMessageNode.top = plotBounds.top + SNAPSHOT_SAVED_MESSAGE_MARGIN;
    } );

    // When we get a new snapshot, indicate that data was saved.
    let previousSnapshotsCount = graphData.snapshotsCountProperty.value;
    graphData.snapshotsCountProperty.link( snapshotsCount => {
      if ( snapshotsCount > previousSnapshotsCount ) {
        snapshotSavedMessageNode.showMessage();
      }
      previousSnapshotsCount = snapshotsCount;
    } );
  }
}
