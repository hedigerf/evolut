/**
 * Partial genotype body module.
 *
 * @module algorithm/genotype/individual/body
 * @see module:algorithm/genotype/genotype
 */

import * as L from 'partial.lenses';
import { compose, set, view } from 'ramda';
import inside from 'point-in-polygon';
import { List } from 'immutable';
import { PartialGenotype } from '../genotype/genotype';
import Random  from 'random-js';

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
 * [Generates a random polygon point]
 *
 * @param  {Number} startAngle [the start angle]
 * @param  {Number} endAngle   [the end angle]
 * @return {Array}            [the coordinates]
 */
export function generateRandomPolygonPoint(startAngle, endAngle) {
  const r = random.real(RADIUS / 2, RADIUS);
  const angle = random.real(startAngle, endAngle);
  const x = r * Math.cos(angle);
  const y = r * Math.sin(angle);
  const coords = [x, y];
  return coords;
}
/**
 * Calculates how big a sector angle is
 *
 * @param  {Number} pointCount [how much points the body has]
 * @return {Number}            [sector angle]
 */
export function calcSectorAngle(pointCount) {
  return  Math.PI * 2 / pointCount;
}
/**
 * [Calculates the bounds of the polygon]
 *
 * @param  {List<Number>} polygon [the polygon]
 * @return {Object}         [Object containing bounds]
 */
export function calculatePolygonBounds(polygon) {
  const minX = polygon.minBy (p => p[0])[0];
  const minY = polygon.minBy (p => p[1])[1];
  const maxX = polygon.maxBy (p => p[0])[0];
  const maxY = polygon.maxBy (p => p[1])[1];
  return { minX, minY, maxX, maxY };
}

/**
 * [Calculates the xStep]
 *
 * @param  {Number} minX [description]
 * @param  {Number} maxX [description]
 * @return {Number}      [xStep]
 */
export function calculateXStep(minX, maxX) {
  return (Math.abs(minX) + Math.abs(maxX)) / 3;
}
/**
 * Generates a HipJointPosition
 *
 * @param  {Number} minX         [description]
 * @param  {Number} maxX         [description]
 * @param  {Number} minY         [description]
 * @param  {Number} maxY         [description]
 * @param  {Array<Number>} polygonArray [description]
 * @return {Number}             HipJointPosition
 */
export function generateHipJointPosition(minX, maxX, minY, maxY, polygonArray) {
  let p = [random.real(minX, maxX), random.real(minY, maxY)];
  let condition = inside(p, polygonArray);
  while (!condition) {
    p = [random.real(minX, maxX), random.real(minY, maxY)];
    condition = inside(p, polygonArray);
  }
  return p;
}
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

    const sectorAngle = calcSectorAngle(points);
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

    const polygon = List(polygonArray);
    const { minX, minY, maxX, maxY } = calculatePolygonBounds(polygon);
    const xStep = calculateXStep(minX, maxX);

    const mins = List.of(minX, minX + xStep, minX + xStep * 2);
    //Const mins = List.of(minX, minX, minX);

    const hipJointPositions = mins.map(min => generateHipJointPosition(min, min + xStep, minY, maxY, polygonArray));

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
    const coords = generateRandomPolygonPoint(startAngle, endAngle);
    if (endAngle >= Math.PI * 2 - 0.0001) {
      return acc.push(coords);
    }
    return this.generateRandomPolygon(endAngle, endAngle + sectorAngle, sectorAngle, acc.push(coords));
  }

}
