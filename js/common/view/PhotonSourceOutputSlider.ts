// Copyright 2026, University of Colorado Boulder

/**
 * PhotonSourceOutputSlider controls the normalized output of the photon source. Depending on the selected emission
 * mode, the same normalized value is interpreted as either light intensity or photon rate.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import HSlider from '../../../../sun/js/HSlider.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import PhotoelectricEffectPreferences from '../model/PhotoelectricEffectPreferences.js';
import { wavelengthToIntensityGradientEndColor } from '../model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

type SelfOptions = {
  trackSize?: Dimension2;
  thumbSize?: Dimension2;
  readoutMaxWidth?: number;
};

export type PhotonSourceOutputSliderOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

// Horizontal gap between the gradient rectangle and the percent readout.
const READOUT_SPACING = 6;

// Vertical gap between the output title and the slider track.
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
   * @param normalizedOutputProperty - normalized source output
   * @param normalizedOutputPercentProperty - source output reported as a percentage for display
   * @param wavelengthProperty - wavelength of emitted photons
   * @param providedOptions
   */
  public constructor(
    normalizedOutputProperty: NumberProperty,
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

    const outputLabelStringProperty = new DerivedProperty(
      [
        PhotoelectricEffectPreferences.photonCountModeEnabledProperty,
        PhotoelectricEffectFluent.intensity.labelStringProperty,
        PhotoelectricEffectFluent.photonRate.labelStringProperty
      ],
      ( photonCountModeEnabled, intensityLabel, photonRateLabel ) => photonCountModeEnabled ? photonRateLabel : intensityLabel
    );

    const outputLabel = new Text( outputLabelStringProperty, {
      font: PhotoelectricEffectConstants.PANEL_TITLE_FONT,
      maxWidth: OUTPUT_LABEL_MAX_WIDTH
    } );

    const outputSlider = new HSlider( normalizedOutputProperty, normalizedOutputProperty.range, {
      tandem: options.tandem.createTandem( 'outputSlider' ),
      trackSize: options.trackSize,
      thumbSize: options.thumbSize
    } );

    const outputGradientRectangle = new Rectangle( outputSlider.localBounds, {
      stroke: 'black',
      lineWidth: 1
    } );

    const outputReadout = new NumberDisplay( normalizedOutputPercentProperty, new Range(
      normalizedOutputProperty.range.min * 100,
      normalizedOutputProperty.range.max * 100
    ), combineOptions<NumberDisplayOptions>(
      {},
      NUMBER_DISPLAY_BASE,
      {
        valuePattern: PhotoelectricEffectFluent.sourceOutput.percentReadoutPatternStringProperty,
        textOptions: {
          font: PhotoelectricEffectConstants.READOUT_FONT,
          maxWidth: options.readoutMaxWidth
        },
        tandem: options.tandem.createTandem( 'outputReadout' )
      }
    ) );

    this.addChild( outputLabel );
    this.addChild( outputGradientRectangle );
    this.addChild( outputSlider );
    this.addChild( outputReadout );

    this.mutate( options );

    // Static layout - slider and gradient are at the origin, output label centered above, with
    // output readout centered to the right.
    outputLabel.centerX = outputGradientRectangle.centerX;
    outputLabel.bottom = outputGradientRectangle.top - LABEL_SLIDER_SPACING;
    outputReadout.left = outputGradientRectangle.right + READOUT_SPACING;
    outputReadout.centerY = outputGradientRectangle.centerY;

    // Update gradient for the backplate when selected wavelength changes.
    wavelengthProperty.link( wavelength => {
      const gradientWidth = outputGradientRectangle.rectWidth;
      const endColor = wavelengthToIntensityGradientEndColor( wavelength );
      outputGradientRectangle.fill = new LinearGradient( 0, 0, gradientWidth, 0 )
        .addColorStop( 0, Color.BLACK )
        .addColorStop( 1, endColor );
    } );

    // Override local bounds for this component when the output string changes (likely from
    // dynamic locales). The logical bounds includes the backplate rectangle and the output label,
    // but excludes the output readout for layout purposes when used in panels.
    const backplateBounds = outputGradientRectangle.bounds;
    outputLabel.boundsProperty.link( outputLabelBounds => {
      const layoutBoundsLocal = outputLabelBounds.union( backplateBounds );
      outputLabel.centerX = outputGradientRectangle.centerX;
      outputLabel.bottom = outputGradientRectangle.top - LABEL_SLIDER_SPACING;

      affirm( layoutBoundsLocal.isValid(), 'Bounds should be valid before overriding local bounds' );
      this.setLocalBounds( layoutBoundsLocal );
    } );
  }
}
