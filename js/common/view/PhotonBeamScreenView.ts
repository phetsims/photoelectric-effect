// Copyright 2026, University of Colorado Boulder

/**
 * Base view shared by the screens whose photon source emits a continuous beam (Intro and Experiment), as
 * opposed to the Energy screen's single-photon/burst emission. Adds the ammeter display, electron visibility
 * controls, and the particle canvas on top of the common photoelectric-effect.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import GatedVisibleProperty from '../../../../axon/js/GatedVisibleProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import PhotoelectricEffectModel from '../model/PhotoelectricEffectModel.js';
import PhotoelectricEffectPreferences from '../model/PhotoelectricEffectPreferences.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import AmmeterDisplayPanel from './AmmeterDisplayPanel.js';
import CircuitNode from './CircuitNode.js';
import ElectronNode from './ElectronNode.js';
import PhotoelectricEffectScreenView, { PhotoelectricEffectScreenViewOptions } from './PhotoelectricEffectScreenView.js';

type SelfOptions = EmptySelfOptions;
export type PhotonBeamScreenViewOptions = SelfOptions & PhotoelectricEffectScreenViewOptions;

export default class PhotonBeamScreenView extends PhotoelectricEffectScreenView {

  // Shared ammeter panel for layout and visibility control in subclasses.
  protected readonly ammeterDisplayPanel: AmmeterDisplayPanel;

  // Controls for electron rendering and behavior, for layout and visibility control in subclasses.
  protected readonly electronVisibilityControls: VBox;

  protected constructor( model: PhotoelectricEffectModel, providedOptions: PhotonBeamScreenViewOptions ) {

    const options = optionize<PhotonBeamScreenViewOptions, SelfOptions, PhotoelectricEffectScreenViewOptions>()( {

      // On the continuous-beam screens, photon rendering is governed by the 'show photons' preference. When
      // disabled, the LightBeamNode stands in for the photons.
      photonsVisibleProperty: PhotoelectricEffectPreferences.showPhotonsProperty
    }, providedOptions );

    super( model, options );

    //------------------------------------------------------------------------
    // Ammeter readout (on the bottom wire, offset right of the circuit center, mirroring the battery on the
    // Experiment screen)
    //------------------------------------------------------------------------

    this.ammeterDisplayPanel = new AmmeterDisplayPanel( model.currentProperty, {
      tandem: options.tandem.createTandem( 'ammeterDisplayPanel' ),
      left: CircuitNode.getCircuitCenterX( this.modelViewTransform ) + PhotoelectricEffectConstants.WIRE_COMPONENT_CENTER_OFFSET,
      centerY: this.modelViewTransform.modelToViewY( 0 ) + CircuitNode.WIRE_HEIGHT
    } );
    this.addChild( this.ammeterDisplayPanel );

    //------------------------------------------------------------------------
    // Electron visibility checkboxes (bottom-left of the play area)
    //------------------------------------------------------------------------

    const showElectronsCheckbox = new Checkbox(
      model.showElectronsProperty,
      new HBox( {
        spacing: 8,
        children: [
          new Text( PhotoelectricEffectFluent.showElectronsStringProperty, {
            font: PhotoelectricEffectConstants.CONTENT_FONT,
            maxWidth: 170
          } ),

          // Icon matching the shaded-sphere electrons drawn in the play area.
          ElectronNode.createIcon()
        ]
      } ),
      {
        tandem: options.tandem.createTandem( 'showElectronsCheckbox' )
      }
    );

    const highestEnergyOnlyCheckboxTandem = options.tandem.createTandem( 'highestEnergyOnlyCheckbox' );

    // If the showElectronsCheckbox is hidden, hide highestEnergyOnlyCheckbox. PhET-iO clients can permanently hide
    // the checkbox via highestEnergyOnlyCheckbox.selfVisibleProperty.
    const highestEnergyOnlyCheckbox = new Checkbox(
      model.showHighestEnergyOnlyProperty,
      new Text( PhotoelectricEffectFluent.highestEnergyOnlyStringProperty, {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        maxWidth: 170
      } ),
      {
        enabledProperty: model.showElectronsProperty,

        // For phet-io customization, this checkbox is hidden when the showElectronsCheckbox is hidden.
        visibleProperty: new GatedVisibleProperty(
          showElectronsCheckbox.visibleProperty,
          highestEnergyOnlyCheckboxTandem
        ),
        layoutOptions: {
          leftMargin: 20
        },
        tandem: highestEnergyOnlyCheckboxTandem
      }
    );

    this.electronVisibilityControls = new VBox( {
      spacing: 5,
      align: 'left',
      children: [
        showElectronsCheckbox,
        highestEnergyOnlyCheckbox
      ],
      rightBottom: new Vector2(
        CircuitNode.getCircuitRightX( this.modelViewTransform ),
        this.layoutBounds.bottom - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN
      )
    } );
    this.addChild( this.electronVisibilityControls );

    // Insert the electron visibility checkboxes ahead of the base's default control area order.
    this.pdomControlAreaNode.pdomOrder = [
      showElectronsCheckbox,
      highestEnergyOnlyCheckbox,
      this.timeControlNode,
      this.resetAllButton
    ];
  }
}
