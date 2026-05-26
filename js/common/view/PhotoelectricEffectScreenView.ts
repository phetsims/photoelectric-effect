// Copyright 2026, University of Colorado Boulder

/**
 * Base view shared by all photoelectric-effect screens.
 *
 * Owns the common play-area transform and shared controls (materials selection, work function control,
 * photon source panel + light source + cord, play/pause/step, and reset). Subclasses contribute screen-specific
 * play-area content (graphs, additional controls) and provide the concrete light source / photon source panel
 * via factory options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PlayPauseStepButtonGroup from '../../../../scenery-phet/js/buttons/PlayPauseStepButtonGroup.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import type Tandem from '../../../../tandem/js/Tandem.js';
import Material, { MaterialType } from '../../common/model/Material.js';
import PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import { wavelengthToEnergy } from '../model/PhotoelectricEffectUtils.js';
import MaterialsComboBox from './MaterialsComboBox.js';

// Minimal interface every screen-specific light source node must satisfy.
export type LightSourceNodeInterface = Node & { readonly cordAttachmentPoint: Vector2 };

type SelfOptions = {

  // Factory for the screen-specific light source node. Receives the view-space position of the beam aperture.
  createLightSourceNode: ( beamStartCenter: Vector2 ) => LightSourceNodeInterface;

  // Factory for the screen-specific photon source panel. The base positions the returned node at leftTop.
  createPhotonSourcePanel: ( tandem: Tandem ) => Node;
};

export type PhotoelectricEffectScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class PhotoelectricEffectScreenView extends ScreenView {

  // Static drawings that decorate and add context to each screen — typically the circuit artwork for the screen.
  protected readonly backgroundNode = new Node();

  protected readonly modelViewTransform: ModelViewTransform2;

  // Exposed for subclasses to wire into pdom order and to position screen-specific content relative to.
  protected readonly materialsComboBox: Node;
  protected readonly workFunctionControl: Node;
  protected readonly photonSourcePanel: Node;
  protected readonly playPauseStepButtonGroup: Node;
  protected readonly resetAllButton: Node;

  protected constructor( model: PhotoelectricEffectModel, providedOptions: PhotoelectricEffectScreenViewOptions ) {

    const options = optionize<PhotoelectricEffectScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    super( options );

    // Added first so screen artwork drawn into it sits behind everything else.
    this.addChild( this.backgroundNode );

    // model-view transform places the model x origin at the target plate, and a view origin at an x-offset with
    // y centered in the layout bounds
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( PhotoelectricEffectConstants.TARGET_X, 0 ), // model point - the target is the origin

      // View x coordinate of model x=0 (the left edge of the target plate), in pixels from the left edge of the screen.
      new Vector2( 250, this.layoutBounds.centerY + 30 ),
      PhotoelectricEffectConstants.MODEL_VIEW_SCALE );

    // Combo box should appear to the left of the target plate and above the wire that extends from center.
    this.materialsComboBox = new MaterialsComboBox( model.target.materialProperty, model.target.materials, this, {
      left: this.layoutBounds.left + PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.modelViewTransform.modelToViewY( 0 ) - 35,
      tandem: options.tandem.createTandem( 'materialsComboBox' )
    } );

    const workFunctionProperty = new DynamicProperty<number, number, Material>( model.target.materialProperty, {
      bidirectional: true,
      derive: 'workFunctionProperty'
    } );
    const customMaterialSelectedProperty = new DerivedProperty( [ model.target.materialProperty ],
      material => material.materialType === MaterialType.CUSTOM );

    this.workFunctionControl = new NumberControl(
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
        sliderOptions: {
          trackSize: new Dimension2( this.materialsComboBox.width, 5 )
        },
        layoutFunction: NumberControl.createLayoutFunction3(),
        visibleProperty: customMaterialSelectedProperty,
        centerTop: this.materialsComboBox.centerBottom.plusXY( 0, 20 ),
        tandem: options.tandem.createTandem( 'workFunctionControl' )
      }
    );

    this.photonSourcePanel = options.createPhotonSourcePanel( options.tandem.createTandem( 'photonSourcePanel' ) );
    this.photonSourcePanel.leftTop = this.layoutBounds.leftTop.plusXY(
      PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN
    );

    // Light source node: aperture at local origin, placed at the beam-start view position.
    const beamStartCenter = this.modelViewTransform.modelToViewPosition( PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION );
    const lightSourceNode = options.createLightSourceNode( beamStartCenter );

    // S-shaped wire from the back of the lamp to the right side of the photon source panel.
    // First control point of the cubic curve below the start and second control point above the end create the S
    // regardless of height difference.
    const S_BEND = 200;
    const photonSourceWireStart = lightSourceNode.cordAttachmentPoint;
    const photonSourceWireEnd = this.photonSourcePanel.rightCenter.plusXY( -2, 0 ); // So the wire end overlaps with the panel.
    const photonSourceWireNode = new Path( new Shape()
      .moveToPoint( photonSourceWireStart )
      .cubicCurveToPoint(
        photonSourceWireStart.plusXY( 0, -S_BEND ),
        photonSourceWireEnd.plusXY( 0, S_BEND ),
        photonSourceWireEnd
      ), {
      stroke: PhotoelectricEffectColors.circuitStrokeColorProperty,
      lineWidth: 3
    } );

    // Added in this order for proper z-layering.
    this.addChild( photonSourceWireNode );
    this.addChild( lightSourceNode );
    this.addChild( this.photonSourcePanel );

    this.addChild( this.materialsComboBox );
    this.addChild( this.workFunctionControl );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
      },
      right: this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( this.resetAllButton );

    this.playPauseStepButtonGroup = new PlayPauseStepButtonGroup( model.isPlayingProperty, {
      tandem: options.tandem.createTandem( 'playPauseStepButtonGroup' ),
      stepForwardButtonOptions: {
        listener: () => {
          model.stepForwardInTime( PhotoelectricEffectConstants.MANUAL_STEP_DT );
        }
      },
      centerBottom: this.layoutBounds.centerBottom.minusXY( -200, PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN )
    } );
    this.addChild( this.playPauseStepButtonGroup );

    // Default PDOM order for the control area. Subclasses may prepend additional items by reassigning this.
    this.pdomControlAreaNode.pdomOrder = [
      this.playPauseStepButtonGroup,
      this.resetAllButton
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
        leftTop: this.photonSourcePanel.rightTop
      } ) );
    }
  }
}
