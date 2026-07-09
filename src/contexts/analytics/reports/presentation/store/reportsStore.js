import { defineStore } from 'pinia';
import { ReportRepositoryImpl } from '../../infrastructure/repositories/ReportRepositoryImpl';
import { GetConsumptionReportUseCase } from '../../application/use-cases/GetConsumptionReportUseCase';

const reportRepository = new ReportRepositoryImpl();
const getConsumptionReportUseCase = new GetConsumptionReportUseCase(reportRepository);

export const useReportsStore = defineStore('reports', {
  state: () => ({
    consumption: null,
    hasElectricityLinked: false,
    hasGasLinked: false,
    hasWaterLinked: false,
    chartData: {
      months: [],
      energy: [],
      gas: [],
      water: []
    },
    propertyBreakdown: [],
    selectedMonths: 6,
    isLoading: false
  }),
  getters: {
    consumptionSummary: (state) => {
      if (!state.consumption) {
        return {
          estimatedCost: 0,
          totalElectricity: 0,
          totalGas: 0,
          budgetLimit: 0,
          budgetPercent: 0
        };
      }
      return {
        estimatedCost: state.consumption.projectedCosts?.value || 0,
        totalElectricity: state.consumption.energy?.value || 0,
        totalGas: state.consumption.gas?.value || 0,
        budgetLimit: state.consumption.projectedCosts?.budgetLimit || 0,
        budgetPercent: state.consumption.projectedCosts?.budgetPercent || 0
      };
    }
  },
  actions: {
    async fetchReportsData(months) {
      if (months !== undefined) {
        this.selectedMonths = months;
      }
      this.isLoading = true;
      try {
        const data = await getConsumptionReportUseCase.execute(this.selectedMonths);
        this.consumption = data.consumption;
        this.hasElectricityLinked = data.hasElectricityLinked;
        this.hasGasLinked = data.hasGasLinked;
        this.hasWaterLinked = data.hasWaterLinked;
        this.chartData = data.chartData;
        this.propertyBreakdown = data.propertyBreakdown;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
