// Copyright 2026, University of Colorado Boulder

/**
 * FrequencyEnergyGraphAssemblyNode configures a GraphAssemblyAccordionBox for a frequency/energy plot.
 * Sample data is owned by ExperimentModel.frequencyEnergyGraphData.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentModel from '../model/ExperimentModel.js';
import GraphAssemblyAccordionBox, { type GraphAssemblyAccordionBoxOptions } from './GraphAssemblyAccordionBox.js';

type SelfOptions = EmptySelfOptions;

export type FrequencyEnergyGraphAssemblyNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class FrequencyEnergyGraphAssemblyNode extends GraphAssemblyAccordionBox {

  /**
   * @param model - Provides graph data and axis ranges for this plot.
   * @param providedOptions - Node options for layout and instrumentation.
   */
  public constructor( model: ExperimentModel, providedOptions: FrequencyEnergyGraphAssemblyNodeOptions ) {

    // Frequency domain displayed for this graph.
    const xRange = new Range( 0, 3 );

    // Preset y-axis domains used by zoom controls (most zoomed-in to most zoomed-out after sorting).
    const yZoomRanges = [
      new Range( 0, 1 ),
      new Range( 0, 6 ),
      new Range( 0, 12 )
    ];

    const graphOptions: GraphAssemblyAccordionBoxOptions = {
      graphPlotAreaNodeOptions: {
        xAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.frequencyAxisLabelStringProperty,
        yAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.energyAxisLabelStringProperty,

        // TODO: @design This option is a little strange. We needed it so that the label did not overlap with the
        //   ExpandCollapseButton. Check in with design to see how the layout should ideally be done.
        yAxisLabelYOffset: 10,
        fill: PhotoelectricEffectColors.frequencyEnergyGraphFillColorProperty
      },
      accessibleName: PhotoelectricEffectFluent.a11y.frequencyEnergyGraphNode.accessibleHeadingStringProperty,
      cameraButtonAccessibleNameProperty: PhotoelectricEffectFluent.a11y.frequencyEnergyGraphNode.cameraButton.accessibleNameStringProperty,
      trashButtonAccessibleNameProperty: PhotoelectricEffectFluent.a11y.frequencyEnergyGraphNode.trashButton.accessibleNameStringProperty,
      snapshotsGalleryButtonAccessibleNameProperty: PhotoelectricEffectFluent.a11y.frequencyEnergyGraphNode.snapshotsGalleryButton.accessibleNameStringProperty,
      snapshotsGalleryButtonAccessibleHelpTextProperty: PhotoelectricEffectFluent.a11y.frequencyEnergyGraphNode.snapshotsGalleryButton.accessibleHelpTextStringProperty,
      tandem: providedOptions.tandem
    };

    super(
      model.frequencyEnergyGraphData,
      xRange,
      yZoomRanges,
      PhotoelectricEffectFluent.experiment.graph.frequencyEnergyTitleStringProperty,
      graphOptions
    );
  }
}
