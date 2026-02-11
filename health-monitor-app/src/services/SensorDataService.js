import { ALERT_TYPES, DEFAULT_THRESHOLDS } from '../utils/constants';
import { checkHeartRateStatus, detectFall, checkInactivity } from '../utils/helpers';

/**
 * Sensör verilerini simüle eden ve işleyen servis
 * Service that simulates and processes sensor data
 */
class SensorDataService {
  constructor() {
    this.listeners = [];
    this.isRunning = false;
    this.lastActivityTime = Date.now();
    this.currentData = {
      heartRate: 75,
      accelerometer: { x: 0, y: 0, z: 1 },
      isButtonPressed: false,
      timestamp: Date.now()
    };
    this.thresholds = { ...DEFAULT_THRESHOLDS };
  }

  /**
   * Veri güncellemelerini dinleyen listener ekler
   * Adds a listener for data updates
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Listener'ı kaldırır
   * Removes a listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Tüm listener'lara veri gönderir
   * Notifies all listeners with new data
   */
  notifyListeners(data) {
    this.listeners.forEach(listener => listener(data));
  }

  /**
   * Eşik değerlerini günceller
   * Updates threshold values
   */
  updateThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  /**
   * Mock sensör verisi üretir (gerçek cihaz bağlandığında bu fonksiyon değiştirilecek)
   * Generates mock sensor data (will be replaced when real device is connected)
   */
  generateMockData() {
    // Normal kalp atışı etrafında rasgele değer (60-100 arası çoğunlukla)
    const baseHeartRate = 75;
    const heartRateVariation = Math.random() * 20 - 10;
    let heartRate = Math.round(baseHeartRate + heartRateVariation);

    // Bazen anormal değerler simüle et (%5 olasılık)
    if (Math.random() < 0.05) {
      heartRate = Math.random() < 0.5 ? 35 : 135; // Düşük veya yüksek nabız
    }

    // İvmeölçer verisi - normal durum
    const accelerometer = {
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5,
      z: 1 + (Math.random() - 0.5) * 0.2
    };

    // Düşme simülasyonu (%1 olasılık)
    const isFall = Math.random() < 0.01;
    if (isFall) {
      accelerometer.x = (Math.random() - 0.5) * 5;
      accelerometer.y = (Math.random() - 0.5) * 5;
      accelerometer.z = (Math.random() - 0.5) * 5;
    }

    // Manuel acil durum butonu (%0.5 olasılık)
    const isButtonPressed = Math.random() < 0.005;

    return {
      heartRate,
      accelerometer,
      isButtonPressed,
      timestamp: Date.now()
    };
  }

  /**
   * Sensör verilerini analiz eder ve uyarı durumunu belirler
   * Analyzes sensor data and determines alert status
   */
  analyzeSensorData(data) {
    const alerts = [];

    // Kalp atış hızı kontrolü
    const heartRateCheck = checkHeartRateStatus(data.heartRate, this.thresholds.heartRate);
    if (heartRateCheck.status !== ALERT_TYPES.NORMAL) {
      alerts.push(heartRateCheck);
    }

    // Düşme tespiti
    const fallDetected = detectFall(data.accelerometer, this.thresholds.fallDetection);
    if (fallDetected) {
      alerts.push({
        status: ALERT_TYPES.FALL,
        severity: 'critical',
        message: 'DÜŞME TESPİT EDİLDİ!'
      });
      this.lastActivityTime = Date.now() - (this.thresholds.inactivityDuration * 1000); // Düşmeden sonra hareketsizliği tetikle
    }

    // Hareketsizlik kontrolü
    const inactivityCheck = checkInactivity(this.lastActivityTime, this.thresholds.inactivityDuration);
    if (inactivityCheck.isInactive) {
      alerts.push({
        status: ALERT_TYPES.INACTIVITY,
        severity: 'high',
        message: inactivityCheck.message
      });
    }

    // Manuel acil durum butonu
    if (data.isButtonPressed) {
      alerts.push({
        status: ALERT_TYPES.MANUAL,
        severity: 'critical',
        message: 'Manuel acil durum butonu aktif!'
      });
    }

    // Hareket varsa son aktivite zamanını güncelle
    const hasMovement = Math.abs(data.accelerometer.x) > 0.1 ||
                       Math.abs(data.accelerometer.y) > 0.1;
    if (hasMovement && !fallDetected) {
      this.lastActivityTime = Date.now();
    }

    return {
      data,
      alerts,
      overallStatus: alerts.length > 0
        ? alerts.reduce((prev, curr) => prev.severity === 'critical' ? prev : curr).status
        : ALERT_TYPES.NORMAL
    };
  }

  /**
   * Sensör veri toplama işlemini başlatır
   * Starts sensor data collection
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      const mockData = this.generateMockData();
      this.currentData = mockData;
      const analysis = this.analyzeSensorData(mockData);
      this.notifyListeners(analysis);
    }, 1000); // Her saniye güncelle - Update every second
  }

  /**
   * Sensör veri toplamayı durdurur
   * Stops sensor data collection
   */
  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Mevcut sensör verisini döndürür
   * Returns current sensor data
   */
  getCurrentData() {
    return this.currentData;
  }

  /**
   * Servisi sıfırlar
   * Resets the service
   */
  reset() {
    this.stop();
    this.listeners = [];
    this.lastActivityTime = Date.now();
    this.thresholds = { ...DEFAULT_THRESHOLDS };
  }
}

// Singleton instance
const sensorDataService = new SensorDataService();

export default sensorDataService;
