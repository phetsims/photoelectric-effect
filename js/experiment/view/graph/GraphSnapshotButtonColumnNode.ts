// Copyright 2026, University of Colorado Boulder

/**
 * GraphSnapshotButtonColumnNode owns the action buttons beside an experiment graph plot area: capture snapshot, show
 * saved snapshots, and clear snapshots.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import type { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import CameraButton, { type CameraButtonOptions } from '../../../../../scenery-phet/js/buttons/CameraButton.js';
import InfoButton, { type InfoButtonOptions } from '../../../../../scenery-phet/js/buttons/InfoButton.js';
import TrashButton, { type TrashButtonOptions } from '../../../../../scenery-phet/js/buttons/TrashButton.js';
import VBox from '../../../../../scenery/js/layout/nodes/VBox.js';
import { type RectangularPushButtonOptions } from '../../../../../sun/js/buttons/RectangularPushButton.js';
import type { PhetioObjectOptions } from '../../../../../tandem/js/PhetioObject.js';
import PhotoelectricEffectColors from '../../../common/PhotoelectricEffectColors.js';
import GraphData from '../../model/GraphData.js';

// Vertical spacing between action buttons in the right-side column.
const GRAPH_ASSEMBLY_BUTTON_SPACING = 8;

// Minimum dimensions used to normalize action-button sizing.
const GRAPH_ASSEMBLY_BUTTON_WIDTH = 28;
const GRAPH_ASSEMBLY_BUTTON_HEIGHT = 20;

type GraphSnapshotButtonColumnNodeOptions = {

  // Accessible names for each button in the right-side column.
  cameraButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  trashButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  snapshotsGalleryButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  snapshotsGalleryButtonAccessibleHelpTextProperty: TReadOnlyProperty<string>;
} & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class GraphSnapshotButtonColumnNode extends VBox {

  /**
   * @param graphData - Source of snapshots for button enabled state and actions.
   * @param showSnapshotsDialog - Shows the snapshots dialog for this graph.
   * @param options
   */
  public constructor(
    graphData: GraphData,
    showSnapshotsDialog: () => void,
    options: GraphSnapshotButtonColumnNodeOptions
  ) {

    // Uses a square size so mixed button implementations share a consistent visual footprint.
    const actionButtonSideLength = Math.max(
      GRAPH_ASSEMBLY_BUTTON_WIDTH,
      GRAPH_ASSEMBLY_BUTTON_HEIGHT
    );
    const actionButtonOptions: RectangularPushButtonOptions = {
      size: new Dimension2( actionButtonSideLength, actionButtonSideLength ),
      baseColor: PhotoelectricEffectColors.graphButtonBaseColorProperty,
      xMargin: 6,
      yMargin: 6
    };
    const infoButtonOptions: InfoButtonOptions = {
      radius: actionButtonSideLength / 2,
      baseColor: 'white',
      xMargin: 6,
      yMargin: 6
    };

    const cameraButton = new CameraButton( combineOptions<CameraButtonOptions>( {}, actionButtonOptions, {
      listener: () => graphData.captureSnapshot(),
      enabledProperty: new DerivedProperty( [ graphData.snapshotsCountProperty ], count => {
        return count < GraphData.MAX_SNAPSHOTS;
      } ),
      tandem: options.tandem.createTandem( 'cameraButton' ),
      accessibleName: options.cameraButtonAccessibleNameProperty
    } ) );

    const snapshotsGalleryButton = new InfoButton( combineOptions<InfoButtonOptions>( {}, infoButtonOptions, {
      listener: showSnapshotsDialog,
      enabledProperty: new DerivedProperty(
        [ graphData.snapshotsCountProperty ],
        count => count > 0
      ),
      accessibleName: options.snapshotsGalleryButtonAccessibleNameProperty,
      accessibleHelpText: options.snapshotsGalleryButtonAccessibleHelpTextProperty,
      tandem: options.tandem.createTandem( 'snapshotsGalleryButton' )
    } ) );

    const trashButton = new TrashButton( combineOptions<TrashButtonOptions>( {}, actionButtonOptions, {
      listener: () => graphData.clearSnapshots(),
      tandem: options.tandem.createTandem( 'trashButton' ),
      accessibleName: options.trashButtonAccessibleNameProperty
    } ) );

    super( {
      spacing: GRAPH_ASSEMBLY_BUTTON_SPACING,
      align: 'center',
      children: [
        cameraButton,
        snapshotsGalleryButton,
        trashButton
      ]
    } );
  }
}
