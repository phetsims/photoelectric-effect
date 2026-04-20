// Copyright 2026, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PlayPauseStepButtonGroup from '../../../../scenery-phet/js/buttons/PlayPauseStepButtonGroup.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import Material, { MaterialType } from '../../common/model/Material.js';
import PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import ParticleCanvasNode from './ParticleCanvasNode.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import IntensityAndWavelengthControl from './IntensityAndWavelengthControl.js';

type SelfOptions = {
  //TODO add options that are specific to PhotoelectricEffectScreenView here
};

type PhotoelectricEffectScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class PhotoelectricEffectScreenView extends ScreenView {

  private readonly particleCanvasNode: ParticleCanvasNode;
  private readonly modelViewTransform: ModelViewTransform2;

  public constructor( private readonly model: PhotoelectricEffectModel, providedOptions: PhotoelectricEffectScreenViewOptions ) {

    const options = optionize<PhotoelectricEffectScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    super( options );
    this.model = model;

    // TODO: Toggle comboBox item visibility based on PhotoelectricEffectPreferences.mysteryMaterialEnabledProperty, see
    // https://github.com/phetsims/photoelectric-effect/issues/5
    const comboBoxItems = model.target.materials.map( ( material, i ) => {
      return {
        value: material,
        createNode: () => new Text( `Material ${i}, ${material.materialType}` )
      };
    } );

    const materialsComboBox = new ComboBox( model.target.materialProperty, comboBoxItems, this, {
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
      new Range( 0, 10 ),
      {
        delta: 0.1,
        numberDisplayOptions: {
          decimalPlaces: 1
        },
        visibleProperty: customMaterialSelectedProperty,
        tandem: options.tandem.createTandem( 'workFunctionControl' )
      }
    );

    const photonSourcePanel = new IntensityAndWavelengthControl( model.photonSource, {
      tandem: options.tandem.createTandem( 'photonSourcePanel' )
    } );

    const voltageControl = new NumberControl(
      PhotoelectricEffectFluent.voltage.labelStringProperty,
      model.voltageProperty,
      new Range( PhotoelectricEffectConstants.MIN_VOLTAGE, PhotoelectricEffectConstants.MAX_VOLTAGE ),
      {
        delta: 0.1,
        numberDisplayOptions: {
          decimalPlaces: 1
        },
        tandem: options.tandem.createTandem( 'voltageControl' )
      }
    );

    const currentDisplay = new NumberDisplay(
      model.currentProperty,
      new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT ),
      {
        decimalPlaces: 3,
        tandem: options.tandem.createTandem( 'currentDisplay' )
      }
    );

    const currentReadout = new HBox( {
      spacing: 10,
      align: 'center',
      children: [
        new Text( PhotoelectricEffectFluent.current.labelStringProperty ),
        currentDisplay
      ]
    } );

    const debugLegend = new VBox( {
      spacing: 2,
      align: 'left',
      children: [
        new Text( PhotoelectricEffectFluent.debugLegend.titleStringProperty, { fontSize: 12 } ),
        new Text( PhotoelectricEffectFluent.debugLegend.photonsStringProperty, { fontSize: 12 } ),
        new Text( PhotoelectricEffectFluent.debugLegend.electronsStringProperty, { fontSize: 12 } ),
        new Text( PhotoelectricEffectFluent.debugLegend.targetStringProperty, { fontSize: 12 } ),
        new Text( PhotoelectricEffectFluent.debugLegend.collectorStringProperty, { fontSize: 12 } )
      ]
    } );

    const debugControlsVBox = new VBox( {
      spacing: 15,
      align: 'left',
      excludeInvisible: true,
      children: [
        materialsComboBox,
        workFunctionControl,
        voltageControl,
        currentReadout,
        debugLegend
      ]
    } );

    /**
     * Shared transform for model coordinates to this ScreenView (same as particle canvas and target overlay).
     */
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( PhotoelectricEffectConstants.TARGET_X, 0 ), // model point - the target is the origin
      new Vector2( PhotoelectricEffectConstants.VIEW_ORIGIN_X, this.layoutBounds.centerY ),
      PhotoelectricEffectConstants.MODEL_VIEW_SCALE );

    // Right-align the photon control with the target plate's x in view space (targetRectangle uses the same anchor).
    photonSourcePanel.right = this.modelViewTransform.modelToViewXY( model.target.x, 0 ).x;
    photonSourcePanel.top = this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN;
    this.addChild( photonSourcePanel );

    debugControlsVBox.left = this.layoutBounds.left + PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN;
    debugControlsVBox.bottom = this.layoutBounds.maxY - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN;
    this.addChild( debugControlsVBox );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        this.reset();
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

    /**
     * Create canvas that renders the particles.
     */
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( PhotoelectricEffectConstants.TARGET_X, 0 ), // model point - the target is the origin
      new Vector2( PhotoelectricEffectConstants.VIEW_ORIGIN_X, this.layoutBounds.centerY ),
      PhotoelectricEffectConstants.MODEL_VIEW_SCALE );

    // Placeholder lamp rectangle aligned with the photon source line.
    const beamStartCenter = this.modelViewTransform.modelToViewPosition( PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION );

    // Negate the model angle to convert to view space (the MVT inverts the y-axis).
    const lampAngle = -PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION_ANGLE;
    const lampFaceLength = PhotoelectricEffectConstants.PHOTON_SOURCE_WIDTH;
    const lampBodyDepth = 20;
    const lampRectangle = new Rectangle( -lampBodyDepth / 2, -lampFaceLength / 2, lampBodyDepth, lampFaceLength, {
      fill: 'gray',
      stroke: 'black',
      rotation: lampAngle,

      // TODO: The lamp needs to end at the beam start and currently it's centered at the beam start... awk.
      centerX: beamStartCenter.x,
      centerY: beamStartCenter.y
    } );
    this.addChild( lampRectangle );

    // Canvas that renders photons and electrons using the same model-view transform as the play area.
    this.particleCanvasNode = new ParticleCanvasNode( model.photons, model.electrons, this.modelViewTransform,
      { canvasBounds: this.layoutBounds } );
    this.addChild( this.particleCanvasNode );

    // Debug visualization for collision bounds.
    const targetBounds = PhotoelectricEffectConstants.TARGET_BOUNDS;
    const collectorBounds = PhotoelectricEffectConstants.COLLECTOR_BOUNDS;
    const targetRectangle = this.createBoundsRectangle( targetBounds, 'rgba(255,0,0,0.6)' );
    const collectorRectangle = this.createBoundsRectangle( collectorBounds, 'rgba(0,0,255,0.6)' );

    this.addChild( targetRectangle );
    this.addChild( collectorRectangle );

    targetRectangle.rightCenter = this.modelViewTransform.modelToViewXY( this.model.target.x, 0 );
    collectorRectangle.leftCenter = this.modelViewTransform.modelToViewXY( this.model.collector.x, 0 );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    this.particleCanvasNode.step( dt );
  }

  private createBoundsRectangle( bounds: Bounds2, stroke: string ): Rectangle {
    return new Rectangle( bounds, {
      stroke: stroke,
      lineWidth: 1,
      fill: null
    } );
  }
}
