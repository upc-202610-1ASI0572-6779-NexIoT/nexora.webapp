import { DashboardStats } from '../../domain/entities/DashboardStats';
import { AlertCreated } from '../../../domain/events/AlertCreated';

export class GetDashboardStatsUseCase {
  constructor(dashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }

  async execute() {
    const data = await this.dashboardRepository.getStats();
    const stats = new DashboardStats(data);
    if (stats.hasActiveAlerts()) {
      const alert = stats.alerts[0];
      const event = new AlertCreated(alert.id, alert.type, alert.severity, alert.type);
      console.debug('[Domain Event]', event.name, event);
    }
    return stats;
  }
}
