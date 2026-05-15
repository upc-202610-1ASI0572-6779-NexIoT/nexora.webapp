import { defineStore } from 'pinia';
import { ReportRepositoryImpl } from '../../infrastructure/repositories/ReportRepositoryImpl';
import { GetConsumptionReportUseCase } from '../../application/use-cases/GetConsumptionReportUseCase';

const reportRepository = new ReportRepositoryImpl();
const getConsumptionReportUseCase = new GetConsumptionReportUseCase(reportRepository);

export const useReportsStore = defineStore('reports', {
  state: () => ({
    consumption: null, // ConsumptionReport entity
    chartData: {
      months: [],
      energy: [],
      gas: []
    },
    propertyBreakdown: [], // PropertyBreakdown entities
    aiInsights: [],
    isLoading: false
  }),
  actions: {
    async fetchReportsData() {
      this.isLoading = true;
      try {
        const data = await getConsumptionReportUseCase.execute();
        this.consumption = data.consumption;
        this.chartData = data.chartData;
        this.propertyBreakdown = data.propertyBreakdown;
        this.aiInsights = data.aiInsights;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
