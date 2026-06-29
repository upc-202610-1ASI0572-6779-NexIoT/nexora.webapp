import { defineStore } from 'pinia';
import { ReportRepositoryImpl } from '../../infrastructure/repositories/ReportRepositoryImpl';
import { GetConsumptionReportUseCase } from '../../application/use-cases/GetConsumptionReportUseCase';

const reportRepository = new ReportRepositoryImpl();
const getConsumptionReportUseCase = new GetConsumptionReportUseCase(reportRepository);

export const useReportsStore = defineStore('reports', {
  state: () => ({
    consumption: null,
    chartData: {
      months: [],
      energy: [],
      gas: []
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
        this.chartData = data.chartData;
        this.propertyBreakdown = data.propertyBreakdown;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
