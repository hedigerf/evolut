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
import { getLogger } from '../../app/log';
import Individual from '../object/individual/individual';
import { info } from '../../util/logUtil';
import ParcourGenerator from '../object/parcour/parcourCreator';
import { texture } from '../../util/path';
import { view } from 'ramda';

/**
 * World start time.
 *
 * @type {Number}
 */
const WORLD_START_TIME = 0;

/**
 * Simulation configuration.
 *
 * @type {Object}
 */
const simulation = config('simulation');

/**
 * Lens to the x-position of a body.
 *
 * @type {Lens}
 */
const lensBodyXpos = L.compose(L.prop('bodies'), L.index(0), L.prop('position'), L.index(0));

/**
 * The logger of the current worker.
 *
 * @type {Logger}
 */
let logger;

/**
 * Responsible for simulating one simulation run.
 *
 * @extends {P2Pixi.Game}
 */
export default class SimulationWorld extends Game {

  /**
   * Constructs a simulation world.
   *
   * @param {Object} parcourOptions The options for the parcour
   * @param {Population} population The current population
   * @param {Function} cb This callback is fired when the simulation is over
   */
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
        gravity: simulation.gravity
      }
    });
    logger = getLogger('SimulationWorld', parcourOptions.workerId);
    this.world.defaultContactMaterial.friction = simulation.friction.friction;
    this.world.defaultContactMaterial.frictionRelaxation = simulation.friction.relaxation;
    this.world.defaultContactMaterial.frictionStifness = simulation.friction.stiffness;
    this.world.defaultContactMaterial.relaxation = simulation.relaxation;
    this.world.defaultContactMaterial.stiffness = simulation.stiffness;
    this.population = population;
    this.parcourOptions = parcourOptions;
    this.cb = cb;
    this.isRenderingEnabled = simulation.render;
    this.reset();
  }

  /**
   * Reset the world.
   * Sets the time to 0.
   */
  reset() {
    this.currentTime = WORLD_START_TIME;
    this.phenotypeToGenotype = Map();
    this.positionLastEvaluation = Map();
    this.runOver = false;
    this.stepTime = simulation.stepTime;
    this.tickCount = 0;
    this.world.solver.iterations = simulation.solver.iterations;
    this.world.solver.tolerance = simulation.solver.tolerance;
  }

  /**
   * Creates a new parcour for this world.
   *
   * @param {Object} parcour
   */
  createParcour(parcour) {
    const parcourGenerator = new ParcourGenerator();
    parcourGenerator.createParcour(this, parcour);
    if (!simulation.trackBestIndividual) {
      this.trackedBody = parcourGenerator.trackMe;
    }
  }

  /**
   * Draws the pheotypes of the current population.
   */
  drawPhenotypes() {

    const takeN = simulation.solo && 1 || this.population.individuals.size;

    // Force evaluation of sequenc
    this.phenoTypes = this.population.individuals.take(takeN).map((genotype) => {
      const individual = new Individual(this, genotype);
      this.positionLastEvaluation = this.positionLastEvaluation.set(individual, view(lensBodyXpos, individual));
      this.phenotypeToGenotype = this.phenotypeToGenotype.set(individual, genotype);
      return individual;
    });
    info(logger, 'drawn ' + this.phenoTypes.size + ' phenoTypes');
    if (simulation.trackBestIndividual) {
      const trackedIndividual = this.phenoTypes.get(0);
      this.trackedBody = trackedIndividual.bodies[0];
    }

  }

  /**
   * Adds a new population to this world.
   * The old population is removed and the world will be reset.
   *
   * @param {Population} population The new population
   */
  addNewPopulation(population) {
    this.population = population;
    this.clear();
    this.reset();
    this.drawPhenotypes();
  }

  /**
   * Evaluates the current population.
   */
  evaluate() {
    let removeElements = List();
    this.phenoTypes.forEach((individual) => {
      const posLastEvaluation = this.positionLastEvaluation.get(individual);
      const posCurEvaluation = view(lensBodyXpos, individual);
      const delta = posCurEvaluation - posLastEvaluation;
      if (simulation.timeOut && simulation.mustMovement >= delta) {
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
    } else if (simulation.trackBestIndividual) {
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
      if (this.tickCount % simulation.evaluateAfterTickCount === 0) {
        // Perform evulation after tickCount is reached
        this.evaluate();
      }

      this.currentTime += this.stepTime;
      if (simulation.runDuration <= this.currentTime) {

        this.evaluate();
        this.runOver = true;
        info(logger, 'Simulation run ended.');

      } else {
        this.phenoTypes.forEach(this.performEngineStep, this);
      }
    });
  }

  /**
   * Performs a step of the engine of an individual.
   *
   * @protected
   * @param  {Individual} individual The individual
   */
  performEngineStep(individual) {
    if (this.currentTime === WORLD_START_TIME + this.stepTime) {
      Engine.initialStep(individual);
    } else {
      Engine.step(individual, this);
    }
  }

  /**
   * Begins the world step / render loop
   */
  run() {

    const self = this;
    const maxSubSteps = 20;

    self.lastWorldStepTime = self.time();

    /**
     * Step forward in the simulation.
     */
    function update() {
      if (!self.runOver) {

        if (!self.paused) {
          const time = self.time();
          const timeSinceLastCall = time - self.lastWorldStepTime;
          self.lastWorldStepTime = time;
          self.world.step(self.stepTime, timeSinceLastCall, maxSubSteps);

          // emit ascent/descent
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
      if (simulation.trackY) {
        containerPosition.y = ((trackedBodyOffset[1] + 1) * renderer.height * 0.5) + trackedBodyPosition[1] * scaledPPU;
      } else {
        containerPosition.y = renderer.height * 0.5;
      }
    }
  }

}
