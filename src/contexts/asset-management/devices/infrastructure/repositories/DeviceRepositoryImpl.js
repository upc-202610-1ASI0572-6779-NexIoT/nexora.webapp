import apiClient from '@/shared/infrastructure/http/apiClient';
import { Device } from '../../domain/entities/Device';
import { DeviceFleetService } from '../../../domain/services/DeviceFleetService';
import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class DeviceRepositoryImpl extends IDeviceRepository {
  async getAll() {
    try {
      const { data } = await apiClient.get('/api/v1/devices');
      const linkedDevices = data.filter(d => d.propertyId !== null);
      return linkedDevices.map(d => {
        const isOnline = d.connectionStatus.toLowerCase() === 'online';
        // Format uptime based on last sync time
        let uptimeStr = 'Unknown';
        if (d.lastSyncAt) {
          const syncDate = new Date(d.lastSyncAt);
          uptimeStr = syncDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // Simular firmware drift de manera determinista (si el id termina en número impar, tiene firmware antiguo)
        const hasLegacyFirmware = d.id.charCodeAt(d.id.length - 1) % 2 !== 0;
        const firmwareVersion = hasLegacyFirmware ? 'v2.3.5' : 'v2.4.1';
        
        return new Device({
          id: d.id,
          location: d.propertyName || 'Unassigned',
          status: isOnline ? 'online' : 'comm-failure',
          rssi: isOnline ? -45 : null,
          firmware: firmwareVersion,
          uptime: uptimeStr,
          isFirmwareOutdated: hasLegacyFirmware
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
      const devices = await this.getAll();
      const total = devices.length;
      const online = devices.filter(d => d.isOnline()).length;
      const offline = total - online;
      const outdated = devices.filter(d => d.needsUpdate()).length;
      
      const opStatus = total > 0 ? `${Math.round((online / total) * 100)}%` : '100%';
      
      return {
        operationalStatus: opStatus,
        gatewayLoad: total > 0 ? (online * 12).toString() : '0',
        activeAlerts: offline.toString(),
        firmwareDrift: outdated.toString()
      };
    } catch (e) {
      return {
        operationalStatus: '0%',
        gatewayLoad: '0',
        activeAlerts: '0',
        firmwareDrift: '0.00'
      };
    }
  }
}
