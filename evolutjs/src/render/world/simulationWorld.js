'use strict';

import path from 'path';
import P2Pixi from './../../../lib/p2Pixi';
import log4js from 'log4js';
import Immutable from 'immutable';

import FlatParcour from '../object/parcour/flatParcour';
import DemoGround from '../object/demoGround';
import ParcourGenerator from '../object/parcour/parcourGenerator';
import config from '../../../config';
import {debug, info} from '../../util/logUtil';
import Individual from '../object/individual/individual';



import Circle from '../object/demoCircle';

const logger = log4js.getLogger('simulationWorld');

const render = config('simulation.render');
const solo = config('simulation.solo');

function rockTexturePath() {
  return path.join(__dirname, '../../..', 'assets/textures', 'rock.jpg');
}
/**
 * Responsible for simulating one simulation run.
 */
export default class SimulationWorld extends P2Pixi.Game {

  constructor(parcourOptions, population, cb) {
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
    this.stepTime = 1 / 30;
    this.runOver = false;
    this.currentTime = 0;
  }

  generateParcour(maxSlope, highestY) {
    if (this.parcourOptions.mode === 'flat') {
      new FlatParcour(this);
    }else if (this.parcourOptions.mode === 'demo') {
      new DemoGround(this);
    }else if (this.parcourOptions.mode === 'generator') {
      const parcourGenerator = new ParcourGenerator();
      const parcour = parcourGenerator.generateParcour(this, maxSlope, highestY);
    }
  }

  drawPhenotypes() {
    // Force evaluation of sequence
    // jshint -W098
    let takeN;
    if (solo) {
      takeN = 1;
    }else {
      takeN = this.population.individuals.size;
    }
    this.phenoTypes = this.population.individuals.take(takeN).map(i => new Individual(this, i));
    info(logger, 'drawn ' + this.phenoTypes.size + ' phenoTypes');
    const trackedIndividual = this.phenoTypes.get(0);
    this.trackedBody = trackedIndividual.bodies[0];
  }

  addNewPopulation(population) {
    this.population = population;
    /*This.population.individuals.forEach(x => {
      x.randomPos();
      this.addGameObject(x);
    });*/
    this.clear();
    this.reset();
    this.mapIndividualsToRenderers();
  }

  mapIndividualsToRenderers() {
    // TODO create renderers for each indiviual
  }

  beforeRun() {
    info(logger, 'Preparing Simulation for Generation: ' + this.population.generationCount);
    this.generateParcour(this.parcourOptions.maxSlope, this.parcourOptions.highestY);
    this.drawPhenotypes();
    const runDuration = config('simulation.runDuration');
    this.currentTime = 0;
    this.world.on('postStep', (event) => {
      //Debug(logger,'' + this.trackedBody.position);
      this.currentTime += this.stepTime;
      if (runDuration <= this.currentTime) {
        this.runOver = true;
        info(logger, 'Simulation run ended.');
      }else {
        // Info(logger, this.population.individuals.size);
        // /*
        // Move back,front on one side and middle from other side
        // Simplified in 2D: only necessary to move on one side
        // Negative motorspeed values -> leg moves in x direction
        // Positive motorspeed -> leg moves in -x direction
        this.phenoTypes.forEach((indiviual) => {

          if (this.currentTime > 0) {
            const jointsMap = indiviual.jointsMap;
            const leftSide = jointsMap.get('left');
            const rightSide = jointsMap.get('right');
            const leftBack = leftSide.get('back').hip;
            const leftMiddle = leftSide.get('middle').hip;
            const leftFront = leftSide.get('front').hip;
            info(logger, this.trackedBody.position + ' pos');
            const min = -Math.PI;
            const max = Math.PI;
            leftBack.setLimits(min, max);
            leftBack.setMotorSpeed(-2.0);
            leftFront.setLimits(min, max);
            leftFront.setMotorSpeed(-2.0);
            leftMiddle.setLimits(min, max);
            leftMiddle.setMotorSpeed(-2.0);
          }

        });
      }
      /*Const f = this.phenoTypes.forEach((indiviual) => {
        indiviual.revoluteHips.forEach(revoluteHip => {
          const index = revoluteHip.equations.indexOf(revoluteHip.motorEquation);
          const maxAngle = revoluteHip.upperLimit;
          const minAngle = revoluteHip.lowerLimit;

          if (revoluteHip.angle < minAngle || revoluteHip.angle > maxAngle) {
            info(logger, 'Velocity: ' + -revoluteHip.equations[index].relativeVelocity +
             ' Angle: ' + revoluteHip.angle);
            revoluteHip.setMotorSpeed(-1 * revoluteHip.equations[index].relativeVelocity);
          }
        });
      });*/


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

         if (render) {
           self.beforeRender();
           self.render();
           self.afterRender();
         }


         self.req = requestAnimationFrame(update);
       }else {
         cancelAnimationFrame(self.req);
         // TODO update generaton with fitness values, dont pass renderers
         self.cb({ generationCount: self.population.generationCount, individuals: self.population.individuals });
       }
     }

     self.req = requestAnimationFrame(update);
   }

   addGameObject(gameObject) {
     this.gameObjects.push(gameObject);
   }


}
