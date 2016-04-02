/**
 * Contains the simulation world.
 *
 * @module render/world/simulationWorld
 */

import path from 'path';
import P2Pixi from './../../../lib/p2Pixi';
import log4js from 'log4js';
import { List, Map } from 'immutable';
import L  from 'partial.lenses';
import { view } from 'ramda';


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
const evaluateAfterTickCount = config('simulation.evaluateAfterTickCount');
const timeOut = config('simulation.timeOut');
const mustMovement = config('simulation.mustMovement');
const runDuration = config('simulation.runDuration');
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
    this.tickCount = 0;
    this.positionLastEvaluation = Map();
    this.phenotypeToGenotype = Map();

  }
  /**
   * Triggers the parcour generation
   *
   * @param  {Number} maxSlope max. slope
   * @param  {Number} highestY highest possible position
   */
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
  /**
   * Draws all phenotypes and creates the pheno- to genotype mapping
   */
  drawPhenotypes() {
    // Force evaluation of sequence
    // jshint -W098
    let takeN;
    if (solo) {
      takeN = 1;
    } else {
      takeN = this.population.individuals.size;
    }
    this.phenoTypes = this.population.individuals.take(takeN).map(genotype => {
      const individual = new Individual(this, genotype);
      this.positionLastEvaluation = this.positionLastEvaluation.set(individual, view(lensBodyXpos, individual));
      this.phenotypeToGenotype = this.phenotypeToGenotype.set(individual, genotype);
      return individual;
    });
    info(logger, 'drawn ' + this.phenoTypes.size + ' phenoTypes');
    const trackedIndividual = this.phenoTypes.get(0);
    this.trackedBody = trackedIndividual.bodies[0];
  }
  /**
   * Add a new population to the simulation
   *
   * @param {Population} population the population
   */
  addNewPopulation(population) {
    this.population = population;
    this.clear();
    this.reset();
  }
  /**
   * Evaluates the current state of the simulation. Timeout all stuck individuals and record information.
   */
  evaluate() {
    let removeElements = List();
    this.phenoTypes.forEach((individual) => {
      const posLastEvaluation = this.positionLastEvaluation.get(individual);
      const posCurEvaluation = view(lensBodyXpos, individual);
      const delta = posCurEvaluation - posLastEvaluation;
      if (timeOut && mustMovement >= delta) {
        // Remove Individuals which are stuck from simulation
        removeElements = removeElements.push(individual);
        this.removeGameObject(individual);
      }else {
        this.positionLastEvaluation = this.positionLastEvaluation.set(individual, posCurEvaluation);
      }
    });
    this.phenoTypes = this.phenoTypes.filterNot(individual => removeElements.includes(individual));
    this.recordFitness(removeElements);
    if (this.phenoTypes.size === 0) {
      // If there are no more individuals remaining in the simulation, end the run
      this.runOver = true;
    }else {
      // Track always the individual which is leading
      const trackedIndividual = this.phenoTypes.maxBy(individual => view(lensBodyXpos, individual));
      this.trackedBody = trackedIndividual.bodies[0];

    }

  }
  /**
   * Record fitenss of the the given phenotypes
   *
   * @param  {List<Phenotype>} phenotypes to be recorded.
   */
  recordFitness(phenotypes) {
    phenotypes.forEach((individual) => {
      const genotype = this.phenotypeToGenotype.get(individual);
      genotype.fitness = view(lensBodyXpos, individual);
    });
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
    this.currentTime = 0;
    this.world.on('postStep', (event) => { // eslint-disable-line no-unused-vars
      this.tickCount++;
      if (this.tickCount % evaluateAfterTickCount === 0) {
        // Perform Evulation after tickCount is reached
        this.evaluate();
      }
      this.currentTime += this.stepTime;
      if (runDuration <= this.currentTime) {
        this.evaluate();
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
        self.recordFitness(self.phenoTypes);
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
      }else {
        containerPosition.y = ((0 + 1) * renderer.height * 0.5) + (0 * ppu * deviceScale);
      }
    }
  }

  addGameObject(gameObject) {
    this.gameObjects.push(gameObject);
  }

}
