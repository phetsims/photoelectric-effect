// Copyright 2026, University of Colorado Boulder

/**
 * IntensityCurrentGraphAccordionBox configures a GraphAssemblyAccordionBox for an intensity/current plot.
 * Sample data is owned by ExperimentModel.intensityCurrentGraphData.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { percentUnit } from '../../../../scenery-phet/js/units/percentUnit.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import { microamperesUnit } from '../../common/model/microamperesUnit.js';
import { ampsToMicroamps } from '../../common/model/PhotoelectricEffectUtils.js';
import PhotonSource from '../../common/model/PhotonSource.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentModel from '../model/ExperimentModel.js';
import GraphAssemblyAccordionBox, { type GraphAssemblyAccordionBoxOptions } from './GraphAssemblyAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type IntensityCurrentGraphAccordionBoxOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class IntensityCurrentGraphAccordionBox extends GraphAssemblyAccordionBox {

  /**
   * @param model - Provides graph data and axis ranges for this plot.
   * @param providedOptions - Node options for layout and instrumentation.
   */
  public constructor( model: ExperimentModel, providedOptions: IntensityCurrentGraphAccordionBoxOptions ) {

    // Graph remains labeled as intensity, but the source control value is represented as normalized output.
    const xRange = PhotonSource.NORMALIZED_OUTPUT_RANGE;

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
        xAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.intensityAxisLabelStringProperty,
        yAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.currentAxisLabelStringProperty,
        xTickLabelFormatter: value => {
          const scaledValue = value * 100;
          const isInteger = Math.abs( scaledValue - roundSymmetric( scaledValue ) ) < 1e-6;
          return toFixed( scaledValue, isInteger ? 0 : 2 );
        },
        fill: PhotoelectricEffectColors.intensityCurrentGraphFillColorProperty,
        yTickLabelMode: 'all',
        yTickLabelFormatter: value => toFixed( ampsToMicroamps( value ), 3 )
      },
      referenceLineXDisplayOptions: {
        displayRange: new Range( 0, 100 ),
        valueMapper: value => value * 100,
        numberFormatter: value => percentUnit.getDualString( value, { decimalPlaces: 0 } ),
        numberFormatterDependencies: percentUnit.getDependentProperties()
      },
      referenceLineYDisplayOptions: {
        displayRange: new Range( 0, ampsToMicroamps( PhotoelectricEffectConstants.MAX_CURRENT ) ),
        valueMapper: value => ampsToMicroamps( value ),
        numberFormatter: value => microamperesUnit.getDualString( value, { decimalPlaces: 3 } ),
        numberFormatterDependencies: microamperesUnit.getDependentProperties()
      },
      accessibleName: PhotoelectricEffectFluent.a11y.intensityCurrentGraphNode.accessibleHeadingStringProperty,
      cameraButtonAccessibleNameProperty: PhotoelectricEffectFluent.a11y.intensityCurrentGraphNode.cameraButton.accessibleNameStringProperty,
      trashButtonAccessibleNameProperty: PhotoelectricEffectFluent.a11y.intensityCurrentGraphNode.trashButton.accessibleNameStringProperty,
      snapshotsGalleryButtonAccessibleNameProperty: PhotoelectricEffectFluent.a11y.intensityCurrentGraphNode.snapshotsGalleryButton.accessibleNameStringProperty,
      snapshotsGalleryButtonAccessibleHelpTextProperty: PhotoelectricEffectFluent.a11y.intensityCurrentGraphNode.snapshotsGalleryButton.accessibleHelpTextStringProperty,
      tandem: providedOptions.tandem
    };

    super(
      model.intensityCurrentGraphData,
      xRange,
      yZoomRanges,
      PhotoelectricEffectFluent.experiment.graph.intensityCurrentTitleStringProperty,
      graphOptions
    );
  }
}
