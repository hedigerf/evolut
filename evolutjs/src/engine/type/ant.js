/**
 * Ant movement engine module.
 *
 * @module engine/type/ant
 * @see module:engine/engine
 */

import L from 'partial.lenses';

import { ANGLE_MAX, ANGLE_MIN } from '../../algorithm/individual/joint';
import * as M from '../movement';
import * as CL from '../constraintLenses';

const lensLFHip = L.compose(CL.lensLeftFrontJoint, CL.lensHip);
const lensLMHip = L.compose(CL.lensLeftMiddleJoint, CL.lensHip);
const lensLBHip = L.compose(CL.lensLeftBackJoint, CL.lensHip);

const lensLFKnee = L.compose(CL.lensLeftFrontJoint, CL.lensKnee);
const lensLMKnee = L.compose(CL.lensLeftMiddleJoint, CL.lensKnee);
const lensLBKnee = L.compose(CL.lensLeftBackJoint, CL.lensKnee);

const lensRFHip = L.compose(CL.lensRightFrontJoint, CL.lensHip);
const lensRMHip = L.compose(CL.lensRightMiddleJoint, CL.lensHip);
const lensRBHip = L.compose(CL.lensRightBackJoint, CL.lensHip);

const lensRFKnee = L.compose(CL.lensRightFrontJoint, CL.lensKnee);
const lensRMKnee = L.compose(CL.lensRightMiddleJoint, CL.lensKnee);
const lensRBKnee = L.compose(CL.lensRightBackJoint, CL.lensKnee);

/**
 * Describes an ant's movement.
 *
 * @type {Object}
 * @property {Array<MovementDescriptor>} initial
 * @property {Array<MovementDescriptor>} movements
 */
const AntEngineDescriptor = {

  initial: [
    {
      id: 'XX',
      lensId: 'LFH',
      params: [0, 1]
    },
    {
      id: 'XX',
      lensId: 'LFH',
      params: [0, 1]
    }
  ],

  movements: [

    {
      id: 'allPass',
      params: [
        {
          id: 'XX',
          lensId: 'LFH',
          params: [0, 1]
        },
        {
          id: 'XX',
          lensId: 'LFH',
          params: [0, 1]
        }
      ]
    },
    {
      id: 'XX',
      lensId: 'LFH',
      params: [0, 1]
    },
    {
      id: 'XX',
      lensId: 'LFH',
      params: [0, 1]
    },
    {
      id: 'anyPass',
      params: [
        {
          id: 'until',
          lensId: 'LFH',
          params: ['isMaxAngle']
        },
        {
          id: 'until',
          lensId: 'LMH',
          params: ['isMaxAngle']
        },
        {
          id: 'until',
          lensId: 'LBH',
          params: ['isMaxAngle']
        }
      ]
    }

  ]

};

export default AntEngineDescriptor;


