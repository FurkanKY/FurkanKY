// Sağlık Eşik Değerleri (Health Threshold Values)
export const DEFAULT_THRESHOLDS = {
  heartRate: {
    min: 40,
    max: 120,
    normal: { min: 60, max: 100 }
  },
  inactivityDuration: 1800, // 30 dakika (saniye cinsinden) - 30 minutes in seconds
  fallDetection: {
    accelerationThreshold: 2.5, // g cinsinden - in g units
    inactivityAfterFall: 10 // saniye - seconds
  }
};

// Alarm Tipleri (Alert Types)
export const ALERT_TYPES = {
  FALL: 'fall',
  INACTIVITY: 'inactivity',
  HIGH_HEART_RATE: 'high_heart_rate',
  LOW_HEART_RATE: 'low_heart_rate',
  MANUAL: 'manual',
  NORMAL: 'normal'
};

// Alarm Mesajları (Alert Messages)
export const ALERT_MESSAGES = {
  [ALERT_TYPES.FALL]: 'DÜŞME TESPİT EDİLDİ! Acil kontrol gerekli.',
  [ALERT_TYPES.INACTIVITY]: 'Uzun Süreli Hareketsizlik! Kullanıcı kontrol edilmeli.',
  [ALERT_TYPES.HIGH_HEART_RATE]: 'Yüksek Nabız! Kalp atış hızı normalin üzerinde.',
  [ALERT_TYPES.LOW_HEART_RATE]: 'Düşük Nabız! Kalp atış hızı normalin altında.',
  [ALERT_TYPES.MANUAL]: 'Manuel Acil Durum Butonu! Kullanıcı yardım talep etti.',
  [ALERT_TYPES.NORMAL]: 'Tüm Değerler Normal'
};

// Renk Kodları (Color Codes)
export const COLORS = {
  primary: '#2196F3',
  secondary: '#4CAF50',
  danger: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0'
};

// Bildirim Kanalları (Notification Channels)
export const NOTIFICATION_CHANNEL = {
  id: 'health-alerts',
  name: 'Sağlık Uyarıları',
  importance: 5,
  sound: true,
  vibrate: true
};
