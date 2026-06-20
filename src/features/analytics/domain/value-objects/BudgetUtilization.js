export class BudgetUtilization {
  constructor(value, budgetLimit) {
    this.value = typeof value === 'string' ? parseFloat(value.replace(',', '')) : (value || 0);
    this.budgetLimit = typeof budgetLimit === 'string' ? parseFloat(budgetLimit.replace(',', '')) : (budgetLimit || 1);
  }

  get percentage() {
    return (this.value / this.budgetLimit) * 100;
  }

  isOverBudget(threshold = 90) {
    return this.percentage > threshold;
  }

  isNearLimit(threshold = 75) {
    return this.percentage > threshold && this.percentage <= 90;
  }

  equals(other) {
    return other instanceof BudgetUtilization &&
      this.value === other.value &&
      this.budgetLimit === other.budgetLimit;
  }

  toString() {
    return `${this.percentage.toFixed(1)}%`;
  }
}
