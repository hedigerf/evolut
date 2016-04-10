/**
 * Defines the main application menu.
 * Runs within the main process.
 * The spawned window run each in a separate render process.
 *
 * @module app/app
 */

import './menu';
import { app, BrowserWindow, ipcMain } from 'electron';
import { debug, info } from '../util/logUtil';
import { List, Range } from 'immutable';
import { path as appRoot } from 'app-root-path';
import { curry } from 'ramda';
import config from './config';
import InitialPopulationGenerator from '../algorithm/population/initialPopulationGenerator';
import log4js from 'log4js';
import Reporter from '../report/reporter';
import Mutator from '../algorithm/mutation/mutator';
import ParcourGenerator from '../algorithm/parcour/parcourGenerator';
import TournamentBasedSelectionStrategy from '../algorithm/selection/tournamentBasedSelectionStrategy';


const logger = log4js.getLogger('app');
const index = 'file://' + appRoot + '/index.html';
const workerCount = config('workers.count');
const populationSize = config('algorithm.populationSize');
const partialPopulationSize = populationSize / workerCount;
const bodyPointsMin = 4;
const bodyPointsMax = 8;
const kTournamentBasedSelection = 10;
const increaseDifficultyAfter = config('parcour.increaseDifficultyAfter');
const maxSlopeStep = config('parcour.maxSlopeStep');
const highestYStep = config('parcour.highestYStep');
const limitSlope = config('parcour.limitSlope');
const reportBestFitness = Reporter.createFitnessGraphBestReport();

let workers = null;
let finishedWorkCounter = 0;
let generationCounter = 1;
let maxSlope = config('parcour.startMaxSlope');
let highestY = config('parcour.startHighestY');

function startWorker() {
  const worker = new BrowserWindow({
    width: config('window:width'),
    height: config('window:height')
  });
  worker.loadURL(index);
  worker.on('closed', () => {
    app.exit(0);
  });
  return worker;
}

function distributeInitialWork(initialPopulation, options, worker, index) {
  worker.webContents.on('did-finish-load', () => {
    distributeWork(initialPopulation, options, worker, index);
  });
}

function distributeWork(population, options, worker, index) {
  const start = index * partialPopulationSize;
  const end = (index + 1) * partialPopulationSize;
  const partialPopulation = population.individuals.slice(start, end);
  const stringified = partialPopulation.toArray().map(x => x.blueprint());
  worker.webContents.send('receive-work', stringified, population.generationCount, options);
}

function performSimulationPostprocessing(population) {
  info(logger, 'starting postprocessing');
  reportBestFitness(population);
  const selectionStrategy = new TournamentBasedSelectionStrategy(population, kTournamentBasedSelection);
  const selected = selectionStrategy.select();
  const mutator = new Mutator();
  const mutated = mutator.mutate(selected);
  debug(logger, 'selected individuals size: ' + selected.individuals.size);
  mutated.generationCount = ++generationCounter;
  return mutated;
}

function prepareDistributor(distributeWork, population) {
  const parcour = ParcourGenerator.generateParcour(maxSlope, highestY);
  const distributor = curry(distributeWork)(population, { parcour: JSON.stringify(parcour), maxSlope, highestY });
  return distributor;
}

let individuals = List();
ipcMain.on('work-finished', (event, individualsStringified) => {
  finishedWorkCounter++;
  const partialPopulation = individualsStringified.map(x => JSON.parse(x));
  individuals = individuals.concat(partialPopulation);
  if (finishedWorkCounter % workerCount === 0) {
    const population = { individuals, generationCount: generationCounter};
    const mutated = performSimulationPostprocessing(population);
    if (generationCounter % increaseDifficultyAfter === 0) {
      if (maxSlope < limitSlope) {
        maxSlope = maxSlope + maxSlopeStep;
      }
      highestY = highestY + highestYStep;
    }
    const distributor = prepareDistributor(distributeWork, mutated);
    workers.forEach(distributor);
  }
});

app.on('window-all-closed', () =>  {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  const workerRange = List(Range(0, workerCount));
  workers = workerRange.map(x =>  startWorker() );
  const initialPopulationGenerator = new InitialPopulationGenerator(
    Range(bodyPointsMin, bodyPointsMax + 1), populationSize);
  const initialPopulation = initialPopulationGenerator.generateInitialPopulation();
  const distributor = prepareDistributor(distributeInitialWork, initialPopulation)
  workers.forEach(distributor);


});
