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
 * Calculates polygon area
 * @param  {[Array<Number>]} vertices vertices
 * @return {[Number]}          [Area]
 */
function calcPolygonArea(vertices) {
  let total = 0;

  for (let i = 0, l = vertices.length; i < l; i++) {
    const addX = vertices[i][0];
    const addY = vertices[i === vertices.length - 1 ? 0 : i + 1][1];
    const subX = vertices[i === vertices.length - 1 ? 0 : i + 1][0];
    const subY = vertices[i][1];

    total += (addX * addY * 0.5);
    total -= (subX * subY * 0.5);
  }

  return Math.abs(total);
}

function calcLegArea(leg) {
  return leg.height * leg.width;
}

/**
 * Distribute a mass by the nested part object.
 * Each level is searched for the property massFactor.
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
