// Copyright 2026, University of Colorado Boulder

/**
 * Energy diagram display for the Energy screen. Each sample shows an electron's initial energy in the conduction
 * band and its emitted kinetic energy above the zero-energy reference line.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import BracketNode from '../../../../scenery-phet/js/BracketNode.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import EnergyGraphDisplayProperties from '../model/EnergyGraphDisplayProperties.js';
import type { EnergyBarGraphSampleData, EnergyBarGraphSampleState } from './EnergyBarGraphNode.js';

type SelfOptions = EmptySelfOptions;
export type EnergyDiagramNodeOptions = SelfOptions & NodeOptions;

// Number of sample plots shown in the Energy diagram.
const NUMBER_OF_SAMPLE_PLOTS = 3;

// View size of the shared chart rectangle.
const CHART_VIEW_WIDTH = 120;
const CHART_VIEW_HEIGHT = 320;

// Horizontal layout in model x coordinates. Sample indices are zero-based, while model x positions are one-based.
const getSampleCenterX = ( sampleIndex: number ): number => sampleIndex + 1;

// Energy level for the bottom of the conduction band, in eV.
const CONDUCTION_BAND_BOTTOM = -8;

// Marker and label layout.
const ELECTRON_MARKER_RADIUS = 5;
const Y_TICK_LABEL_MARGIN = 5;
const X_LABEL_MARGIN = 5;
const Y_AXIS_LABEL_MARGIN = 96;
const WORK_FUNCTION_MARKER_X = CHART_VIEW_WIDTH + 14;
const WORK_FUNCTION_MARKER_CAP_WIDTH = 12;
const WORK_FUNCTION_MARKER_LINE_WIDTH = 2;
const WORK_FUNCTION_LABEL_MARGIN = 4;
const CHECKBOX_ROW_TOP_MARGIN = 10;
const CHECKBOX_ROW_SPACING = 32;
const CHECKBOX_LABEL_MAX_WIDTH = 110;
const CHECKBOX_BOX_WIDTH = 17;
const CHECKBOX_LABEL_FONT = new PhetFont( 14 );
const CONDUCTION_BAND_BRACKET_X = WORK_FUNCTION_MARKER_X - WORK_FUNCTION_MARKER_CAP_WIDTH / 2;
const CONDUCTION_BAND_LABEL_LINE_WRAP = 90;
const CONDUCTION_BAND_LABEL_SPACING = 4;
const CONDUCTION_BAND_BRACKET_MIN_LENGTH = 18;
const CONDUCTION_BAND_BRACKET_VERTICAL_INSET = 6;
const CONDUCTION_BAND_BRACKET_END_RADIUS = 3;
const CONDUCTION_BAND_BRACKET_TIP_RADIUS = 4;

export default class EnergyDiagramNode extends Node {

  // Translates energy and sample coordinates into the shared chart view.
  private readonly chartTransform: ChartTransform;

  // Shared custom graph decorations, regenerated when the work-function marker changes.
  private readonly graphDecorationNode: Node;

  // Electron markers for samples 1, 2, and 3.
  private readonly sampleNodes: Node[];

  // Labels for the special y values shown on the graph.
  private readonly zeroTickLabel: Text;
  private readonly fermiLevelTickLabel: Text;

  // Listener retained so it can be removed on disposal.
  private readonly workFunctionListener: () => void;

  // Work function source used for the Fermi level marker.
  private readonly workFunctionProperty: TReadOnlyProperty<number>;

  // Whether Fermi level and conduction band labels are visible.
  private readonly labelsVisibleProperty: BooleanProperty;

  // Whether the work function label is visible.
  private readonly workFunctionVisibleProperty: BooleanProperty;

  public constructor( workFunctionProperty: TReadOnlyProperty<number>,
                      labelsVisibleProperty: BooleanProperty,
                      workFunctionVisibleProperty: BooleanProperty,
                      providedOptions: EnergyDiagramNodeOptions ) {

    const options = optionize<EnergyDiagramNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions );

    super( options );

    this.workFunctionProperty = workFunctionProperty;
    this.labelsVisibleProperty = labelsVisibleProperty;
    this.workFunctionVisibleProperty = workFunctionVisibleProperty;

    this.chartTransform = new ChartTransform( {
      viewWidth: CHART_VIEW_WIDTH,
      viewHeight: CHART_VIEW_HEIGHT,
      modelXRange: new Range( 0.5, 3.5 ),
      modelYRange: EnergyGraphDisplayProperties.MODEL_Y_RANGE
    } );

    this.graphDecorationNode = new Node();

    this.sampleNodes = _.times( NUMBER_OF_SAMPLE_PLOTS, () => new Node() );

    const plotLayer = new Node( {
      children: [
        this.graphDecorationNode,
        ...this.sampleNodes
      ]
    } );

    this.zeroTickLabel = new Text( '0', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );

    // TODO: i18n
    this.fermiLevelTickLabel = new Text( 'Fermi Level', {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      visibleProperty: this.labelsVisibleProperty
    } );

    // TODO: i18n
    const yAxisLabel = new Text( 'Energy (eV)', {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      rotation: -Math.PI / 2
    } );

    const xLabels = _.times( NUMBER_OF_SAMPLE_PLOTS, sampleIndex => {
      const label = new Text( `${sampleIndex + 1}`, {
        font: PhotoelectricEffectConstants.CONTENT_FONT
      } );
      label.centerTop = new Vector2(
        this.chartTransform.modelToViewX( getSampleCenterX( sampleIndex ) ),
        CHART_VIEW_HEIGHT + X_LABEL_MARGIN
      );
      return label;
    } );

    const chartNode = new Node( {
      children: [
        plotLayer,
        this.zeroTickLabel,
        this.fermiLevelTickLabel,
        ...xLabels
      ]
    } );

    yAxisLabel.rightCenter = new Vector2( -Y_AXIS_LABEL_MARGIN, CHART_VIEW_HEIGHT / 2 );

    // TODO: i18n
    const labelsCheckbox = new Checkbox(
      this.labelsVisibleProperty,
      new Text( 'Labels', {
        font: CHECKBOX_LABEL_FONT,
        maxWidth: CHECKBOX_LABEL_MAX_WIDTH
      } ), {
        boxWidth: CHECKBOX_BOX_WIDTH,
        spacing: 4
      }
    );

    // TODO: i18n
    const workFunctionCheckbox = new Checkbox(
      this.workFunctionVisibleProperty,
      new Text( 'Work Function', {
        font: CHECKBOX_LABEL_FONT,
        maxWidth: CHECKBOX_LABEL_MAX_WIDTH
      } ), {
        boxWidth: CHECKBOX_BOX_WIDTH,
        spacing: 4
      }
    );

    const checkboxRow = new HBox( {
      align: 'center',
      spacing: CHECKBOX_ROW_SPACING,
      children: [
        labelsCheckbox,
        workFunctionCheckbox
      ]
    } );
    checkboxRow.leftTop = new Vector2( yAxisLabel.left, chartNode.bottom + CHECKBOX_ROW_TOP_MARGIN );

    this.children = [
      new Node( {
        children: [
          yAxisLabel,
          chartNode,
          checkboxRow
        ]
      } )
    ];

    this.workFunctionListener = () => {
      this.updateGraphDecorations();
    };
    workFunctionProperty.link( this.workFunctionListener );

    this.updateGraphDecorations();
  }

  /**
   * Sets or clears one sample plot. Null means there is no sample data yet. The 'no-emit' state means the sample
   * exists, but no electron was ejected.
   */
  public setSampleData( sampleIndex: number, sampleState: EnergyBarGraphSampleState ): void {
    assert && assert( sampleIndex >= 0 && sampleIndex < NUMBER_OF_SAMPLE_PLOTS, 'sampleIndex out of range' );

    if ( sampleState === null || sampleState === 'no-emit' ) {
      this.sampleNodes[ sampleIndex ].children = [];
    }
    else {
      this.sampleNodes[ sampleIndex ].children = EnergyDiagramNode.createSampleMarkers(
        this.chartTransform,
        sampleIndex,
        sampleState
      );
    }
  }

  /**
   * Clears all sample plots.
   */
  public clearSampleData(): void {
    for ( let sampleIndex = 0; sampleIndex < NUMBER_OF_SAMPLE_PLOTS; sampleIndex++ ) {
      this.setSampleData( sampleIndex, null );
    }
  }

  /**
   * Repositions the y labels and regenerates the energy-level lines. The Fermi level depends on the active
   * material, so these decorations are updated when the work function changes.
   */
  private updateGraphDecorations(): void {
    const zeroY = this.chartTransform.modelToViewY( 0 );
    const fermiLevelY = this.chartTransform.modelToViewY( -this.workFunctionProperty.value );
    const conductionBandBottomY = this.chartTransform.modelToViewY( CONDUCTION_BAND_BOTTOM );

    this.zeroTickLabel.rightCenter = new Vector2( -Y_TICK_LABEL_MARGIN, zeroY );
    this.fermiLevelTickLabel.rightCenter = new Vector2( -Y_TICK_LABEL_MARGIN, fermiLevelY );

    const conductionBandNode = new Rectangle(
      0,
      fermiLevelY,
      CHART_VIEW_WIDTH,
      conductionBandBottomY - fermiLevelY, {
        fill: PhotoelectricEffectColors.conductionBandEnergyDiagramColorProperty
      } );

    // TODO: i18n
    const conductionBandLabel = new RichText( 'Conduction Band', {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      lineWrap: CONDUCTION_BAND_LABEL_LINE_WRAP
    } );

    const conductionBandBracket = new BracketNode( {
      orientation: 'right',
      labelNode: conductionBandLabel,
      bracketLength: Math.max(
        conductionBandBottomY - fermiLevelY - 2 * CONDUCTION_BAND_BRACKET_VERTICAL_INSET,
        CONDUCTION_BAND_BRACKET_MIN_LENGTH
      ),
      bracketEndRadius: CONDUCTION_BAND_BRACKET_END_RADIUS,
      bracketTipRadius: CONDUCTION_BAND_BRACKET_TIP_RADIUS,
      bracketStroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      bracketLineWidth: 1.5,
      spacing: CONDUCTION_BAND_LABEL_SPACING,
      visibleProperty: this.labelsVisibleProperty
    } );
    conductionBandBracket.leftCenter = new Vector2(
      CONDUCTION_BAND_BRACKET_X,
      ( fermiLevelY + conductionBandBottomY ) / 2
    );

    const workFunctionLabel = new Text( MathSymbols.PHI, {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      visibleProperty: this.workFunctionVisibleProperty
    } );
    workFunctionLabel.leftCenter = new Vector2(
      WORK_FUNCTION_MARKER_X + WORK_FUNCTION_MARKER_CAP_WIDTH / 2 + WORK_FUNCTION_LABEL_MARGIN,
      ( fermiLevelY + zeroY ) / 2
    );

    const workFunctionMarkerNode = new Node( {
      visibleProperty: this.workFunctionVisibleProperty,
      children: [
        new Line( WORK_FUNCTION_MARKER_X, fermiLevelY, WORK_FUNCTION_MARKER_X, zeroY, {
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
          lineWidth: WORK_FUNCTION_MARKER_LINE_WIDTH
        } ),
        new Line(
          WORK_FUNCTION_MARKER_X - WORK_FUNCTION_MARKER_CAP_WIDTH / 2, fermiLevelY,
          WORK_FUNCTION_MARKER_X + WORK_FUNCTION_MARKER_CAP_WIDTH / 2, fermiLevelY, {
            stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
            lineWidth: WORK_FUNCTION_MARKER_LINE_WIDTH
          } ),
        new Line(
          WORK_FUNCTION_MARKER_X - WORK_FUNCTION_MARKER_CAP_WIDTH / 2, zeroY,
          WORK_FUNCTION_MARKER_X + WORK_FUNCTION_MARKER_CAP_WIDTH / 2, zeroY, {
            stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
            lineWidth: WORK_FUNCTION_MARKER_LINE_WIDTH
          } ),
        workFunctionLabel
      ]
    } );

    this.graphDecorationNode.children = [
      conductionBandNode,
      new ArrowNode( 0, CHART_VIEW_HEIGHT, 0, 0, {
        fill: PhotoelectricEffectColors.iconStrokeColorProperty,
        stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
        lineWidth: 1,
        tailWidth: 1,
        headWidth: 9,
        headHeight: 9
      } ),
      new Line( 0, conductionBandBottomY, CHART_VIEW_WIDTH, conductionBandBottomY, {
        stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
        lineWidth: 1.5,
        lineDash: [ 2, 2 ]
      } ),
      new Line( 0, fermiLevelY, CHART_VIEW_WIDTH, fermiLevelY, {
        stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
        lineWidth: 1.5,
        lineDash: [ 2, 2 ]
      } ),
      new Line( 0, zeroY, CHART_VIEW_WIDTH, zeroY, {
        stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
        lineWidth: 1.5,
        lineDash: [ 8, 5 ]
      } ),
      workFunctionMarkerNode,
      conductionBandBracket
    ];
  }

  /**
   * Creates the electron markers for one sample. A white circle marks the electron's initial energy in the
   * conduction band, and the shaded blue electron marks its emitted kinetic energy after photon collision.
   */
  private static createSampleMarkers( chartTransform: ChartTransform,
                                      sampleIndex: number,
                                      data: EnergyBarGraphSampleData ): Node[] {
    const sampleCenterX = chartTransform.modelToViewX( getSampleCenterX( sampleIndex ) );

    const initialEnergyMarker = new Circle( ELECTRON_MARKER_RADIUS, {
      fill: 'white',
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1.5
    } );
    initialEnergyMarker.center = new Vector2( sampleCenterX, chartTransform.modelToViewY( data.potentialEnergy ) );

    const emittedEnergyMarker = EnergyDiagramNode.createElectronMarker();
    emittedEnergyMarker.center = new Vector2( sampleCenterX, chartTransform.modelToViewY( data.kineticEnergy ) );

    return [ initialEnergyMarker, emittedEnergyMarker ];
  }

  /**
   * Creates a shaded electron marker, matching the light direction used by ElectronNode in Models of the Hydrogen Atom.
   */
  private static createElectronMarker(): ShadedSphereNode {
    return new ShadedSphereNode( 2 * ELECTRON_MARKER_RADIUS, {
      mainColor: PhotoelectricEffectColors.electronBaseColorProperty,
      highlightColor: PhotoelectricEffectColors.electronHighlightColorProperty,
      highlightXOffset: 0,
      highlightYOffset: 0.4,
      isDisposable: false
    } );
  }

  public override dispose(): void {
    this.workFunctionProperty.unlink( this.workFunctionListener );
    super.dispose();
    this.chartTransform.dispose();
  }
}
