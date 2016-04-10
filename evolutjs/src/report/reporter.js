import { path as appRoot } from 'app-root-path';
import fs from 'graceful-fs';
import { List } from 'immutable';
import moment from 'moment';
import path from 'path';

export default class Reporter {

  static createReportFile(reportName) {
    const fileName = moment().format('YYYYMMDDHHmmss') + '_' + reportName + '.txt';
    const pathToFile = path.join(appRoot, 'assets/reports', path.basename(fileName));
    fs.writeFile(pathToFile, '', (err) => {
      if (err) {
        throw err;
      }
    });
    return pathToFile;
  }

  static createFitnessGraphBestReport() {
    const reportName = 'fitness_graph_best_report';
    const pathToReport = this.createReportFile(reportName);
    const reporterFunction = (population) => {
      const best =  List(population.individuals).maxBy(individual => individual.fitness);
      this.appendToReport(pathToReport, population.generationCount, best.fitness);
    };
    return reporterFunction;
  }

  static appendToReport(pathToReport, x, y) {
    fs.appendFile(pathToReport, '(' + x + ',' +  y + ')',  (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
