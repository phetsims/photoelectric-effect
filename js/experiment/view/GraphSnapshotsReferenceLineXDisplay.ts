// Copyright 2026, University of Colorado Boulder

/**
 * X-value readout shown above the graph snapshots reference line.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { createGraphSnapshotsReferenceLineNumberDisplayOptions, createGraphSnapshotsReferenceLineValueMapper, type GraphSnapshotsReferenceLineValueDisplayOptions } from './GraphSnapshotsReferenceLineNumberDisplay.js';

// Space between the top of the visible plot stack and the x-value readout.
const X_DISPLAY_MARGIN = 6;

export default class GraphSnapshotsReferenceLineXDisplay extends NumberDisplay {

  public constructor(
    referenceLineXProperty: NumberProperty,
    displayOptions: GraphSnapshotsReferenceLineValueDisplayOptions,
    tandem: Tandem
  ) {

    const xValueMapper = createGraphSnapshotsReferenceLineValueMapper( displayOptions );
    const xDisplayProperty = new DerivedProperty(
      [ referenceLineXProperty ],
      x => xValueMapper( x )
    );

    super(
      xDisplayProperty,
      displayOptions.displayRange,
      createGraphSnapshotsReferenceLineNumberDisplayOptions( displayOptions, {
        tandem: tandem
      } )
    );
  }

  /**
   * Positions the x readout above the line, clamping to the plot bounds so it stays readable near the edges.
   */
  public updateLayout( referenceLineX: number, topPlotBounds: Bounds2 ): void {
    const xDisplayCenterX = clamp(
      referenceLineX,
      topPlotBounds.left + this.width / 2,
      topPlotBounds.right - this.width / 2
    );
    this.centerBottom = new Vector2( xDisplayCenterX, topPlotBounds.top - X_DISPLAY_MARGIN );
  }
}
