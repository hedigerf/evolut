/**
 * Partial genotype body module.
 *
 * @module algorithm/genotype/individual/body
 * @see module:algorithm/genotype/genotype
 */

import { List } from 'immutable';
import L  from 'partial.lenses';
import { compose, set, view } from 'ramda';
import Random  from 'random-js';
import inside from 'point-in-polygon';

import { PartialGenotype } from '../genotype/genotype';

const random = new Random(Random.engines.mt19937().autoSeed());
const RADIUS = 1;

/**
 * Lens for body mass information.
 *
 * @return {Lens}
 */
const lensMass = L.prop('mass');

/**
 * Lens for body mass factor information.
 *
 * @return {Lens}
 */
const lensMassFactor = L.prop('massFactor');

/**
 * Lens for body points information.
 *
 * @return {Lens}
 */
const lensBodyPoints = L.prop('bodyPoints');

/**
 * Lens for body point count information.
 *
 * @return {Lens}
 */
const lensBodyPointsCount = L.prop('bodyPointsCount');

/**
 * Lens for hip joint positions information.
 *
 * @return {Lens}
 */
const lensHipJointPositions = L.prop('hipJointPositions');

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

    /**
     * The mass of this body.
     *
     * @type {Number}
     */
    this.mass = view(lensMass, options);

    /**
     * The mass factor of this body.
     *
     * @type {Number}
     */
    this.massFactor = view(lensMassFactor, options);

    /**
     * List of polygon points forming the body.
     * Counter clock wise.
     *
     * @type {Array<Point>}
     */
    this.bodyPoints = view(lensBodyPoints, options);

    /**
     * The number of polygon points.
     *
     * @type {Number}
     */
    this.bodyPointsCount = view(lensBodyPointsCount, options);

    /**
     * The positions of the hip joints.
     *
     * @type {Array<Point>}
     */
    this.hipJointPositions = view(lensHipJointPositions, options);
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
    const bodyPointsCount = view(lensBodyPointsCount, options) || random.integer(4, 8);
    const bodyPoints = view(lensBodyPoints, options) || this.seedCCWPolygonPoints(bodyPointsCount);
    const hipJointPositions = view(lensHipJointPositions, options) || this.seedHipJointPositions(bodyPoints);

    const setter = compose(
      set(lensBodyPoints, bodyPoints),
      set(lensBodyPointsCount, bodyPointsCount),
      set(lensMassFactor, massFactor),
      set(lensHipJointPositions, hipJointPositions)
    );

    return super.seed(setter(options));
  }

  /**
   * Generate a list of polygon points and ensure that
   * they are in counter-clockwise order, and form a simple polygon.
   *
   * @param {Number} points Number of points.
   * @return {Array}
   */
  static seedCCWPolygonPoints(points) {

    const sectorAngle = Math.PI * 2 / points;
    const startAngle = 0;
    const endAngle = startAngle + sectorAngle;
    const polygon = this.generateRandomPolygon(startAngle , endAngle, sectorAngle, List());
    const polygonArray = polygon.toArray();
    return polygonArray;
  }
  /**
   * [Generates all positions of the hip joints]
   *
   * @param  {Array<Number>} polygonArray [Array containing all points of the polygon]
   * @return {Array<Number>}              [hip joint positions]
   */
  static seedHipJointPositions(polygonArray) {

    const generateP = (minX, maxX, minY, maxY) => {
      let p = [random.real(minX, maxX), random.real(minY, maxY)];
      let condition = inside(p, polygonArray);
      while (!condition) {
        p = [random.real(minX, maxX), random.real(minY, maxY)];
        condition = inside(p, polygonArray);
      }
      return p;
    };

    const polygon = List(polygonArray);
    const minX = polygon.minBy (p => p[0])[0];
    const minY = polygon.minBy (p => p[1])[1];
    const maxX = polygon.maxBy (p => p[0])[0];
    const maxY = polygon.maxBy (p => p[1])[1];

    const xStep = (Math.abs(minX) + Math.abs(maxX)) / 3;

    const mins = List.of(minX, minX + xStep, minX + xStep * 2);
    //Const mins = List.of(minX, minX, minX);

    const hipJointPositions = mins.map(min => generateP(min, min + xStep, minY, maxY));

    return hipJointPositions.toArray();
  }
  /**
   * [Generates a random polygon]
   *
   * @param  {Number} startAngle  [the start angle]
   * @param  {Number} endAngle    [the end angle]
   * @param  {Number} sectorAngle [angle of one sector]
   * @param  {list<Number>} acc         [accumulator]
   * @return {list<Number>}             [list of polygon points]
   */
  static generateRandomPolygon(startAngle, endAngle, sectorAngle, acc) {
    const r = random.real(RADIUS / 2, RADIUS);
    const angle = random.real(startAngle, endAngle);
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    const coords = [x, y];
    if (endAngle >= Math.PI * 2 - 0.0001) {
      return acc.push(coords);
    }
    return this.generateRandomPolygon(endAngle, endAngle + sectorAngle, sectorAngle, acc.push(coords));
  }

}
