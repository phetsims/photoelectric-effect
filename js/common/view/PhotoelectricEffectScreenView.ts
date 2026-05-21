// Copyright 2026, University of Colorado Boulder

/**
 * Base view shared by all photoelectric-effect screens.
 *
 * Owns the common circuit/play-area transform and shared controls (photon source, materials selection, electron
 * visibility controls, current readout, transport controls, and reset). Subclasses add screen-specific graphing and
 * play-area content while reusing this layout and PDOM wiring.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PlayPauseStepButtonGroup from '../../../../scenery-phet/js/buttons/PlayPauseStepButtonGroup.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Material, { MaterialType } from '../../common/model/Material.js';
import PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import { wavelengthToEnergy } from '../model/PhotoelectricEffectUtils.js';
import AmmeterDisplayPanel from './AmmeterDisplayPanel.js';
import CircuitNode from './CircuitNode.js';
import LightSourceNode from './LightSourceNode.js';
import MaterialsComboBox from './MaterialsComboBox.js';
import ParticleCanvasNode from './ParticleCanvasNode.js';
import PhotonSourceControl from './PhotonSourceControl.js';

type SelfOptions = EmptySelfOptions;
type PhotoelectricEffectScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class PhotoelectricEffectScreenView extends ScreenView {

  // The background node holds static drawings that decorate and add context to each screen. Generally this is
  // populated by the specific circuit required by the screen.
  protected readonly backgroundNode = new Node();

  private readonly particleCanvasNode: ParticleCanvasNode;
  protected readonly modelViewTransform: ModelViewTransform2;

  // Shared ammeter panel for layout and visibility control in subclasses.
  protected readonly ammeterDisplayPanel: AmmeterDisplayPanel;

  // Controls for electron rendering and behavior, for layout and visibility control in subclasses.
  protected readonly electronVisibilityControls: VBox;

  // For pdom order
  protected readonly photonSourceControl: Node;
  protected readonly materialsComboBox: Node;

  public constructor( private readonly model: PhotoelectricEffectModel, providedOptions: PhotoelectricEffectScreenViewOptions ) {

    const options = optionize<PhotoelectricEffectScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    super( options );

    // Added first to be in the background of each screen.
    this.addChild( this.backgroundNode );

    // model-view transform places the model x origin at the target plate, and a view origin at an x-offset with
    // y centered in the layout bounds
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( PhotoelectricEffectConstants.TARGET_X, 0 ), // model point - the target is the origin

      // View x coordinate of model x=0 (the left edge of the target plate), in pixels from the left edge of the screen.
      // TODO: Adjust once the target plate artwork and layout are finalized. https://github.com/phetsims/photoelectric-effect/issues/1
      new Vector2( 250, this.layoutBounds.centerY + 40 ),
      PhotoelectricEffectConstants.MODEL_VIEW_SCALE );

    this.materialsComboBox = new MaterialsComboBox( model.target.materialProperty, model.target.materials, this, {
      left: this.layoutBounds.left + PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.centerY,
      tandem: options.tandem.createTandem( 'materialsComboBox' )
    } );

    const workFunctionProperty = new DynamicProperty<number, number, Material>( model.target.materialProperty, {
      bidirectional: true,
      derive: 'workFunctionProperty'
    } );
    const customMaterialSelectedProperty = new DerivedProperty( [ model.target.materialProperty ],
      material => material.materialType === MaterialType.CUSTOM );

    const workFunctionControl = new NumberControl(
      PhotoelectricEffectFluent.workFunction.labelStringProperty,
      workFunctionProperty,

      // TODO: @design NumberControl doesn't support a Property<Range>? If this needs to be different for each Material,
      //   we will need to add support in scenery-phet or reconstruct this NumberControl on material change,
      //   or create several NumberControls and toggle visibility. SEE TODO where this is created.
      Material.WORK_FUNCTION_RANGE,
      {
        delta: 0.1,
        numberDisplayOptions: {
          decimalPlaces: 1
        },
        visibleProperty: customMaterialSelectedProperty,
        centerTop: this.materialsComboBox.centerBottom.plusXY( 0, 25 ),
        tandem: options.tandem.createTandem( 'workFunctionControl' )
      }
    );

    this.photonSourceControl = new PhotonSourceControl( model.photonSource, {
      rightTop: new Vector2(
        this.modelViewTransform.modelToViewXY( model.target.x, 0 ).x,
        this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN
      ),
      tandem: options.tandem.createTandem( 'photonSourceControl' )
    } );

    this.ammeterDisplayPanel = new AmmeterDisplayPanel( model.currentProperty, {
      tandem: options.tandem.createTandem( 'ammeterDisplayPanel' ),
      center: this.modelViewTransform.modelToViewXY( model.collector.x, 0 )
        .plusXY( 0, CircuitNode.WIRE_HEIGHT )
    } );

    // Light source node: aperture at local origin, placed at the beam-start view position.
    const beamStartCenter = this.modelViewTransform.modelToViewPosition( PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION );
    const lightSourceNode = new LightSourceNode( beamStartCenter );

    // S-shaped wire from the back of the lamp to the right side of the control panel.
    // First control point of cubic curve below the start and second control point of cubic curve above the end
    // create the S regardless of height difference.
    const S_BEND = 200;
    const photonSourceWireStart = lightSourceNode.cordAttachmentPoint;
    const photonSourceWireEnd = this.photonSourceControl.rightCenter.plusXY( -2, 0 ); // So the wire end overlaps with the panel.
    const photonSourceWireNode = new Path( new Shape()
      .moveToPoint( photonSourceWireStart )
      .cubicCurveToPoint(
        photonSourceWireStart.plusXY( 0, -S_BEND ),
        photonSourceWireEnd.plusXY( 0, S_BEND ),
        photonSourceWireEnd
      ), {
      stroke: 'black',
      lineWidth: 3
    } );

    // Added in this order for proper z-layering.
    this.addChild( photonSourceWireNode );
    this.addChild( lightSourceNode );
    this.addChild( this.photonSourceControl );

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

    this.addChild( this.materialsComboBox );
    this.addChild( workFunctionControl );
    this.addChild( this.electronVisibilityControls );
    this.addChild( this.ammeterDisplayPanel );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
      },
      right: this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    const playPauseStepButtonGroup = new PlayPauseStepButtonGroup( model.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'playPauseStepButtonGroup' ),
      stepForwardButtonOptions: {
        listener: () => {
          model.stepForwardInTime( PhotoelectricEffectConstants.MANUAL_STEP_DT );
        }
      },

      // TODO: clean up once layout is more settled in mockups.
      centerBottom: this.layoutBounds.centerBottom.minusXY( -200, PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN )
    } );
    this.addChild( playPauseStepButtonGroup );

    // Canvas that renders photons and electrons using the same model-view transform as the play area.
    this.particleCanvasNode = new ParticleCanvasNode( model.photons, model.electrons, model.showElectronsProperty, this.modelViewTransform,
      { canvasBounds: this.layoutBounds } );
    this.addChild( this.particleCanvasNode );

    // PDOM order for controls. It is up to subclasses to set the pdom order for the
    // play area.
    this.pdomControlAreaNode.pdomOrder = [
      showElectronsCheckbox,
      highestEnergyOnlyCheckbox,
      playPauseStepButtonGroup,
      resetAllButton
    ];

    // DEBUG INDICATORS:
    if ( phet.chipper.queryParameters.dev ) {
      const devWorkFunctionStringProperty = new DerivedProperty( [ model.target.workFunctionProperty ],
        workFunction => `Work Function: ${toFixed( workFunction, 2 )} eV` );
      const devWorkFunctionPlusDepthStringProperty = new DerivedProperty(
        [ model.target.workFunctionProperty, model.target.bandWidthProperty ],
        ( workFunction, bandWidth ) => `Work Function + Band Width: ${toFixed( workFunction + bandWidth, 2 )} eV` );
      const devPhotonEnergyStringProperty = new DerivedProperty( [ model.wavelengthProperty ],
        wavelength => `Photon Energy: ${toFixed( wavelengthToEnergy( wavelength ), 2 )} eV` );
      const devCurrentStringProperty = new DerivedProperty( [ model.currentProperty ],
        current => `Current: ${current} A` );

      this.addChild( new VBox( {
        align: 'left',
        spacing: 3,
        children: [
          new Text( devWorkFunctionStringProperty, { font: PhotoelectricEffectConstants.READOUT_FONT } ),
          new Text( devWorkFunctionPlusDepthStringProperty, { font: PhotoelectricEffectConstants.READOUT_FONT } ),
          new Text( devPhotonEnergyStringProperty, { font: PhotoelectricEffectConstants.READOUT_FONT } ),
          new Text( devCurrentStringProperty, { font: PhotoelectricEffectConstants.READOUT_FONT } )
        ],
        leftTop: this.photonSourceControl.rightTop
      } ) );
    }
  }

  /**
   * Steps the view.
   * @param _dt - time step, in seconds
   */
  public override step( _dt: number ): void {
    this.particleCanvasNode.step();
  }
}
