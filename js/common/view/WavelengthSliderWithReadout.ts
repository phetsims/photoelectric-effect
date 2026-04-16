// Copyright 2026, University of Colorado Boulder

/**
 * Wavelength control: HSlider with labeled spectrum track, spectrum thumb, and a NumberDisplay (nm) positioned
 * above the thumb and clamped to the track span.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import SpectrumSliderThumb from '../../../../scenery-phet/js/SpectrumSliderThumb.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Slider from '../../../../sun/js/Slider.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import { wavelengthToColor } from '../model/PhotoelectricEffectUtils.js';
import PhotonSource from '../model/PhotonSource.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import LabeledSpectrumSliderTrack from './LabeledSpectrumSliderTrack.js';

type SelfOptions = {
  trackSize?: Dimension2;
  thumbWidth?: number;
  thumbHeight?: number;
  readoutMaxWidth?: number;
  readoutAboveSliderSpacing?: number;
};

export type WavelengthSliderWithReadoutOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

const DEFAULT_TRACK_SIZE = new Dimension2( 240, 20 );

const DEFAULT_NUMBER_DISPLAY_OPTIONS: NumberDisplayOptions = {
  decimalPlaces: 0,
  cornerRadius: 4,
  backgroundFill: 'white',
  backgroundStroke: 'black',
  backgroundLineWidth: 1,
  align: 'center',
  xMargin: 2
};

export default class WavelengthSliderWithReadout extends Node {

  public constructor( photonSource: PhotonSource, providedOptions: WavelengthSliderWithReadoutOptions ) {

    const options = optionize<WavelengthSliderWithReadoutOptions, SelfOptions, NodeOptions>()( {
      trackSize: DEFAULT_TRACK_SIZE,
      thumbWidth: 18,
      thumbHeight: 25,
      readoutMaxWidth: 100,
      readoutAboveSliderSpacing: 5,
      isDisposable: false
    }, providedOptions );

    super();

    const wavelengthThumbNode = new SpectrumSliderThumb( photonSource.wavelengthProperty, {
      valueToColor: wavelengthToColor,
      width: options.thumbWidth,
      height: options.thumbHeight,
      cursorHeight: options.trackSize.height,
      tandem: options.tandem.createTandem( Slider.THUMB_NODE_TANDEM_NAME )
    } );

    const wavelengthTrackNode = new LabeledSpectrumSliderTrack( photonSource.wavelengthProperty, photonSource.wavelengthProperty.range, {
      valueToColor: wavelengthToColor,
      size: options.trackSize,
      tandem: options.tandem.createTandem( Slider.TRACK_NODE_TANDEM_NAME )
    } );

    const wavelengthSlider = new HSlider( photonSource.wavelengthProperty, photonSource.wavelengthProperty.range, {
      tandem: options.tandem,
      trackNode: wavelengthTrackNode,
      thumbNode: wavelengthThumbNode
    } );

    const wavelengthReadout = new NumberDisplay( photonSource.wavelengthProperty, photonSource.wavelengthProperty.range, combineOptions<NumberDisplayOptions>(
      {},
      DEFAULT_NUMBER_DISPLAY_OPTIONS,
      {
        valuePattern: PhotoelectricEffectFluent.wavelength.valueReadoutPatternStringProperty,
        textOptions: {
          font: PhotoelectricEffectConstants.READOUT_FONT,
          maxWidth: options.readoutMaxWidth
        },
        tandem: options.tandem.createTandem( 'wavelengthReadout' )
      }
    ) );

    this.addChild( wavelengthSlider );
    this.addChild( wavelengthReadout );

    this.mutate( options );

    Multilink.multilink(
      [
        photonSource.wavelengthProperty,
        wavelengthReadout.boundsProperty
      ],
      () => {
        WavelengthSliderWithReadout.updateReadoutLayout(
          photonSource,
          this,
          wavelengthSlider,
          wavelengthThumbNode,
          wavelengthReadout,
          wavelengthTrackNode,
          options.readoutAboveSliderSpacing
        );
      }
    );
  }

  /**
   * Keeps the readout centered above the thumb while clamping its center to the visible track span.
   * It is factored out into a static method to reduce complexity within the constructor.
   *
   * @param photonSource - provides current wavelength
   * @param sliderWithReadout - the entire WavelengthSliderWithReadout, needed for coordinate frame transformations
   * @param wavelengthSlider - for layout relative to the slider
   * @param wavelengthThumbNode - the readout is x aligned with the thumb
   * @param wavelengthReadout - the readout will be repositioned
   * @param wavelengthTrackNode - the track exposes a valueToPosition, and also is used for coordinate frame transforms
   * @param readoutAboveSliderSpacing - spacing between the slider track and the value readout
   */
  private static updateReadoutLayout(
    photonSource: PhotonSource,
    sliderWithReadout: Node,
    wavelengthSlider: HSlider,
    wavelengthThumbNode: SpectrumSliderThumb,
    wavelengthReadout: NumberDisplay,
    wavelengthTrackNode: LabeledSpectrumSliderTrack,
    readoutAboveSliderSpacing: number
  ): void {
    if ( sliderWithReadout.bounds.isValid() && wavelengthThumbNode.bounds.isValid() && wavelengthReadout.bounds.isValid() ) {
      const thumbCenterLocal = wavelengthThumbNode.localBounds.center;
      const thumbCenterGlobal = wavelengthThumbNode.localToGlobalPoint( thumbCenterLocal );
      const thumbCenterInRow = sliderWithReadout.globalToLocalPoint( thumbCenterGlobal );

      const valueToPosition = wavelengthTrackNode.valueToPositionProperty.value;
      const wavelengthRange = photonSource.wavelengthProperty.range;
      const trackLeftInRow = sliderWithReadout.globalToLocalPoint(
        wavelengthTrackNode.localToGlobalPoint( new Vector2( valueToPosition.evaluate( wavelengthRange.min ), 0 ) )
      ).x;
      const trackRightInRow = sliderWithReadout.globalToLocalPoint(
        wavelengthTrackNode.localToGlobalPoint( new Vector2( valueToPosition.evaluate( wavelengthRange.max ), 0 ) )
      ).x;

      const halfReadoutWidth = wavelengthReadout.width / 2;
      const minCenterX = trackLeftInRow + halfReadoutWidth;
      const maxCenterX = trackRightInRow - halfReadoutWidth;

      let centerX = thumbCenterInRow.x;
      if ( minCenterX <= maxCenterX ) {
        centerX = clamp( centerX, minCenterX, maxCenterX );
      }
      else {

        // Readout wider than the track interior: keep it centered on the bar.
        centerX = ( trackLeftInRow + trackRightInRow ) / 2;
      }

      wavelengthReadout.centerX = centerX;
      wavelengthReadout.bottom = wavelengthSlider.top - readoutAboveSliderSpacing;
    }
  }
}
