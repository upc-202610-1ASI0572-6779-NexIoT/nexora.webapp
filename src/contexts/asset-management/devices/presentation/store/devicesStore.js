import { defineStore } from 'pinia';
import { DeviceRepositoryImpl } from '../../infrastructure/repositories/DeviceRepositoryImpl';
import { GetDeviceFleetUseCase } from '../../application/use-cases/GetDeviceFleetUseCase';

const deviceRepository = new DeviceRepositoryImpl();
const getDeviceFleetUseCase = new GetDeviceFleetUseCase(deviceRepository);

export const useDevicesStore = defineStore('devices', {
  state: () => ({
    kpis: {
      operationalStatus: '0%',
      gatewayLoad: '0',
      activeAlerts: '0',
      firmwareDrift: '0'
    },
    devices: [], // This will be a list of Device entities
    isLoading: false,
    firmwareMix: [
      { version: 'v2.4.1 (Latest)', percentage: 82, variant: 'latest' },
      { version: 'v2.3.5 (Stable)', percentage: 12, variant: 'stable' },
      { version: 'v2.2.0 (Legacy)', percentage: 6, variant: 'legacy' }
    ]
  }),
  getters: {
    getDeviceById: (state) => (id) => state.devices.find(d => d.id === id),
    onlineDevicesCount: (state) => state.devices.filter(d => d.isOnline()).length,
    criticalDevicesCount: (state) => state.devices.filter(d => d.hasCriticalSignal()).length,
  },
  actions: {
    async fetchDevices() {
      this.isLoading = true;
      try {
        const { devices, kpis } = await getDeviceFleetUseCase.execute();
        this.devices = devices;
        this.kpis = kpis;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
