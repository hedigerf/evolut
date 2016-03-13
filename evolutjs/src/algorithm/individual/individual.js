'use strict';

import { zipWith } from 'ramda';
import log4js from 'log4js';

import { debug } from '../../util/logUtil';
import { Genotype } from 'genotype';
import Leg from './leg';
import Random from 'random-js';

const logger = log4js.getLogger('Individual');
const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Default mass of an individual's body.
 *
 * @type {Number}
 */
const DEFAULT_BODY_MASS = 1;

/**
 * Represents an Individual.
 * This is the genotype of an inidividual.
 * An individual consists of multiple leg pairs.
 * The Individual class maintains knowledge of it's body and all legs.
 * Including the joints which connect the legs to the body.
 */
export default class Individual extends Genotype {

  /**
   * Default constructor of an individual.
   *
   * @param {Number} bodyMassFactor Factor of the default mass of an indivudual
   * @param {List<Vector>} bodyPoints Polygon points
   * @param {List<{oreintation: ORIENTATION, position: Vector}>} legJoints
   *   Joints between an individuals body and legs.
   * @param {List<{heightThigh: Number, mass: Number, joint: {orientation: ORIENTATION}}>} legs
   *   Information about an individuals legs.
   * @param {Engine} engine Specifies which engine controlls the movement of the legs.
   */
  constructor(bodyMassFactor, bodyPoints, legJoints, legs, engine) {

    super();

    this.mass = DEFAULT_BODY_MASS * bodyMassFactor;
    this.bodyPoints = bodyPoints;
    this.engine = engine;

    this.makeLegs(legs, legJoints);

    debug(logger, 'Individual created');
  }

  /**
   * Make the legs of an individual.
   *
   * @param {List<{heightThigh: Number, joint: {orientation: ORIENTATION}}>} legs
   *   Information about an individuals legs.
   * @param {List<{oreintation: ORIENTATION, position: Vector}>} legJoints
   *   Joints between an individuals body and legs.
   */
  makeLegs(legs, legJoints) {

    const legCount = legs.size * 2;
    const legMass = (DEFAULT_BODY_MASS - this.mass) / legCount;

    /**
     * Closure for making a new leg.
     *
     * @param {{heightThigh: Number, joint: {orientation: ORIENTATION}}} leg
     * @param {{oreintation: ORIENTATION, position: Vector}} joint
     * @return {Leg}
     */
    const makeLeg = (leg, joint) => {
      return new Leg(legMass, leg.massFactorThigh, leg.heightThigh, joint);
    };

    this.joints = legJoints.slice(0);
    this.legs = zipWith(makeLeg, legs, legJoints);
  }

}

/**
 * Generate a random individual.
 *
 * @return {Object}
 */
export function seed() {

  const randomReal = () => {
    return random.real(0.1, 0.9);
  };
  const randomPoint = () => {
    return random.integer(0, 10);
  };
  const randomPolygon = () => {
    return [
      randomPoint(),
      randomPoint(),
      randomPoint(),
      randomPoint()
    ];
  };
  const randomOrientation = () => {
    return random.integer(1, 2);
  };
  const randomJoint = () => {
    return {
      orientation: randomOrientation(),
      position: randomPoint()
    };
  };
  const randomLeg = () => {
    return {
      massFactorThigh: randomReal(),
      heightThigh: randomReal(),
      joint: {
        orientation: randomOrientation()
      }
    };
  };

  return {
    bodyMassFactor: randomReal(),
    bodyPoints: randomPolygon(),
    joints: [
      randomJoint(),
      randomJoint(),
      randomJoint()
    ],
    legs: [
      randomLeg(),
      randomLeg(),
      randomLeg()
    ],
    engine: 'ant'
  };
}
