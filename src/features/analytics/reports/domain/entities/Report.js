import { ConsumptionValue } from '../../../domain/value-objects/ConsumptionValue';
import { BudgetUtilization } from '../../../domain/value-objects/BudgetUtilization';

export class ConsumptionReport {
  constructor({ energy, gas, projectedCosts }) {
    this.energy = energy;
    this.gas = gas;
    this.projectedCosts = projectedCosts;
    this._energyVO = new ConsumptionValue(energy);
    this._gasVO = new ConsumptionValue(gas);
    this._budgetUtil = new BudgetUtilization(projectedCosts.value, projectedCosts.budgetLimit);
  }

  get budgetUtilization() {
    return this._budgetUtil.percentage;
  }

  isOverBudget() {
    return this._budgetUtil.isOverBudget();
  }

  get energyVO() {
    return this._energyVO;
  }

  get gasVO() {
    return this._gasVO;
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

  isOptimal() {
    return this.status === 'optimal';
  }

  needsMonitoring() {
    return this.status === 'monitor' || this.status === 'high-load';
  }
}
