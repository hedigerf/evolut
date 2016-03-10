'use strict';

// Import { Seq } from 'immutable';
import { vec2 as Vector } from 'p2';
import log4js from 'log4js';

import debug from '../../debug';

const logger = log4js.getLogger('Individual');

/**
 * Default mass of an individual's body.
 *
 * @type {Number}
 */
const DEFAULT_BODY_MASS = 1;

/**
 * Checks if the specified mass factor is less than 1.
 *
 * @param {Number} bodyMassFactor
 * @throws {Error}
 */
function checkMassFactor(bodyMassFactor) {
  if (bodyMassFactor >= 1) {
    throw new Error('Individual: Mass factor is greater or equal than 1');
  }
}

/**
 * Checks if the body points form a valid polygon.
 *
 * @param  {Seq<Vetor>} bodyPoints Describes the bodz of the Individual
 * @throws {Error}
 */
function checkBodyPoints(bodyPoints) {
  // TODO check if simple polygon with sweep algorithm
}

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
   * @param {Seq<Vector>} bodyPoints Describes the body of the Individual
   * @param {Number} bodyMassFactor The amount of the mass which belongs to the body
   * @param {Seq<Record<Vector, Leg>>} legsAndPositions A set with Legs and their Position
   */
  constructor(bodyPoints, bodyMassFactor, legsAndPositions) {

    // The body points form a simple polygon.
    // @link https://en.wikipedia.org/wiki/Simple_polygon
    checkBodyPoints(bodyPoints);
    this.bodyPoints = bodyPoints;

    // The mass of this body is distributed
    // amongst the leg pairs and the body itself.
    checkMassFactor(bodyMassFactor);
    this.mass = DEFAULT_BODY_MASS * bodyMassFactor;

    this.legs = legsAndPositions.size;
    this.legMassFactor = (1 - bodyMassFactor) / this.legs;
    this.legsAndPositions = legsAndPositions;

    debug(logger, 'Individual created');
  }

  /**
   * Returns the number of legs.
   *
   * @return {Number}
   */
  get countLegs() {
    return this.legs;
  }

  /**
   * Returns the mass of the body.
   *
   * @return {Number}
   */
  get mass() {
    return this.mass;
  }

  /**
   * Returns the mass of all legs.
   *
   * @return {Number}
   */
  get massLegs() {
    return DEFAULT_BODY_MASS - this.mass;
  }

}
