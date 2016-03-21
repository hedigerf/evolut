'use strict';

import L from 'partial.lenses';
import { compose, set, view } from 'ramda';
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
 * Represents the body of an individual's genotype.
 */
export default class Body extends PartialGenotype {

  /**
   * Default constructor of an individual.
   *
   * @param {Object} genotype
   */
  constructor({ massFactor, bodyPoints } = {}) {

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
   * @param {Object} options
   * @return {Object}
   */
  static seed(options) {

    const lensMassFactor = L.prop('massFactor');
    const lensBodyPoints = L.prop('bodyPoints');

    const massFactor = view(lensMassFactor, options) || random.real(0.1, 0.9);
    const bodyPoints = this.seedCWPolygonPoints(
      view(lensBodyPoints, options) || random.integer(4, 8)
    );

    const setter = compose(
      set(lensBodyPoints, bodyPoints),
      set(lensMassFactor, massFactor)
    );

    return super.seed(setter(options));
  }

  /**
   * Generate a list of polygon points and ensure that
   * they are in clockwise order, and form a simple polygon.
   *
   * @param {Number} points Number of points.
   * @return {Array}
   */
  static seedCWPolygonPoints(points) {

    const rangePoints = Range(0, points);
    const randomPoint = () => {
      return [random.integer(0, 2), random.integer(0, 2)];
    };

    rangePoints.map(randomPoint).toArray();

    // TODO

    return [[0, 0], [1, 0], [1, 1], [0, 1]];
  }

}
