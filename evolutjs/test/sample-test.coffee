chai = require 'chai';

describe 'Array', ->
    describe '#indexOf()', ->
        it 'should return -1 when the value is not present', ->
            chai.assert.equal -1, [1, 2, 3].indexOf 5
            chai.assert.equal -1, [1, 2, 3].indexOf 0

        it 'should not return -1 when the value is present', ->
            chai.assert.notEqual -1, [1, 2, 3].indexOf 3
            chai.assert.notEqual -1, [1, 2, 3].indexOf 2
