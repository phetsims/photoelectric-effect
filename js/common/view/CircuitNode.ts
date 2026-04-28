// Copyright 2024, University of Colorado Boulder
/**
 * A node that draws the circuit. This circuit includes the wires connecting to each collector (target and sink),
 * as well as the target plate, and visual outline of a vacuum tube that the electrons travel inside. This is a purely
 * visual component whose position and size is determined by the needs of the model-view transform. There are no
 * interactive components.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import CircuitFactory from './CircuitFactory.js';

type SelfOptions = EmptySelfOptions;
type CircuitNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class CircuitNode extends Node {

  public constructor( modelViewTransform: ModelViewTransform2, providedOptions?: CircuitNodeOptions ) {

    /**
     * Create the collectors and plate that the electrons travel between
     */
    const targetPlate = CircuitFactory.createPlateWithMaterial( {
      rightCenter: modelViewTransform.modelToViewXY( PhotoelectricEffectConstants.TARGET_X, 0 )
    } );

    const collectorPlate = CircuitFactory.createPlate( {
      leftCenter: modelViewTransform.modelToViewXY( PhotoelectricEffectConstants.COLLECTOR_X, 0 )
    } );

    /**
     * Create the shape for the circuit wire that connects the collectors.
     */
    const circuitWireHeight = 150;
    const circuitWirePlateExtension = 50;
    const circuitWireLineWidth = 10;
    const circuitWireShape = new Shape().moveToPoint( targetPlate.leftCenter )
      .lineTo( targetPlate.left - circuitWirePlateExtension, targetPlate.centerY )
      .lineTo( targetPlate.left - circuitWirePlateExtension, targetPlate.centerY + circuitWireHeight )
      .lineTo( collectorPlate.right + circuitWirePlateExtension, collectorPlate.centerY + circuitWireHeight )
      .lineTo( collectorPlate.right + circuitWirePlateExtension, collectorPlate.centerY )
      .lineToPoint( collectorPlate.rightCenter );


    /**
     * Create the vacuum tube which is an outline of a cylinder.
     */
    const vacuumTubeHorizontalExtension = 10;
    const vacuumTubeVerticalExtension = 10;
    const tubeEndXRadius = 5;
    const tubeEndYRadius = PhotoelectricEffectConstants.PLATE_BOUNDS.height / 2 + vacuumTubeVerticalExtension;
    const vacuumTubeLineWidth = 1.5;
    const vacuumTubeShape = new Shape()

      // Create the top boundary of the tube
      .moveTo( targetPlate.left - vacuumTubeHorizontalExtension, targetPlate.top - vacuumTubeVerticalExtension )
      .lineTo( collectorPlate.right + vacuumTubeHorizontalExtension, collectorPlate.top - vacuumTubeVerticalExtension )
      .moveTo( collectorPlate.right + vacuumTubeHorizontalExtension, collectorPlate.centerY )

      // Create the right end of the tube
      .ellipse(
        new Vector2( collectorPlate.right + vacuumTubeHorizontalExtension, collectorPlate.centerY ),
        tubeEndXRadius, tubeEndYRadius, 0 )

      // Create the bottom boundary of the tube
      .moveTo( collectorPlate.right + vacuumTubeHorizontalExtension, collectorPlate.bottom + vacuumTubeVerticalExtension )
      .lineTo( targetPlate.left - vacuumTubeHorizontalExtension, targetPlate.bottom + vacuumTubeVerticalExtension )
      .moveTo( targetPlate.left - vacuumTubeHorizontalExtension, targetPlate.centerY )

      // Create the left end of the tube
      .ellipse( new Vector2( targetPlate.left - vacuumTubeHorizontalExtension, targetPlate.centerY ),
        tubeEndXRadius, tubeEndYRadius, 0 );
    const vacuumNode = new Path( vacuumTubeShape, {
      stroke: PhotoelectricEffectColors.vacuumTubeColorProperty,
      lineWidth: vacuumTubeLineWidth
    } );

    /**
     * We want the vacuum tobe to appear as though it is surrounding the collectors and traveling electrons.
     * We create a clip area to cut out "holes" in the wire for the vacuum tube outline to appear through in two spots.
     */

      // Clip area that allows part of the vacuum line to appear in front of the circuit wire.
      // Shared parameters for the two spots where the circuit wire crosses the tube ellipses.
    const clipRectY = targetPlate.centerY - circuitWireLineWidth / 2;
    const clipRectWidth = vacuumTubeLineWidth;
    const clipRectHeight = circuitWireLineWidth;
    const leftClipRectX = targetPlate.left - vacuumTubeHorizontalExtension - tubeEndXRadius - vacuumTubeLineWidth / 2;
    const rightClipRectX = collectorPlate.right + vacuumTubeHorizontalExtension - tubeEndXRadius - vacuumTubeLineWidth / 2;

    const wireClipArea = new Shape()
      .rect( -1000, -1000, 2000, 2000 )

      // Left hole drawn in a counter-clockwise direction
      .moveTo( leftClipRectX + clipRectWidth, clipRectY )
      .lineTo( leftClipRectX, clipRectY )
      .lineTo( leftClipRectX, clipRectY + clipRectHeight )
      .lineTo( leftClipRectX + clipRectWidth, clipRectY + clipRectHeight )
      .close()

      // Right hole drawn in a counter-clockwise direction
      .moveTo( rightClipRectX + clipRectWidth, clipRectY )
      .lineTo( rightClipRectX, clipRectY )
      .lineTo( rightClipRectX, clipRectY + clipRectHeight )
      .lineTo( rightClipRectX + clipRectWidth, clipRectY + clipRectHeight )
      .close();

    const circuitWirePath = new Path( circuitWireShape, {
      stroke: PhotoelectricEffectColors.circuitWireColorProperty,
      lineWidth: circuitWireLineWidth,
      clipArea: wireClipArea
    } );

    const options = optionize<CircuitNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ vacuumNode, targetPlate, collectorPlate, circuitWirePath ]
    }, providedOptions );
    super( options );
  }
}