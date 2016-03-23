/**
 * Partial genotype body module.
 *
 * @module algorithm/genotype/individual/body
 * @see module:algorithm/genotype/genotype
 */

import { Range } from 'immutable';
import L  from 'partial.lenses';
import { compose, set, view } from 'ramda';
import Random  from 'random-js';

import { PartialGenotype } from '../genotype/genotype';

const random = new Random(Random.engines.mt19937().autoSeed());

const lensMassFactor = L.prop('massFactor');
const lensBodyPoints = L.prop('bodyPoints');

/**
 * Represents the body of an individual's genotype.
 *
 * @extends {PartialGenotype}
 */
export default class Body extends PartialGenotype {

  /**
   * Default constructor of an individual.
   *
   * @param {Object} options
   * @param {Number} options.mass
   * @param {Seq<Point>} options.bodyPoints
   */
  constructor(options) {

    super(options);

    this.mass = 0;
    this.massFactor = view(lensMassFactor, options);
    this.bodyPoints = view(lensBodyPoints, options);
  }

  /**
   * Returns the identifier of a body.
   *
   * @return {String}
   */
  static get identifier() {
    return 'body';
  }

  /**
   * Returns a randomly seeded version of a genotype.
   *
   * @param {Object} options
   * @param {Number} options.mass
   * @param {Number} options.bodyPoints
   * @return {Object}
   */
  static seed(options) {

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
