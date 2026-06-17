// Copyright 2026, University of Colorado Boulder

/**
 * Interactive handle for the graph snapshots reference line. Supports pointer drag and left/right keyboard drag,
 * without Home/End shortcuts.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../../../axon/js/NumberProperty.js';
import type { TReadOnlyProperty } from '../../../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../../../dot/js/Vector2Property.js';
import { combineOptions } from '../../../../../../phet-core/js/optionize.js';
import AccessibleInteractiveOptions from '../../../../../../scenery-phet/js/accessibility/AccessibleInteractiveOptions.js';
import ShadedSphereNode, { type ShadedSphereNodeOptions } from '../../../../../../scenery-phet/js/ShadedSphereNode.js';
import InteractiveHighlighting from '../../../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import RichDragListener from '../../../../../../scenery/js/listeners/RichDragListener.js';
import Tandem from '../../../../../../tandem/js/Tandem.js';
import PhotoelectricEffectColors from '../../../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectFluent from '../../../../PhotoelectricEffectFluent.js';
import GraphSnapshotRowNode from '../GraphSnapshotRowNode.js';

// Diameter of the draggable reference line handle.
const HANDLE_DIAMETER = 18;

export default class GraphSnapshotsReferenceLineHandleNode extends InteractiveHighlighting( ShadedSphereNode ) {

  // Position used internally by RichDragListener for pointer and keyboard deltas.
  private readonly dragPositionProperty = new Vector2Property( new Vector2( 0, 0 ) );


  /**
   * @param xProperty - The x value controlled by this handle.
   * @param dragBoundsProperty - To keep the handle in range.
   * @param dragSnapshotRow - For coordinate transforms as we position within this row.
   * @param tandem
   */
  public constructor(
    xProperty: NumberProperty,
    dragBoundsProperty: TReadOnlyProperty<Bounds2 | null>,
    dragSnapshotRow: GraphSnapshotRowNode,
    tandem: Tandem
  ) {

    const options = combineOptions<ShadedSphereNodeOptions>( {}, AccessibleInteractiveOptions, {
      isDisposable: false,
      cursor: 'ew-resize',
      mainColor: PhotoelectricEffectColors.referenceLineHandleColorProperty,
      accessibleName: PhotoelectricEffectFluent.a11y.referenceLine.accessibleNameStringProperty,
      accessibleHelpText: PhotoelectricEffectFluent.a11y.referenceLine.accessibleHelpTextStringProperty,
      tandem: tandem
    } );

    super( HANDLE_DIAMETER, options );

    // TODO: Consider accessibility for this. There is some discussion about whether this should be a "slider"
    //   or a custom draggable. What should it be?
    this.addInputListener( new RichDragListener( {
      positionProperty: this.dragPositionProperty,
      dragBoundsProperty: dragBoundsProperty,
      keyboardDragListenerOptions: {
        keyboardDragDirection: 'leftRight',
        dragDelta: dragSnapshotRow.modelToViewDeltaX( 0.1 ),
        shiftDragDelta: dragSnapshotRow.modelToViewDeltaX( 0.01 ),
        moveOnHoldInterval: 50
      },
      drag: ( event, listener ) => {
        const deltaX = dragSnapshotRow.viewToModelDeltaX( listener.modelDelta.x );
        xProperty.value = xProperty.range.constrainValue(
          xProperty.value + deltaX
        );
      },
      tandem: tandem.createTandem( 'dragListener' )
    } ) );

    this.mouseArea = this.localBounds.dilatedXY( 3, 3 );
    this.touchArea = this.localBounds.dilatedXY( 5, 5 );
  }

  /**
   * Keeps RichDragListener's position in sync with the handle's rendered position.
   */
  public setDragPosition( position: Vector2 ): void {
    if ( !this.dragPositionProperty.value.equals( position ) ) {
      this.dragPositionProperty.value = position;
    }
  }
}
