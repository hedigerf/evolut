'use strict';

import log4js from 'log4js';
import { Range } from 'immutable';

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
   * @param {String} [engine='ant']
   * @return {Object}
   */
  static seed(massFactor, numberPoints, numberLegs = DEFAULT_LEG_COUNT, engine = 'ant') {

    const rangeLeg = Range(0, numberLegs);
    const rangePoints = Range(0, numberPoints);

    const randomPoint = () => {
      return [random.integer(0, 2), random.integer(0, 2)];
    };

    const massFactorLeg = (DEFAULT_BODY_MASS * massFactor) / numberLegs;

    // jshint -W098
    return {
      body: {
        massFactor,
        bodyPoints: rangePoints.map(_ => randomPoint()), // Ensure clockwise order
      },
      joints: rangeLeg.map(_ => HipJoint.seed()),
      legs: rangeLeg.map(_ => Leg.seed(massFactorLeg)),
      engine
    };
  }

}
