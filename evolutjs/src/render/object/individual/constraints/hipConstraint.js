'use strict';

import p2 from 'p2';


export default class HipConstraint extends p2.RevoluteConstraint {

  update() {
    var bodyA =  this.bodyA,
        bodyB =  this.bodyB,
        pivotA = this.pivotA,
        pivotB = this.pivotB,
        eqs =    this.equations,
        normal = eqs[0],
        tangent= eqs[1],
        x = eqs[0],
        y = eqs[1],
        upperLimit = this.upperLimit,
        lowerLimit = this.lowerLimit,
        upperLimitEquation = this.upperLimitEquation,
        lowerLimitEquation = this.lowerLimitEquation;

    const relAngle = this.angle = bodyB.angle - bodyA.angle;

    if (this.upperLimitEnabled && relAngle > upperLimit) {
      this.upperLimitEquation.angle = upperLimit;
      if (eqs.indexOf(upperLimitEquation) === -1) {
        this.eqs.push(upperLimitEquation);
      }
    } else {
      var idx = eqs.indexOf(upperLimitEquation);
      if (idx !== -1) {
        this.eqs.splice(idx, 1);
      }
    }

    if (this.lowerLimitEnabled && relAngle < lowerLimit) {
      this.lowerLimitEquation.angle = lowerLimit;
      if (eqs.indexOf(lowerLimitEquation) === -1) {
        this.eqs.push(lowerLimitEquation);
      }
    } else {
      const idx = eqs.indexOf(lowerLimitEquation);
      if (idx !== -1) {
        this.eqs.splice(idx, 1);
      }
    }
  }
}
