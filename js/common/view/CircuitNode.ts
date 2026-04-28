// Copyright 2026, University of Colorado Boulder
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
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

export default class CircuitNode extends Node {

  public constructor( modelViewTransform: ModelViewTransform2 ) {

    /**
     * Create the collectors and plate that the electrons travel between
     */
    const targetPlate = new Rectangle( PhotoelectricEffectConstants.TARGET_PLATE_BOUNDS, {
      rightCenter: modelViewTransform.modelToViewXY( PhotoelectricEffectConstants.TARGET_X, 0 ),
      fill: PhotoelectricEffectColors.targetPlateFillColorProperty,
      stroke: 'black'
    } );
    const targetCollector = new Rectangle( PhotoelectricEffectConstants.COLLECTOR_BOUNDS, {
      rightCenter: targetPlate.leftCenter,
      fill: PhotoelectricEffectColors.collectorColorProperty,
      cornerRadius: 5
    } );
    const sinkCollector = new Rectangle( PhotoelectricEffectConstants.COLLECTOR_BOUNDS, {
      leftCenter: modelViewTransform.modelToViewXY( PhotoelectricEffectConstants.COLLECTOR_X, 0 ),
      fill: PhotoelectricEffectColors.collectorColorProperty,
      cornerRadius: 5
    } );

    /**
     * Create the shape for the circuit wire that connects the collectors.
     */
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
    const vacuumNode = new Path( vacuumTubeShape, {
      stroke: PhotoelectricEffectColors.vacuumTubeColorProperty,
      lineWidth: vacuumTubeLineWidth
    } );

     // We want the vacuum tube to appear as though it is surrounding the collectors and traveling electrons.
     // To do this we create two elliptical arcs to z-order above the circuitWirePath.
    const leftTubeEndShape = new Shape().ellipticalArc( targetCollector.left - vacuumTubeHorizontalExtension,
      targetCollector.centerY, tubeEndXRadius, tubeEndYRadius, 0, Math.PI / 2, Math.PI * 1.5 );
    const leftTubeEndPath = new Path( leftTubeEndShape, { stroke: PhotoelectricEffectColors.vacuumTubeColorProperty,
      lineWidth: vacuumTubeLineWidth } );
    const rightTubeEndShape = new Shape().ellipticalArc( sinkCollector.right + vacuumTubeHorizontalExtension,
      sinkCollector.centerY, tubeEndXRadius, tubeEndYRadius, 0, Math.PI / 2, Math.PI * 1.5 );
    const rightTubeEndPath = new Path( rightTubeEndShape, { stroke: PhotoelectricEffectColors.vacuumTubeColorProperty,
      lineWidth: vacuumTubeLineWidth } );

    const circuitWirePath = new Path( circuitWireShape, {
      stroke: PhotoelectricEffectColors.circuitWireColorProperty,
      lineWidth: circuitWireLineWidth
    } );

    super( {
      children: [ vacuumNode, targetPlate, targetCollector, sinkCollector, circuitWirePath, leftTubeEndPath, rightTubeEndPath ]
    } );
  }
}