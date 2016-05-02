/**
 * Provides mutation rules for a body.
 *
 * @module algorithm/mutation/rules/body
 * @see algorithm/mutation/rule
 */

import { defaultTo, mapObjIndexed } from 'ramda';
import Leg from '../../individual/leg';
import MutationRule from '../rule';

/**
 * @typedef {Object} LegMutationOption
 * @property {Object} height
 * @property {Number} height.probability
 * @property {Number} height.step
 * @property {Object} heightFactor
 * @property {Number} heightFactor.probability
 * @property {Number} heightFactor.step
 * @property {Object} width
 * @property {Number} width.probability
 * @property {Number} width.step
 */

/**
 * Represents a mutation rule for a body.
 *
 * @extends {MutationRule}
 */
export default class LegMutationRule extends MutationRule {

  /**
   * Return the option transformation.
   *
   * @return {LegMutationOption} The transformation
   */
  static get transformation() {

    const defaultProbability = defaultTo(0.1);
    const defaultStep = defaultTo(0.05);

    return {
      height: {
        probability: defaultProbability,
        step: defaultStep
      },
      heightFactor: {
        probability: defaultProbability,
        step: defaultStep
      },
      width: {
        probability: defaultProbability,
        step: defaultTo(0.1)
      }
    };
  }

  /**
   * Mutates a body.
   *
   * @protected
   * @param {Genotype} genotype
   * @return {Genotype}
   */
  mutate(genotype) {

    const mutated = super.mutate(genotype);

    mutated.legs = this.tryMutateLegs(mutated.legs);

    return mutated;
  }

  /**
   * Mutates legs.
   *
   * @protected
   * @param {Array<Leg>} legs
   * @return {Array<Leg>}
   */
  tryMutateLegs(legs) {

    const self = this;

    const mutateProperty = (o) => (v) => {
      if (self.shouldMutate(o.probability)) {
        return self.mutateNumeric(v, o.step);
      }
      return v;
    };

    const mutateHeight = mutateProperty(self.options.height);
    const mutateHeightFactor = mutateProperty(self.options.heightFactor);
    const mutateWidth = mutateProperty(self.options.width);

    const mutateLegs = mapObjIndexed(({ hipJoint, leg }) => {

      return {
        leg: new Leg({
          mass: leg.mass,
          height: mutateHeight(leg.height),
          heightFactor: mutateHeightFactor(leg.heightFactor),
          width: mutateWidth(leg.width)
        }),
        joint: hipJoint
      };

    });

    return mutateLegs(legs);
  }

}
