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
import Mutator from '../algorithm/mutation/mutator';
import TournamentBasedSelectionStrategy from '../algorithm/selection/tournamentBasedSelectionStrategy';


const logger = log4js.getLogger('applicationController');
const index = 'file://' + appRoot + '/index.html';
const workerCount = config('workers.count');
const populationSize = config('algorithm.populationSize');
const partialPopulationSize = populationSize / workerCount;
const bodyPointsMin = 4;
const bodyPointsMax = 8;
const kTournamentBasedSelection = 10;

let workers = null;
let finishedWorkCounter = 0;
let generationCounter = 1;

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

function distributeInitialWork(initialPopulation, worker, index) {
  worker.webContents.on('did-finish-load', () => {
    distributeWork(initialPopulation, worker, index);
  });
}

function distributeWork(population, worker, index) {
  const start = index * partialPopulationSize;
  const end = (index + 1) * partialPopulationSize;
  const partialPopulation = population.individuals.slice(start, end);
  const stringified = partialPopulation.toArray().map(x => x.blueprint());
  worker.webContents.send('receive-work', stringified, population.generationCount);
}

function performSimulationPostprocessing(population) {
  info(logger, 'starting postprocessing');
  const selectionStrategy = new TournamentBasedSelectionStrategy(population, kTournamentBasedSelection);
  const selected = selectionStrategy.select();
  const mutator = new Mutator();
  const mutated = mutator.mutate(selected);
  debug(logger, 'selected individuals size: ' + selected.individuals.size);
  return mutated;
}

let individuals = List();
ipcMain.on('work-finished', (event, individualsStringified) => {
  finishedWorkCounter++;
  const partialPopulation = individualsStringified.map(x => JSON.parse(x));
  individuals = individuals.concat(partialPopulation);
  if (finishedWorkCounter % workerCount === 0) {
    generationCounter
    const population = { individuals, generationCount: generationCounter++};
    const mutated = performSimulationPostprocessing(population);
    const distributor = curry(distributeWork)(mutated);
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
  const distributor = curry(distributeInitialWork)(initialPopulation);
  workers.forEach(distributor);


});
