'use strict';

import path from 'path';
import P2Pixi from './../../../lib/p2Pixi';
import log4js from 'log4js';

import FlatParcour from '../object/parcour/flatparcour';
import Circle from '../object/demoCircle';

const logger = log4js.getLogger('simulationWorld');


function rockTexturePath() {
  return path.join(__dirname, '../../..', 'assets/textures', 'rock.jpg');
}
/**
 * Responsible for simulating one simulation run.
 */
export default class SimulationWorld extends P2Pixi.Game {

  constructor(parcour,population) {
    super({
      pixiOptions: {
        view: document.getElementById('viewport'),
        transparent: true,
        autoResize: true
      },
      assetUrls: [rockTexturePath()]
    });
    this.parcour = parcour;
    this.population = population;
  }

  beforeRun() {
    logger.info('Preparing Simulation for Generation: ' + this.population.generationCount);
    if (this.parcour === 'flat') {
      new FlatParcour(this);
    }
    const circle = new Circle(this);

    for (let i = 0; i < 200; i++) {
      new Circle(this);
    }

    this.trackedBody = circle.bodies[0];
  }

}
