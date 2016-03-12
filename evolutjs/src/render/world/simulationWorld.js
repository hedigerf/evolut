'use strict';

import path from 'path';
import P2Pixi from './../../../lib/p2Pixi';
import log4js from 'log4js';
import Immutable from 'immutable';

import FlatParcour from '../object/parcour/flatParcour';
import DemoGround from '../object/demoGround';
import ParcourGenerator from '../object/parcour/parcourGenerator';
import config from '../../../config';
import {debug,info} from '../../util/logUtil';



import Circle from '../object/demoCircle';

const logger = log4js.getLogger('simulationWorld');


function rockTexturePath() {
  return path.join(__dirname, '../../..', 'assets/textures', 'rock.jpg');
}
/**
 * Responsible for simulating one simulation run.
 */
export default class SimulationWorld extends P2Pixi.Game {

  constructor(parcourOptions,population,cb) {
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
    this.cb = cb;
    this.reset();
  }

  reset() {
    this.stepTime = 1 / 60;
    this.runOver = false;
    this.currentTime = 0;
  }

  generateParcour(maxSlope,highestY) {
    if (this.parcourOptions.mode === 'flat') {
      new FlatParcour(this);
    }else if (this.parcourOptions.mode === 'demo') {
      new DemoGround(this);
    }else if (this.parcourOptions.mode === 'generator') {
      const parcourGenerator = new ParcourGenerator();
      const parcour = parcourGenerator.generateParcour(this,maxSlope,highestY);
    }
  }

  drawCircles() {
    this.population.individuals = Immutable.Range(0,200).map(x => new Circle(this));
    // Force evaluation of sequence
    this.population.individuals.cacheResult();
    this.trackedBody = this.population.individuals.get(0).bodies[0];
  }

  addNewPopulation(population) {
    this.population = population;
    this.population.individuals.forEach(x => {
      x.randomPos();
      this.addGameObject(x);
    });
  }

  beforeRun() {
    info(logger,'Preparing Simulation for Generation: ' + this.population.generationCount);
    this.generateParcour(this.parcourOptions.maxSlope,this.parcourOptions.highestY);
    this.drawCircles();
    const runDuration = config('simulation.runDuration');
    this.currentTime = 0;
    this.world.on('postStep',(event) => {
      debug(logger,'' + this.trackedBody.position);
      this.currentTime += this.stepTime;
      if (runDuration <= this.currentTime) {
        this.runOver = true;
        info(logger,'Simulation run ended.');
      }
    });

  }
    /**
    * Begins the world step / render loop
    */
   run() {
     var self = this;
     var maxSubSteps = 10;

     self.lastWorldStepTime = self.time();

     function update() {
       if (!self.runOver) {
         var timeSinceLastCall;

         if (!self.paused) {
           timeSinceLastCall = self.time() - self.lastWorldStepTime;
           self.lastWorldStepTime = self.time();
           self.world.step(self.stepTime, timeSinceLastCall, maxSubSteps);
         }

         self.beforeRender();
         self.render();
         self.afterRender();

         self.req = requestAnimationFrame(update);
       }else {
         cancelAnimationFrame(self.req);
         self.cb({generationCount: self.population.generationCount + 1, individuals: self.population.individuals});
       }
     }

     self.req = requestAnimationFrame(update);
   }


}
