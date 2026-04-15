// Copyright 2026, University of Colorado Boulder

/**
 * Panel with light intensity and wavelength controls for the photon source.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import PhotonSource from '../model/PhotonSource.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import GradientBackplateIntensitySlider from './GradientBackplateIntensitySlider.js';
import WavelengthSliderWithReadout from './WavelengthSliderWithReadout.js';

type SelfOptions = EmptySelfOptions;

type IntensityAndWavelengthControlOptions = SelfOptions & PickRequired<StrictOmit<PanelOptions, 'isDisposable'>, 'tandem'>;

export default class IntensityAndWavelengthControl extends Panel {

  public constructor( photonSource: PhotonSource, providedOptions: IntensityAndWavelengthControlOptions ) {
    const options = optionize<IntensityAndWavelengthControlOptions, SelfOptions, PanelOptions>()( {
      stroke: 'black',
      lineWidth: 3,
      cornerRadius: 4,
      fill: PhotoelectricEffectColors.screenBackgroundColorProperty,
      align: 'center',
      isDisposable: false
    }, providedOptions );

    const intensitySlider = new GradientBackplateIntensitySlider( photonSource, {
      tandem: options.tandem.createTandem( 'intensitySlider' )
    } );

    const wavelengthSlider = new WavelengthSliderWithReadout( photonSource, {
      tandem: options.tandem.createTandem( 'wavelengthSlider' )
    } );

    const content = new VBox( {
      spacing: 12,
      align: 'center',
      children: [
        new VBox( {
          spacing: 5,
          align: 'center',
          children: [
            new Text( PhotoelectricEffectFluent.intensity.labelStringProperty, {
              font: new PhetFont( 16 ),
              maxWidth: 200
            } ),
            intensitySlider
          ]
        } ),
        wavelengthSlider
      ]
    } );

    super( content, options );
  }
}
