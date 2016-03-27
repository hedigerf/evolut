'use strict';

import p2 from 'p2';
import Random from 'random-js';
import {List, Map} from 'immutable';
import log4js from 'log4js';
import { curry } from 'ramda';


import Phenotype from './phenotype';
import HipConstraint from './constraints/hipConstraint';
import {debug, info} from '../../../util/logUtil';

const random = new Random(Random.engines.mt19937().autoSeed());

/**
 * Returns a random color
 *
 * @return {Number}
 */
function randomColor() {
  return parseInt((random.hex(6)), 16);
}
const logger = log4js.getLogger('Individual');


/**
 * Represents the phenotype of an individual.
 * The phenotype is the graphical representation of  it's corresponding genotype.
 */
export default class Individual extends Phenotype {

constructor(world, genotype) {
  super(world, genotype);

}


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
    const bodyDescriptor = genotype.instanceParts.body;
    const posX = random.real(-30, -27);
    const posY = 0.4;

    const bodyOptions = {
      collisionGroup: Math.pow(2, 1),
      collisionMask: Math.pow(2, 0)
    };

    const body = new p2.Body({
      position: [posX, posY ],
      mass: bodyDescriptor.mass
    });

    const style = {
      lineWidth: 1,
      lineColor: randomColor(),
      fillColor: randomColor()
    };

