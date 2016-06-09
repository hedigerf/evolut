import { createTimePrefix, report } from '../util/path';
import { List, Range } from 'immutable';
import DiversityCalculator from './diversityCalculator';
import fs from 'graceful-fs';
/**
 * Responsible for creating and handling reports.
 */
export default class Reporter {
  /**
   * [Creates the ReportFile an returns the path of it]
   * @param  {string} reportName [the name of the report]
   * @param  {string} prefix     [optional parameter, defaulted to current time]
   * @return {string}            [the file path]
   */
  static createReportFile(reportName, prefix = createTimePrefix()) {

    const fileName = prefix + '_' + reportName + '.txt';
    const filePath = report(fileName);

    fs.writeFile(filePath, '', (err) => {
      if (err) {
        throw err;
      }
    });
    return filePath;
  }
  /**
   * Creates the FitnessGrapBestReport
   * @return {Function} [function which is able to append to the report file]
   */
  static createFitnessGraphBestReport() {
    const reportName = 'fitness_graph_best_report';
    const pathToReport = this.createReportFile(reportName);
    const reporterFunction = (population) => {
      const best =  List(population.individuals).maxBy((individual) => individual.fitness);
      this.appendToReport(pathToReport, this.createGraphCoordStr(population.generationCount, best.fitness));
    };
    return reporterFunction;
  }
  /**
   * Creates the FitnessGraphAveragerReport
   * @return {Function} [function which is able to append to the report file]
   */
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
  /**
   * Creates the FitnessGraphAveragerReportBodyPoints
   * @return {Function} [function which is able to append to the report file]
   */
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
  /**
   * Creates the genotypeBlueprintREport
   * @return {Function} [function which is able to append to the report file]
   */
  static createGenotypeBlueprintReport() {
    const prefix = createTimePrefix();
    const reportBaseName = 'genotype_blue_print_report';
    const reportName = reportBaseName + '_0';
    let pathToReport = this.createReportFile(reportName, prefix);
    const reporterFunction = (population)  => {
      if (population.generationCount % 20 === 0) {
        const newReportName = reportBaseName + '_' + (population.generationCount / 20);
        pathToReport = this.createReportFile(newReportName, prefix);
      }
      this.appendToReport(pathToReport, JSON.stringify(population) + '\n');
    };
    return reporterFunction;
  }
  /**
   * Creates the diveristyReport
   * @return {Function} [function which is able to append to the report file]
   */
  static createDiversityReport() {
    const reportName = 'diversity_report';
    const pathToReport = this.createReportFile(reportName);
    const reporterFunction = (population) => {
      const diversity = DiversityCalculator.calculate(population);
      this.appendToReport(pathToReport, this.createGraphCoordStr(population.generationCount, diversity));
    };
    return reporterFunction;
  }
  /**
   * Creates all reports
   * @return {[type]} [function which is able to append to all report files]
   */
  static createReports() {
    const reportingFunctionList = List.of(
      this.createFitnessGraphAveragerReport('fitness_graph_average_report'),
      this.createFitnessGraphBestReport(), this.createGenotypeBlueprintReport(),
      this.createFitnessGraphAveragerReportBodyPoints(), this.createDiversityReport());
    return (population) => {
      reportingFunctionList.forEach((reportingFunction) => reportingFunction(population));
    };
  }
  /**
   * Creates a string which represents a coordinate
   * @param  {string} x [y-cord.]
   * @param  {string} y [x-cord.]
   * @return {string}   [coordinate as string]
   */
  static createGraphCoordStr(x, y) {
    return '(' + x + ',' +  y + ')';
  }
  /**
   * Appends a string to a report
   * @param  {string} pathToReport [path to the report]
   * @param  {string} str          [string to append]
   */
  static appendToReport(pathToReport, str) {
    fs.appendFile(pathToReport, str,  (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
