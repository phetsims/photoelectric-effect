// Copyright 2024-2026, University of Colorado Boulder

/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import CircuitFactory from '../../common/view/CircuitFactory.js';

type SelfOptions = EmptySelfOptions;
type GroundedCircuitNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class GroundedCircuitNode extends Node {

  public constructor( modelViewTransform: ModelViewTransform2, providedOptions: GroundedCircuitNodeOptions ) {
    const targetPlate = CircuitFactory.createPlateWithMaterial( {
      rightCenter: modelViewTransform.modelToViewXY( PhotoelectricEffectConstants.TARGET_X, 0 )
    } );

    const groundLineShape = new Shape().moveToPoint( targetPlate.leftCenter )
      .lineTo( targetPlate.left - 50, targetPlate.centerY )
      .lineTo( targetPlate.left - 50, targetPlate.centerY + 150 );
    const groundLinePath = new Path( groundLineShape, {
      stroke: 'black',
      lineWidth: 5
    } );

    const options = optionize<GroundedCircuitNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ targetPlate, groundLinePath ]
    }, providedOptions );
    super( options );
  }
}