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
  public static readonly WIRE_HEIGHT = 150;

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
    const circuitWireHeight = CircuitNode.WIRE_HEIGHT;
    const circuitWirePlateExtension = 50;
    const circuitWireLineWidth = 10;
    const circuitWireShape = new Shape().moveToPoint( targetPlate.leftCenter )
      .lineTo( targetPlate.left - circuitWirePlateExtension, targetPlate.centerY )
      .lineTo( targetPlate.left - circuitWirePlateExtension, targetPlate.centerY + circuitWireHeight )
      .lineTo( collectorPlate.right + circuitWirePlateExtension, collectorPlate.centerY + circuitWireHeight )
      .lineTo( collectorPlate.right + circuitWirePlateExtension, collectorPlate.centerY )
      .lineToPoint( collectorPlate.rightCenter );

    const circuitWirePath = new Path( circuitWireShape, {
      stroke: PhotoelectricEffectColors.circuitWireColorProperty,
      lineWidth: circuitWireLineWidth
    } );

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

    // We want the vacuum tube to appear as though it is surrounding the collectors and traveling electrons.
    // To do this we create two elliptical arcs to z-order above the circuitWirePath.
    const leftTubeEndShape = new Shape().ellipticalArc( targetPlate.left - vacuumTubeHorizontalExtension,
      targetPlate.centerY, tubeEndXRadius, tubeEndYRadius, 0, Math.PI / 2, Math.PI * 1.5 );
    const leftTubeEndPath = new Path( leftTubeEndShape, {
      stroke: PhotoelectricEffectColors.vacuumTubeColorProperty,
      lineWidth: vacuumTubeLineWidth
    } );
    const rightTubeEndShape = new Shape().ellipticalArc( collectorPlate.right + vacuumTubeHorizontalExtension,
      collectorPlate.centerY, tubeEndXRadius, tubeEndYRadius, 0, Math.PI / 2, Math.PI * 1.5 );
    const rightTubeEndPath = new Path( rightTubeEndShape, {
      stroke: PhotoelectricEffectColors.vacuumTubeColorProperty,
      lineWidth: vacuumTubeLineWidth
    } );

    const options = optionize<CircuitNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ vacuumNode, targetPlate, collectorPlate, circuitWirePath, leftTubeEndPath, rightTubeEndPath ]
    }, providedOptions );
    super( options );
  }
}