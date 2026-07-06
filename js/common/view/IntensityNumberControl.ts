// Copyright 2026, University of Colorado Boulder

/**
 * IntensityNumberControl controls the normalized intensity of the photon source, presented as a percentage with a
 * slider, NumberDisplay, and arrow buttons. Depending on the selected emission mode, the same normalized value is
 * interpreted as either light intensity or photon rate.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import MappedProperty from '../../../../axon/js/MappedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import SliderTrack from '../../../../sun/js/SliderTrack.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import { wavelengthToIntensityGradientEndColor } from '../model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

type SelfOptions = EmptySelfOptions;

export type IntensityNumberControlOptions = SelfOptions & PickRequired<NumberControlOptions, 'tandem'>;

// Track width matches the wavelength control below it in the photon source panel. The track itself is rendered
// as a narrow gradient rectangle, see the layout function.
const TRACK_SIZE = new Dimension2( 240, 5 );
const THUMB_SIZE = new Dimension2( 10, 25 );
const READOUT_MAX_WIDTH = 72;
const TITLE_MAX_WIDTH = 100;

const NUMBER_DISPLAY_BASE: NumberDisplayOptions = {
  cornerRadius: 5,
  backgroundStroke: PhotoelectricEffectColors.circuitWireColorProperty,
  align: 'center',
  xMargin: 2
};

export default class IntensityNumberControl extends NumberControl {

  /**
   * @param normalizedIntensityProperty - normalized source intensity
   * @param wavelengthProperty - wavelength of emitted photons, colors the gradient behind the slider
   * @param providedOptions
   */
  public constructor(
    normalizedIntensityProperty: NumberProperty,
    wavelengthProperty: TReadOnlyProperty<number>,
    providedOptions: IntensityNumberControlOptions
  ) {

    // Percent view of the normalized intensity, controlled by the slider/arrows and shown in the NumberDisplay.
    const percentProperty = new MappedProperty( normalizedIntensityProperty, {
      bidirectional: true,
      map: ( value: number ) => value * 100,
      inverseMap: ( value: number ) => value / 100
    } );
    const percentRange = new Range(
      normalizedIntensityProperty.range.min * 100,
      normalizedIntensityProperty.range.max * 100
    );

    // Narrow wavelength-colored gradient rectangle that acts as the visible track. The slider's own track is
    // transparent (see sliderOptions) but still handles input. The track spans the slider's local x origin and
    // is vertically centered on the thumb.
    const gradientRectangle = new Rectangle(
      0, 0, TRACK_SIZE.width, TRACK_SIZE.height, {
        stroke: PhotoelectricEffectColors.circuitWireColorProperty,
        lineWidth: 1
      } );
    wavelengthProperty.link( wavelength => {
      const endColor = wavelengthToIntensityGradientEndColor( wavelength );
      gradientRectangle.fill = new LinearGradient( gradientRectangle.rectX, 0, gradientRectangle.rectX + gradientRectangle.rectWidth, 0 )
        .addColorStop( 0, Color.WHITE )
        .addColorStop( 1, endColor );
    } );
    const sliderTrack = new SliderTrack( percentProperty, gradientRectangle, percentRange, {
      size: TRACK_SIZE
    } );

    const options = optionize<IntensityNumberControlOptions, SelfOptions, NumberControlOptions>()( {
      isDisposable: false,
      layoutFunction: NumberControl.createLayoutFunction2( {
        align: 'left',
        xSpacing: 10
      } ),
      delta: 1,
      accessibleName: PhotoelectricEffectFluent.a11y.photonSourceControl.intensitySlider.accessibleNameStringProperty,
      titleNodeOptions: {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        maxWidth: TITLE_MAX_WIDTH
      },
      numberDisplayOptions: combineOptions<NumberDisplayOptions>(
        {},
        NUMBER_DISPLAY_BASE,
        {
          valuePattern: PhotoelectricEffectFluent.sourceIntensity.percentReadoutPatternStringProperty,
          textOptions: {
            font: PhotoelectricEffectConstants.READOUT_FONT,
            maxWidth: READOUT_MAX_WIDTH
          }
        }
      ),
      sliderOptions: {
        trackNode: sliderTrack,
        thumbSize: THUMB_SIZE,

        // Integer percents, so the slider always agrees with the readout and the arrow buttons.
        constrainValue: value => roundToInterval( value, 1 ),
        phetioVisiblePropertyInstrumented: false // Component cannot be hidden since it is critical to usage of the sim.
      },
      phetioVisiblePropertyInstrumented: false // Component cannot be hidden since it is critical to usage of the sim.
    }, providedOptions );

    super( PhotoelectricEffectFluent.intensity.labelStringProperty, percentProperty, percentRange, options );
  }
}
