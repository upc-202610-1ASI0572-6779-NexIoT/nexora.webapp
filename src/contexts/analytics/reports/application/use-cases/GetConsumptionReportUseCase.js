import { ReportGenerated } from '../../../domain/events/ReportGenerated';

export class GetConsumptionReportUseCase {
  constructor(reportRepository) {
    this.reportRepository = reportRepository;
  }

  async execute(months) {
    const result = await this.reportRepository.getConsumptionSummary(months);
    const event = new ReportGenerated('consumption', 'current');
    console.debug('[Domain Event]', event.name, event);
    return result;
  }
}
