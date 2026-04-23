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
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import Material, { MaterialType } from '../../common/model/Material.js';
import PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import AmmeterDisplayPanel from './AmmeterDisplayPanel.js';
import IntensityAndWavelengthControl from './IntensityAndWavelengthControl.js';
import ParticleCanvasNode from './ParticleCanvasNode.js';

type SelfOptions = {
  //TODO add options that are specific to PhotoelectricEffectScreenView here
};

type PhotoelectricEffectScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class PhotoelectricEffectScreenView extends ScreenView {

  private readonly particleCanvasNode: ParticleCanvasNode;
  protected readonly modelViewTransform: ModelViewTransform2;

  // Shared ammeter panel for layout and visibility control in subclasses.
  protected readonly ammeterDisplayPanel: AmmeterDisplayPanel;

  // Controls for electron rendering and behavior, for layout and visibility control in subclasses.
  protected readonly electronVisibilityControls: VBox;

  public constructor( private readonly model: PhotoelectricEffectModel, providedOptions: PhotoelectricEffectScreenViewOptions ) {

    const options = optionize<PhotoelectricEffectScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    super( options );
    this.model = model;

    // model-view transform places the model x origin at the target plate, and a view origin at an x-offset with
    // y centered in the layout bounds
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( PhotoelectricEffectConstants.TARGET_X, 0 ), // model point - the target is the origin
      new Vector2( PhotoelectricEffectConstants.VIEW_ORIGIN_X, this.layoutBounds.centerY ),
      PhotoelectricEffectConstants.MODEL_VIEW_SCALE );

    // TODO: Toggle comboBox item visibility based on PhotoelectricEffectPreferences.mysteryMaterialEnabledProperty, see
    // https://github.com/phetsims/photoelectric-effect/issues/5
    const comboBoxItems = model.target.materials.map( ( material, i ) => {
      return {
        value: material,
        createNode: () => new Text( `Material ${i}, ${material.materialType}` )
      };
    } );

    const materialsComboBox = new ComboBox( model.target.materialProperty, comboBoxItems, this, {
      tandem: options.tandem.createTandem( 'materialsComboBox' ),
      leftCenter: this.layoutBounds.leftCenter.plusXY( PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN, 0 )
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
      rightTop: new Vector2(
        this.modelViewTransform.modelToViewXY( model.target.x, 0 ).x,
        this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN
      ),
      tandem: options.tandem.createTandem( 'photonSourcePanel' )
    } );

    this.ammeterDisplayPanel = new AmmeterDisplayPanel( model.currentProperty );

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

    // When electrons become invisible, the "highest energy only" is not relevant and becomes unavailable.
    // Reset to false so that it is clearly not selected in the UI.
    // TODO: @brett is this behavior correct?
    model.showElectronsProperty.link( showElectrons => {
      if ( !showElectrons ) {
        model.showHighestEnergyOnlyProperty.value = false;
      }
    } );

    this.addChild( materialsComboBox );
    this.addChild( workFunctionControl );
    this.addChild( this.electronVisibilityControls );
    this.addChild( photonSourcePanel );
    this.addChild( this.ammeterDisplayPanel );

    this.ammeterDisplayPanel.centerTop = this.modelViewTransform.modelToViewXY( model.collector.x, 0 ).plusXY(
      0,
      PhotoelectricEffectConstants.COLLECTOR_BOUNDS.maxY + 20
    );

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
    this.particleCanvasNode = new ParticleCanvasNode( model.photons, model.electrons, model.showElectronsProperty, this.modelViewTransform,
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
   * @param _dt - time step, in seconds
   */
  public override step( _dt: number ): void {
    this.particleCanvasNode.step();
  }

  private createBoundsRectangle( bounds: Bounds2, stroke: string ): Rectangle {
    return new Rectangle( bounds, {
      stroke: stroke,
      lineWidth: 1,
      fill: null
    } );
  }
}
