import { ConsumptionReport, PropertyBreakdown } from '../../domain/entities/Report';

export class ReportMapper {
  static toConsumptionDomain(raw) {
    return new ConsumptionReport({
      energy: raw.energy,
      gas: raw.gas,
      projectedCosts: {
        value: parseFloat(raw.projectedCosts.value.replace(',', '')),
        budgetLimit: parseFloat(raw.projectedCosts.budgetLimit.replace(',', '')),
        budgetPercent: raw.projectedCosts.budgetPercent
      }
    });
  }

  static toPropertyBreakdownDomain(raw) {
    return new PropertyBreakdown({
      id: raw.id,
      name: raw.name,
      location: raw.location,
      energy: raw.energy,
      gas: raw.gas,
      status: raw.status
    });
  }
}
