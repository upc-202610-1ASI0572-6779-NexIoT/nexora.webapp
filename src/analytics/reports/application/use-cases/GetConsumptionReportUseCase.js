export class GetConsumptionReportUseCase {
  constructor(reportRepository) {
    this.reportRepository = reportRepository;
  }

  async execute() {
    return await this.reportRepository.getConsumptionSummary();
  }
}
