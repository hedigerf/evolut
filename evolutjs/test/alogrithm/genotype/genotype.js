/* eslint-env mocha */

import Genotype, { PartialGenotype } from '../../../src/algorithm/genotype/genotype';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);

describe('Genotype', () => {
  describe('seed', () => {
    it('should have no parts', () => {
      chai.expect(Genotype.parts).to.be.empty;
    });
  });
});

describe('PartialGenotype', () => {
  describe('identifier', () => {
    it('should have no implementation for identifier', () => {
      chai.expect(() => PartialGenotype.identifier).to.throw(Error, 'not implemented');
    });
  });
  describe('seed', () => {
    it('should have no parts', () => {
      chai.expect(PartialGenotype.parts).to.be.empty;
    });
  });
});
