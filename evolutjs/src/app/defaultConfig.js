/**
 * Provides the default configuration for the application.
 *
 * @module app/defaultConfiguration
 */

/**
 * Average acceleration on earth.
 *
 * @type {Number}
 */
const EARTH_GRAVITY = -9.81;

/**
 * Default configuration
 *
 * @type {Object}
 * @property {Object} defaults.alogrithm
 * @property {Object} defaults.mutation
 * @property {Object} defaults.parcour
 * @property {Object} defaults.simulation
 * @property {Object} defaults.window
 * @property {Object} defaults.worker
 */
const defaultConfig = {
  alogrithm: {
    populationSize: 15,
    loadPopulationFromFile: false,
    switchParcourAfterGeneration: 1
  },
  mutation: {
    body: {
      bodyPoint: {
        probability: 0.1
      },
      hipJoint: {
        probability: 0.1
      }
    },
    engine: {
      add: 0.005,
      remove: 0.001,
      lens: {
        index: 0.01,
        side: 0.01,
        type: 0.01
      },
      movement: {
        id: 0.001,
        params: 0.5,
        sts: {
          step: 0.01
        },
        sta: {
          step: 0.01
        }
      }
    },
    leg: {
      height: {
        limit: 1.5,
        probability: 0.1,
        step: 0.05
      },
      heightFactor: {
        probability: 0.1,
        step: 0.05
      },
      width: {
        limit: 0.25,
        probability: 0.1,
        step: 0.01
      }
    }
  },
  parcour: {
    highestYStep: 0.05,
    increaseDifficultyAfter: 100,
    limitSlope: 1,
    maxSlopeStep: 0.05,
    startHighestY: 0,
    startMaxSlope: 0
  },
  simulation: {
    evaluateAfterTickCount: 240,
    friction: 1000,
    gravity: [0, EARTH_GRAVITY],
    mustMovement: 0.05,
    render: true,
    relaxation: 4,
    runDuration: 10,
    solo: false,
    stepTime: 0.016,
    timeOut: true,
    trackY: false,
    trackBestIndividual: true
  },
  window: {
    height: 720,
    width: 1280
  },
  workers: {
    count: 1
  }
};

export default defaultConfig;
