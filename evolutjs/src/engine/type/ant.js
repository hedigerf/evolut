/**
 * Ant movement engine module.
 *
 * @module engine/type/ant
 * @see module:engine/engine
 */

import { all, makeMovementDescriptor, one } from '../movement';
import { ANGLE_MAX, ANGLE_MIN } from '../../algorithm/individual/joint';

/**
 * Describes an ant's movement.
 *
 * @type {Object}
 * @property {Array<MovementDescriptor>} initial
 * @property {Array<MovementDescriptor>} movements
 */
const AntEngineDescriptor = {
  // Initial movement.
  initial: [
    makeMovementDescriptor('la0', 'lfh'),
    makeMovementDescriptor('la0', 'lmh'),
    makeMovementDescriptor('la0', 'lbh'),
    makeMovementDescriptor('la0', 'rfh'),
    makeMovementDescriptor('la0', 'rmh'),
    makeMovementDescriptor('la0', 'rbh'),
    makeMovementDescriptor('sts', 'lfh', [0]),
    makeMovementDescriptor('sts', 'lmh', [0]),
    makeMovementDescriptor('sts', 'lbh', [0])
  ],
  // The cyclic movement
  movements: [
    // Phase 1
    // Unlock the revolute constraint angles of the left side
    // Start the hip and knee joint motors
    // Wait until the hip joints are all fully deflected
    all(
      makeMovementDescriptor('sta', 'lfh', [ANGLE_MIN, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'lmh', [ANGLE_MIN, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'lbh', [ANGLE_MIN, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'lfk', [ANGLE_MIN, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'lmk', [ANGLE_MIN, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'lbk', [ANGLE_MIN, ANGLE_MAX])
    ),
    all(
      makeMovementDescriptor('sts', 'lfh', [1]),
      makeMovementDescriptor('sts', 'lmh', [1]),
      makeMovementDescriptor('sts', 'lbh', [1]),
      makeMovementDescriptor('sts', 'lfk', [1]),
      makeMovementDescriptor('sts', 'lmk', [1]),
      makeMovementDescriptor('sts', 'lbk', [1])
    ),
    all(
      makeMovementDescriptor('utl', 'lfh', ['mxa']),
      makeMovementDescriptor('utl', 'lmh', ['mxa']),
      makeMovementDescriptor('utl', 'lbh', ['mxa'])
    ),
    // Phase 2
    // Unlock the angles of the right side
    // Halt the left hip and knee joints
    // Start the motor of the right hip joints
    // Wait until one right hip is at it's minimal angle
    all(
      makeMovementDescriptor('sta', 'rfh', [ANGLE_MIN, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'rmh', [ANGLE_MIN, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'rbh', [ANGLE_MIN, ANGLE_MAX])
    ),
    all(
      makeMovementDescriptor('sts', 'lfh', [0]),
      makeMovementDescriptor('sts', 'lmh', [0]),
      makeMovementDescriptor('sts', 'lbh', [0]),
      makeMovementDescriptor('sts', 'lfk', [0]),
      makeMovementDescriptor('sts', 'lmk', [0]),
      makeMovementDescriptor('sts', 'lbk', [0])
    ),
    all(
      makeMovementDescriptor('sts', 'rfh', [-1]),
      makeMovementDescriptor('sts', 'rmh', [-1]),
      makeMovementDescriptor('sts', 'rbh', [-1])
    ),
    one(
      makeMovementDescriptor('utl', 'rfh', ['mia']),
      makeMovementDescriptor('utl', 'rmh', ['mia']),
      makeMovementDescriptor('utl', 'rbh', ['mia'])
    ),
    // Phase 3
    // Remove speed from right hip joint motors
    // Set angles of left hip and knee joints to 0 and ANGLE_MAX
    // Set speed of left hip and knee joints and move toward center
    // Wait until left hip joints are at angle 0 (current minimum)
    // Lock left hip and knee joint angles to 0
    all(
      makeMovementDescriptor('sts', 'rfh', [0]),
      makeMovementDescriptor('sts', 'rmh', [0]),
      makeMovementDescriptor('sts', 'rbh', [0])
    ),
    all(
      makeMovementDescriptor('sta', 'lfh', [0, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'lmh', [0, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'lbh', [0, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'lfk', [0, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'lmk', [0, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'lbk', [0, ANGLE_MAX])
    ),
    all(
      makeMovementDescriptor('sts', 'lfh', [-1]),
      makeMovementDescriptor('sts', 'lmh', [-1]),
      makeMovementDescriptor('sts', 'lbh', [-1]),
      makeMovementDescriptor('sts', 'lfk', [-1]),
      makeMovementDescriptor('sts', 'lmk', [-1]),
      makeMovementDescriptor('sts', 'lbk', [-1])
    ),
    all(
      makeMovementDescriptor('utl', 'lfh', ['mia']),
      makeMovementDescriptor('utl', 'lmh', ['mia']),
      makeMovementDescriptor('utl', 'lbh', ['mia'])
    ),
    all(
      makeMovementDescriptor('la0', 'lfh'),
      makeMovementDescriptor('la0', 'lmh'),
      makeMovementDescriptor('la0', 'lbh'),
      makeMovementDescriptor('la0', 'lfk'),
      makeMovementDescriptor('la0', 'lmk'),
      makeMovementDescriptor('la0', 'lbk')
    ),
    // Phase 4
    // Unlock right knee angles
    // Set motor speed of right hip and knee joints
    // Wait until right hip joints are fully deflected
    all(
      makeMovementDescriptor('sta', 'rfk', [ANGLE_MIN, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'rmk', [ANGLE_MIN, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'rbk', [ANGLE_MIN, ANGLE_MAX])
    ),
    all(
      makeMovementDescriptor('sts', 'rfh', [1]),
      makeMovementDescriptor('sts', 'rmh', [1]),
      makeMovementDescriptor('sts', 'rbh', [1]),
      makeMovementDescriptor('sts', 'rfk', [1]),
      makeMovementDescriptor('sts', 'rmk', [1]),
      makeMovementDescriptor('sts', 'rbk', [1])
    ),
    all(
      makeMovementDescriptor('utl', 'rfh', ['mxa']),
      makeMovementDescriptor('utl', 'rmh', ['mxa']),
      makeMovementDescriptor('utl', 'rbh', ['mxa'])
    ),
    // Phase 5
    // Unlock left hip joints
    // Remove speed of left hip and knee joint motors
    // Set speed of left hip joints in backward direction
    // Wait until one left hip joint angle is minimally deflected
    all(
      makeMovementDescriptor('sta', 'lfh', [ANGLE_MIN, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'lmh', [ANGLE_MIN, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'lbh', [ANGLE_MIN, ANGLE_MAX])
    ),
    all(
      makeMovementDescriptor('sts', 'lfh', [0]),
      makeMovementDescriptor('sts', 'lmh', [0]),
      makeMovementDescriptor('sts', 'lbh', [0]),
      makeMovementDescriptor('sts', 'lfk', [0]),
      makeMovementDescriptor('sts', 'lmk', [0]),
      makeMovementDescriptor('sts', 'lbk', [0])
    ),
    all(
      makeMovementDescriptor('sts', 'lfh', [-1]),
      makeMovementDescriptor('sts', 'lmh', [-1]),
      makeMovementDescriptor('sts', 'lbh', [-1])
    ),
    one(
      makeMovementDescriptor('utl', 'lfh', ['mia']),
      makeMovementDescriptor('utl', 'lmh', ['mia']),
      makeMovementDescriptor('utl', 'lbh', ['mia'])
    ),
    // Phase 6
    // Remove speed of left hip joint motors
    // Unlock right hip and knee joints
    // Set motor speed of right hip and knee joint
    // Wait until one angle is 0
    // Lock right hip and knee joints
    all(
      makeMovementDescriptor('sts', 'lfh', [0]),
      makeMovementDescriptor('sts', 'lmh', [0]),
      makeMovementDescriptor('sts', 'lbh', [0])
    ),
    all(
      makeMovementDescriptor('sta', 'rfh', [0, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'rmh', [0, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'rbh', [0, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'rfk', [0, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'rmk', [0, ANGLE_MAX]),
      makeMovementDescriptor('sta', 'rbk', [0, ANGLE_MAX])
    ),
    all(
      makeMovementDescriptor('sts', 'rfh', [-1]),
      makeMovementDescriptor('sts', 'rmh', [-1]),
      makeMovementDescriptor('sts', 'rbh', [-1]),
      makeMovementDescriptor('sts', 'rfk', [-1]),
      makeMovementDescriptor('sts', 'rmk', [-1]),
      makeMovementDescriptor('sts', 'rbk', [-1])
    ),
    one(
      makeMovementDescriptor('utl', 'rfh', ['mia']), // ['isa', 0]
      makeMovementDescriptor('utl', 'rmh', ['mia']),
      makeMovementDescriptor('utl', 'rbh', ['mia'])
    ),
    all(
      makeMovementDescriptor('la0', 'rfh'),
      makeMovementDescriptor('la0', 'rmh'),
      makeMovementDescriptor('la0', 'rbh'),
      makeMovementDescriptor('la0', 'rfk'),
      makeMovementDescriptor('la0', 'rmk'),
      makeMovementDescriptor('la0', 'rbk')
    )
  ]
};

export default AntEngineDescriptor;
