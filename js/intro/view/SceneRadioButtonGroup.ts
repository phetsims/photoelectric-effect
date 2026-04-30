// Copyright 2026, University of Colorado Boulder

/**
 * Control for switching the Intro screen between grounded and circuit scenes.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import circuit_svg from '../../../images/circuit_svg.js';
import ground_svg from '../../../images/ground_svg.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import type { IntroRepresentation } from '../model/IntroModel.js';

type SelfOptions = EmptySelfOptions;

export type SceneRadioButtonGroupOptions = SelfOptions & PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class SceneRadioButtonGroup extends RectangularRadioButtonGroup<IntroRepresentation> {

  public constructor( sceneProperty: PhetioProperty<IntroRepresentation>, providedOptions: SceneRadioButtonGroupOptions ) {

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

    const items: RectangularRadioButtonGroupItem<IntroRepresentation>[] = [
      {
        value: 'grounded',
        createNode: () => new Image( ground_svg ),
        tandemName: 'groundedRadioButton'
      },
      {
        value: 'circuit',
        createNode: () => new Image( circuit_svg ),
        tandemName: 'circuitRadioButton'
      }
    ];

    super( sceneProperty, items, options );
  }
}
