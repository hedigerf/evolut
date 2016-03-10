import log4js from 'log4js';

const logger = log4js.getLogger('SelectionStrategy');
/**
 *Base class for selection strategy
 */
export class SelectionStrategy{

  constructor(population) {
    this.population = population;
  }

  select() {
    return this.population;
  }

}
