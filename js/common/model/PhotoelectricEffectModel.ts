// Copyright 2026, University of Colorado Boulder

/**
 * Particle-based photoelectric effect model.
 * Owns the photon and electron collections and computes analytic current.
 *
 * @author Marla A. Schulz (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import Electron from './Electron.js';
import Material, { MaterialType } from './Material.js';
import PhotoelectricEffectModelConfig from './PhotoelectricEffectModelConfig.js';
import { intensityToPhotonRate, wavelengthToEnergy } from './PhotoelectricEffectUtils.js';
import Photon from './Photon.js';
import PhotonSource from './PhotonSource.js';
import Target from './Target.js';

type SelfOptions = {

  // TODO add options that are specific to PhotoelectricEffectModel here
};

export type PhotoelectricEffectModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PhotoelectricEffectModel implements TModel {

  /**
   * Active photons in the model.
   */
  public readonly photons: Photon[] = [];

  /**
   * Active electrons in the model.
   */
  public readonly electrons: Electron[] = [];

  /**
   * Target plate that emits electrons.
   */
  public readonly target: Target;

  /**
   * Photon source that emits toward the target.
   */
  public readonly photonSource: PhotonSource;

  /**
   * Voltage across the plates in model units.
   */
  public readonly voltageProperty: NumberProperty;

  /**
   * Wavelength of emitted photons in nanometers.
   */
  public readonly wavelengthProperty: NumberProperty;

  /**
   * Derived analytic current based on model settings.
   */
  public readonly currentProperty: TReadOnlyProperty<number>;

  /**
   * Accumulates fractional photon emissions between steps.
   */
  private photonEmissionAccumulator = 0;

  /**
   * Creates the model and configures materials, sources, and derived current.
   * @param mysteryMaterials - mystery materials owned by PhotoelectricEffectPreferencesModel and passed down.
   *   One entry for the user-configurable mystery material; additional entries can be added in the future
   *   for PhET-iO clients to manipulate.
   * @param providedOptions
   */
  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectModelOptions ) {

    const options = optionize<PhotoelectricEffectModelOptions, SelfOptions, PhetioObjectOptions>()( {}, providedOptions );

    const standardMaterials = [
      new Material( MaterialType.SODIUM, options.tandem ),
      new Material( MaterialType.COPPER, options.tandem ),
      new Material( MaterialType.CALCIUM, options.tandem ),
      new Material( MaterialType.MAGNESIUM, options.tandem ),
      new Material( MaterialType.PLATINUM, options.tandem ),
      new Material( MaterialType.ZINC, options.tandem ),
      new Material( MaterialType.CUSTOM, options.tandem )
    ];

    const allMaterials = [
      ...standardMaterials,
      ...mysteryMaterials
    ];

    this.target = new Target( allMaterials, providedOptions.tandem.createTandem( 'target' ) );
    this.photonSource = new PhotonSource( {
      tandem: providedOptions.tandem.createTandem( 'photonSource' )
    } );


    this.voltageProperty = new NumberProperty( 0, {
      range: new Range( PhotoelectricEffectConstants.MIN_VOLTAGE,
        PhotoelectricEffectConstants.MAX_VOLTAGE )
    } );
    this.wavelengthProperty = this.photonSource.wavelengthProperty;

    this.currentProperty = new DerivedProperty(
      [
        this.voltageProperty,
        this.photonSource.intensityProperty,
        this.photonSource.wavelengthProperty,
        this.target.workFunctionProperty
      ],
      ( voltage, intensity, wavelength, workFunction ) => {
        return this.getCurrentForVoltage( voltage, intensity, wavelength, workFunction );
      }
    );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.target.reset();
    this.photonSource.reset();
    this.voltageProperty.reset();

    this.photons.length = 0;
    this.electrons.length = 0;
    this.photonEmissionAccumulator = 0;

  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    if ( dt > 0 ) {
      this.emitPhotons( dt );
      this.stepPhotons( dt );
      this.stepElectrons( dt );
    }
  }

  /**
   * Handles collisions between emitted electrons and the sink.
   * Returns true when the electron is absorbed by the sink.
   */
  protected handleElectronSinkCollision( _electron: Electron ): boolean {
    return false;
  }

  /**
   * Emits new photons based on source intensity and elapsed time.
   */
  private emitPhotons( dt: number ): void {
    const photonRate = intensityToPhotonRate(
      this.photonSource.intensityProperty.value,
      this.photonSource.wavelengthProperty.value
    );
    const totalPhotons = this.photonEmissionAccumulator + photonRate * dt;
    const wholePhotons = Math.floor( totalPhotons );
    this.photonEmissionAccumulator = totalPhotons - wholePhotons;

    if ( wholePhotons > 0 ) {
      for ( let i = 0; i < wholePhotons; i++ ) {
        const position = PhotoelectricEffectModelConfig.PHOTON_SOURCE_POSITION.copy();
        const angle = ( dotRandom.nextDouble() - 0.5 ) * PhotoelectricEffectModelConfig.PHOTON_SOURCE_FANOUT_ANGLE;
        const direction = PhotoelectricEffectModelConfig.PHOTON_SOURCE_DIRECTION.rotated( angle );
        const velocity = direction.timesScalar( PhotoelectricEffectModelConfig.PHOTON_SPEED );
        const photon = new Photon( position, velocity, new Vector2( 0, 0 ), this.photonSource.wavelengthProperty.value );
        this.photons.push( photon );
      }
    }
  }

  /**
   * Advances photons and handles collisions with the target.
   */
  private stepPhotons( dt: number ): void {
    const nextPhotons: Photon[] = [];

    for ( let i = 0; i < this.photons.length; i++ ) {
      const photon = this.photons[ i ];
      photon.step( dt );

      const hitTarget = this.target.isHitByPhoton( photon );
      if ( hitTarget ) {
        const electron = this.target.handlePhotonCollision( photon );
        if ( electron ) {
          this.electrons.push( electron );
        }
      }

      const inBounds = PhotoelectricEffectModelConfig.MODEL_BOUNDS.containsPoint( photon.getPosition() );
      if ( !hitTarget && inBounds ) {
        nextPhotons.push( photon );
      }
    }

    this.photons.length = 0;
    this.photons.push( ...nextPhotons );
  }

  /**
   * Advances electrons and handles collisions with the target or sink.
   */
  private stepElectrons( dt: number ): void {
    const nextElectrons: Electron[] = [];
    const acceleration = this.getElectronAcceleration();

    for ( let i = 0; i < this.electrons.length; i++ ) {
      const electron = this.electrons[ i ];
      electron.setAcceleration( acceleration );
      electron.step( dt );

      const hitTarget = this.target.isHitByElectron( electron );
      if ( !hitTarget ) {
        const absorbed = this.handleElectronSinkCollision( electron );
        const inBounds = PhotoelectricEffectModelConfig.MODEL_BOUNDS.containsPoint( electron.getPosition() );

        if ( !absorbed && inBounds ) {
          nextElectrons.push( electron );
        }
      }
    }

    this.electrons.length = 0;
    this.electrons.push( ...nextElectrons );
  }

  /**
   * Computes the acceleration applied to electrons from the plate voltage.
   */
  private getElectronAcceleration(): Vector2 {
    const accelerationMagnitude = ( this.voltageProperty.value *
                                    PhotoelectricEffectConstants.ELECTRON_ACCELERATION_SCALE ) /
                                  PhotoelectricEffectModelConfig.PLATE_SEPARATION;
    return new Vector2( accelerationMagnitude, 0 );
  }

  /**
   * Computes the analytic current expected for the given conditions.
   */
  private getCurrentForVoltage( voltage: number, intensity: number, wavelength: number, workFunction: number ): number {
    const photonsPerSecond = intensityToPhotonRate( intensity, wavelength );
    let electronsPerSecondFromTarget = 0;
    let electronsPerSecondToAnode = 0;

    const photonEnergyBeyondWorkFunction = wavelengthToEnergy( wavelength ) - workFunction;
    const electronRateAsFractionOfPhotonRate = Math.min(
      photonEnergyBeyondWorkFunction / Material.TOTAL_ENERGY_DEPTH,
      1
    );
    electronsPerSecondFromTarget = electronRateAsFractionOfPhotonRate * photonsPerSecond;

    const retardingVoltage = voltage < 0 ? -voltage : 0;
    const fractionMoreEnergeticThanRetardingVoltage = Math.max(
      0,
      Math.min( ( photonEnergyBeyondWorkFunction - retardingVoltage ) /
                Material.TOTAL_ENERGY_DEPTH, 1 )
    );
    electronsPerSecondToAnode = electronsPerSecondFromTarget * fractionMoreEnergeticThanRetardingVoltage;

    if ( electronsPerSecondToAnode < 1 ) {
      electronsPerSecondToAnode = 0;
    }

    return electronsPerSecondToAnode * PhotoelectricEffectConstants.CURRENT_JIMMY_FACTOR;
  }

  /**
   * Returns the stopping voltage for the given photon energy and work function.
   */
  private getStoppingVoltage( wavelength: number, workFunction: number ): number {
    const photonEnergy = wavelengthToEnergy( wavelength );
    return workFunction - photonEnergy;
  }
}
