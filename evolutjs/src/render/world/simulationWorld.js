/**
 * Contains the simulation world.
 *
 * @module render/world/simulationWorld
 */

/* eslint-env browser */

import * as L from 'partial.lenses';
import { List, Map } from 'immutable';
import config from '../../app/config';
import Engine from '../../engine/engine';
import { Game } from './../../../lib/p2Pixi.es6';
import Individual from '../object/individual/individual';
import { info } from '../../util/logUtil';
import log4js from 'log4js';
import ParcourGenerator from '../object/parcour/parcourCreator';
import { texture } from '../../util/path';
import { view } from 'ramda';

/**
 * World start time.
 *
 * @type {Number}
 */
const WORLD_START_TIME = 0;

let logger;

const evaluateAfterTickCount = config('simulation.evaluateAfterTickCount');
const friction = config('simulation.friction');
const gravity = config('simulation.gravity');
const mustMovement = config('simulation.mustMovement');
const render = config('simulation.render');
const relaxation = config('simulation.relaxation');
const runDuration = config('simulation.runDuration');
const solo = config('simulation.solo');
const stepTime = config('simulation.stepTime');
const timeOut = config('simulation.timeOut');
const trackBestIndividual = config('simulation.trackBestIndividual');
const trackY = config('simulation.trackY');

const lensBodyXpos = L.compose(L.prop('bodies'), L.index(0), L.prop('position'), L.index(0));

/**
 * Responsible for simulating one simulation run.
 *
 * @extends {P2Pixi.Game}
 */
export default class SimulationWorld extends Game {

  constructor(parcourOptions, population, cb) {
    super({
      assetUrls: [texture('rock.jpg')],
      pixiOptions: {
        autoResize: true,
        preserveDrawingBuffer: true, // Ensures that a canvas with a webgl context can be saved via toDataUrl
        transparent: true,
        view: document.getElementById('viewport')
      },
      worldOptions: {
        gravity
      }
    });
    logger = log4js.getLogger('simulationWorld[' + parcourOptions.wokerId + ']');
    this.world.defaultContactMaterial.friction = friction;
    this.world.defaultContactMaterial.frictionRelaxation = relaxation;
    this.world.defaultContactMaterial.relaxation = relaxation;
    this.world.defaultContactMaterial.stiffness = 10000;
    this.world.defaultContactMaterial.frictionStifness = 10000;
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
    this.tickCount = 0;
    this.positionLastEvaluation = Map();
    this.phenotypeToGenotype = Map();
  }

  createParcour(parcour) {
    const parcourGenerator = new ParcourGenerator();
    parcourGenerator.createParcour(this, parcour);
    if (!trackBestIndividual) {
      this.trackedBody = parcourGenerator.trackMe;
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
    this.phenoTypes = this.population.individuals.take(takeN).map((genotype) => {
      const individual = new Individual(this, genotype);
      this.positionLastEvaluation = this.positionLastEvaluation.set(individual, view(lensBodyXpos, individual));
      this.phenotypeToGenotype = this.phenotypeToGenotype.set(individual, genotype);
      return individual;
    });
    info(logger, 'drawn ' + this.phenoTypes.size + ' phenoTypes');
    if (trackBestIndividual) {
      const trackedIndividual = this.phenoTypes.get(0);
      this.trackedBody = trackedIndividual.bodies[0];
    }

  }

  addNewPopulation(population) {
    this.population = population;
    this.clear();
    this.reset();
    this.drawPhenotypes();
  }

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
      } else {
        this.positionLastEvaluation = this.positionLastEvaluation.set(individual, posCurEvaluation);
      }
    });
    this.phenoTypes = this.phenoTypes.filterNot((individual) => removeElements.includes(individual));
    this.recordFitness(removeElements);
    if (this.phenoTypes.size === 0) {
      // If there are no more individuals remaining in the simulation, end the run
      this.runOver = true;
    } else if (trackBestIndividual) {
      // Track always the individual which is leading
      const trackedIndividual = this.phenoTypes.maxBy((individual) => view(lensBodyXpos, individual));
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
    this.createParcour(this.parcourOptions.parcour);
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

          if (this.currentTime === WORLD_START_TIME + stepTime) {
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
    const maxSubSteps = 20;

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

      const scaledPPU = ppu * deviceScale;

      containerPosition.x = ((trackedBodyOffset[0] + 1) * renderer.width * 0.5) - (trackedBodyPosition[0] * scaledPPU);
      if (trackY) {
        containerPosition.y = ((trackedBodyOffset[1] + 1) * renderer.height * 0.5) + trackedBodyPosition[1] * scaledPPU;
      } else {
        containerPosition.y = ((0 + 1) * renderer.height * 0.5) + (0 * scaledPPU);
      }
    }
  }

  addGameObject(gameObject) {
    this.gameObjects.push(gameObject);
  }

}
