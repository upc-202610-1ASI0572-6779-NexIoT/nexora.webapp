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
