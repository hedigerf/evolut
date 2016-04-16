import { debug, info } from '../util/logUtil';
import config from './config';
import io from 'socket.io-client';
import log4js from 'log4js';

const logger = log4js.getLogger('slave');
const masterAdress = config('cluster.master-adress');
const workerCount = config('workers.count');


export default class Slave {

  connect() {
    debug(logger, 'try connecting to the master...');
    const socket = io.connect(masterAdress, {'connect timeout': 1000});
    socket.on('connect', () => {
      debug(logger, 'connected to master');
      socket.emit('slave_registration', { slaveWorkerCount: workerCount });
      socket.on('slave_registration', ({ populationSize }) => {
        debug(logger, 'Received from master populationSize: ' + populationSize);
      });
    });
      // Global events are bound against socket
    socket.on('connect_failed', () => {
      debug(logger, 'connection failed.');
    });
  }
}
