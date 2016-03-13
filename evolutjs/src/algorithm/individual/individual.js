'use strict';

import log4js from 'log4js';

import { debug } from '../../util/logUtil';

const logger = log4js.getLogger('Individual');

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
export default class Individual {

  /**
   * Default constructor of an individual.
   *
   * @param {Number} mass Mass of an indivudual
   * @param {List<Vector>} bodyPoints Polygon points
   * @param {List<{oreintation: ORIENTATION, position: Vector}>} legJoints
   *   Joints between an individuals body and legs.
   * @param {List<{heightThigh: Number, mass: Number, joint: {orientation: ORIENTATION}}>} legs
   *   Information about an individuals legs.
   * @param {Engine} engine Specifies which engine controlls the movement of the legs.
   */
  constructor(mass, bodyPoints, legJoints, legs, engine) {

    this.mass = mass;
    this.bodyPoints = bodyPoints;
    this.joints = legJoints;
    this.legs = legs;
    this.engine = engine;

    // This.makeLegs(legs, legJoints);

    debug(logger, 'Individual created');
  }

}
