// Copyright 2026, University of Colorado Boulder

/**
 * Base view shared by the screens whose photon source emits a continuous beam (Intro and Experiment), as
 * opposed to the Energy screen's single-photon/burst emission. Adds the ammeter display, electron visibility
 * controls, and the particle canvas on top of the common photoelectric-effect.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import PhotoelectricEffectModel from '../model/PhotoelectricEffectModel.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import AmmeterDisplayPanel from './AmmeterDisplayPanel.js';
import CircuitNode from './CircuitNode.js';
import ParticleCanvasNode from './ParticleCanvasNode.js';
import PhotoelectricEffectScreenView, { PhotoelectricEffectScreenViewOptions } from './PhotoelectricEffectScreenView.js';

type SelfOptions = EmptySelfOptions;
export type PhotonBeamScreenViewOptions = SelfOptions & PhotoelectricEffectScreenViewOptions;

export default class PhotonBeamScreenView extends PhotoelectricEffectScreenView {

  // Shared ammeter panel for layout and visibility control in subclasses.
  protected readonly ammeterDisplayPanel: AmmeterDisplayPanel;

  // Controls for electron rendering and behavior, for layout and visibility control in subclasses.
  protected readonly electronVisibilityControls: VBox;

  private readonly particleCanvasNode: ParticleCanvasNode;

  protected constructor( model: PhotoelectricEffectModel, providedOptions: PhotonBeamScreenViewOptions ) {

    const options = optionize<PhotonBeamScreenViewOptions, SelfOptions, PhotoelectricEffectScreenViewOptions>()( {}, providedOptions );

    super( model, options );

    //------------------------------------------------------------------------
    // Ammeter readout (positioned along the collector-side wire)
    //------------------------------------------------------------------------

    this.ammeterDisplayPanel = new AmmeterDisplayPanel( model.currentProperty, {
      tandem: options.tandem.createTandem( 'ammeterDisplayPanel' ),
      center: this.modelViewTransform.modelToViewXY( model.collector.x, 0 )
        .plusXY( 0, CircuitNode.WIRE_HEIGHT )
    } );
    this.addChild( this.ammeterDisplayPanel );

    //------------------------------------------------------------------------
    // Electron visibility checkboxes (bottom-left of the play area)
    //------------------------------------------------------------------------

    const showElectronsCheckbox = new Checkbox(
      model.showElectronsProperty,
      new Text( PhotoelectricEffectFluent.showElectronsStringProperty, {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        maxWidth: 170
      } ),
      {
        tandem: options.tandem.createTandem( 'showElectronsCheckbox' )
      }
    );

    // The 'highest energy only' checkbox is nested under 'show electrons' — only meaningful when electrons are shown.
    const highestEnergyOnlyCheckbox = new Checkbox(
      model.showHighestEnergyOnlyProperty,
      new Text( PhotoelectricEffectFluent.highestEnergyOnlyStringProperty, {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        maxWidth: 170
      } ),
      {
        enabledProperty: model.showElectronsProperty,
        layoutOptions: {
          leftMargin: 20
        },
        tandem: options.tandem.createTandem( 'highestEnergyOnlyCheckbox' )
      }
    );

    this.electronVisibilityControls = new VBox( {
      spacing: 5,
      align: 'left',
      children: [
        showElectronsCheckbox,
        highestEnergyOnlyCheckbox
      ],
      leftBottom: this.layoutBounds.leftBottom.plusXY(
        PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
        -PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN
      )
    } );
    this.addChild( this.electronVisibilityControls );

    //------------------------------------------------------------------------
    // Particle canvas: renders photons and electrons in the play area
    //------------------------------------------------------------------------

    this.particleCanvasNode = new ParticleCanvasNode( model.photons, model.electrons, model.showElectronsProperty, this.modelViewTransform,
      { canvasBounds: this.layoutBounds } );
    this.addChild( this.particleCanvasNode );

    // Insert the electron visibility checkboxes ahead of the base's default control area order.
    this.pdomControlAreaNode.pdomOrder = [
      showElectronsCheckbox,
      highestEnergyOnlyCheckbox,
      this.playPauseStepButtonGroup,
      this.resetAllButton
    ];
  }

  /**
   * Steps the view.
   * @param _dt - time step, in seconds
   */
  public override step( _dt: number ): void {
    this.particleCanvasNode.step();
  }
}
