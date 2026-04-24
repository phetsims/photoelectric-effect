// Copyright 2024, University of Colorado Boulder
/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

export default class CircuitNode extends Node {

  public constructor( modelViewTransform: ModelViewTransform2 ) {

    const targetPlate = new Rectangle( PhotoelectricEffectConstants.TARGET_PLATE_BOUNDS, {
      rightCenter: modelViewTransform.modelToViewXY( PhotoelectricEffectConstants.TARGET_X, 0 ),
      fill: 'gray',
      stroke: 'black'
    } );
    const targetCollector = new Rectangle( PhotoelectricEffectConstants.COLLECTOR_BOUNDS, {
      rightCenter: targetPlate.leftCenter,
      fill: 'black',
      cornerRadius: 5
    } );
    const sinkCollector = new Rectangle( PhotoelectricEffectConstants.COLLECTOR_BOUNDS, {
      leftCenter: modelViewTransform.modelToViewXY( PhotoelectricEffectConstants.COLLECTOR_X, 0 ),
      fill: 'black',
      cornerRadius: 5
    } );

    const circuitWireHeight = 150;
    const circuitWirePlateExtension = 50;
    const circuitWireLineWidth = 10;
    const circuitWireShape = new Shape().moveToPoint( targetCollector.leftCenter )
      .lineTo( targetCollector.left - circuitWirePlateExtension, targetCollector.centerY )
      .lineTo( targetCollector.left - circuitWirePlateExtension, targetCollector.centerY + circuitWireHeight )
      .lineTo( sinkCollector.right + circuitWirePlateExtension, sinkCollector.centerY + circuitWireHeight )
      .lineTo( sinkCollector.right + circuitWirePlateExtension, sinkCollector.centerY )
      .lineToPoint( sinkCollector.rightCenter );


    /**
     * Create the vacuum tube which is an outline of a cylinder.
     */
    const vacuumTubeHorizontalExtension = 10;
    const vacuumTubeVerticalExtension = 10;
    const tubeEndXRadius = 5;
    const tubeEndYRadius = PhotoelectricEffectConstants.COLLECTOR_BOUNDS.height / 2 + vacuumTubeVerticalExtension;
    const vacuumTubeLineWidth = 1.5;
    const vacuumTubeShape = new Shape()

      // Create the top boundary of the tube
      .moveTo( targetCollector.left - vacuumTubeHorizontalExtension, targetCollector.top - vacuumTubeVerticalExtension )
      .lineTo( sinkCollector.right + vacuumTubeHorizontalExtension, sinkCollector.top - vacuumTubeVerticalExtension )
      .moveTo( sinkCollector.right + vacuumTubeHorizontalExtension, sinkCollector.centerY )

      // Create the right end of the tube
      .ellipse(
        new Vector2( sinkCollector.right + vacuumTubeHorizontalExtension, sinkCollector.centerY ),
        tubeEndXRadius, tubeEndYRadius, 0 )

      // Create the bottom boundary of the tube
      .moveTo( sinkCollector.right + vacuumTubeHorizontalExtension, sinkCollector.bottom + vacuumTubeVerticalExtension )
      .lineTo( targetCollector.left - vacuumTubeHorizontalExtension, targetCollector.bottom + vacuumTubeVerticalExtension )
      .moveTo( targetCollector.left - vacuumTubeHorizontalExtension, targetCollector.centerY )

      // Create the left end of the tube
      .ellipse( new Vector2( targetCollector.left - vacuumTubeHorizontalExtension, targetCollector.centerY ),
        tubeEndXRadius, tubeEndYRadius, 0 );

    // Clip area that allows part of the vacuum line to appear in front of the circuit wire.
    // Shared parameters for the two spots where the circuit wire crosses the tube ellipses.
    const clipRectY = targetCollector.centerY - circuitWireLineWidth / 2;
    const clipRectWidth = vacuumTubeLineWidth;
    const clipRectHeight = circuitWireLineWidth;
    const leftClipRectX = targetCollector.left - vacuumTubeHorizontalExtension - tubeEndXRadius - vacuumTubeLineWidth / 2;
    const rightClipRectX = sinkCollector.right + vacuumTubeHorizontalExtension - tubeEndXRadius - vacuumTubeLineWidth / 2;

    const wireClipArea = new Shape()
      .rect( -1000, -1000, 2000, 2000 )

      // Left hole
      .moveTo( leftClipRectX + clipRectWidth, clipRectY )
      .lineTo( leftClipRectX, clipRectY )
      .lineTo( leftClipRectX, clipRectY + clipRectHeight )
      .lineTo( leftClipRectX + clipRectWidth, clipRectY + clipRectHeight )
      .close()

      // Right hole
      .moveTo( rightClipRectX + clipRectWidth, clipRectY )
      .lineTo( rightClipRectX, clipRectY )
      .lineTo( rightClipRectX, clipRectY + clipRectHeight )
      .lineTo( rightClipRectX + clipRectWidth, clipRectY + clipRectHeight )
      .close();

    const vacuumNode = new Path( vacuumTubeShape, {
      stroke: 'blue',
      lineWidth: vacuumTubeLineWidth
    } );

    const circuitWirePath = new Path( circuitWireShape, {
      stroke: 'gray',
      lineWidth: circuitWireLineWidth,
      clipArea: wireClipArea
    } );

    super( {
      children: [ vacuumNode, targetPlate, targetCollector, sinkCollector, circuitWirePath ]
    } );
  }
}