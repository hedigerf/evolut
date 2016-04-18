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
      this.appendToReport(pathToReport, this.createGraphCoordStr(population.generationCount, best.fitness));
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
      this.appendToReport(pathToReport, this.createGraphCoordStr(population.generationCount, averageFitness));
    };
    return reporterFunction;
  }

  static createGenotypeBlueprintReport() {
    const reportName = 'genotype_blue_print_report';
    const pathToReport = this.createReportFile(reportName);
    const reporterFunction = (population)  => {
      this.appendToReport(pathToReport, JSON.stringify(population) + '\n');
    };
    return reporterFunction;
  }

  static createReports() {
    const reportingFunctionList = List.of(this.createFitnessGraphAveragerReport(), this.createFitnessGraphBestReport(), this.createGenotypeBlueprintReport());
    return (population) => {
      reportingFunctionList.forEach((reportingFunction) => reportingFunction(population));
    };
  }

  static createGraphCoordStr(x, y) {
    return '(' + x + ',' +  y + ')';
  }

  static appendToReport(pathToReport, str) {
    fs.appendFile(pathToReport, str,  (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
