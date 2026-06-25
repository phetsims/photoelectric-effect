// Copyright 2026, University of Colorado Boulder

/**
 * PhotonSourceOutputSlider controls the normalized intensity of the photon source. Depending on the selected emission
 * mode, the same normalized value is interpreted as either light intensity or photon rate.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import HSlider from '../../../../sun/js/HSlider.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import { wavelengthToIntensityGradientEndColor } from '../model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

type SelfOptions = {
  trackSize?: Dimension2;
  thumbSize?: Dimension2;
  readoutMaxWidth?: number;
};

export type PhotonSourceOutputSliderOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

// Horizontal gap between the gradient rectangle and the percent readout.
const READOUT_SPACING = 6;

// Vertical gap between the intensity title and the slider track.
const LABEL_SLIDER_SPACING = 5;

const OUTPUT_LABEL_MAX_WIDTH = 200;

const NUMBER_DISPLAY_BASE: NumberDisplayOptions = {
  decimalPlaces: 0,
  cornerRadius: 4,
  backgroundFill: 'white',
  backgroundStroke: 'black',
  backgroundLineWidth: 1,
  align: 'center',
  xMargin: 2
};

export default class PhotonSourceOutputSlider extends Node {

  /**
   * @param normalizedIntensityProperty - normalized source intensity
   * @param normalizedOutputPercentProperty - source intensity reported as a percentage for display
   * @param wavelengthProperty - wavelength of emitted photons
   * @param providedOptions
   */
  public constructor(
    normalizedIntensityProperty: NumberProperty,
    normalizedOutputPercentProperty: TReadOnlyProperty<number>,
    wavelengthProperty: TReadOnlyProperty<number>,
    providedOptions: PhotonSourceOutputSliderOptions
  ) {

    const options = optionize<PhotonSourceOutputSliderOptions, SelfOptions, NodeOptions>()( {
      trackSize: new Dimension2( 125, 5 ),
      thumbSize: new Dimension2( 13, 26 ),
      readoutMaxWidth: 72,
      isDisposable: false
    }, providedOptions );

    super();

    const intensityLabel = new Text( PhotoelectricEffectFluent.intensity.labelStringProperty, {
      font: PhotoelectricEffectConstants.PANEL_TITLE_FONT,
      maxWidth: OUTPUT_LABEL_MAX_WIDTH
    } );

    const slider = new HSlider( normalizedIntensityProperty, normalizedIntensityProperty.range, {
      tandem: options.tandem.createTandem( 'slider' ),
      trackSize: options.trackSize,
      thumbSize: options.thumbSize
    } );

    const intensityGradientRectangle = new Rectangle( slider.localBounds, {
      stroke: PhotoelectricEffectColors.panelStrokeColorProperty,
      lineWidth: 1
    } );

    const intensityReadout = new NumberDisplay( normalizedOutputPercentProperty, new Range(
      normalizedIntensityProperty.range.min * 100,
      normalizedIntensityProperty.range.max * 100
    ), combineOptions<NumberDisplayOptions>(
      {},
      NUMBER_DISPLAY_BASE,
      {
        valuePattern: PhotoelectricEffectFluent.sourceOutput.percentReadoutPatternStringProperty,
        textOptions: {
          font: PhotoelectricEffectConstants.READOUT_FONT,
          maxWidth: options.readoutMaxWidth
        },
        tandem: options.tandem.createTandem( 'intensityReadout' )
      }
    ) );

    const sliderStack = new Node( {
      children: [
        intensityGradientRectangle,
        slider
      ]
    } );

    // An invisible strut balances the visible readout so the slider remains centered in the parent layout.
    const readoutBalanceStrut = new HStrut( 0, {
      pickable: false,
      visibleProperty: intensityReadout.visibleProperty
    } );
    intensityReadout.localBoundsProperty.link( bounds => {
      readoutBalanceStrut.localBounds = new Bounds2( 0, 0, bounds.width, 0 );
    } );

    const content = new VBox( {
      spacing: LABEL_SLIDER_SPACING,
      align: 'center',
      children: [
        intensityLabel,
        new HBox( {
          spacing: READOUT_SPACING,
          align: 'center',
          children: [
            readoutBalanceStrut,
            sliderStack,
            intensityReadout
          ]
        } )
      ]
    } );

    this.addChild( content );
    this.mutate( options );

    // Update gradient for the backplate when selected wavelength changes.
    const gradientWidth = intensityGradientRectangle.rectWidth;
    wavelengthProperty.link( wavelength => {
      const endColor = wavelengthToIntensityGradientEndColor( wavelength );
      intensityGradientRectangle.fill = new LinearGradient( 0, 0, gradientWidth, 0 )
        .addColorStop( 0, Color.BLACK )
        .addColorStop( 1, endColor );
    } );
  }
}
