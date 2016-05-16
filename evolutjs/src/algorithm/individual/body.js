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
import random from '../../util/random';

/**
 * Default radius.
 *
 * @type {Number}
 */
const RADIUS = 1;

/**
 * Tolerance for sector angles.
 *
 * @type {Number}
 */
const TOLERANCE = 0.0001;

/**
 * Lens for body mass information.
 *
 * @return {Lens}
 */
export const lensMass = L.prop('mass');

/**
 * Lens for body points information.
 *
 * @return {Lens}
 */
export const lensBodyPoints = L.prop('bodyPoints');

/**
 * Lens for body point count information.
 *
 * @return {Lens}
 */
export const lensBodyPointsCount = L.prop('bodyPointsCount');

/**
 * Lens for hip joint positions information.
 *
 * @return {Lens}
 */
export const lensHipJointPositions = L.prop('hipJointPositions');

/**
 * Generates a random polygon point.
 *
 * @param {Number} startAngle [the start angle]
 * @param {Number} endAngle   [the end angle]
 * @return {Array} The coordinates
 */
export function generateRandomPolygonPoint(startAngle, endAngle) {

  const r = random.real(0, RADIUS);
  const angle = random.real(startAngle, endAngle);
  const x = r * Math.cos(angle);
  const y = r * Math.sin(angle);

  return [x, y];
}
/**
 * Calculates how big a sector angle is.
 *
 * @param  {Number} pointCount How much points the body has
 * @return {Number} Sector angle
 */
export function calcSectorAngle(pointCount) {
  return  Math.PI * 2 / pointCount;
}
/**
 * Calculates the bounds of the polygon
 *
 * @param {List<Number>} polygon The polygon
 * @return {Object} Object containing bounds
 */
export function calculatePolygonBounds(polygon) {

  const first = (p) => p[0];
  const second = (p) => p[1];

  const minX = polygon.minBy(first)[0];
  const minY = polygon.minBy(second)[1];
  const maxX = polygon.maxBy(first)[0];
  const maxY = polygon.maxBy(second)[1];

  return { minX, minY, maxX, maxY };
}

/**
 * Calculates the step in x direction.
 *
 * @param {Number} minX
 * @param {Number} maxX
 * @return {Number}
 */
export function calculateXStep(minX, maxX) {
  return (Math.abs(minX) + Math.abs(maxX)) / 3;
}

/**
 * Generates the position a hip join.
 *
 * @param {Number} minX
 * @param {Number} maxX
 * @param {Number} minY
 * @param {Number} maxY
 * @param {Array<Number>} polygonArray
 * @return {Number} The position of the hip join
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
   * @param {Array<Point>} options.bodyPoints
   * @param {Number} options.bodyPointsCount
   * @param {Array<Point>} options.hipJointPositions
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
   * @param {Array<Point>} options.bodyPoints
   * @param {Number} options.bodyPointsCount
   * @param {Array<Point>} options.hipJointPositions
   * @return {Object}
   */
  static seed(options) {

    const bodyPointsCount = view(lensBodyPointsCount, options) || random.integer(4, 8);
    const bodyPoints = view(lensBodyPoints, options) || this.seedCCWPolygonPoints(bodyPointsCount);
    const hipJointPositions = view(lensHipJointPositions, options) || this.seedHipJointPositions(bodyPoints);

    const setter = compose(
      set(lensBodyPoints, bodyPoints),
      set(lensBodyPointsCount, bodyPointsCount),
      set(lensHipJointPositions, hipJointPositions)
    );

    return super.seed(setter(options));
  }

  /**
   * Generates a list of polygon points and ensures that
   * they are in counter-clockwise order and form a simple polygon.
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
   * Generates all positions of the hip joints.
   *
   * @param {Array<Number>} polygonArray Array containing all points of the polygon
   * @return {Array<Number>} Hip joint positions
   */
  static seedHipJointPositions(polygonArray) {

    const polygon = List(polygonArray);
    const { minX, minY, maxX, maxY } = calculatePolygonBounds(polygon);
    const xStep = calculateXStep(minX, maxX);
    const firstStep = minX + xStep;
    const mins = List.of(minX, firstStep, firstStep * 2);
    const hipJointPositions = mins.map((min) => generateHipJointPosition(min, firstStep, minY, maxY, polygonArray));

    return hipJointPositions.toArray();
  }

  /**
   * Generates a random polygon.
   *
   * @param {Number} startAngle The start angle
   * @param {Number} endAngle Tthe end angle
   * @param {Number} sectorAngle [angle of one sector
   * @param {list<Number>} acc The accumulator
   * @return {list<Number>} List of polygon points
   */
  static generateRandomPolygon(startAngle, endAngle, sectorAngle, acc) {
    const coords = generateRandomPolygonPoint(startAngle, endAngle);
    if (endAngle >= Math.PI * 2 - TOLERANCE) {
      return acc.push(coords);
    }
    return this.generateRandomPolygon(endAngle, endAngle + sectorAngle, sectorAngle, acc.push(coords));
  }

}
