export class ConsumptionReport {
  constructor({ energy, gas, projectedCosts }) {
    this.energy = energy;
    this.gas = gas;
    this.projectedCosts = projectedCosts;
  }

  get budgetUtilization() {
    return (this.projectedCosts.value / this.projectedCosts.budgetLimit) * 100;
  }

  isOverBudget() {
    return this.budgetUtilization > 90;
  }
}

export class PropertyBreakdown {
  constructor({ id, name, location, energy, gas, status }) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.energy = energy;
    this.gas = gas;
    this.status = status;
  }

  get totalConsumption() {
    return this.energy + this.gas;
  }
}
