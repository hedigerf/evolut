import { debug, info } from '../util/logUtil';
import config from './config';
import io from 'socket.io-client';
import log4js from 'log4js';

const logger = log4js.getLogger('slave');
const masterAdress = config('cluster.masterAdress');

export default class Slave {

  connect() {
    const socket = io.connect(masterAdress);
    socket.on('connect', () => {
      socket.emit('slave_registration', { my: 'data' });
      socket.on('slave_registration', ({ populationSize }) => {
        debug(logger, 'Received from master populationSize: ' + populationSize);
      });
    });
  }
}
