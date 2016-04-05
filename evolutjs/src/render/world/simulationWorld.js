/**
 * Contains the simulation world.
 *
 * @module render/world/simulationWorld
 */

import * as L from 'partial.lenses'
import log4js from 'log4js';
import path from 'path';
import P2Pixi from './../../../lib/p2Pixi';

import Engine, { Feedback } from '../../engine/engine';
import FlatParcour from '../object/parcour/flatParcour';
import ParcourGenerator from '../object/parcour/parcourGenerator';
import config from '../../app/config';
import { info } from '../../util/logUtil';
import Individual from '../object/individual/individual';

/**
 * World start time.
 *
 * @type {Number}
 */
const WORLD_START_TIME = 0;

const logger = log4js.getLogger('simulationWorld');

const evaluateAfterTickCount = config('simulation.evaluateAfterTickCount');
const friction = config('simulation.friction');
const gravity = config('simulation.gravity');
const mustMovement = config('simulation.mustMovement');
const render = config('simulation.render');
const runDuration = config('simulation.runDuration');
const solo = config('simulation.solo');
const stepTime = config('simulation.stepTime');
const timeOut = config('simulation.timeOut');
const trackY = config('simulation.trackY');

const lensBodyXpos = L.compose(L.prop('bodies'), L.index(0), L.prop('position'), L.index(0));

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
      assetUrls: [rockTexturePath()],
      pixiOptions: {
        view: document.getElementById('viewport'),
        transparent: true,
        autoResize: true
      },
      worldOptions: {
        gravity
      }
    });
    this.world.defaultContactMaterial.friction = friction;
    this.population = population;
    this.parcourOptions = parcourOptions;
    this.cb = cb;
    this.isRenderingEnabled = render;
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

          if (this.currentTime === WORLD_START_TIME + stepTime) {
            Feedback.register(this.world, individual);
            Engine.initialStep(individual);
          } else {
            Engine.step(individual, this.currentTime);
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

        if (self.isRenderingEnabled) {
          self.beforeRender();
          self.render();
          self.afterRender();
        }

        self.req = requestAnimationFrame(update);
      } else {
        cancelAnimationFrame(self.req);
        self.cb({ generationCount: self.population.generationCount, individuals: self.population.individuals });
      }
    }

    self.req = requestAnimationFrame(update);
  }
  /**
   * P2Pixi beforeRender function, modified so it only tracks x position and not y position
   */
  beforeRender() {
    const trackedBody = this.trackedBody;

    // Focus tracked body, if set
    if (trackedBody !== null) {
      const pixiAdapter = this.pixiAdapter;
      const renderer = pixiAdapter.renderer;
      const ppu = pixiAdapter.pixelsPerLengthUnit;
      const containerPosition = pixiAdapter.container.position;
      const trackedBodyPosition = trackedBody.position;
      const trackedBodyOffset = this.options.trackedBodyOffset;
      const deviceScale = pixiAdapter.deviceScale;

      containerPosition.x = ((trackedBodyOffset[0] + 1) * renderer.width * 0.5) - (trackedBodyPosition[0] * ppu * deviceScale);
      if (trackY) {
        containerPosition.y = ((trackedBodyOffset[1] + 1) * renderer.height * 0.5) + (trackedBodyPosition[1] * ppu * deviceScale);
      } else {
        containerPosition.y = ((0 + 1) * renderer.height * 0.5) + (0 * ppu * deviceScale);
      }
    }
  }

  addGameObject(gameObject) {
    this.gameObjects.push(gameObject);
  }

}
