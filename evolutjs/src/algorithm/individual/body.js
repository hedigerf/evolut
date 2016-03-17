'use strict';

import Random from 'random-js';
import { Range } from 'immutable';

import { PartialGenotype } from '../genotype/genotype';

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Default mass of an individual's body.
 *
 * @type {Number}
 */
const DEFAULT_BODY_MASS = 1;

/**
 * Default amount of polygon point of an individual's body.
 *
 * @type {Number}
 */
const DEFAULT_BODY_POINTS = 4;

/**
 * Represents the body of an individual's genotype.
 */
export default class Body extends PartialGenotype {

  /**
   * Default constructor of an individual.
   *
   * @param {Object} genotype
   */
  constructor({ massFactor, bodyPoints }) {

    super({});

    this.mass = DEFAULT_BODY_MASS * massFactor;
    this.bodyPoints = bodyPoints;
  }

  /**
   * Returns the identifier of a body.
   *
   * @override
   * @static
   * @return {String}
   */
  static get identifier() {
    return 'body';
  }

  /**
   * Returns a randomly seeded version of a genotype.
   *
   * @override
   * @static
   * @param {Object=}
   * @return {Object}
   */
  static seed({ massFactor, bodyPoints = DEFAULT_BODY_POINTS } = {}) {

    massFactor = massFactor || random.real(0.1, 0.9);

    return {
      [this.identifier]: {
        bodyPoints: this.seedCWPolygonPoints(bodyPoints),
        massFactor
      }
    };
  }

  /**
   * Generate a list of polygon points and ensure that
   * they are in clockwise order, and form a simple polygon.
   *
   * @param  {Number} points Number of points.
   * @return {Array}
   */
  static seedCWPolygonPoints(points) {

    const rangePoints = Range(0, points);
    const randomPoint = () => {
      return [random.integer(0, 2), random.integer(0, 2)];
    };

    rangePoints.map(randomPoint).toArray();

    return [[0,0], [1,0], [1,1], [0, 1]];
  }

}
