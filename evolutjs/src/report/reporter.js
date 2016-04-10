import { path as appRoot } from 'app-root-path';
import fs from 'graceful-fs';
import moment from 'moment';
import path from 'path';

export default class Reporter {

  static createReportFile() {
    const fileName = moment().format('YYYYMMDDHHmmss') + '.txt';
    const pathToFile = path.join(appRoot, 'assets/reports', path.basename(fileName));
    fs.writeFile(pathToFile, 'Hello Node', (err) => {
      if (err) {
        throw err;
      }
    });
    return pathToFile;
  }

  static appendToReport(pathToFile, population) {
    fs.appendFile(pathToFile, 'data to append', (err) => {
      if (err) {
        throw err;
      }
    });
  }

}
