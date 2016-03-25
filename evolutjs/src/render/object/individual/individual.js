/**
 * Indivudual phenotyp module.
 *
 * @module render/object/individual/individual
 * @see mdoule:render/object/individual/phenotype
 */

import p2 from 'p2';
import Random from 'random-js';
import { List, Map } from 'immutable';

import Phenotype from './phenotype';

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Returns a random color
 *
 * @return {Number}
 */
function randomColor() {
  return parseInt((random.hex(6)), 16);
}

/**
 * Represents the phenotype of an individual.
 * The phenotype is the graphical representation of  it's corresponding genotype.
 *
 * @extends {Phenotype}
 */
export default class Individual extends Phenotype {

  createRevoluteConstraint(speed, bodyToConnect, jointBody, pivotA, pivotB) {
    const revoluteHip = new p2.RevoluteConstraint(bodyToConnect, jointBody, {
      localPivotA: pivotA,
      localPivotB: pivotB,
      collideConnected: false
    });

    revoluteHip.enableMotor();
    revoluteHip.setMotorSpeed(speed);

    const maxAngle = 0; // Math.PI / 6;
    const minAngle = 0; // -Math.PI / 6;
    revoluteHip.setLimits(minAngle, maxAngle);
    this.addConstraint(revoluteHip);
    return revoluteHip;
  }


  /**
   * Creates this phonetype from a genotype.
   *
   * @override
   * @protected
   * @param {Genotype} genotype The genotype
   */
  fromGenotype(genotype) {

    const posX = random.real(-30, -27);
    const posY = 0.4;

    const bodyOptions = {
      collisionGroup: Math.pow(2, 1),
      collisionMask: Math.pow(2, 0)
    };

    const body = new p2.Body({
      position: [posX, posY ],
      mass: 2
    });

    const style = {
      lineWidth: 1,
      lineColor: randomColor(),
      fillColor: randomColor()
    };

    this.addBody(body);
    this.addShape(body, this.makeShape(genotype.instanceParts.body.bodyPoints), [0, 0], 0, bodyOptions, style);

    const createLeg = ({ pos, hipPivotA, hipPivotB, speed }) => {

      const styleLeg = {
        lineWidth: 1,
        lineColor: randomColor(),
        fillColor: randomColor()
      };
      const legWidth =  0.1;
      const legHeight = 0.4;

      const upperLegShape = new p2.Box({ width: legWidth, height: legHeight });
      const upperLegBody = new p2.Body({
        mass: 1,
        position: [ posX + (0.5 * (pos - 1)), posY ]
      });
      this.addBody(upperLegBody);
      this.addShape(upperLegBody, upperLegShape, [0, 0] , 0, bodyOptions, styleLeg);

      // Shank
      const lowerLegShape = new p2.Box({ width: legWidth, height: legHeight });
      const lowerLegBody = new p2.Body({
        mass: 1,
        position: [ posX + (0.5 * (pos - 1)), posY + legHeight ]
      });
      this.addBody(lowerLegBody);
      this.addShape(lowerLegBody, lowerLegShape, [0, 0] , 0, bodyOptions, styleLeg);

      const revoluteHip = this.createRevoluteConstraint(speed, upperLegBody, body,
        [0, legHeight / 2],
        [(0.5 * (pos - 1)), 0]
      );
      const revoltuteKnee = this.createRevoluteConstraint(speed, upperLegBody, lowerLegBody,
        [0, -legHeight / 2],
        [0, legHeight / 2]);

      return { hip: revoluteHip, knee: revoltuteKnee };
    };

    const speed = 0;
    const toLeg = ({ pos, id, aXval, speed }) => {
      return (
        [
          id,
          createLeg(
          {
            pos,
            hipPivotA: [0, 0.4 / 2],
            hipPivotB: [0, -0.4 / 2],
            speed
          })
        ]);
    };
    let jointsMap = Map();
    const bluePrints = List.of(
      { id: 'back', aXval: 0.05, speed, pos: 1 },
      { id: 'middle', aXval: 0.5, speed, pos: 2 },
      { id: 'front' , aXval: 0.95, speed, pos: 3 }
    );
    const leftSide = bluePrints.map(toLeg);
    const rightSide = bluePrints.map(toLeg);
    jointsMap = jointsMap.set('left', new Map(leftSide));
    jointsMap = jointsMap.set('right', new Map(rightSide));
    this.jointsMap = jointsMap;

    this.engine = genotype.instanceParts.engine.type;
  }

  /**
  * Returns the shape of the phenotype.
  *
  * @protected
  * @param {Array} bodyPoints
  * @return {p2.Convex}
  */
  makeShape(bodyPoints) {
    return new p2.Convex({ vertices: bodyPoints });
  }

}
