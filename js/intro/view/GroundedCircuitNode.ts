// Copyright 2024-2026, University of Colorado Boulder

/**
 * GroundedCircuitNode renders the Intro screen's simplified grounded target plate.
 *
 * This node composes the target plate artwork with a fixed ground-wire path so Intro can show a grounded
 * configuration without the full experiment-screen circuit assembly.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
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
  public constructor( modelViewTransform: ModelViewTransform2, providedOptions?: GroundedCircuitNodeOptions ) {
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

    // The ground symbol shape is made of three lines that get narrower as they go further down.
    const groundSymbolWidth = 60;
    const symbolVerticalSpacing = 15;
    const groundSymbolShape = new Shape().moveTo( targetPlate.left - 50 - groundSymbolWidth / 2, groundLinePath.bottom )
      .lineTo( targetPlate.left - 50 + groundSymbolWidth / 2, groundLinePath.bottom )
      .moveTo( targetPlate.left - 50 - groundSymbolWidth / 3, groundLinePath.bottom + symbolVerticalSpacing )
      .lineTo( targetPlate.left - 50 + groundSymbolWidth / 3, groundLinePath.bottom + symbolVerticalSpacing )
      .moveTo( targetPlate.left - 50 - groundSymbolWidth / 6, groundLinePath.bottom + symbolVerticalSpacing * 2 )
      .lineTo( targetPlate.left - 50 + groundSymbolWidth / 6, groundLinePath.bottom + symbolVerticalSpacing * 2 );
    const groundSymbolPath = new Path( groundSymbolShape, {
      stroke: 'black',
      lineWidth: 5
    } );

    const options = optionize<GroundedCircuitNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ targetPlate, groundLinePath, groundSymbolPath ]
    }, providedOptions );
    super( options );
  }
}