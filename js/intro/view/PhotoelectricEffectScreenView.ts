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
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import Material, { MaterialType } from '../../common/model/Material.js';
import PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import IntroModel from '../model/IntroModel.js';
import PhotonCanvasNode from './PhotonCanvasNode.js';

type SelfOptions = {
  //TODO add options that are specific to PhotoelectricEffectScreenView here
};

// Do something similar to the model:
// Create PhotoelectricEffectScreenView

type PhotoelectricEffectScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class IntroScreenView extends ScreenView {

  private readonly photonCanvasNode: PhotonCanvasNode;
  private readonly particleLayer: Node;
  private readonly modelOrigin: Vector2;
  private readonly modelViewTransform: ModelViewTransform2;

  public constructor( private readonly model: IntroModel, providedOptions: PhotoelectricEffectScreenViewOptions ) {

    const options = optionize<PhotoelectricEffectScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    super( options );
    this.model = model;

    // TODO: Toggle comboBox item visibility based on PhotoelectricEffectPreferences.mysteryMaterialEnabledProperty, see https://github.com/phetsims/photoelectric-effect/issues/5
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

    const intensityControl = new NumberControl(
      PhotoelectricEffectFluent.intensity.labelStringProperty,
      model.photonSource.intensityProperty,
      new Range( 0, 1 ),
      {
        delta: 0.05,
        numberDisplayOptions: {
          decimalPlaces: 2
        },
        tandem: options.tandem.createTandem( 'intensityControl' )
      }
    );

    const wavelengthControl = new NumberControl(
      PhotoelectricEffectFluent.wavelength.labelStringProperty,
      model.photonSource.wavelengthProperty,
      new Range(
        PhotoelectricEffectConstants.MIN_WAVELENGTH,
        PhotoelectricEffectConstants.MAX_WAVELENGTH_UI
      ),
      {
        delta: 5,
        numberDisplayOptions: {
          decimalPlaces: 0
        },
        tandem: options.tandem.createTandem( 'wavelengthControl' )
      }
    );

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
        new Text( PhotoelectricEffectFluent.debugLegend.sinkStringProperty, { fontSize: 12 } )
      ]
    } );

    const controlsVBox = new VBox( {
      spacing: 15,
      align: 'left',
      excludeInvisible: true,
      children: [
        materialsComboBox,
        workFunctionControl,
        intensityControl,
        wavelengthControl,
        voltageControl,
        currentReadout,
        debugLegend
      ]
    } );
    controlsVBox.left = this.layoutBounds.left + PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN;
    controlsVBox.top = this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN;
    this.addChild( controlsVBox );

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

    /**
     * Create canvas that renders the particles.
     */
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( PhotoelectricEffectConstants.TARGET_X, 0 ), // model point - the target is the origin
      new Vector2( PhotoelectricEffectConstants.VIEW_ORIGIN_X, this.layoutBounds.centerY ),
      PhotoelectricEffectConstants.MODEL_VIEW_SCALE );

    // TODO: Rename to ParticleCanvasNode.
    this.photonCanvasNode = new PhotonCanvasNode( model, this.modelViewTransform, { canvasBounds: this.layoutBounds } );
    this.addChild( this.photonCanvasNode );

    // Debug visualization for particles and collision bounds.
    this.modelOrigin = new Vector2( this.layoutBounds.centerX, this.layoutBounds.centerY );
    this.particleLayer = new Node();
    this.addChild( this.particleLayer );

    const targetBounds = PhotoelectricEffectConstants.TARGET_BOUNDS;
    const sinkBounds = PhotoelectricEffectConstants.SINK_BOUNDS;
    const targetRectangle = this.createBoundsRectangle( targetBounds, 'rgba(255,0,0,0.6)' );
    const sinkRectangle = this.createBoundsRectangle( sinkBounds, 'rgba(0,0,255,0.6)' );

    this.addChild( targetRectangle );
    this.addChild( sinkRectangle );

    targetRectangle.rightCenter = this.modelViewTransform.modelToViewXY( this.model.target.x, 0 );
    sinkRectangle.leftCenter = this.modelViewTransform.modelToViewXY( this.model.sink.x, 0 );
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
    this.photonCanvasNode.step( dt );
    this.updateParticleDebug( this.model );
  }

  private updateParticleDebug( model: PhotoelectricEffectModel ): void {
    this.particleLayer.removeAllChildren();

    model.electrons.forEach( electron => {
      const node = new Circle( 2.5, { fill: 'cyan', stroke: 'black', lineWidth: 0.5 } );
      const position = electron.position;
      node.centerX = this.modelOrigin.x + position.x;
      node.centerY = this.modelOrigin.y - position.y;
      this.particleLayer.addChild( node );
    } );
  }

  private createBoundsRectangle( bounds: Bounds2, stroke: string ): Rectangle {
    return new Rectangle( bounds, {
      stroke: stroke,
      lineWidth: 1,
      fill: null
    } );
  }
}
