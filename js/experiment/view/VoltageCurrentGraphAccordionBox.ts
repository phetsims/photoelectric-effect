// Copyright 2026, University of Colorado Boulder

/**
 * VoltageCurrentGraphAccordionBox configures a GraphAssemblyAccordionBox for a voltage/current plot.
 * Sample data is owned by ExperimentModel.voltageCurrentGraphData.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { voltsUnit } from '../../../../scenery-phet/js/units/voltsUnit.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import { ampsToMicroamps } from '../../common/model/PhotoelectricEffectUtils.js';
import { microamperesUnit } from '../../common/model/microamperesUnit.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentModel from '../model/ExperimentModel.js';
import GraphAssemblyAccordionBox, { type GraphAssemblyAccordionBoxOptions } from './GraphAssemblyAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type VoltageCurrentGraphAccordionBoxOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class VoltageCurrentGraphAccordionBox extends GraphAssemblyAccordionBox {

  /**
   * @param model - Provides graph data and axis ranges for this plot.
   * @param providedOptions - Node options for layout and instrumentation.
   */
  public constructor( model: ExperimentModel, providedOptions: VoltageCurrentGraphAccordionBoxOptions ) {

    // Full voltage domain displayed for this graph.
    const xRange = new Range( PhotoelectricEffectConstants.MIN_VOLTAGE, PhotoelectricEffectConstants.MAX_VOLTAGE );

    // Preset y-axis domains used by zoom controls (most zoomed-in to most zoomed-out after sorting).
    const yZoomRanges = [
      new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT ),
      new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT * 0.6 ),
      new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT * 0.2 ),
      new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT * 0.1 ),
      new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT * 0.02 )
    ];

    const graphOptions: GraphAssemblyAccordionBoxOptions = {
      graphPlotAreaNodeOptions: {
        xAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.voltageAxisLabelStringProperty,
        yAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.currentAxisLabelStringProperty,
        xTickCount: 9,
        xTickLabelMode: 'all',
        xTickLabelFormatter: value => toFixed( value, 0 ),
        yTickLabelMode: 'all',
        fill: PhotoelectricEffectColors.voltageCurrentGraphFillColorProperty,
        yTickLabelFormatter: value => toFixed( ampsToMicroamps( value ), 3 )
      },
      referenceLineXDisplayOptions: {
        displayRange: xRange,
        numberFormatter: value => voltsUnit.getDualString( value, { decimalPlaces: 2 } ),
        numberFormatterDependencies: voltsUnit.getDependentProperties()
      },
      referenceLineYDisplayOptions: {
        displayRange: new Range( 0, ampsToMicroamps( PhotoelectricEffectConstants.MAX_CURRENT ) ),
        valueMapper: value => ampsToMicroamps( value ),
        numberFormatter: value => microamperesUnit.getDualString( value, { decimalPlaces: 3 } ),
        numberFormatterDependencies: microamperesUnit.getDependentProperties()
      },
      accessibleName: PhotoelectricEffectFluent.a11y.voltageCurrentGraphNode.accessibleHeadingStringProperty,
      cameraButtonAccessibleNameProperty: PhotoelectricEffectFluent.a11y.voltageCurrentGraphNode.cameraButton.accessibleNameStringProperty,
      trashButtonAccessibleNameProperty: PhotoelectricEffectFluent.a11y.voltageCurrentGraphNode.trashButton.accessibleNameStringProperty,
      snapshotsGalleryButtonAccessibleNameProperty: PhotoelectricEffectFluent.a11y.voltageCurrentGraphNode.snapshotsGalleryButton.accessibleNameStringProperty,
      snapshotsGalleryButtonAccessibleHelpTextProperty: PhotoelectricEffectFluent.a11y.voltageCurrentGraphNode.snapshotsGalleryButton.accessibleHelpTextStringProperty,
      tandem: providedOptions.tandem
    };

    super(
      model.voltageCurrentGraphData,
      xRange,
      yZoomRanges,
      PhotoelectricEffectFluent.experiment.graph.voltageCurrentTitleStringProperty,
      graphOptions
    );
  }
}
