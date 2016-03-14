'use strict';

import log4js from 'log4js';

import { debug } from '../../util/logUtil';
import { Genotype } from './genotype';
import Leg from './leg';
import { HipJoint } from './joint';
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
 * Default number of legs.
 *
 * @type {Number}
 */
const DEFAULT_LEG_COUNT = 3;

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
   * @param {Object} genotype
   */
  constructor({body, legs, joints, engine}) {

    super({body});

    this.mass = DEFAULT_BODY_MASS * body.massFactor;
    this.bodyPoints = body.bodyPoints;
    this.engine = engine;

    this.legs = legs.map(l => new Leg(l));
    this.joints = joints.map(j => new HipJoint(j));

    debug(logger, 'Individual created');
  }

  /**
   * @override
   * @static
   * @param {Number} massFactor
   * @param {Number} numberPoints
   * @param {Number} [numberLegs=DEFAULT_LEG_COUNT]
   * @return {Individual}
   */
  static seed(massFactor, numberPoints, numberLegs = DEFAULT_LEG_COUNT, engine = 'ant') {

    const rangeLeg = Range(0, numberLegs);
    const rangePoints = Range(0, numberPoints);

    const randomPoint = () => {
      return random.integer(0, 10);
    };

    // jshint -W098
    const genotype = {
      body: {
        massFactor: massFactor,
        bodyPoints: rangePoints.map(_ => randomPoint()),
      },
      joints: rangeLeg.map(_ => HipJoint.seed()),
      legs: rangeLeg.map(_ => Leg.seed()),
      engine: 'ant'
    };

    return new Individual(genotype);
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
      massFactor: randomReal(),
      massFactorThigh: randomReal(),
      heightThigh: randomReal(),
      joint: {
        orientation: randomOrientation()
      }
    };
  };

  return {
    body: {
      massFactor: randomReal(),
      bodyPoints: randomPolygon(),
    },
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
