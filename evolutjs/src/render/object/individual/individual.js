/**
 * Indivudual phenotyp module.
 *
 * @module render/object/individual/individual
 * @see mdoule:render/object/individual/phenotype
 */

import { List, Map } from 'immutable';
import p2 from 'p2';
import Phenotype from './phenotype';
import { randomColor } from '../../color';

/**
 * Represents the phenotype of an individual.
 * The phenotype is the graphical representation of  it's corresponding genotype.
 *
 * @extends {Phenotype}
 */
export default class Individual extends Phenotype {

  /**
   * Create a revolute constraint.
   *
   * @param  {p2.Body} bodyA
   * @param  {p2.Body} bodyB
   * @param  {Vector} pivotA
   * @param  {Vector} pivotB
   * @return {p2.RevoluteConstraint}
   */
  createRevoluteConstraint(bodyA, bodyB, pivotA, pivotB) {

    const constraint = new p2.RevoluteConstraint(bodyA, bodyB, {
      localPivotA: pivotA,
      localPivotB: pivotB,
      collideConnected: false
    });

    constraint.enableMotor();
    constraint.setMotorSpeed(0);
    constraint.setLimits(0, 0);

    this.addConstraint(constraint);

    return constraint;
  }

  /**
   * Creates this phonetype from a genotype.
   *
   * @override
   * @protected
   * @param {Genotype} genotype The genotype
   */
  fromGenotype(genotype) { // eslint-disable-line max-statements

    this.engine = genotype.engine;
    this.engine.current = 0;

    const bodyDescriptor = genotype.body;
    const posX = 0;
    const posY = 0.4;

    const bodyOptions = {
      collisionGroup: Math.pow(2, 1),
      collisionMask: Math.pow(2, 0)
    };

    const body = new p2.Body({
      position: [posX, posY],
      mass: bodyDescriptor.mass
    });

    const style = {
      lineWidth: 1,
      lineColor: randomColor(),
      fillColor: randomColor()
    };

    this.addBody(body);
    this.addShape(body, this.createBodyShape(genotype.body.bodyPoints), [0, 0], 0, bodyOptions, style);

    // Mid
    this.createCenterOfMassPoint(body, bodyOptions);

    const createLeg = ({ pos, legDescriptor, hipJointPosition }) => { // eslint-disable-line max-statements
      const styleLeg = {
        lineWidth: 1,
        lineColor: randomColor(),
        fillColor: randomColor()
      };
      const leg = legDescriptor.leg;
      // Leg-parts heights
      const upperLegHeight = (1 - leg.heightFactor) * leg.height;
      const lowerLegHeight = leg.heightFactor * leg.height;
      // Leg-parts masses
      const upperLegMass = (1 - leg.heightFactor) * leg.mass;
      const lowerLegMass = leg.heightFactor * leg.mass;

      const legWidth =  0.1;

      const upperLegShape = new p2.Box({ width: legWidth, height: upperLegHeight });
      const upperLegBody = new p2.Body({
        mass: upperLegMass,
        position: [posX + (0.5 * pos), posY]
      });
      this.addBody(upperLegBody);
      this.addShape(upperLegBody, upperLegShape, [0, 0], 0, bodyOptions, styleLeg);

      // Shank
      const lowerLegShape = new p2.Box({ width: legWidth, height: lowerLegHeight });
      const lowerLegBody = new p2.Body({
        mass: lowerLegMass,
        position: [posX + (0.5 * pos), posY + upperLegHeight]
      });
      this.addBody(lowerLegBody);
      this.addShape(lowerLegBody, lowerLegShape, [0, 0], 0, bodyOptions, styleLeg);

      const calcX = hipJointPosition[0];
      const calcY = hipJointPosition[1];
      const revoluteHip = this.createRevoluteConstraint(upperLegBody, body,
        [0, upperLegHeight / 2],
        [calcX, calcY]
      );
      const revoltuteKnee = this.createRevoluteConstraint(upperLegBody, lowerLegBody,
        [0, -lowerLegHeight / 2],
        [0, lowerLegHeight / 2]);

      return { hip: revoluteHip, knee: revoltuteKnee };
    };

    const toLeg = (blueprint, index) => {
      return [index, createLeg(blueprint)];
    };

    // Only take 3 legs because one side is symertrical to the other.
    // It would be bettter if legs isn array insted of object
    const legs = List.of(
      genotype.legs['0'],
      genotype.legs['2'],
      genotype.legs['4']
    );
    // Const sortedByXposition = legs.sort((a, b) => a.legRelPos[0] < b.legRelPos[0]);
    const sortedByXpos = legs;
    const bluePrints = List.of(
      { pos: 0, legDescriptor: sortedByXpos.get(0), hipJointPosition: genotype.body.hipJointPositions[0] },
      { pos: 1, legDescriptor: sortedByXpos.get(1), hipJointPosition: genotype.body.hipJointPositions[1] },
      { pos: 2, legDescriptor: sortedByXpos.get(2), hipJointPosition: genotype.body.hipJointPositions[2] }
    );
    let jointsMap = Map();

    const leftSide = bluePrints.map(toLeg);
    const rightSide = bluePrints.map(toLeg);

    jointsMap = jointsMap.set('left', new Map(leftSide)).set('right', new Map(rightSide));

    this.jointsMap = jointsMap;
  }

  /**
   * Create a point around the center of mass of an individuals body.
   *
   * @param {p2.Body} body
   * @param {Object} bodyOptions
   */
  createCenterOfMassPoint(body, bodyOptions) {

    const style = {
      lineWidth: 1,
      lineColor: randomColor(),
      fillColor: randomColor()
    };
    const shape = new p2.Circle({ radius: 0.05 });
    const midBody = new p2.Body({
      mass: 0.0001,
      position: body.position[0]
    });
    const constraint = new p2.RevoluteConstraint(midBody, body, {
      localPivotA: [0, 0],
      localPivotB: [0, 0],
      collideConnected: false
    });
    this.addBody(midBody);
    this.addShape(midBody, shape, [0, 0], 0, bodyOptions, style);
    this.addConstraint(constraint);
  }

  /**
  * Returns the shape of the phenotype.
  *
  * @protected
  * @param {Array} bodyPoints
  * @return {p2.Convex}
  */
  createBodyShape(bodyPoints) {
    return new p2.Convex({ vertices: bodyPoints });
  }

}
