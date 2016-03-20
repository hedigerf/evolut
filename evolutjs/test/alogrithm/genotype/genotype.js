'use strict';

import chai from 'chai';
import chaiFuzzy from 'chai-fuzzy';
import chaiImmutable from 'chai-immutable';

import Genotype, { PartialGenotype } from '../../../src/algorithm/genotype/genotype';

chai.use(chaiFuzzy);
chai.use(chaiImmutable);

// jshint -W030

describe('Genotype', () => {
  describe('seed', () => {
    it('should have no parts', () => {
      chai.expect(Genotype.parts).to.be.empty;
    });
  });
});

describe('PartialGenotype', () => {
  describe('identifier', () => {
    it('should have an empty identifier', () => {
      chai.expect(PartialGenotype.identifier).to.be.empty;
    });
  });
  describe('seed', () => {
    it('should have no parts', () => {
      chai.expect(PartialGenotype.parts).to.be.empty;
    });
  });
});
