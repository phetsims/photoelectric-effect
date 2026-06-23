// Copyright 2026, University of Colorado Boulder

/**
 * Base view shared by all photoelectric-effect screens.
 *
 * Owns the common play-area transform and shared controls (materials selection, photon source panel + light source +
 * cord, play/pause/step, and reset). Subclasses contribute screen-specific play-area content (graphs, additional
 * controls) and provide the concrete light source / photon source panel via factory options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import type EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import type TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import type Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import { wavelengthToEnergy } from '../model/PhotoelectricEffectUtils.js';
import LightBeamNode from './LightBeamNode.js';
import MaterialsComboBox from './MaterialsComboBox.js';
import ParticleCanvasNode from './ParticleCanvasNode.js';

const TIME_CONTROL_NODE_FLOW_BOX_SPACING = 24;

// Minimal interface every screen-specific light source node must satisfy.
export type LightSourceNodeInterface = Node & { readonly cordAttachmentPoint: Vector2 };

type SelfOptions = {

  // Factory for the screen-specific light source node. Receives the view-space position of the beam aperture.
  createLightSourceNode: ( beamStartCenter: Vector2 ) => LightSourceNodeInterface;

  // Factory for the screen-specific photon source panel. The base positions the returned node at leftTop.
  createPhotonSourcePanel: ( tandem: Tandem ) => Node;

  // Whether individual photons are rendered. When false, a LightBeamNode stands in for the photons. Defaults to
  // always visible, so screens that emit single photons (e.g. Energy) are unaffected. Continuous-beam screens
  // pass the 'show photons' preference here.
  photonsVisibleProperty?: TReadOnlyProperty<boolean>;

  // Optional time-speed Property. When provided, the shared TimeControlNode includes Normal/Slow radio buttons.
  timeSpeedProperty?: EnumerationProperty<TimeSpeed> | null;
};

export type PhotoelectricEffectScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class PhotoelectricEffectScreenView extends ScreenView {

  // Static drawings that decorate and add context to each screen — typically the circuit artwork for the screen.
  protected readonly backgroundNode = new Node();

  protected readonly modelViewTransform: ModelViewTransform2;

  // Exposed for subclasses to wire into pdom order and to position screen-specific content relative to.
  protected readonly materialsComboBox: Node;
  protected readonly photonSourcePanel: Node;
  protected readonly timeControlNode: TimeControlNode;
  protected readonly resetAllButton: Node;

  private readonly particleCanvasNode: ParticleCanvasNode;

  protected constructor( model: PhotoelectricEffectModel, providedOptions: PhotoelectricEffectScreenViewOptions ) {

    const options = optionize<PhotoelectricEffectScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // Photons are rendered by default; continuous-beam screens override this with the 'show photons' preference.
      photonsVisibleProperty: new TinyProperty( true ),
      timeSpeedProperty: null
    }, providedOptions );

    super( options );

    //------------------------------------------------------------------------
    // Background and model-view transform
    //------------------------------------------------------------------------

    // Added first so screen artwork drawn into it sits behind everything else.
    this.addChild( this.backgroundNode );

    // Model-view transform places the model x origin at the target plate, and a view origin at an x-offset with
    // y centered in the layout bounds.
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( PhotoelectricEffectConstants.TARGET_X, 0 ), // model point — the target is the origin
      new Vector2( 250, this.layoutBounds.centerY + 20 ),      // view point
      PhotoelectricEffectConstants.MODEL_VIEW_SCALE
    );

    //------------------------------------------------------------------------
    // Photon source group: panel (top-left), light source lamp, S-shaped wire
    //------------------------------------------------------------------------

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
    const WIRE_PANEL_OVERLAP = 2;
    const photonSourceWireStart = lightSourceNode.cordAttachmentPoint;
    const getPhotonSourceWireEnd = ( photonSourcePanelRightCenter: Vector2 ): Vector2 => {

      // Overlap with the panel so the wire appears tucked under the panel border.
      return photonSourcePanelRightCenter.plusXY( -WIRE_PANEL_OVERLAP, 0 );
    };
    const createPhotonSourceWireShape = ( photonSourceWireEnd: Vector2 ): Shape => {
      return new Shape()
        .moveToPoint( photonSourceWireStart )
        .cubicCurveToPoint(
          photonSourceWireStart.plusXY( 0, -S_BEND ),
          photonSourceWireEnd.plusXY( 0, S_BEND ),
          photonSourceWireEnd
        );
    };
    const photonSourceWireNode = new Path( createPhotonSourceWireShape(
      getPhotonSourceWireEnd( this.photonSourcePanel.rightCenter )
    ), {
      stroke: PhotoelectricEffectColors.circuitStrokeColorProperty,
      lineWidth: 3
    } );
    ManualConstraint.create( this, [ this.photonSourcePanel ], photonSourcePanelProxy => {
      photonSourceWireNode.shape = createPhotonSourceWireShape(
        getPhotonSourceWireEnd( photonSourcePanelProxy.rightCenter )
      );
    } );

    //------------------------------------------------------------------------
    // Light beam: stands in for the rendered photons when the 'show photons' preference is disabled. Added before
    // the lamp so the lamp occludes the beam's recessed starting edge, making the beam emerge from the aperture.
    //------------------------------------------------------------------------

    const lightBeamNode = new LightBeamNode(
      beamStartCenter,
      this.modelViewTransform.modelToViewXY( PhotoelectricEffectConstants.TARGET_X, 0 ),
      model.wavelengthProperty,
      model.photonSource.normalizedIntensityProperty,
      {
        visibleProperty: DerivedProperty.not( options.photonsVisibleProperty )
      }
    );
    this.addChild( lightBeamNode );

    // Added in this order for proper z-layering: beam behind the lamp, wire underneath the lamp, panel covers the
    // wire end.
    this.addChild( photonSourceWireNode );
    this.addChild( lightSourceNode );
    this.addChild( this.photonSourcePanel );

    //------------------------------------------------------------------------
    // Target material controls
    //------------------------------------------------------------------------

    // Combo box should appear to the left of the target plate and above the wire that extends from center.
    this.materialsComboBox = new MaterialsComboBox( model.target.materialProperty, model.target.materials, this, {
      left: this.layoutBounds.left + PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      top: this.modelViewTransform.modelToViewY( 0 ) - PhotoelectricEffectConstants.PLATE_BOUNDS.height / 2,
      tandem: options.tandem.createTandem( 'materialsComboBox' )
    } );

    this.addChild( this.materialsComboBox );

    //------------------------------------------------------------------------
    // Particle canvas: renders photons and electrons in the play area
    //------------------------------------------------------------------------

    this.particleCanvasNode = new ParticleCanvasNode( model.photons, model.electrons, model.showElectronsProperty,
      options.photonsVisibleProperty, this.modelViewTransform,
      { canvasBounds: this.layoutBounds } );
    this.addChild( this.particleCanvasNode );

    //------------------------------------------------------------------------
    // Time controls and reset
    //------------------------------------------------------------------------

    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      timeSpeedProperty: options.timeSpeedProperty,
      flowBoxSpacing: TIME_CONTROL_NODE_FLOW_BOX_SPACING,
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => {
            model.stepForwardInTime( PhotoelectricEffectConstants.MANUAL_STEP_DT );
          }
        }
      },
      tandem: options.tandem.createTandem( 'timeControlNode' ),
      leftCenter: this.layoutBounds.centerBottom.minusXY( -160, PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN + 25 )
    } );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
      },
      right: this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    this.addChild( this.timeControlNode );
    this.addChild( this.resetAllButton );

    // Default PDOM order for the control area. Subclasses may prepend additional items by reassigning this.
    this.pdomControlAreaNode.pdomOrder = [
      this.timeControlNode,
      this.resetAllButton
    ];

    //------------------------------------------------------------------------
    // Developer-only debug indicators (visible via ?dev query parameter)
    //------------------------------------------------------------------------

    if ( phet.chipper.queryParameters.dev ) {
      const devWorkFunctionStringProperty = new DerivedProperty( [ model.target.workFunctionProperty ],
        workFunction => `Work Function: ${toFixed( workFunction, 2 )} eV` );
      const devWorkFunctionPlusDepthStringProperty = new DerivedProperty(
        [ model.target.workFunctionProperty, model.target.bandDepthProperty ],
        ( workFunction, bandDepth ) => `Work Function + Band Depth: ${toFixed( workFunction + bandDepth, 2 )} eV` );
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

  /**
   * Steps the view.
   * @param _dt - time step, in seconds
   */
  public override step( _dt: number ): void {
    this.particleCanvasNode.step();
  }
}
