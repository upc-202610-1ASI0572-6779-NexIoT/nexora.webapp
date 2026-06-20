import { DomainEvent } from '@/shared/domain/DomainEvent';

export class ReportGenerated extends DomainEvent {
  constructor(reportType, period) {
    super();
    this.name = 'ReportGenerated';
    this.reportType = reportType;
    this.period = period;
  }
}
