export class UsageLimit {
  constructor({ activeDevices, activeDevicesLimit, dataProcessing, dataProcessingLimit, resetDays, remainingPercentage }) {
    this.activeDevices = activeDevices;
    this.activeDevicesLimit = activeDevicesLimit;
    this.dataProcessing = dataProcessing;
    this.dataProcessingLimit = dataProcessingLimit;
    this.resetDays = resetDays;
    this.remainingPercentage = remainingPercentage;
  }

  getActiveDevicesPercentage() {
    return Math.round((this.activeDevices / this.activeDevicesLimit) * 100);
  }

  getDataProcessingPercentage() {
    return Math.round((this.dataProcessing / this.dataProcessingLimit) * 100);
  }

  getActiveDevicesLabel() {
    return `${this.activeDevices.toLocaleString()} / ${this.activeDevicesLimit.toLocaleString()}`;
  }

  getDataProcessingLabel() {
    return `${this.dataProcessing.toFixed(1)} TB / ${this.dataProcessingLimit.toFixed(1)} TB`;
  }

  getCycleSummary() {
    return `Your cycle resets in ${this.resetDays} days. You have ${this.remainingPercentage}% of your volume remaining.`;
  }
}
