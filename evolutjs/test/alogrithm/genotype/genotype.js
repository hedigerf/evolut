/* eslint-env mocha */

import Genotype, { PartialGenotype } from '../../../src/algorithm/genotype/genotype';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);

describe('Genotype', () => {

  describe('build', () => {
    it('should be buildable', () => {
      chai.expect(Genotype).itself.to.respondTo('build');
    });
  });

  describe('mutate', () => {
    it('should be mutatable', () => {
      chai.expect(new Genotype()).to.respondTo('mutate');
    });
  });

  describe('seed', () => {
    it('should be seedable', () => {
      chai.expect(Genotype).itself.to.respondTo('seed');
    });
    it('should have no parts', () => {
      chai.expect(Genotype.parts).to.be.empty;
    });
  });

});

describe('PartialGenotype', () => {

  describe('identifier', () => {
    it('should have an empty identifier', () => {
      chai.expect(PartialGenotype.identifier).to.equal('');
    });
  });

  describe('seed', () => {
    it('should have no parts', () => {
      chai.expect(PartialGenotype.parts).to.be.empty;
    });
  });

});
