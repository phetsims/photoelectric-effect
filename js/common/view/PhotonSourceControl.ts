// Copyright 2026, University of Colorado Boulder

/**
 * Panel with source intensity and wavelength controls for the photon source.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import { NodeBoundsBasedTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import PhotonSource from '../model/PhotonSource.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import IntensityNumberControl from './IntensityNumberControl.js';
import LabeledWavelengthNumberControl from './LabeledWavelengthNumberControl.js';

type SelfOptions = EmptySelfOptions;

type PhotonSourceControlOptions =
  SelfOptions &
  NodeBoundsBasedTranslationOptions &
  PickRequired<PanelOptions, 'tandem'>;

export default class PhotonSourceControl extends Panel {

  public constructor( photonSource: PhotonSource, providedOptions: PhotonSourceControlOptions ) {
    const options = optionize<PhotonSourceControlOptions, SelfOptions, PanelOptions>()( {
      stroke: PhotoelectricEffectColors.circuitWireColorProperty,
      cornerRadius: PhotoelectricEffectConstants.PHOTON_SOURCE_CONTROL_CORNER_RADIUS,
      fill: PhotoelectricEffectColors.photonSourceControlFillColorProperty,
      align: 'center',
      isDisposable: false,
      yMargin: 8,
      accessibleHeading: PhotoelectricEffectFluent.a11y.photonSourceControl.accessibleHeadingStringProperty,
      phetioVisiblePropertyInstrumented: false // Component cannot be hidden since it is critical to usage of the sim.
    }, providedOptions );

    const intensityControl = new IntensityNumberControl(
      photonSource.normalizedIntensityProperty,
      photonSource.wavelengthProperty,
      {
        tandem: options.tandem.createTandem( 'intensityControl' )
      }
    );

    const wavelengthNumberControl = new LabeledWavelengthNumberControl( photonSource.wavelengthProperty, {
      tandem: options.tandem.createTandem( 'wavelengthNumberControl' )
    } );

    const content = new VBox( {
      spacing: 20,
      align: 'center',
      children: [
        intensityControl,
        wavelengthNumberControl
      ]
    } );

    super( content, options );
  }
}