export const antEngineMovements = [
  [
    M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLFHip),
    M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLMHip),
    M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLBHip),
    M.lockAngleToZero(lensLFHip),
    M.lockAngleToZero(lensLMHip),
    M.lockAngleToZero(lensLBHip),
    M.lockAngleToZero(lensRFHip),
    M.lockAngleToZero(lensRMHip),
    M.lockAngleToZero(lensRBHip),
    M.setSpeed(0, lensLFHip),
    M.setSpeed(0, lensLMHip),
    M.setSpeed(0, lensLBHip)
  ],
  [
    M.allPass( // Set angles
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLFHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLMHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLBHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLFKnee),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLMKnee),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLBKnee)
    ),
    M.allPass( // Move left hips, knees
      M.setSpeed(1, lensLFHip),
      M.setSpeed(1, lensLMHip),
      M.setSpeed(1, lensLBHip),
      M.setSpeed(1, lensLFKnee),
      M.setSpeed(1, lensLMKnee),
      M.setSpeed(1, lensLBKnee)
    ),
    M.allPass( // Wait until joints fully deflected
      M.until(M.isMaxAngle, lensLFHip),
      M.until(M.isMaxAngle, lensLMHip),
      M.until(M.isMaxAngle, lensLBHip)
    )
  ],
  [
    M.allPass( // Set angles of the right hips
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensRFHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensRMHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensRBHip)
    ),
    M.allPass( // Halt left hip, knee joint motors
      M.setSpeed(0, lensLFHip),
      M.setSpeed(0, lensLMHip),
      M.setSpeed(0, lensLBHip),
      M.setSpeed(0, lensLFKnee),
      M.setSpeed(0, lensLMKnee),
      M.setSpeed(0, lensLBKnee)
    ),
    M.allPass( // Start motor of right hips in backward direction
      M.setSpeed(-1, lensRFHip),
      M.setSpeed(-1, lensRMHip),
      M.setSpeed(-1, lensRBHip)
    ),
    M.anyPass( // Wait until right hips are at it's minimal angle
      M.until(M.isMinAngle, lensRFHip),
      M.until(M.isMinAngle, lensRMHip),
      M.until(M.isMinAngle, lensRBHip)
    )
  ],
  [
    M.allPass(
      M.setSpeed(0, lensRFHip),
      M.setSpeed(0, lensRMHip),
      M.setSpeed(0, lensRBHip)
    ),
    M.allPass(
      M.setAngles(0, ANGLE_MAX, lensLFHip),
      M.setAngles(0, ANGLE_MAX, lensLMHip),
      M.setAngles(0, ANGLE_MAX, lensLBHip),
      M.setAngles(0, ANGLE_MAX, lensLFKnee),
      M.setAngles(0, ANGLE_MAX, lensLMKnee),
      M.setAngles(0, ANGLE_MAX, lensLBKnee)
    ),
    M.allPass(
      M.setSpeed(-1, lensLFHip),
      M.setSpeed(-1, lensLMHip),
      M.setSpeed(-1, lensLBHip),
      M.setSpeed(-1, lensLFKnee),
      M.setSpeed(-1, lensLMKnee),
      M.setSpeed(-1, lensLBKnee)
    ),
    M.allPass(
      M.until(M.isMinAngle, lensLFHip),
      M.until(M.isMinAngle, lensLMHip),
      M.until(M.isMinAngle, lensLBHip)
    ),
    M.allPass( // Lock angles of left hip to zero
      M.lockAngleToZero(lensLFHip),
      M.lockAngleToZero(lensLMHip),
      M.lockAngleToZero(lensLBHip),
      M.lockAngleToZero(lensLFKnee),
      M.lockAngleToZero(lensLMKnee),
      M.lockAngleToZero(lensLBKnee)
    )
  ],
  [
    M.allPass(
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensRFKnee),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensRMKnee),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensRBKnee)
    ),
    M.allPass( // Move right hips, knees
      M.setSpeed(1, lensRFHip),
      M.setSpeed(1, lensRMHip),
      M.setSpeed(1, lensRBHip),
      M.setSpeed(1, lensRFKnee),
      M.setSpeed(1, lensRMKnee),
      M.setSpeed(1, lensRBKnee)
    ),
    M.allPass( // Wait until joints fully deflected
      M.until(M.isMaxAngle, lensRFHip),
      M.until(M.isMaxAngle, lensRMHip),
      M.until(M.isMaxAngle, lensRBHip)
    )
  ],
  [
    M.allPass(
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLFHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLMHip),
      M.setAngles(ANGLE_MIN, ANGLE_MAX, lensLBHip)
    ),
    M.allPass( // Halt hip, knee joint motors
      M.setSpeed(0, lensLFHip),
      M.setSpeed(0, lensLMHip),
      M.setSpeed(0, lensLBHip),
      M.setSpeed(0, lensLFKnee),
      M.setSpeed(0, lensLMKnee),
      M.setSpeed(0, lensLBKnee)
    ),
    M.allPass(
      M.setSpeed(-1, lensLFHip),
      M.setSpeed(-1, lensLMHip),
      M.setSpeed(-1, lensLBHip)
    ),
    M.anyPass(
      M.until(M.isMinAngle, lensLFHip),
      M.until(M.isMinAngle, lensLMHip),
      M.until(M.isMinAngle, lensLBHip)
    )
  ],
  [
    M.allPass(
      M.setSpeed(0, lensLFHip),
      M.setSpeed(0, lensLMHip),
      M.setSpeed(0, lensLBHip)
    ),
    M.allPass(
      M.setAngles(0, ANGLE_MAX, lensRFHip),
      M.setAngles(0, ANGLE_MAX, lensRMHip),
      M.setAngles(0, ANGLE_MAX, lensRBHip),
      M.setAngles(0, ANGLE_MAX, lensRFKnee),
      M.setAngles(0, ANGLE_MAX, lensRMKnee),
      M.setAngles(0, ANGLE_MAX, lensRBKnee)
    ),
    M.allPass(
      M.setSpeed(-1, lensRFHip),
      M.setSpeed(-1, lensRMHip),
      M.setSpeed(-1, lensRBHip),
      M.setSpeed(-1, lensRFKnee),
      M.setSpeed(-1, lensRMKnee),
      M.setSpeed(-1, lensRBKnee)
    ),
    M.anyPass(
      M.until(M.isAngle(0), lensRFHip),
      M.until(M.isAngle(0), lensRMHip),
      M.until(M.isAngle(0), lensRBHip)
    ),
    M.allPass( // Lock angles of right hip to zero
      M.lockAngleToZero(lensRFHip),
      M.lockAngleToZero(lensRMHip),
      M.lockAngleToZero(lensRBHip),
      M.lockAngleToZero(lensRFKnee),
      M.lockAngleToZero(lensRMKnee),
      M.lockAngleToZero(lensRBKnee)
    )
  ]
];
