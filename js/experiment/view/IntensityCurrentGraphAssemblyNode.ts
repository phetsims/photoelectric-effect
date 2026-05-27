// Copyright 2026, University of Colorado Boulder

/**
 * IntensityCurrentGraphAssemblyNode configures a GraphAssemblyNode for an intensity/current plot.
 * Sample data is owned by ExperimentModel.intensityCurrentGraphData.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import { ampsToMilliAmps } from '../../common/model/PhotoelectricEffectUtils.js';
import PhotonSource from '../../common/model/PhotonSource.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentModel from '../model/ExperimentModel.js';
import GraphAssemblyNode, { type GraphAssemblyNodeOptions } from './GraphAssemblyNode.js';

type SelfOptions = EmptySelfOptions;

export type IntensityCurrentGraphAssemblyNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class IntensityCurrentGraphAssemblyNode extends GraphAssemblyNode {

  /**
   * @param model - Provides graph data and axis ranges for this plot.
   * @param providedOptions - Node options for layout and instrumentation.
   */
  public constructor( model: ExperimentModel, providedOptions: IntensityCurrentGraphAssemblyNodeOptions ) {

    // Graph remains labeled as intensity, but the source control value is represented as normalized output.
    const xRange = PhotonSource.NORMALIZED_OUTPUT_RANGE;

    // Preset y-axis domains used by zoom controls (most zoomed-in to most zoomed-out after sorting).
    const yZoomRanges = [
      new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT ),
      new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT * 0.6 ),
      new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT * 0.2 )
    ];

    const graphOptions: GraphAssemblyNodeOptions = {
      graphPlotAreaNodeOptions: {
        xAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.intensityAxisLabelStringProperty,
        yAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.currentAxisLabelStringProperty,
        xTickLabelFormatter: value => {
          const scaledValue = value * 100;
          const isInteger = Math.abs( scaledValue - roundSymmetric( scaledValue ) ) < 1e-6;
          return toFixed( scaledValue, isInteger ? 0 : 2 );
        },
        fill: PhotoelectricEffectColors.intensityCurrentGraphFillColorProperty,
        yTickLabelFormatter: value => toFixed( ampsToMilliAmps( value ), 0 )
      },
      accessibleHeading: PhotoelectricEffectFluent.a11y.intensityCurrentGraphNode.accessibleHeadingStringProperty,
      expandCollapseButtonAccessibleNameProperty: PhotoelectricEffectFluent.a11y.intensityCurrentGraphNode.expandCollapseButton.accessibleNameStringProperty,
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
