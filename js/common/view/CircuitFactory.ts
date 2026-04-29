// Copyright 2024-2026, University of Colorado Boulder

/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Node, { NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle, { RectangleOptions } from '../../../../scenery/js/nodes/Rectangle.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

export default class CircuitFactory {
  public static createPlate( translationOptions?: NodeTranslationOptions ): Node {
    return new Rectangle( PhotoelectricEffectConstants.PLATE_BOUNDS, combineOptions<RectangleOptions>( {
      fill: PhotoelectricEffectColors.collectorColorProperty,
      cornerRadius: 5
    }, translationOptions ) );
  }

  public static createPlateWithMaterial( translationOptions?: NodeTranslationOptions ): Node {
    const material = new Rectangle( PhotoelectricEffectConstants.PLATE_MATERIAL_BOUNDS, {
      fill: PhotoelectricEffectColors.targetPlateFillColorProperty,
      stroke: 'black'
    } );
    const plate = CircuitFactory.createPlate( { rightCenter: material.leftCenter } );

    return new Node( combineOptions<NodeOptions>( {
      children: [ material, plate ]
    }, translationOptions ) );
  }
}