// Copyright 2026, University of Colorado Boulder

/**
 * Dialog opened from each experiment graph's info button. Currently, shows shared placeholder
 * copy until graph-specific content is designed.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

// Determined empirically for readable line lengths in the dialog body.
const MAX_CONTENT_WIDTH = 480;

const DIALOG_TITLE_FONT = new PhetFont( { size: 18, weight: 'bold' } );
const DIALOG_CONTENT_FONT = new PhetFont( 14 );

export default class ExperimentGraphInfoDialog extends Dialog {

  public constructor( tandem: Tandem ) {

    const titleText = new Text( PhotoelectricEffectFluent.experiment.graph.infoDialogTitleStringProperty, {
      font: DIALOG_TITLE_FONT,
      maxWidth: MAX_CONTENT_WIDTH
    } );

    const placeholderText = new Text( PhotoelectricEffectFluent.experiment.graph.infoDialogPlaceholderStringProperty, {
      font: DIALOG_CONTENT_FONT,
      maxWidth: MAX_CONTENT_WIDTH
    } );

    super( placeholderText, {
      title: titleText,
      xSpacing: 30,
      cornerRadius: 10,
      ySpacing: 30,
      isDisposable: false,
      tandem: tandem,
      phetioReadOnly: true
    } );
  }
}
