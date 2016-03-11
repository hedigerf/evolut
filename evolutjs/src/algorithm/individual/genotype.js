'use strict';

// Validator
// parser, lens

export const GENOTYPE = {
  body: {
    mass: 0.5,
    points: [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1]
    ]
  },
  joints: [
    {
      orientation: 1,
      position: [0.8, 0]
    },
    {
      orientation: 1,
      position: [0.6, 0]
    },
    {
      orientation: 0,
      position: [0.2, 0]
    }
  ],
  legs: [
    {
      heightTigh: 0.55,
      joint: {
        orientation: 1
      },
      mass: 0.15
    },
    {
      heightTigh: 0.55,
      joint: {
        orientation: 1
      },
      mass: 0.15
    },
    {
      heightTigh: 0.6,
      joint: {
        orientation: 1
      },
      mass: 0.2
    }
  ],
  engine: {
    type: 'ant'
  }
};
