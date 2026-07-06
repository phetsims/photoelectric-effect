// Copyright 2026, University of Colorado Boulder

/**
 * Checkbox that controls visibility of the snapshots dialog reference line.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../../axon/js/BooleanProperty.js';
import ShadedSphereNode from '../../../../../../scenery-phet/js/ShadedSphereNode.js';
import HBox from '../../../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../../../scenery/js/nodes/Line.js';
import Node from '../../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../../../sun/js/Checkbox.js';
import Tandem from '../../../../../../tandem/js/Tandem.js';
import PhotoelectricEffectColors from '../../../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../../../PhotoelectricEffectFluent.js';

export default class GraphSnapshotsReferenceLineVisibilityControl extends Checkbox {

  /**
   * @param visibleProperty - Controls whether the reference line overlay is shown.
   * @param tandem - Tandem for the checkbox.
   */
  public constructor( visibleProperty: BooleanProperty, tandem: Tandem ) {
    super(
      visibleProperty,
      new HBox( {
        spacing: 8,
        children: [
          new Text( PhotoelectricEffectFluent.experiment.graph.referenceLineStringProperty, {
            font: PhotoelectricEffectConstants.LABEL_FONT
          } ),
          GraphSnapshotsReferenceLineVisibilityControl.createIcon()
        ]
      } ),
      {
        isDisposable: false,
        tandem: tandem
      }
    );
  }

  /**
   * Creates the icon shown in the Reference Line checkbox.
   */
  private static createIcon(): Node {
    return new VBox( {
      align: 'center',
      spacing: -1,
      children: [
        new Line( 0, 0, 0, 22, {
          stroke: PhotoelectricEffectColors.referenceLineStrokeColorProperty,
          lineWidth: 3
        } ),
        new ShadedSphereNode( 14, {
          mainColor: PhotoelectricEffectColors.referenceLineHandleColorProperty
        } )
      ]
    } );
  }
}
