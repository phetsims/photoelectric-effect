// Copyright 2026, University of Colorado Boulder

/**
 * AccordionBox for controls that edit the physical properties of the active material. The controls use DynamicProperty
 * so they continue to point at the corresponding Properties when the active material changes.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import type Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import type Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import { electronVoltUnit } from '../../../../scenery-phet/js/units/electronVoltUnit.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox, { type AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import type Tandem from '../../../../tandem/js/Tandem.js';
import Material from '../../common/model/Material.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';

type SelfOptions = EmptySelfOptions;

export type MaterialPropertiesAccordionBoxOptions =
  SelfOptions & NodeOptions & PickRequired<AccordionBoxOptions, 'tandem'>;

const CONTROL_TRACK_SIZE = new Dimension2( 140, 2 );

export default class MaterialPropertiesAccordionBox extends AccordionBox {

  public constructor( materialProperty: Property<Material>, providedOptions: MaterialPropertiesAccordionBoxOptions ) {

    const options = optionize<MaterialPropertiesAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      isDisposable: false,
      expandedDefaultValue: false,

      // todo: factor out into constants, since these are shared with the energy diagram accordion box
      buttonXMargin: 10,
      buttonYMargin: 10,
      contentXMargin: 10,
      contentYMargin: 15,
      titleAlignX: 'left',
      fill: PhotoelectricEffectColors.screenBackgroundColorProperty,

      // TODO: i18n
      titleNode: new Text( 'Material Properties', {
        font: PhotoelectricEffectConstants.PANEL_TITLE_FONT
      } ),
      showTitleWhenExpanded: false
    }, providedOptions );

    // TODO: Should Target's workFunctionProperty and bandDepthProperty be bidirectional DynamicProperties so
    //  views can edit the active material through Target directly? Pro: Target would be the single active-material API,
    //  avoiding duplicate DynamicProperties in view code. Con: writable convenience Properties may obscure that setting
    //  them mutates whichever Material is currently selected.

    // These DynamicProperties are bidirectional so the NumberControls edit the currently selected Material directly.
    const workFunctionProperty = new DynamicProperty<number, number, Material>( materialProperty, {
      bidirectional: true,
      units: electronVoltUnit,
      derive: 'workFunctionProperty'
    } );

    const bandDepthProperty = new DynamicProperty<number, number, Material>( materialProperty, {
      bidirectional: true,
      units: electronVoltUnit,
      derive: 'bandDepthProperty'
    } );

    const workFunctionControl = MaterialPropertiesAccordionBox.createMaterialPropertyNumberControl(
      'Work Function',
      workFunctionProperty,
      Material.WORK_FUNCTION_RANGE,
      options.tandem.createTandem( 'workFunctionControl' )
    );

    const bandDepthControl = MaterialPropertiesAccordionBox.createMaterialPropertyNumberControl(
      'Band Depth',
      bandDepthProperty,
      Material.BAND_DEPTH_RANGE,
      options.tandem.createTandem( 'bandDepthControl' )
    );

    const controlsNode = new HBox( {
      align: 'center',
      spacing: 55,
      children: [
        workFunctionControl,
        bandDepthControl
      ]
    } );

    super( controlsNode, options );
  }

  /**
   * Creates one material-property control with the shared slider appearance and formatting options.
   */
  private static createMaterialPropertyNumberControl(
    title: string,
    property: DynamicProperty<number, number, Material>,
    range: Range,
    tandem: Tandem
  ): NumberControl {
    return new NumberControl( title, property, range, {
      delta: 0.1,
      titleNodeOptions: {
        font: PhotoelectricEffectConstants.CONTENT_FONT
      },
      numberDisplayOptions: {
        decimalPlaces: 1
      },
      sliderOptions: {
        trackSize: CONTROL_TRACK_SIZE,
        majorTicks: [
          {
            value: range.min,
            label: new Text( toFixed( range.min, 1 ), {
              font: PhotoelectricEffectConstants.READOUT_FONT
            } )
          },
          {
            value: range.max,
            label: new Text( toFixed( range.max, 1 ), {
              font: PhotoelectricEffectConstants.READOUT_FONT
            } )
          }
        ],
        majorTickLength: 8
      },
      layoutFunction: NumberControl.createLayoutFunction4( {
        arrowButtonSpacing: 0
      } ),
      tandem: tandem
    } );
  }
}