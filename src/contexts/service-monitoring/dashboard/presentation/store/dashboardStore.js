import { defineStore } from 'pinia';
import { DashboardRepositoryImpl } from '../../infrastructure/repositories/DashboardRepositoryImpl';
import { GetDashboardStatsUseCase } from '../../application/use-cases/GetDashboardStatsUseCase';

const dashboardRepository = new DashboardRepositoryImpl();
const getDashboardStatsUseCase = new GetDashboardStatsUseCase(dashboardRepository);

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: null,
    isLoading: false
  }),
  actions: {
    async fetchStats() {
      this.isLoading = true;
      try {
        this.stats = await getDashboardStatsUseCase.execute();
      } finally {
        this.isLoading = false;
      }
    }
  }
});
