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
    const circuitShape = new Shape().moveToPoint( targetCollector.leftCenter )
      .lineTo( targetCollector.left - circuitWirePlateExtension, targetCollector.centerY )
      .lineTo( targetCollector.left - circuitWirePlateExtension, targetCollector.centerY + circuitWireHeight )
      .lineTo( sinkCollector.right + circuitWirePlateExtension, sinkCollector.centerY + circuitWireHeight )
      .lineTo( sinkCollector.right + circuitWirePlateExtension, sinkCollector.centerY )
      .lineToPoint( sinkCollector.rightCenter );
    const circuitPath = new Path( circuitShape, {
      stroke: 'gray',
      lineWidth: 10
    } );

    /**
     * Create the vacuum tube which is an outline of a cylinder.
     */
    const vacuumTubeHorizontalExtension = 10;
    const vacuumTubeVerticalExtension = 10;
    const tubeEndXRadius = 5;
    const tubeEndYRadius = PhotoelectricEffectConstants.COLLECTOR_BOUNDS.height / 2 + vacuumTubeVerticalExtension;
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
    const vacuumNode = new Path( vacuumTubeShape, {
      stroke: 'blue'
    } );

    super( {
      children: [ vacuumNode, targetPlate, targetCollector, sinkCollector, circuitPath ]
    } );
  }
}