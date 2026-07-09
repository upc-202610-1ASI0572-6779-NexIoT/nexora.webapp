export class ReportCalculationService {
  static calculateBudgetUtilization(projectedCosts) {
    const value = typeof projectedCosts.value === 'string'
      ? parseFloat(projectedCosts.value.replace(',', ''))
      : projectedCosts.value;
    const budgetLimit = typeof projectedCosts.budgetLimit === 'string'
      ? parseFloat(projectedCosts.budgetLimit.replace(',', ''))
      : projectedCosts.budgetLimit;

    return (value / budgetLimit) * 100;
  }

  static isOverBudget(projectedCosts, threshold = 90) {
    return ReportCalculationService.calculateBudgetUtilization(projectedCosts) > threshold;
  }
}
