// Copyright 2026, University of Colorado Boulder

/**
 * GraphSnapshotsReferenceLineNode overlays a draggable vertical reference line on the stacked snapshot plots in the
 * graph snapshots dialog. It shows the shared x value at the top of the line and one y readout per visible snapshot
 * plot, using each row's nearest saved data point.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import type { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import GraphSnapshotRowNode from './GraphSnapshotRowNode.js';
import GraphSnapshotsReferenceLineHandleNode from './GraphSnapshotsReferenceLineHandleNode.js';
import type { GraphSnapshotsReferenceLineValueDisplayOptions } from './GraphSnapshotsReferenceLineNumberDisplay.js';
import GraphSnapshotsReferenceLineXDisplay from './GraphSnapshotsReferenceLineXDisplay.js';
import GraphSnapshotsReferenceLineYDisplay from './GraphSnapshotsReferenceLineYDisplay.js';

export type { GraphSnapshotsReferenceLineValueDisplayOptions } from './GraphSnapshotsReferenceLineNumberDisplay.js';

// Line stroke width, matching the strong visual treatment from the design mockup.
const LINE_WIDTH = 3;

type SelfOptions = {

  // Formatter for the shared x readout.
  xDisplayOptions: GraphSnapshotsReferenceLineValueDisplayOptions;

  // Formatter for each per-snapshot y readout.
  yDisplayOptions: GraphSnapshotsReferenceLineValueDisplayOptions;
};

type GraphSnapshotsReferenceLineNodeOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class GraphSnapshotsReferenceLineNode extends Node {

  // Draggable handle at the bottom of the reference line.
  private readonly handleNode: GraphSnapshotsReferenceLineHandleNode;

  // Vertical line spanning all visible snapshot plot areas.
  private readonly verticalLine: Line;

  // Shared x-value readout at the top of the reference line.
  private readonly xDisplay: GraphSnapshotsReferenceLineXDisplay;

  // Per-row y-value readouts.
  private readonly yDisplays: GraphSnapshotsReferenceLineYDisplay[];

  // Rows that provide plot geometry and nearest-point sampling.
  private readonly snapshotRows: GraphSnapshotRowNode[];

  // Model-space x value for the reference line.
  private readonly referenceLineXProperty: NumberProperty;

  // Bounds used by RichDragListener to constrain horizontal drag.
  private readonly dragBoundsProperty: Property<Bounds2 | null>;

  public constructor(
    snapshotRows: GraphSnapshotRowNode[],
    referenceLineXProperty: NumberProperty,
    referenceLineVisibleProperty: TReadOnlyProperty<boolean>,
    providedOptions: GraphSnapshotsReferenceLineNodeOptions
  ) {

    const dragBoundsProperty = new Property<Bounds2 | null>( Bounds2.NOTHING );
    const getDragSnapshotRow = (): GraphSnapshotRowNode | null => {
      return snapshotRows.length > 0 ? snapshotRows[ 0 ] : null;
    };

    const xDisplay = new GraphSnapshotsReferenceLineXDisplay(
      referenceLineXProperty,
      providedOptions.xDisplayOptions,
      providedOptions.tandem.createTandem( 'xDisplay' )
    );

    const yDisplays = snapshotRows.map( ( snapshotRow, i ) => {
      return new GraphSnapshotsReferenceLineYDisplay(
        snapshotRow,
        referenceLineXProperty,
        providedOptions.yDisplayOptions,
        providedOptions.tandem.createTandem( `yDisplay${i}` )
      );
    } );

    const verticalLine = new Line( 0, 0, 0, 0, {
      stroke: PhotoelectricEffectColors.referenceLineStrokeColorProperty,
      lineWidth: LINE_WIDTH,
      pickable: false
    } );

    const handleNode = new GraphSnapshotsReferenceLineHandleNode(
      referenceLineXProperty,
      dragBoundsProperty,
      getDragSnapshotRow,
      providedOptions.tandem.createTandem( 'handleNode' )
    );

    super( {
      isDisposable: false,
      visibleProperty: referenceLineVisibleProperty,
      children: [
        verticalLine,
        xDisplay,
        ...yDisplays,
        handleNode
      ]
    } );

    this.snapshotRows = snapshotRows;
    this.verticalLine = verticalLine;
    this.xDisplay = xDisplay;
    this.yDisplays = yDisplays;
    this.handleNode = handleNode;
    this.referenceLineXProperty = referenceLineXProperty;
    this.dragBoundsProperty = dragBoundsProperty;

    referenceLineXProperty.lazyLink( () => {
      this.updateLayout();
    } );

    snapshotRows.forEach( snapshotRow => {
      snapshotRow.pointsProperty.lazyLink( () => {
        this.updateLayout();
      } );
    } );
  }

  /**
   * Repositions the line, handle, and readouts from current row visibility, plot transforms, and reference x value.
   */
  public updateLayout(): void {
    const visibleSnapshotRows = this.snapshotRows.filter( snapshotRow => {
      return snapshotRow.visible;
    } );

    if ( visibleSnapshotRows.length === 0 ) {
      this.verticalLine.visible = false;
      this.handleNode.visible = false;
      this.xDisplay.visible = false;
      this.yDisplays.forEach( yDisplay => {
        yDisplay.visible = false;
      } );
      this.dragBoundsProperty.value = Bounds2.NOTHING;
      return;
    }

    const firstVisibleSnapshotRow = visibleSnapshotRows[ 0 ];
    const lastVisibleSnapshotRow = visibleSnapshotRows[ visibleSnapshotRows.length - 1 ];
    const topPlotBounds = firstVisibleSnapshotRow.getPlotBoundsInNode( this );
    const bottomPlotBounds = lastVisibleSnapshotRow.getPlotBoundsInNode( this );
    const referenceLineX = topPlotBounds.left + firstVisibleSnapshotRow.modelToViewX(
      this.referenceLineXProperty.value
    );

    this.verticalLine.visible = true;
    this.handleNode.visible = true;
    this.xDisplay.visible = true;

    this.verticalLine.setLine( referenceLineX, topPlotBounds.top, referenceLineX, bottomPlotBounds.bottom );
    this.handleNode.center = new Vector2( referenceLineX, bottomPlotBounds.bottom );
    this.handleNode.setDragPosition( this.handleNode.center );
    this.xDisplay.updateLayout( referenceLineX, topPlotBounds );

    this.dragBoundsProperty.value = new Bounds2( topPlotBounds.left, bottomPlotBounds.bottom,
      topPlotBounds.right, bottomPlotBounds.bottom );

    this.yDisplays.forEach( yDisplay => {
      yDisplay.updateLayout( referenceLineX, this );
    } );
  }
}
