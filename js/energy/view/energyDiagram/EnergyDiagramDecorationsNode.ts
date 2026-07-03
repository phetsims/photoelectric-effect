// Copyright 2026, University of Colorado Boulder

/**
 * Persistent background decorations for the Energy screen energy diagram.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import type { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import ArrowNode from '../../../../../scenery-phet/js/ArrowNode.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import Line from '../../../../../scenery/js/nodes/Line.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectColors from '../../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../../PhotoelectricEffectFluent.js';
import EnergyGraphLayout from '../EnergyGraphLayout.js';

// View-coordinate layout for the work-function bracket.
const WORK_FUNCTION_MARKER_X_OFFSET = 14;
const WORK_FUNCTION_MARKER_CAP_WIDTH = 12;
const WORK_FUNCTION_MARKER_LINE_WIDTH = 2;

/**
 * Owns the static and work-function-dependent decorations behind the sample markers. This includes the occupied and
 * empty state regions, y-reference lines, y tick labels, and the work-function bracket.
 */
export default class EnergyDiagramDecorationsNode extends Node {

  // Translates energy coordinates into the shared chart view.
  private readonly chartTransform: ChartTransform;

  // Filled region between zero energy and the Fermi level, representing empty electron states.
  private readonly emptyStatesNode: Rectangle;

  // Filled region that represents occupied states below the Fermi level.
  private readonly conductionBandNode: Rectangle;

  // Persistent graph decorations that can be repositioned as the work function changes. These are created once
  // to avoid disposing/reconstructing every change.
  private readonly conductionBandBottomLine: Line;
  private readonly fermiLevelLine: Line;
  private readonly zeroEnergyLine: Line;
  private readonly workFunctionMarkerLine: Line;
  private readonly workFunctionMarkerFermiCap: Line;
  private readonly workFunctionMarkerZeroCap: Line;
  private readonly workFunctionLabel: Node;

  // Labels for the special y values shown on the graph.
  private readonly zeroTickLabel: Node;
  private readonly fermiLevelTickLabel: Node;

  /**
   * @param chartTransform - Translates energy coordinates into the shared chart view.
   * @param workFunctionProperty - Work function source used for the Fermi level and work-function bracket.
   * @param bandDepthProperty - Occupied-band depth source used for the bottom of the filled states.
   * @param labelsVisibleProperty - Whether Fermi level labels are visible.
   * @param workFunctionVisibleProperty - Whether the work-function bracket and label are visible.
   */
  public constructor( chartTransform: ChartTransform,
                      workFunctionProperty: TReadOnlyProperty<number>,
                      bandDepthProperty: TReadOnlyProperty<number>,
                      labelsVisibleProperty: TReadOnlyProperty<boolean>,
                      workFunctionVisibleProperty: TReadOnlyProperty<boolean> ) {
    super();

    this.chartTransform = chartTransform;

    const chartViewWidth = chartTransform.viewWidth;
    const chartViewHeight = chartTransform.viewHeight;
    const workFunctionMarkerX = chartViewWidth + WORK_FUNCTION_MARKER_X_OFFSET;

    this.emptyStatesNode = new Rectangle( 0, 0, chartViewWidth, 0, {
      fill: PhotoelectricEffectColors.emptyStatesEnergyDiagramColorProperty
    } );

    this.conductionBandNode = new Rectangle( 0, 0, chartViewWidth, 0, {
      fill: PhotoelectricEffectColors.electronColorProperty
    } );

    const energyAxisNode = new ArrowNode( 0, chartViewHeight, 0, 0, {
      fill: PhotoelectricEffectColors.iconStrokeColorProperty,
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1,
      tailWidth: 0.5,
      headWidth: 9,
      headHeight: 9
    } );

    this.conductionBandBottomLine = new Line( 0, 0, chartViewWidth, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1.5,
      lineDash: [ 1, 0.5 ]
    } );

