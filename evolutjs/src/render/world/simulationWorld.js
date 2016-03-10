'use strict';

import path from 'path';
import P2Pixi from './../../../lib/p2Pixi';
import log4js from 'log4js';

import FlatParcour from '../object/parcour/flatParcour';
import DemoGround from '../object/demoGround';
import ParcourGenerator from '../object/parcour/parcourGenerator';

import Circle from '../object/demoCircle';

const logger = log4js.getLogger('simulationWorld');


function rockTexturePath() {
  return path.join(__dirname, '../../..', 'assets/textures', 'rock.jpg');
}
/**
 * Responsible for simulating one simulation run.
 */
export default class SimulationWorld extends P2Pixi.Game {

  constructor(parcourOptions,population) {
    super({
      pixiOptions: {
        view: document.getElementById('viewport'),
        transparent: true,
        autoResize: true
      },
      assetUrls: [rockTexturePath()]
    });
    this.population = population;
    this.parcourOptions = parcourOptions;
  }

  beforeRun() {
    logger.info('Preparing Simulation for Generation: ' + this.population.generationCount);
    if (this.parcourOptions.mode === 'flat') {
      new FlatParcour(this);
    }else if (this.parcourOptions.mode === 'demo') {
      new DemoGround(this);
    }else if (this.parcourOptions.mode === 'generator') {
      const parcourGenerator = new ParcourGenerator();
      const parcour = parcourGenerator.generateParcour(this,this.parcourOptions.maxSlope,this.parcourOptions.highestY);
    }
    const circle = new Circle(this);

    for (let i = 0; i < 200; i++) {
      new Circle(this);
    }

    this.trackedBody = circle.bodies[0];
  }

}
