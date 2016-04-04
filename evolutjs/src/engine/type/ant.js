/**
 * Ant movement engine module.
 *
 * @module engine/type/ant
 * @see module:engine/engine
 */

import { ANGLE_MAX, ANGLE_MIN } from '../../algorithm/individual/joint';

/**
 * @typedef {{
 *   side: String,
 *   type: String,
 *   index: Number
 * }} LensDescriptor
 */

/**
 * Create a lens desriptor object.
 *
 * @param {String} side The side, left or right
 * @param {String} type The type, hip or joint
 * @param {Number} index The leg index
 * @return {LensDescriptor}
 */
function makeLens(side, type, index) {
  return { side, type, index };
}
// TODO convert lenses ids to lens descriptors
makeLens('left', 'hip', 0);

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
    {
      id: 'la0', lensId: 'lfh', params: []
    },
    {
      id: 'la0', lensId: 'lmh', params: []
    },
    {
      id: 'la0', lensId: 'lbh', params: []
    },
    {
      id: 'la0', lensId: 'rfh', params: []
    },
    {
      id: 'la0', lensId: 'rmh', params: []
    },
    {
      id: 'la0', lensId: 'rbh', params: []
    },
    {
      id: 'sts', lensId: 'lfh', params: [0]
    },
    {
      id: 'sts', lensId: 'lmh', params: [0]
    },
    {
      id: 'sts', lensId: 'lbh', params: [0]
    }
  ],
  // The cyclic movement
  movements: [
    // Phase 1
    // Unlock the revolute constraint angles of the left side
    // Start the hip and knee joint motors
    // Wait until the hip joints are all fully deflected
    {
      id: 'all',
      params: [
        {
          id: 'sta', lensId: 'lfh', params: [ANGLE_MIN, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'lmh', params: [ANGLE_MIN, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'lbh', params: [ANGLE_MIN, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'lfk', params: [ANGLE_MIN, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'lmk', params: [ANGLE_MIN, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'lbk', params: [ANGLE_MIN, ANGLE_MAX]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'sts', lensId: 'lfh', params: [1]
        },
        {
          id: 'sts', lensId: 'lmh', params: [1]
        },
        {
          id: 'sts', lensId: 'lbh', params: [1]
        },
        {
          id: 'sts', lensId: 'lfk', params: [1]
        },
        {
          id: 'sts', lensId: 'lmk', params: [1]
        },
        {
          id: 'sts', lensId: 'lbk', params: [1]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'utl', lensId: 'lfh', params: ['mxa']
        },
        {
          id: 'utl', lensId: 'lmh', params: ['mxa']
        },
        {
          id: 'utl', lensId: 'lbh', params: ['mxa']
        }
      ]
    },
    // Phase 2
    // Unlock the angles of the right side
    // Halt the left hip and knee joints
    // Start the motor of the right hip joints
    // Wait until one right hip is at it's minimal angle
    {
      id: 'all',
      params: [
        {
          id: 'sta', lensId: 'rfh', params: [ANGLE_MIN, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'rmh', params: [ANGLE_MIN, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'rbh', params: [ANGLE_MIN, ANGLE_MAX]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'sts', lensId: 'lfh', params: [0]
        },
        {
          id: 'sts', lensId: 'lmh', params: [0]
        },
        {
          id: 'sts', lensId: 'lbh', params: [0]
        },
        {
          id: 'sts', lensId: 'lfk', params: [0]
        },
        {
          id: 'sts', lensId: 'lmk', params: [0]
        },
        {
          id: 'sts', lensId: 'lbk', params: [0]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'sts', lensId: 'rfh', params: [-1]
        },
        {
          id: 'sts', lensId: 'rmh', params: [-1]
        },
        {
          id: 'sts', lensId: 'rbh', params: [-1]
        }
      ]
    },
    {
      id: 'one',
      params: [
        {
          id: 'utl', lensId: 'rfh', params: ['mia']
        },
        {
          id: 'utl', lensId: 'rmh', params: ['mia']
        },
        {
          id: 'utl', lensId: 'rbh', params: ['mia']
        }
      ]
    },
    // Phase 3
    // Remove speed from right hip joint motors
    // Set angles of left hip and knee joints to 0 and ANGLE_MAX
    // Set speed of left hip and knee joints and move toward center
    // Wait until left hip joints are at angle 0 (current minimum)
    // Lock left hip and knee joint angles to 0
    {
      id: 'all',
      params: [
        {
          id: 'sts', lensId: 'rfh', params: [0]
        },
        {
          id: 'sts', lensId: 'rmh', params: [0]
        },
        {
          id: 'sts', lensId: 'rbh', params: [0]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'sta', lensId: 'lfh', params: [0, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'lmh', params: [0, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'lbh', params: [0, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'lfk', params: [0, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'lmk', params: [0, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'lbk', params: [0, ANGLE_MAX]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'sts', lensId: 'lfh', params: [-1]
        },
        {
          id: 'sts', lensId: 'lmh', params: [-1]
        },
        {
          id: 'sts', lensId: 'lbh', params: [-1]
        },
        {
          id: 'sts', lensId: 'lfk', params: [-1]
        },
        {
          id: 'sts', lensId: 'lmk', params: [-1]
        },
        {
          id: 'sts', lensId: 'lbk', params: [-1]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'utl', lensId: 'lfh', params: ['mia']
        },
        {
          id: 'utl', lensId: 'lmh', params: ['mia']
        },
        {
          id: 'utl', lensId: 'lbh', params: ['mia']
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'la0', lensId: 'lfh', params: []
        },
        {
          id: 'la0', lensId: 'lmh', params: []
        },
        {
          id: 'la0', lensId: 'lbh', params: []
        },
        {
          id: 'la0', lensId: 'lfk', params: []
        },
        {
          id: 'la0', lensId: 'lmk', params: []
        },
        {
          id: 'la0', lensId: 'lbk', params: []
        }
      ]
    },
    // Phase 4
    // Unlock right knee angles
    // Set motor speed of right hip and knee joints
    // Wait until right hip joints are fully deflected
    {
      id: 'all',
      params: [
        {
          id: 'sta', lensId: 'rfk', params: [ANGLE_MIN, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'rmk', params: [ANGLE_MIN, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'rbk', params: [ANGLE_MIN, ANGLE_MAX]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'sts', lensId: 'rfh', params: [1]
        },
        {
          id: 'sts', lensId: 'rmh', params: [1]
        },
        {
          id: 'sts', lensId: 'rbh', params: [1]
        },
        {
          id: 'sts', lensId: 'rfk', params: [1]
        },
        {
          id: 'sts', lensId: 'rmk', params: [1]
        },
        {
          id: 'sts', lensId: 'rbk', params: [1]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'utl', lensId: 'rfh', params: ['mxa']
        },
        {
          id: 'utl', lensId: 'rmh', params: ['mxa']
        },
        {
          id: 'utl', lensId: 'rbh', params: ['mxa']
        }
      ]
    },
    // Phase 5
    // Unlock left hip joints
    // Remove speed of left hip and knee joint motors
    // Set speed of left hip joints in backward direction
    // Wait until one left hip joint angle is minimally deflected
    {
      id: 'all',
      params: [
        {
          id: 'sta', lensId: 'lfh', params: [ANGLE_MIN, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'lmh', params: [ANGLE_MIN, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'lbh', params: [ANGLE_MIN, ANGLE_MAX]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'sts', lensId: 'lfh', params: [0]
        },
        {
          id: 'sts', lensId: 'lmh', params: [0]
        },
        {
          id: 'sts', lensId: 'lbh', params: [0]
        },
        {
          id: 'sts', lensId: 'lfk', params: [0]
        },
        {
          id: 'sts', lensId: 'lmk', params: [0]
        },
        {
          id: 'sts', lensId: 'lbk', params: [0]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'sts', lensId: 'lfh', params: [-1]
        },
        {
          id: 'sts', lensId: 'lmh', params: [-1]
        },
        {
          id: 'sts', lensId: 'lbh', params: [-1]
        }
      ]
    },
    {
      id: 'one',
      params: [
        {
          id: 'utl', lensId: 'lfh', params: ['mia']
        },
        {
          id: 'utl', lensId: 'lmh', params: ['mia']
        },
        {
          id: 'utl', lensId: 'lbh', params: ['mia']
        }
      ]
    },
    // Phase 6
    // Remove speed of left hip joint motors
    // Unlock right hip and knee joints
    // Set motor speed of right hip and knee joint
    // Wait until one angle is 0
    // Lock right hip and knee joints
    {
      id: 'all',
      params: [
        {
          id: 'sts', lensId: 'lfh', params: [0]
        },
        {
          id: 'sts', lensId: 'lmh', params: [0]
        },
        {
          id: 'sts', lensId: 'lbh', params: [0]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'sta', lensId: 'rfh', params: [0, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'rmh', params: [0, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'rbh', params: [0, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'rfk', params: [0, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'rmk', params: [0, ANGLE_MAX]
        },
        {
          id: 'sta', lensId: 'rbk', params: [0, ANGLE_MAX]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'sts', lensId: 'rfh', params: [-1]
        },
        {
          id: 'sts', lensId: 'rmh', params: [-1]
        },
        {
          id: 'sts', lensId: 'rbh', params: [-1]
        },
        {
          id: 'sts', lensId: 'rfk', params: [-1]
        },
        {
          id: 'sts', lensId: 'rmk', params: [-1]
        },
        {
          id: 'sts', lensId: 'rbk', params: [-1]
        }
      ]
    },
    {
      id: 'one',
      params: [
        {
          id: 'utl', lensId: 'rfh', params: ['isa', 0]
        },
        {
          id: 'utl', lensId: 'rmh', params: ['isa', 0]
        },
        {
          id: 'utl', lensId: 'rbh', params: ['isa', 0]
        }
      ]
    },
    {
      id: 'all',
      params: [
        {
          id: 'la0', lensId: 'rfh', params: []
        },
        {
          id: 'la0', lensId: 'rmh', params: []
        },
        {
          id: 'la0', lensId: 'rbh', params: []
        },
        {
          id: 'la0', lensId: 'rfk', params: []
        },
        {
          id: 'la0', lensId: 'rmk', params: []
        },
        {
          id: 'la0', lensId: 'rbk', params: []
        }
      ]
    }
  ]
};

export default AntEngineDescriptor;
