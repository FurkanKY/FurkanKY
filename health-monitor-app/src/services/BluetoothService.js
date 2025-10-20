/**
 * Bluetooth bağlantı servisi (Şu an mock, gerçek cihaz bağlandığında genişletilecek)
 * Bluetooth connection service (Currently mock, will be expanded when real device is connected)
 */
class BluetoothService {
  constructor() {
    this.isConnected = false;
    this.connectedDevice = null;
    this.listeners = [];
  }

  /**
   * Bluetooth cihazlarını tarar
   * Scans for Bluetooth devices
   */
  async scanDevices() {
    // Mock implementation
    // Gerçek implementasyonda react-native-ble-manager kullanılacak
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'device-1', name: 'Sağlık Bilekliği #1', rssi: -45 },
          { id: 'device-2', name: 'Sağlık Bilekliği #2', rssi: -60 },
        ]);
      }, 2000);
    });
  }

  /**
   * Cihaza bağlanır
   * Connects to a device
   */
  async connect(deviceId) {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.connectedDevice = {
          id: deviceId,
          name: 'Sağlık Bilekliği',
          batteryLevel: 85,
          firmwareVersion: '1.0.0'
        };
        this.notifyListeners({ type: 'connected', device: this.connectedDevice });
        resolve(true);
      }, 1500);
    });
  }

  /**
   * Cihaz bağlantısını keser
   * Disconnects from device
   */
  async disconnect() {
    return new Promise((resolve) => {
      this.isConnected = false;
      const device = this.connectedDevice;
      this.connectedDevice = null;
      this.notifyListeners({ type: 'disconnected', device });
      resolve(true);
    });
  }

  /**
   * Bağlantı durumunu döndürür
   * Returns connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      device: this.connectedDevice
    };
  }

  /**
   * Cihazdan veri okur
   * Reads data from device
   */
  async readCharacteristic(serviceUUID, characteristicUUID) {
    // Mock implementation
    // Gerçek implementasyonda BLE karakteristik okuma yapılacak
    if (!this.isConnected) {
      throw new Error('Cihaz bağlı değil');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          heartRate: 75,
          accelerometer: { x: 0, y: 0, z: 1 },
          timestamp: Date.now()
        });
      }, 100);
    });
  }

  /**
   * Cihaza veri yazar
   * Writes data to device
   */
  async writeCharacteristic(serviceUUID, characteristicUUID, data) {
    // Mock implementation
    if (!this.isConnected) {
      throw new Error('Cihaz bağlı değil');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 100);
    });
  }

  /**
   * Listener ekler
   * Adds a listener
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Listener kaldırır
   * Removes a listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Listener'ları bilgilendirir
   * Notifies listeners
   */
  notifyListeners(event) {
    this.listeners.forEach(listener => listener(event));
  }

  /**
   * Pil seviyesini okur
   * Reads battery level
   */
  async readBatteryLevel() {
    if (!this.isConnected) {
      return null;
    }

    return this.connectedDevice?.batteryLevel || null;
  }
}

// Singleton instance
const bluetoothService = new BluetoothService();

export default bluetoothService;
