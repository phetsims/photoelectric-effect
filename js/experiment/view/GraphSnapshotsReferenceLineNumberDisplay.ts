// Copyright 2026, University of Colorado Boulder

/**
 * Shared NumberDisplay configuration for readouts on the graph snapshots reference line.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { DualStringNumber } from '../../../../axon/js/AccessibleStrings.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import type { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';

export type GraphSnapshotsReferenceLineValueDisplayOptions = {

  // Range of formatted display values, used by NumberDisplay to size the readout.
  displayRange: Range;

  // Converts the raw graph model value to the displayed value.
  valueMapper?: ( value: number ) => number;

  // Formats the displayed value for visual and accessible readouts.
  numberFormatter: ( value: number ) => string | DualStringNumber;

  // Dependencies used by numberFormatter, for example unit string Properties.
  numberFormatterDependencies?: TReadOnlyProperty<unknown>[];
};

/**
 * Shared NumberDisplay styling for the reference-line readouts.
 */
export const createGraphSnapshotsReferenceLineNumberDisplayOptions = (
  displayOptions: GraphSnapshotsReferenceLineValueDisplayOptions,
  providedOptions?: NumberDisplayOptions
): NumberDisplayOptions => {
  return combineOptions<NumberDisplayOptions>( {
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
  }, providedOptions );
};

/**
 * Creates a value mapper for readout Properties.
 */
export const createGraphSnapshotsReferenceLineValueMapper = (
  displayOptions: GraphSnapshotsReferenceLineValueDisplayOptions
): ( value: number ) => number => {
  return displayOptions.valueMapper || ( value => value );
};
