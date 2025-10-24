import { ALERT_TYPES, DEFAULT_THRESHOLDS } from './constants';

/**
 * Kalp atış hızının durumunu kontrol eder
 * Checks heart rate status
 */
export const checkHeartRateStatus = (heartRate, thresholds = DEFAULT_THRESHOLDS.heartRate) => {
  if (heartRate < thresholds.min) {
    return {
      status: ALERT_TYPES.LOW_HEART_RATE,
      severity: 'high',
      message: `Kalp atış hızı çok düşük: ${heartRate} bpm`
    };
  }

  if (heartRate > thresholds.max) {
    return {
      status: ALERT_TYPES.HIGH_HEART_RATE,
      severity: 'high',
      message: `Kalp atış hızı çok yüksek: ${heartRate} bpm`
    };
  }

  return {
    status: ALERT_TYPES.NORMAL,
    severity: 'normal',
    message: 'Kalp atış hızı normal'
  };
};

/**
 * Düşme tespiti yapar
 * Detects falls based on accelerometer data
 */
export const detectFall = (accelerometerData, thresholds = DEFAULT_THRESHOLDS.fallDetection) => {
  const { x, y, z } = accelerometerData;
  const totalAcceleration = Math.sqrt(x * x + y * y + z * z);

  return totalAcceleration > thresholds.accelerationThreshold;
};

/**
 * Hareketsizlik süresini kontrol eder
 * Checks inactivity duration
 */
export const checkInactivity = (lastActivityTime, thresholds = DEFAULT_THRESHOLDS.inactivityDuration) => {
  const currentTime = Date.now();
  const inactivitySeconds = (currentTime - lastActivityTime) / 1000;

  return {
    isInactive: inactivitySeconds > thresholds,
    duration: inactivitySeconds,
    message: inactivitySeconds > thresholds
      ? `${Math.floor(inactivitySeconds / 60)} dakikadır hareketsiz`
      : 'Aktif'
  };
};

/**
 * Tarih formatlar
 * Formats date and time
 */
export const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Süre formatlar (saniye -> dakika:saniye)
 * Formats duration (seconds -> minutes:seconds)
 */
export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

/**
 * Sağlık durumuna göre renk döndürür
 * Returns color based on health status
 */
export const getStatusColor = (status) => {
  const { COLORS } = require('./constants');

  switch (status) {
    case ALERT_TYPES.NORMAL:
      return COLORS.success;
    case ALERT_TYPES.HIGH_HEART_RATE:
    case ALERT_TYPES.LOW_HEART_RATE:
    case ALERT_TYPES.FALL:
      return COLORS.danger;
    case ALERT_TYPES.INACTIVITY:
      return COLORS.warning;
    case ALERT_TYPES.MANUAL:
      return COLORS.danger;
    default:
      return COLORS.textSecondary;
  }
};
