import { createTimePrefix, report } from '../util/path';
import fs from 'graceful-fs';
import { List, Range } from 'immutable';

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

  static createFitnessGraphAveragerReport(reportName) {
    const pathToReport = this.createReportFile(reportName);
    const reporterFunction = (population)  => {
      const individuals = List(population.individuals);
      const totalFitness = individuals.reduce((total, individual) => total + individual.fitness, 0);
      const averageFitness = totalFitness / individuals.size;
      this.appendToReport(pathToReport, this.createGraphCoordStr(population.generationCount, averageFitness));
    };
    return reporterFunction;
  }

  static createFitnessGraphAveragerReportBodyPoints() {
    const bpRange = List(Range(4, 9));
    const reporterFunctions = bpRange.map((bpCount) =>
      this.createFitnessGraphAveragerReport('fitness_graph_average_bp' + bpCount + '_report'));
    const f = (population) => {
      const individuals = List(population.individuals);
      const groupedBy = individuals.groupBy((individual) => individual.body.bodyPointsCount);
      reporterFunctions.forEach((reporterFunction, index) =>
       reporterFunction({ individuals: groupedBy.get(index + 4), generationCount: population.generationCount}));
    };
    return f;
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
    const reportingFunctionList = List.of(
      this.createFitnessGraphAveragerReport('fitness_graph_average_report'),
      this.createFitnessGraphBestReport(), this.createGenotypeBlueprintReport(),
      this.createFitnessGraphAveragerReportBodyPoints());
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
