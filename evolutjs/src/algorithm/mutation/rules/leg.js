/**
 * Provides mutation rules for a body.
 *
 * @module algorithm/mutation/rules/body
 * @see algorithm/mutation/rule
 */

import Leg from '../../individual/leg';
import { map } from 'ramda';
import MutationRule from '../rule';

const PROBABILITY_LEG_HEIGHT = 0.1;
const PROBABILITY_LEG_HEIGHT_FACTOR = 0.1;
const PROBABILITY_LEG_WIDTH = 0.1;

const MUTATION_STEP_LEG_HEIGHT = 0.05;
const MUTATION_STEP_LEG_HEIGHT_FACTOR = 0.05;
const MUTATION_STEP_LEG_WIDTH = 0.01;

/**
 * Represents a mutation rule for a body.
 *
 * @extends {MutationRule}
 */
export default class LegMutationRule extends MutationRule {

  /**
   * Mutates a body.
   *
   * @protected
   * @param {Genotype} genotype
   * @return {Genotype}
   */
  mutate(genotype) {

    const body = genotype.body;

    body.bodyPoints = this.tryMutateBodyPoints(body.bodyPoints, body.bodyPointsCount);
    body.hipJointPositions = this.tryMutateHipJoints(body.bodyPoints, body.hipJointPositions);

    return genotype;
  }

  /**
   * Mutates legs.
   *
   * @protected
   * @param {Array<Leg>} legs
   * @return {Array<Leg>}
   */
  tryMutateLegs(legs) {

    const m = (p, s) => (v) => {
      if (this.shouldMutate(p)) {
        return this.mutateNumeric(v, s);
      }
      return v;
    };

    return map(({ hipJoint, leg }) => {

      const height = m(PROBABILITY_LEG_HEIGHT, MUTATION_STEP_LEG_HEIGHT, leg.height);
      const heightFactor = m(PROBABILITY_LEG_HEIGHT_FACTOR, MUTATION_STEP_LEG_HEIGHT_FACTOR, leg.heightFactor);
      const width = m(PROBABILITY_LEG_WIDTH, MUTATION_STEP_LEG_WIDTH, leg.width);

      return {
        leg: new Leg({
          mass: leg.mass,
          height,
          heightFactor,
          width
        }),
        joint: hipJoint
      };

    }, legs);
  }

}
