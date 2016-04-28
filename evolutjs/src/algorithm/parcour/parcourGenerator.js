import { List, Range } from 'immutable';
import log4js from 'log4js';
import random from '../../util/random';

const logger = log4js.getLogger('ParcourGenerator');


export default class ParcourGenerator {

  static createMontains(length, maxSlope, highestY) {
    const range = Range(0, length);
    const record = { lastY: 0, heights: List.of() };
    const res = range.reduce((result) => {
      const y = this.toHeight(result.lastY, maxSlope, highestY);
      return { lastY: y, heights: result.heights.push(y) };
    }, record);
    const start = List.of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const heights = start.concat(res.heights).toArray();
    return { type: 'mountain', value: heights };
  }

  /**
   * Returns a height for an element in a height field
   *
   * @param {Number} y Height field index
   * @param {Number} maxSlope
   * @param {Number} highestY
   * @return {Number}
   */
  static toHeight(y, maxSlope, highestY) {
    const positive = random.integer(0, 1);
    if (positive === 1) {
      const newY = y + random.real(0, maxSlope, true);
      // If highestY is reached generate a flat top
      if (newY > highestY) {
        return y;
      }
      return newY;
    }
    const newY = y + random.real(-maxSlope, 0);
    // Same for highest negative Y
    if (newY < (highestY * -1)) {
      return y;
    }
    return newY;
  }
  /**
   * Generates the parcour
   * @param  {[type]} maxSlope [description]
   * @param  {[type]} highestY [description]
   * @return {List<Object>}          the generated parcour
   */
  static generateParcour(maxSlope, highestY) {
    if (logger.isDebugEnabled()) {
      logger.debug('ParcourGenerator has started.');
    }
    const mountain = this.createMontains(300, maxSlope , highestY);
    if (logger.isDebugEnabled()) {
      logger.debug('Parcourgeneration ended.');
    }
    return [mountain];
  }


}
