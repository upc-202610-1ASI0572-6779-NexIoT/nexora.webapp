import { ReportMapper } from '../mappers/ReportMapper';
import { IReportRepository } from '../../../domain/repositories/IReportRepository';
import apiClient from '@/shared/infrastructure/http/apiClient';

export class ReportRepositoryImpl extends IReportRepository {
  async getConsumptionSummary(months = 6) {
    const { data } = await apiClient.get('/api/v1/analytics/consumption', {
      params: { months }
    });
    return {
      hasElectricityLinked: data.hasElectricityLinked,
      hasGasLinked: data.hasGasLinked,
      hasWaterLinked: data.hasWaterLinked,
      consumption: ReportMapper.toConsumptionDomain(data.consumption),
      chartData: data.chartData,
      propertyBreakdown: data.propertyBreakdown.map(ReportMapper.toPropertyBreakdownDomain)
    };
  }
}
