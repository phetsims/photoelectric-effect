// Copyright 2026, University of Colorado Boulder

/**
 * Dialog opened from each experiment graph's info button. Currently, shows shared placeholder
 * copy until graph-specific content is designed.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';

export default class GraphInfoDialog extends Dialog {

  public constructor( tandem: Tandem ) {

    const titleText = new Text( PhotoelectricEffectFluent.experiment.graph.infoDialogTitleStringProperty, {
      font: PhotoelectricEffectConstants.DIALOG_TITLE_FONT,
      maxWidth: PhotoelectricEffectConstants.DIALOG_MAX_CONTENT_WIDTH
    } );

    const placeholderText = new Text( PhotoelectricEffectFluent.experiment.graph.infoDialogPlaceholderStringProperty, {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      maxWidth: PhotoelectricEffectConstants.DIALOG_MAX_CONTENT_WIDTH
    } );

    super( placeholderText, {
      title: titleText,
      xSpacing: PhotoelectricEffectConstants.DIALOG_SPACING,
      cornerRadius: PhotoelectricEffectConstants.DIALOG_CORNER_RADIUS,
      ySpacing: PhotoelectricEffectConstants.DIALOG_SPACING,
      isDisposable: false,
      tandem: tandem,
      phetioReadOnly: true
    } );
  }
}
