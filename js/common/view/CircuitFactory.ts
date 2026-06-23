// Copyright 2026, University of Colorado Boulder

/**
 * Factory methods for constructing circuit plate Nodes used in the Photoelectric Effect view.
 * These helpers centralize plate geometry, colors, and composition so plate visuals stay
 * consistent across call sites.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Node, { type NodeOptions, type NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle, { type RectangleOptions } from '../../../../scenery/js/nodes/Rectangle.js';
import type Color from '../../../../scenery/js/util/Color.js';
import type Material from '../model/Material.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

export default class CircuitFactory {

  /**
   * Creates a single plate rectangle using shared bounds and collector styling.
   *
   * @param translationOptions
   */
  public static createPlate( translationOptions?: NodeTranslationOptions ): Node {
    return new Rectangle( PhotoelectricEffectConstants.PLATE_BOUNDS, combineOptions<RectangleOptions>( {
      fill: PhotoelectricEffectColors.collectorColorProperty,
      cornerRadius: 5
    }, translationOptions ) );
  }

  /**
   * Creates a composite Node that includes the material region and an attached plate.
   * The plate is positioned so its right-center aligns with the material's left-center.
   *
   * @param materialProperty - active target material that determines the material-strip fill
   * @param translationOptions
   */
  public static createPlateWithMaterial(
    materialProperty: TReadOnlyProperty<Material>,
    translationOptions?: NodeTranslationOptions
  ): Node {

    const targetPlateFillProperty = new DynamicProperty<Color, Color, Material>( materialProperty, {
      derive: material => material.materialType.targetPlateFillColorProperty
    } );

    const material = new Rectangle( PhotoelectricEffectConstants.PLATE_MATERIAL_BOUNDS, {
      fill: targetPlateFillProperty,
      stroke: PhotoelectricEffectColors.circuitStrokeColorProperty
    } );
    const plate = CircuitFactory.createPlate( { rightCenter: material.leftCenter } );

    return new Node( combineOptions<NodeOptions>( {
      children: [ material, plate ]
    }, translationOptions ) );
  }
}