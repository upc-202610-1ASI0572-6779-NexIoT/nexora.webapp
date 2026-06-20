import { ConsumptionReport, PropertyBreakdown } from '../../domain/entities/Report';

export class ReportMapper {
  static toConsumptionDomain(raw) {
    return new ConsumptionReport({
      energy: raw.energy,
      gas: raw.gas,
      projectedCosts: {
        value: typeof raw.projectedCosts.value === 'string' ? parseFloat(raw.projectedCosts.value.replace(',', '')) : raw.projectedCosts.value,
        budgetLimit: typeof raw.projectedCosts.budgetLimit === 'string' ? parseFloat(raw.projectedCosts.budgetLimit.replace(',', '')) : raw.projectedCosts.budgetLimit,
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
