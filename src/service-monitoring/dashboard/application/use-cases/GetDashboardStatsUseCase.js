import { DashboardStats } from '../../domain/entities/DashboardStats';

export class GetDashboardStatsUseCase {
  constructor(dashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }

  async execute() {
    const data = await this.dashboardRepository.getStats();
    return new DashboardStats(data);
  }
}
