// Copyright 2026, University of Colorado Boulder

/**
 * Pure range helpers used by experiment graph plot areas.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../../dot/js/Range.js';
import Vector2 from '../../../../../dot/js/Vector2.js';

/**
 * Returns y zoom ranges sorted from most zoomed-in to most zoomed-out.
 */
export const sortYZoomRanges = ( yZoomRanges: Range[] ): Range[] => {
  return yZoomRanges.slice().sort( ( a, b ) => {
    return a.getLength() - b.getLength();
  } );
};

/**
 * Applies proportional padding around a model range so plotted curves do not sit directly on the chart edge. This adds
 * visual breathing room and keeps line caps from appearing clipped.
 */
export const getPaddedRange = ( range: Range, paddingFraction: number ): Range => {
  const padding = range.getLength() * paddingFraction;
  return new Range( range.min - padding, range.max + padding );
};

/**
 * Returns the most zoomed-in level that still contains all plotted y-values. Falls back to the default zoomed-in view
 * when no point data is visible.
 */
export const getZoomLevelForDataSetY = (
  yZoomRanges: Range[],
  dataSet: ReadonlyArray<Vector2>,
  currentPoint: Vector2 | null
): number => {

  // Track both bounds for forward compatibility. Current experiment graphs are non-negative and use y ranges that
  // start at zero, but checking both min and max keeps this method correct if future graphs include negative values
  // or shifted ranges.
  let minimumYValue = currentPoint ? currentPoint.y : Number.POSITIVE_INFINITY;
  let maximumYValue = currentPoint ? currentPoint.y : Number.NEGATIVE_INFINITY;
  for ( let i = 0; i < dataSet.length; i++ ) {
    minimumYValue = Math.min( minimumYValue, dataSet[ i ].y );
    maximumYValue = Math.max( maximumYValue, dataSet[ i ].y );
  }

  // Defaults to most zoomed-out until we find the tightest fitting preset.
  let updatedZoomLevel = yZoomRanges.length;
  if ( minimumYValue === Number.POSITIVE_INFINITY ) {

    // No data shown yet, so restore the default zoomed-in view.
    updatedZoomLevel = 1;
  }
  else {

    // Loop starting at most zoomed in. If the zoom range fits both data bounds, we can use that zoom range.
    for ( let i = 0; i < yZoomRanges.length; i++ ) {
      if ( yZoomRanges[ i ].contains( minimumYValue ) &&
           yZoomRanges[ i ].contains( maximumYValue ) ) {
        updatedZoomLevel = i + 1;
        break;
      }
    }
  }

  return updatedZoomLevel;
};
