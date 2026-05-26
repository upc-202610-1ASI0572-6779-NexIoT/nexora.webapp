import { ReportMapper } from '../mappers/ReportMapper';

export class ReportRepositoryImpl {
  constructor() {
    this.rawData = {
      consumption: {
        energy: { value: '4,820', unit: 'kWh', trend: '+12.5%', trendVariant: 'success' },
        gas: { value: '1,142', unit: 'm³', trend: '-4.2%', trendVariant: 'danger' },
        projectedCosts: { value: '12,450.00', budgetLimit: '15,000', budgetPercent: 80 }
      },
      chartData: {
        months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
        energy: [3200, 3800, 4100, 3900, 4500, 4820],
        gas: [800, 950, 1100, 1050, 1200, 1142]
      },
      propertyBreakdown: [
        { id: 1, name: 'Skyline Industrial', location: 'North Wing, Sector 4', energy: 1240, gas: 310, status: 'optimal' },
        { id: 2, name: 'Oak Storage Hub', location: 'South Wing, Unit 109', energy: 850, gas: 142, status: 'monitor' },
        { id: 3, name: 'Central Logistics', location: 'East Wing, Floor 2', energy: 1540, gas: 420, status: 'high-load' },
        { id: 4, name: 'Horizon Biotech', location: 'Lab Block A', energy: 1190, gas: 270, status: 'optimal' }
      ],
      aiInsights: [
        {
          id: 1,
          type: 'opportunity',
          title: 'Off-Peak Opportunity',
          description: 'Shifting heavy machinery operation to 10 PM - 6 AM could reduce energy costs by up to 14% based on current tariff structures.'
        },
        {
          id: 2,
          type: 'efficiency',
          title: 'Efficiency Alert',
          description: 'HVAC systems in Skyline Sector 4 are consuming 12% more energy than comparable units. Maintenance check recommended.'
        }
      ]
    };
  }

  async getConsumptionSummary() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      consumption: ReportMapper.toConsumptionDomain(this.rawData.consumption),
      chartData: this.rawData.chartData,
      propertyBreakdown: this.rawData.propertyBreakdown.map(ReportMapper.toPropertyBreakdownDomain),
      aiInsights: this.rawData.aiInsights
    };
  }
}
