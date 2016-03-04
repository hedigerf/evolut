'use strict';

import log4js from 'log4js';

const logger = log4js.getLogger('Leg');


export default class Leg{

  constructor(heightLeg, heightThigh, heightShank, jointBody, jointFlank,mass) {
    this.heightLeg = heightLeg;
    this.heightThigh = heightThigh;
    this.heightShank = heightShank;
    this.jointBody = jointBody;
    this.jointFlank = jointFlank;
    this.mass = mass;
    logger.debug('Leg created.');
  }

}
