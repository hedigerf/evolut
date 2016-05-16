/**
 * Mass distribution module.
 *
 * @module algorithm/genotype/mass
 */

/**
 * Default mass of an individual's body.
 *
 * @type {Number}
 */
const DEFAULT_BODY_MASS = 1;

/**
 * Calculates polygon area.
 *
 * @param {Array<Number>} vertices
 * @return {Number} Area
 */
export function calcPolygonArea(vertices) {

  const length = vertices.length;
  let total = 0;

  for (let i = 0, l = length; i < l; i++) {

    const calculatedIndex = i === length - 1 ? 0 : i + 1;

    const addX = vertices[i][0];
    const addY = vertices[calculatedIndex][1];
    const subX = vertices[calculatedIndex][0];
    const subY = vertices[i][1];

    total += (addX * addY * 0.5);
    total -= (subX * subY * 0.5);
  }

  return Math.abs(total);
}

/**
 * Calculate area of a leg.
 *
 * @param {Leg} leg The leg
 * @return {Number} Area
 */
function calcLegArea({ height, width }) {
  return height * width;
}

/**
 * Distribute a mass by the nested part object.
 *
 * @param {Object} parts Parts object of a genotype.
 * @param {Number} [mass=DEFAULT_BODY_MASS]
 * @return {Object}
 */
export default function distribute(parts, mass = DEFAULT_BODY_MASS) {

  const areaBody = calcPolygonArea(parts.body.bodyPoints);
  const areaLeg0 = calcLegArea(parts.legs['0'].leg);
  const areaLeg2 = calcLegArea(parts.legs['2'].leg);
  const areaLeg4 = calcLegArea(parts.legs['4'].leg);
  const totalArea = areaBody + 2 * areaLeg0 + 2 * areaLeg2 + 2 * areaLeg4;
  const distr = mass / totalArea;

  parts.body.mass = distr * areaBody;
  parts.legs['0'].leg.mass = distr * areaLeg0;
  parts.legs['2'].leg.mass = distr * areaLeg2;
  parts.legs['4'].leg.mass = distr * areaLeg4;

  return parts;
}
