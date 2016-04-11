import { createTimePrefix, report } from '../util/path';
import fs from 'graceful-fs';
import { List } from 'immutable';

export default class Reporter {

  static createReportFile(reportName) {

    const fileName = createTimePrefix() + '_' + reportName + '.txt';
    const filePath = report(fileName);

    fs.writeFile(filePath, '', (err) => {
      if (err) {
        throw err;
      }
    });
    return filePath;
  }

  static createFitnessGraphBestReport() {
    const reportName = 'fitness_graph_best_report';
    const pathToReport = this.createReportFile(reportName);
    const reporterFunction = (population) => {
      const best =  List(population.individuals).maxBy((individual) => individual.fitness);
      this.appendToReport(pathToReport, population.generationCount, best.fitness);
    };
    return reporterFunction;
  }

  static createFitnessGraphAveragerReport() {
    const reportName = 'fitness_graph_average_report';
    const pathToReport = this.createReportFile(reportName);
    const reporterFunction = (population)  => {
      const individuals = List(population.individuals);
      const totalFitness = individuals.reduce((total, individual) => total + individual.fitness, 0);
      const averageFitness = totalFitness / individuals.size;
      this.appendToReport(pathToReport, population.generationCount, averageFitness);
    };
    return reporterFunction;
  }

  static createReports() {
    const reportingFunctionList = List.of(this.createFitnessGraphAveragerReport(), this.createFitnessGraphBestReport());
    return (population) => {
      reportingFunctionList.forEach((reportingFunction) => reportingFunction(population));
    };
  }

  static appendToReport(pathToReport, x, y) {
    fs.appendFile(pathToReport, '(' + x + ',' +  y + ')',  (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
