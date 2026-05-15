export class GetDeviceFleetUseCase {
  constructor(deviceRepository) {
    this.deviceRepository = deviceRepository;
  }

  async execute() {
    const [devices, kpis] = await Promise.all([
      this.deviceRepository.getAll(),
      this.deviceRepository.getKPIs()
    ]);

    return {
      devices,
      kpis
    };
  }
}
