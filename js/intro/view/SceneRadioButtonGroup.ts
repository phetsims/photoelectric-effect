// Copyright 2026, University of Colorado Boulder

/**
 * Control for switching the Intro screen between grounded and circuit scenes.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import type { IntroScene } from '../model/IntroModel.js';

type SelfOptions = EmptySelfOptions;

export type SceneRadioButtonGroupOptions = SelfOptions & PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class SceneRadioButtonGroup extends RectangularRadioButtonGroup<IntroScene> {

  public constructor( sceneProperty: PhetioProperty<IntroScene>, providedOptions: SceneRadioButtonGroupOptions ) {

    const options = optionize<SceneRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {

      // RectangularRadioButtonGroupOptions
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: PhotoelectricEffectColors.screenBackgroundColorProperty,

        // To create square shaped buttons.
        minWidth: 64,
        minHeight: 64
      },

      // Component should exist for life of simulation.
      isDisposable: false
    }, providedOptions );

    const items: RectangularRadioButtonGroupItem<IntroScene>[] = [
      {
        value: 'grounded',
        createNode: () => SceneRadioButtonGroup.createGroundIcon(),
        tandemName: 'groundedRadioButton'
      },
      {
        value: 'circuit',
        createNode: () => SceneRadioButtonGroup.createCircuitIcon(),
        tandemName: 'circuitRadioButton'
      }
    ];

    super( sceneProperty, items, options );
  }

  /**
   * Creates a grounded scene icon based provided SVG artwork.
   */
  private static createGroundIcon(): Path {

    // Coordinates below are copied from provided SVG artwork.
    const shape = new Shape()
      .moveTo( 15.83, 0 )
      .lineTo( 15.83, 23.48 )
      .moveTo( 0, 23.48 )
      .lineTo( 31.65, 23.48 )
      .moveTo( 5.75, 30.82 )
      .lineTo( 25.91, 30.82 )
      .moveTo( 11.12, 38.22 )
      .lineTo( 20.53, 38.22 );

    return new Path( shape, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 3
    } );
  }

  /**
   * Creates a circuit scene icon based on provided SVG artwork.
   */
  private static createCircuitIcon(): Path {

    // Coordinates below are copied from provided SVG artwork.
    const shape = new Shape()
      .moveTo( 18.44, 1.2 )
      .lineTo( 35.74, 10.79 )
      .moveTo( 54.01, 6.04 )
      .lineTo( 42.45, 6.04 )
      .moveTo( 11.56, 6.04 )
      .lineTo( 0, 6.04 )
      .moveTo( 17.05 + 5.04, 6.04 )
      .arc( 17.05, 6.04, 5.04, 0, Math.PI * 2, false )
      .moveTo( 37.41 + 5.04, 6.04 )
      .arc( 37.41, 6.04, 5.04, 0, Math.PI * 2, false );

    return new Path( shape, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 2
    } );
  }
}
