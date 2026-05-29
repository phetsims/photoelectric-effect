// Copyright 2026, University of Colorado Boulder

/**
 * VoltageCurrentGraphAssemblyNode configures a GraphAssemblyAccordionBox for a voltage/current plot.
 * Sample data is owned by ExperimentModel.voltageCurrentGraphData.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import { ampsToMilliAmps } from '../../common/model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentModel from '../model/ExperimentModel.js';
import GraphAssemblyAccordionBox, { type GraphAssemblyAccordionBoxOptions } from './GraphAssemblyAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type VoltageCurrentGraphAssemblyNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class VoltageCurrentGraphAssemblyNode extends GraphAssemblyAccordionBox {

  /**
   * @param model - Provides graph data and axis ranges for this plot.
   * @param providedOptions - Node options for layout and instrumentation.
   */
  public constructor( model: ExperimentModel, providedOptions: VoltageCurrentGraphAssemblyNodeOptions ) {

    // Full voltage domain displayed for this graph.
    const xRange = new Range( PhotoelectricEffectConstants.MIN_VOLTAGE, PhotoelectricEffectConstants.MAX_VOLTAGE );

    // Preset y-axis domains used by zoom controls (most zoomed-in to most zoomed-out after sorting).
    const yZoomRanges = [
      new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT ),
      new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT * 0.6 ),
      new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT * 0.3 )
    ];

    const graphOptions: GraphAssemblyAccordionBoxOptions = {
      graphPlotAreaNodeOptions: {
        xAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.voltageAxisLabelStringProperty,
        yAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.currentAxisLabelStringProperty,
        fill: PhotoelectricEffectColors.voltageCurrentGraphFillColorProperty,

        // TODO: @design - what units are these in? Mockup shows microamps in label but I think display is in
        //   miliamps.
        yTickLabelFormatter: value => toFixed( ampsToMilliAmps( value ), 0 )
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