    this.fermiLevelLine = new Line( 0, 0, chartViewWidth, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1.5,
      lineDash: [ 1, 0.5 ]
    } );

    this.zeroEnergyLine = new Line( 0, 0, chartViewWidth, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1.5,
      lineDash: [ 2, 1 ]
    } );

    this.workFunctionMarkerLine = new Line( 0, 0, 0, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: WORK_FUNCTION_MARKER_LINE_WIDTH
    } );

    this.workFunctionMarkerFermiCap = new Line( 0, 0, 0, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: WORK_FUNCTION_MARKER_LINE_WIDTH
    } );

    this.workFunctionMarkerZeroCap = new Line( 0, 0, 0, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: WORK_FUNCTION_MARKER_LINE_WIDTH
    } );

    this.workFunctionLabel = new Text( MathSymbols.PHI_SYMBOL, {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      visibleProperty: workFunctionVisibleProperty
    } );

    this.zeroTickLabel = new Text( '0', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );

    this.fermiLevelTickLabel = new RichText( PhotoelectricEffectFluent.energy.graph.fermiLevelLabelStringProperty, {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      visibleProperty: labelsVisibleProperty
    } );

    this.children = [
      this.emptyStatesNode,
      this.conductionBandNode,
      energyAxisNode,
      this.conductionBandBottomLine,
      this.fermiLevelLine,
      this.zeroEnergyLine,
      new Node( {
        visibleProperty: workFunctionVisibleProperty,
        children: [
          this.workFunctionMarkerLine,
          this.workFunctionMarkerFermiCap,
          this.workFunctionMarkerZeroCap,
          this.workFunctionLabel
        ]
      } ),
      this.zeroTickLabel,
      this.fermiLevelTickLabel
    ];

    // Linked eagerly to initialize decoration positions.
    Multilink.multilink( [ workFunctionProperty, bandDepthProperty ], ( workFunction, bandDepth ) => {
      this.updateGraphDecorations( workFunction, bandDepth, workFunctionMarkerX );
    } );
  }

  /**
   * Repositions graph decorations that depend on the active material's work function.
   */
  private updateGraphDecorations( workFunction: number, bandDepth: number, workFunctionMarkerX: number ): void {
    const chartViewWidth = this.chartTransform.viewWidth;
    const chartViewHeight = this.chartTransform.viewHeight;
    const zeroY = this.chartTransform.modelToViewY( 0 );
    const fermiLevelY = this.chartTransform.modelToViewY( -workFunction );
    const unclippedConductionBandBottomY = this.chartTransform.modelToViewY( -workFunction - bandDepth );

    const conductionBandBottomY = Math.min( unclippedConductionBandBottomY, chartViewHeight );

    this.zeroTickLabel.rightCenter = new Vector2( -EnergyGraphLayout.Y_TICK_LABEL_MARGIN, zeroY );
    this.fermiLevelTickLabel.rightCenter = new Vector2( -EnergyGraphLayout.Y_TICK_LABEL_MARGIN, fermiLevelY );

    this.conductionBandNode.setRect( 0, fermiLevelY, chartViewWidth, conductionBandBottomY - fermiLevelY );
    this.emptyStatesNode.setRect( 0, zeroY, chartViewWidth, fermiLevelY - zeroY );

    this.conductionBandBottomLine.setLine( 0, conductionBandBottomY, chartViewWidth, conductionBandBottomY );
    this.fermiLevelLine.setLine( 0, fermiLevelY, chartViewWidth, fermiLevelY );
    this.zeroEnergyLine.setLine( 0, zeroY, chartViewWidth, zeroY );

    this.workFunctionMarkerLine.setLine( workFunctionMarkerX, fermiLevelY, workFunctionMarkerX, zeroY );
    this.workFunctionMarkerFermiCap.setLine(
      workFunctionMarkerX - WORK_FUNCTION_MARKER_CAP_WIDTH / 2, fermiLevelY,
      workFunctionMarkerX + WORK_FUNCTION_MARKER_CAP_WIDTH / 2, fermiLevelY
    );
    this.workFunctionMarkerZeroCap.setLine(
      workFunctionMarkerX - WORK_FUNCTION_MARKER_CAP_WIDTH / 2, zeroY,
      workFunctionMarkerX + WORK_FUNCTION_MARKER_CAP_WIDTH / 2, zeroY
    );
    this.workFunctionLabel.leftCenter = new Vector2(
      workFunctionMarkerX + WORK_FUNCTION_MARKER_CAP_WIDTH / 2 + 4,
      ( fermiLevelY + zeroY ) / 2
    );
  }
}