    this.addBody(body);
    this.addShape(body, this.makeShape(genotype.instanceParts.body.bodyPoints), [0, 0], 0, bodyOptions, style);
    // Mid
    const styleMid = {
      lineWidth: 1,
      lineColor: randomColor(),
      fillColor: randomColor()
    };
    const midShape = new p2.Circle({ radius: 0.05 });
    const midBody = new p2.Body({
      mass: 1,
      position: [body.position[0], body.position[1]]
    });
    const midConstraint = new p2.RevoluteConstraint(midBody, body, {
      localPivotA: [0, 0],
      localPivotB: [0, 0],
      collideConnected: false
    });
    this.addBody(midBody);
    this.addShape(midBody, midShape, [0, 0] , 0, bodyOptions, styleMid);
    this.addConstraint(midConstraint);
    let counter = 0;
    const centerOfMassBody =  body.shapes[0].centerOfMass;
    const createLeg = ({ pos, speed, legDescriptor, hipJointPosition }) => {
      counter++;
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
        position: [ posX + (0.5 * (pos - 1)), posY ]
      });
      this.addBody(upperLegBody);
      this.addShape(upperLegBody, upperLegShape, [0, 0] , 0, bodyOptions, styleLeg);

      // Shank
      const lowerLegShape = new p2.Box({ width: legWidth, height: lowerLegHeight });
      const lowerLegBody = new p2.Body({
        mass: lowerLegMass,
        position: [ posX + (0.5 * (pos - 1)), posY + upperLegHeight ]
      });
      this.addBody(lowerLegBody);
      this.addShape(lowerLegBody, lowerLegShape, [0, 0] , 0, bodyOptions, styleLeg);


      // Foot
      /*Const footShape = new p2.Circle({ radius: 0.2 });
      const footBody = new p2.Body({
        mass: 1,
        position: [lowerLegBody.position[0], lowerLegBody.position[1]]
      });
      this.addBody(footBody);
      this.addShape(footBody, footShape, [0, 0], bodyOptions, styleLeg);

      const lowerLegFootLock = new p2.LockConstraint({ localOffsetB: [0, 0] });
      this.addConstraint(lowerLegFootLock);*/
      let calcX;
      info(logger, 'XHip' + counter);
      if (hipJointPosition[0] > 0) {
        if (centerOfMassBody[0] > 0) {
          calcX = hipJointPosition[0] - centerOfMassBody[0];
          info(logger, '00');
        }else {
          calcX = hipJointPosition[0] + centerOfMassBody[0];
          info(logger, '01');

        }
      }else {
        if (centerOfMassBody[0] > 0) {
          info(logger, '10');
          calcX = hipJointPosition[0] + centerOfMassBody[0];
        }else {
          calcX = hipJointPosition[0] - centerOfMassBody[0];
          info(logger, '11');
        }
      }
      let calcY;
      info(logger, 'YHip' + counter);
      if (hipJointPosition[1] > 0) {
        if (centerOfMassBody[1] > 0) {
          calcY = hipJointPosition[1] - centerOfMassBody[1];
          info(logger, '00');
        }else {
          calcY = hipJointPosition[1] + centerOfMassBody[1];
          info(logger, '01');
        }
      }else {
        if (centerOfMassBody[1] > 0) {
          calcY = hipJointPosition[1] + centerOfMassBody[1];
          info(logger, '10');
        }else {
          calcY = hipJointPosition[1] - centerOfMassBody[1];
          info(logger, '11');
        }
      }

    //  const calcX = hipJointPosition[0] - centerOfMassBody[0];
    //  const calcY = hipJointPosition[1] - centerOfMassBody[1];
      const revoluteHip = this.createRevoluteConstraint(speed, upperLegBody, body,
        [0, upperLegHeight / 2],
        [calcX, calcY]
      );
      const revoltuteKnee = this.createRevoluteConstraint(speed, upperLegBody, lowerLegBody,
        [0, -lowerLegHeight / 2],
        [0, lowerLegHeight / 2]);

      return { hip: revoluteHip, knee: revoltuteKnee };
    };
    // Const speed = 5;
    const speed = 0;
    const toLeg = ({ pos, id, speed, legDescriptor, hipJointPosition }) => {
      return (
        [
          id,
          createLeg(
          {
            pos,
            speed,
            legDescriptor,
            hipJointPosition
          })
        ]);
    };

    // Only take 3 legs because one side is symertrical to the other.
    // It would be bettter if legs isn array insted of object
    const legs = List.of(
      genotype.instanceParts.legs['0'],
      genotype.instanceParts.legs['1'],
      genotype.instanceParts.legs['2']
    );
    // Const sortedByXposition = legs.sort((a, b) => a.legRelPos[0] < b.legRelPos[0]);
    const sortedByXpos = legs;
    const bluePrints = List.of(
      { id: 'back',   speed, pos: 1, legDescriptor: sortedByXpos.get(0),
        hipJointPosition: genotype.instanceParts.body.hipJointPositions[0]
      } ,
      { id: 'middle', speed, pos: 2, legDescriptor: sortedByXpos.get(1),
        hipJointPosition: genotype.instanceParts.body.hipJointPositions[1]
      } ,
      { id: 'front' , speed, pos: 3, legDescriptor: sortedByXpos.get(2),
        hipJointPosition: genotype.instanceParts.body.hipJointPositions[2]
      }
    );
    let jointsMap = Map();
    const leftSide = bluePrints.map(toLeg);
    const rightSide = bluePrints.map(toLeg);
    jointsMap = jointsMap.set('left', new Map(leftSide));
    jointsMap = jointsMap.set('right', new Map(rightSide));
    this.jointsMap = jointsMap;

    /*Const hipPivotAxValues = List.of (
        { id: 'backLeftLeg', aXval: 0.05, speed: speed }, { id: 'backRightLeg', aXval: 0.05, speed: -speed },
        { id: 'middleLeftLeg', aXval: 0.5, speed: speed }, { id: 'middleRightLeg', aXval: 0.5, speed: -speed },
        { id: 'frontLeftLeg' , aXval: 0.95, speed: speed }, { id: 'frontRightLeg', aXval: 0.95, speed: -speed });
    const revoluteHips = hipPivotAxValues.map(({ id, aXval, speed }) => {
      return createLeg({
        hipPivotA: [aXval, -0.1],
        hipPivotB: [0, 0],
        speed: speed
      });
    });*/
    //This.revoluteHips = revoluteHips;


    /*
        Const jointBody2 = new p2.Body({
          mass: 1, position: [body.position[0] + 0.5, 0.7]
        });
        this.addBody(jointBody2);
        this.addShape(jointBody2, new p2.Circle({ radius: 0.1 }), [0, 0] , 0, bodyOptions, style);

        const revoluteFront = new p2.RevoluteConstraint(body, jointBody2, {
          localPivotA: [0.95, -0.1], // Where to hinge second wheel on the chassis
          localPivotB: [0, 0],      // Where the hinge is in the wheel (center)
          collideConnected: false
        });
        revoluteFront.enableMotor();
        revoluteFront.setMotorSpeed(30);
        this.addConstraint(revoluteFront);
*/




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
