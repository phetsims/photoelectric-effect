// Copyright 2026, University of Colorado Boulder

/**
 * Wavelength control with labeled spectrum track, spectrum thumb, NumberDisplay (nm), and arrow buttons.
 * The UV/IR labels are drawn directly on the spectrum track, so no custom layout is needed.
 *
 * TODO: Highly duplicated with MonochromaticWavelengthControl. Consider moving to scenery-phet or
 *   improving WavelengthNumberControl.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import SpectrumSliderThumb from '../../../../scenery-phet/js/SpectrumSliderThumb.js';
import SpectrumSliderTrack from '../../../../scenery-phet/js/SpectrumSliderTrack.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Slider from '../../../../sun/js/Slider.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import { wavelengthToColorWithGradient } from '../model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

type SelfOptions = EmptySelfOptions;
export type LabeledWavelengthNumberControlOptions = SelfOptions & PickRequired<NumberControlOptions, 'tandem'>;

const TRACK_SIZE = new Dimension2( 240, 20 );
const THUMB_WIDTH = 18;
const THUMB_HEIGHT = 25;
const READOUT_MAX_WIDTH = 100;
const TITLE_MAX_WIDTH = 100;

const DEFAULT_NUMBER_DISPLAY_OPTIONS: NumberDisplayOptions = {
  cornerRadius: 5,
  backgroundStroke: PhotoelectricEffectColors.circuitWireColorProperty,
  align: 'center',
  xMargin: 2
};

export default class LabeledWavelengthNumberControl extends NumberControl {

  public constructor( wavelengthProperty: NumberProperty, providedOptions: LabeledWavelengthNumberControlOptions ) {

    const wavelengthRange = wavelengthProperty.range;
    const sliderTandem = providedOptions.tandem.createTandem( NumberControl.SLIDER_TANDEM_NAME );

    // Spectrum track with the UV/IR labels drawn directly on it, in the track's simple local coordinate frame.
    const trackNode = new SpectrumSliderTrack( wavelengthProperty, wavelengthRange, {
      valueToColor: wavelengthToColorWithGradient,
      size: TRACK_SIZE,
      tandem: sliderTandem.createTandem( Slider.TRACK_NODE_TANDEM_NAME ),
      phetioVisiblePropertyInstrumented: false // Component cannot be hidden since it is critical to usage of the sim.
    } );

    const uvText = new Text( PhotoelectricEffectFluent.spectrumTrack.uvLabelStringProperty, {
      font: PhotoelectricEffectConstants.LABEL_FONT,
      maxWidth: 75
    } );
    const irText = new Text( PhotoelectricEffectFluent.spectrumTrack.irLabelStringProperty, {
      font: PhotoelectricEffectConstants.LABEL_FONT,
      maxWidth: 18
    } );
    trackNode.addChild( uvText );
    trackNode.addChild( irText );

    // Center each label over its segment of the track: UV between the range min and the start of the visible
    // spectrum, IR between the end of the visible spectrum and the range max. The constraint keeps the labels
    // centered when dynamic strings resize them.
    const trackRangeLength = wavelengthRange.getLength();
    ManualConstraint.create( trackNode, [ uvText, irText ], ( uvTextProxy, irTextProxy ) => {
      uvTextProxy.centerX = TRACK_SIZE.width * ( VisibleColor.MIN_WAVELENGTH - wavelengthRange.min ) / trackRangeLength / 2;
      uvTextProxy.centerY = TRACK_SIZE.height / 2;
      irTextProxy.centerX = TRACK_SIZE.width * ( VisibleColor.MAX_WAVELENGTH - wavelengthRange.min ) / trackRangeLength +
                            TRACK_SIZE.width * ( wavelengthRange.max - VisibleColor.MAX_WAVELENGTH ) / trackRangeLength / 2;
      irTextProxy.centerY = TRACK_SIZE.height / 2;
    } );

    const thumbNode = new SpectrumSliderThumb( wavelengthProperty, {
      valueToColor: wavelengthToColorWithGradient,
      width: THUMB_WIDTH,
      height: THUMB_HEIGHT,
      cursorHeight: TRACK_SIZE.height,
      tandem: sliderTandem.createTandem( Slider.THUMB_NODE_TANDEM_NAME ),
      phetioVisiblePropertyInstrumented: false // Component cannot be hidden since it is critical to usage of the sim.
    } );

    const options = optionize<LabeledWavelengthNumberControlOptions, SelfOptions, NumberControlOptions>()( {
      isDisposable: false,
      layoutFunction: NumberControl.createLayoutFunction2( {
        align: 'left',
        xSpacing: 10
      } ),
      accessibleName: PhotoelectricEffectFluent.a11y.photonSourceControl.wavelengthNumberControl.accessibleNameStringProperty,
      titleNodeOptions: {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        maxWidth: TITLE_MAX_WIDTH
      },
      numberDisplayOptions: combineOptions<NumberDisplayOptions>(
        {},
        DEFAULT_NUMBER_DISPLAY_OPTIONS,
        {
          valuePattern: PhotoelectricEffectFluent.wavelength.valueReadoutPatternStringProperty,
          textOptions: {
            font: PhotoelectricEffectConstants.READOUT_FONT,
            maxWidth: READOUT_MAX_WIDTH
          }
        }
      ),
      sliderOptions: {
        trackNode: trackNode,
        thumbNode: thumbNode,
        phetioVisiblePropertyInstrumented: false // Component cannot be hidden since it is critical to usage of the sim.
      },
      phetioVisiblePropertyInstrumented: false // Component cannot be hidden since it is critical to usage of the sim.
    }, providedOptions );

    super( PhotoelectricEffectFluent.wavelength.labelStringProperty, wavelengthProperty, wavelengthRange, options );
  }
}
