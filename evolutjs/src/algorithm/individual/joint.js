'use strict';

import log4js from 'log4js';

const logger = log4js.getLogger('Joint');


export default class Leg{

  constructor(angleFront,angleBack) {
    this.angleFront = angleFront;
    this.angleBack = angleBack;
    logger.debug('Joint created.');
  }

}
