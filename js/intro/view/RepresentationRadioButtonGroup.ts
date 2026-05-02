// Copyright 2026, University of Colorado Boulder

/**
 * Control for switching the Intro screen between grounded and circuit representations.
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
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import type { IntroRepresentation } from '../model/IntroModel.js';

type SelfOptions = EmptySelfOptions;

export type RepresentationRadioButtonGroupOptions = SelfOptions & PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class RepresentationRadioButtonGroup extends RectangularRadioButtonGroup<IntroRepresentation> {

  public constructor( representationProperty: PhetioProperty<IntroRepresentation>, providedOptions: RepresentationRadioButtonGroupOptions ) {

    const options = optionize<RepresentationRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {

      // RectangularRadioButtonGroupOptions
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: PhotoelectricEffectColors.screenBackgroundColorProperty,

        // To create square shaped buttons.
        minWidth: 64,
        minHeight: 64
      },
      accessibleName: PhotoelectricEffectFluent.a11y.representationRadioButtonGroup.accessibleNameStringProperty,

      // Component should exist for life of simulation.
      isDisposable: false
    }, providedOptions );

    const items: RectangularRadioButtonGroupItem<IntroRepresentation>[] = [
      {
        value: 'grounded',
        createNode: () => new Image( ground_svg ),
        tandemName: 'groundedRadioButton',
        options: {
          accessibleName: PhotoelectricEffectFluent.a11y.representationRadioButtonGroup.groundedRadioButton.accessibleNameStringProperty
        }
      },
      {
        value: 'circuit',
        createNode: () => new Image( circuit_svg ),
        tandemName: 'circuitRadioButton',
        options: {
          accessibleName: PhotoelectricEffectFluent.a11y.representationRadioButtonGroup.circuitRadioButton.accessibleNameStringProperty
        }
      }
    ];

    super( representationProperty, items, options );
  }
}
