/**
 * Contains the simulation world.
 *
 * @module render/world/simulationWorld
 */

import path from 'path';
import P2Pixi from './../../../lib/p2Pixi';
import log4js from 'log4js';

import FlatParcour from '../object/parcour/flatParcour';
import DemoGround from '../object/demoGround';
import ParcourGenerator from '../object/parcour/parcourGenerator';
import config from '../../../config';
import { info } from '../../util/logUtil';
import Individual from '../object/individual/individual';

/**
 * World start time.
 *
 * @type {Number}
 */
const WORLD_START_TIME = 0;

const logger = log4js.getLogger('simulationWorld');

const friction = config('simulation.friction');
const render = config('simulation.render');
const solo = config('simulation.solo');
const stepTime = config('simulation.stepTime');

function rockTexturePath() {
  return path.join(__dirname, '../../..', 'assets/textures', 'rock.jpg');
}

/**
 * Responsible for simulating one simulation run.
 *
 * @extends {P2Pixi.Game}
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
    this.world.defaultContactMaterial.friction = friction;
    this.population = population;
    this.parcourOptions = parcourOptions;
    this.cb = cb;
    this.reset();
  }

  /**
   * Reset the world.
   * Sets the time to 0.
   */
  reset() {
    this.stepTime = stepTime;
    this.runOver = false;
    this.currentTime = 0;
  }

  generateParcour(maxSlope, highestY) {
    if (this.parcourOptions.mode === 'flat') {
      new FlatParcour(this);
    } else if (this.parcourOptions.mode === 'demo') {
      new DemoGround(this);
    } else if (this.parcourOptions.mode === 'generator') {
      const parcourGenerator = new ParcourGenerator();
      parcourGenerator.generateParcour(this, maxSlope, highestY);
    }
  }

  drawPhenotypes() {
    // Force evaluation of sequence
    // jshint -W098
    let takeN;
    if (solo) {
      takeN = 1;
    } else {
      takeN = this.population.individuals.size;
    }
    this.phenoTypes = this.population.individuals.take(takeN).map(i => new Individual(this, i));
    info(logger, 'drawn ' + this.phenoTypes.size + ' phenoTypes');
    const trackedIndividual = this.phenoTypes.get(0);
    this.trackedBody = trackedIndividual.bodies[0];
  }

  addNewPopulation(population) {
    this.population = population;
    this.clear();
    this.reset();
    this.mapIndividualsToRenderers();
  }

  mapIndividualsToRenderers() {
    // TODO create renderers for each indiviual
  }

  /**
   * Callback on before run.
   *
   * @see class:P2Pixi.Game~beforeRun
   */
  beforeRun() {

    info(logger, 'Preparing Simulation for Generation: ' + this.population.generationCount);
    this.generateParcour(this.parcourOptions.maxSlope, this.parcourOptions.highestY);
    this.drawPhenotypes();
    const runDuration = config('simulation.runDuration');
    this.currentTime = 0;
    this.world.on('postStep', (event) => { // eslint-disable-line no-unused-vars

      this.currentTime += this.stepTime;
      if (runDuration <= this.currentTime) {
        this.runOver = true;
        info(logger, 'Simulation run ended.');
      } else {

        this.phenoTypes.forEach((individual) => {

          const engine = individual.engine;

          if (this.currentTime === WORLD_START_TIME + stepTime) {
            engine.initialStep(individual);
          } else {
            engine.step(individual, this.currentTime);
          }

        });
      }
    });
  }

  /**
  * Begins the world step / render loop
  */
  run() {

    const self = this;
    const maxSubSteps = 10;

    self.lastWorldStepTime = self.time();

    function update() {
      if (!self.runOver) {

        if (!self.paused) {
          const timeSinceLastCall = self.time() - self.lastWorldStepTime;
          self.lastWorldStepTime = self.time();
          self.world.step(self.stepTime, timeSinceLastCall, maxSubSteps);
        }

        if (render) {
          self.beforeRender();
          self.render();
          self.afterRender();
        }

        self.req = requestAnimationFrame(update);
      } else {
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
