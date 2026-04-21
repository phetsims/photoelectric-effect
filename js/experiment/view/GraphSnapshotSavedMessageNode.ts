// Copyright 2026, University of Colorado Boulder

/**
 * GraphSnapshotSavedMessageNode displays a transient "Saved!" message at the top of the graph plot area.
 * Calling showMessage makes the text visible immediately, then fades it out after a delay.
 * If showMessage is called again while fading, the previous fade is cancelled and restarted.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

// Delay before the message begins fading out.
const SNAPSHOT_SAVED_MESSAGE_FADE_DELAY = 1.5;

// Duration for the message fade-out tween.
const SNAPSHOT_SAVED_MESSAGE_FADE_DURATION = 0.6;

export default class GraphSnapshotSavedMessageNode extends Node {

  // Text node for the transient message.
  private readonly snapshotSavedText: Text;

  // Active fade animation, if one is running.
  private snapshotSavedAnimation: Animation | null = null;

  public constructor() {
    super();

    this.snapshotSavedText = new Text(
      PhotoelectricEffectFluent.experiment.graph.snapshotSavedStringProperty,
      {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        visible: false,
        opacity: 0
      }
    );

    this.addChild( this.snapshotSavedText );
  }

  /**
   * Shows the message immediately and starts a delayed fade-out tween.
   */
  public showMessage(): void {
    this.clearMessage();
    this.snapshotSavedText.visible = true;
    this.snapshotSavedText.opacity = 1;

    const savedAnimation = new Animation( {
      duration: SNAPSHOT_SAVED_MESSAGE_FADE_DURATION,
      delay: SNAPSHOT_SAVED_MESSAGE_FADE_DELAY,
      targets: [ {
        property: this.snapshotSavedText.opacityProperty,
        to: 0,
        easing: Easing.QUADRATIC_IN_OUT
      } ]
    } );

    this.snapshotSavedAnimation = savedAnimation;

    savedAnimation.endedEmitter.addListener( () => {
      if ( this.snapshotSavedAnimation === savedAnimation ) {
        this.snapshotSavedAnimation = null;
      }
      this.snapshotSavedText.visible = false;
      savedAnimation.dispose();
    } );

    savedAnimation.start();
  }

  /**
   * Stops any active animation and hides the message immediately.
   */
  private clearMessage(): void {
    if ( this.snapshotSavedAnimation ) {
      this.snapshotSavedAnimation.stop();
      this.snapshotSavedAnimation = null;
    }

    this.snapshotSavedText.visible = false;
    this.snapshotSavedText.opacity = 0;
  }
}
