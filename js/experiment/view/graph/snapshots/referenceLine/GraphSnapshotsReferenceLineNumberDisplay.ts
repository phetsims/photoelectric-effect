// Copyright 2026, University of Colorado Boulder

/**
 * Shared NumberDisplay configuration for readouts on the graph snapshots reference line.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { DualStringNumber } from '../../../../../../../axon/js/AccessibleStrings.js';
import type { TReadOnlyProperty } from '../../../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../../../dot/js/Range.js';
import { combineOptions } from '../../../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../../../phet-core/js/types/PickRequired.js';
import NumberDisplay, { type NumberDisplayOptions } from '../../../../../../../scenery-phet/js/NumberDisplay.js';
import type { PhetioObjectOptions } from '../../../../../../../tandem/js/PhetioObject.js';
import PhotoelectricEffectConstants from '../../../../../common/PhotoelectricEffectConstants.js';

export type GraphSnapshotsReferenceLineValueDisplayOptions = {

  // Range of formatted display values, used by NumberDisplay to size the readout.
  displayRange: Range;

  // Converts the raw graph model value to the displayed value.
  valueMapper: ( value: number ) => number;

  // Formats the displayed value for visual and accessible readouts.
  numberFormatter: ( value: number ) => string | DualStringNumber;

  // Dependencies used by numberFormatter, for example unit string Properties.
  numberFormatterDependencies?: TReadOnlyProperty<unknown>[];
};

export type GraphSnapshotsReferenceLineNumberDisplayOptions = GraphSnapshotsReferenceLineValueDisplayOptions &
  PickRequired<PhetioObjectOptions, 'tandem'>;

/**
 * Base class for reference line readouts that share NumberDisplay styling and instrumentation.
 */
export default abstract class GraphSnapshotsReferenceLineNumberDisplay extends NumberDisplay {
  protected constructor(
    valueProperty: TReadOnlyProperty<number | null>,
    displayOptions: GraphSnapshotsReferenceLineNumberDisplayOptions
  ) {
    super(
      valueProperty,
      displayOptions.displayRange,
      combineOptions<NumberDisplayOptions>( {
        isDisposable: false,
        pickable: false,
        align: 'center',
        numberFormatter: displayOptions.numberFormatter,
        numberFormatterDependencies: displayOptions.numberFormatterDependencies || [],
        textOptions: {
          font: PhotoelectricEffectConstants.READOUT_FONT,
          maxWidth: 80
        },
        xMargin: 4,
        yMargin: 1,
        minBackgroundWidth: 60,
        cornerRadius: 2,
        backgroundStroke: 'gray'
      }, {
        tandem: displayOptions.tandem
      } )
    );
  }
}
