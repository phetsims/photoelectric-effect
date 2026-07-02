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

type PhotonIntensityControlOptions =
  SelfOptions &
  NodeBoundsBasedTranslationOptions &
  PickRequired<PanelOptions, 'tandem'>;

export default class PhotonIntensityControl extends Panel {

  public constructor( photonSource: PhotonSource, providedOptions: PhotonIntensityControlOptions ) {
    const options = optionize<PhotonIntensityControlOptions, SelfOptions, PanelOptions>()( {
      stroke: PhotoelectricEffectColors.panelStrokeColorProperty,
      cornerRadius: PhotoelectricEffectConstants.PHOTON_SOURCE_PANEL_CORNER_RADIUS,
      fill: PhotoelectricEffectColors.photonSourcePanelFillColorProperty,
      align: 'center',
      isDisposable: false,
      accessibleHeading: PhotoelectricEffectFluent.a11y.photonSourcePanel.accessibleHeadingStringProperty,
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
