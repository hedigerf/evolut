
import Individual from '../individual/individual';
import Population from '../population/population';

export default class Mutator {

  /**
   * Mutates a given population
   *
   * @param  {Population} population to be mutated
   * @return {Population}            mutated population
   */
  mutate(population) {
    const copied = population.individuals.map(individual => {
      const offspring = new Individual(individual);
      // offspring.body.massFactor 
      return offspring;
    });
    return new Population(copied, population.generationCount + 1);
  }

}
