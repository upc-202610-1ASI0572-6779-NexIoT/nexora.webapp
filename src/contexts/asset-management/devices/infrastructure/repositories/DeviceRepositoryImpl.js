import apiClient from '@/shared/infrastructure/http/apiClient';
import { Device } from '../../domain/entities/Device';
import { DeviceFleetService } from '../../../domain/services/DeviceFleetService';
import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class DeviceRepositoryImpl extends IDeviceRepository {
  async getAll() {
    try {
      const { data } = await apiClient.get('/api/v1/devices');
      return data.map(d => {
        const isOnline = d.connectionStatus.toLowerCase() === 'online';
        // Format uptime based on last sync time
        let uptimeStr = 'Unknown';
        if (d.lastSyncAt) {
          const syncDate = new Date(d.lastSyncAt);
          uptimeStr = syncDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        return new Device({
          id: d.id,
          name: d.name,
          location: d.propertyName || 'Unassigned',
          status: isOnline ? 'online' : 'comm-failure',
          rssi: isOnline ? d.rssi : null,
          firmware: d.firmwareVersion || 'N/A',
          uptime: uptimeStr,
          isFirmwareOutdated: d.isFirmwareOutdated,
          propertyId: d.propertyId,
          macAddress: d.macAddress,
          lastSyncAt: d.lastSyncAt
        });
      });
    } catch (e) {
      console.error('Failed to fetch devices from backend', e);
      return [];
    }
  }

  async getById(id) {
    const devices = await this.getAll();
    return devices.find(d => d.id === id) || null;
  }

  async getKPIs() {
    try {
      const { data } = await apiClient.get('/api/v1/device-statistics');
      return {
        operationalStatus: data.operationalStatus,
        gatewayLoad: data.gatewayLoad,
        activeAlerts: data.activeAlerts,
        firmwareDrift: data.firmwareDrift
      };
    } catch (e) {
      console.error('Failed to fetch real KPIs, using default fallback', e);
      return {
        operationalStatus: '100%',
        gatewayLoad: '0.00',
        activeAlerts: '0',
        firmwareDrift: '0'
      };
    }
  }
}
