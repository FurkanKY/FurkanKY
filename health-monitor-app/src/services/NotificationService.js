import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NOTIFICATION_CHANNEL, ALERT_MESSAGES } from '../utils/constants';

/**
 * Bildirim yönetim servisi
 * Notification management service
 */
class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.setupNotificationHandler();
  }

  /**
   * Bildirim handler'ını yapılandırır
   * Configures notification handler
   */
  setupNotificationHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  /**
   * Bildirim izinlerini ve kanalını ayarlar
   * Sets up notification permissions and channel
   */
  async initialize() {
    if (this.isInitialized) return true;

    try {
      // İzin iste
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Bildirim izni verilmedi!');
        return false;
      }

      // Android için bildirim kanalı oluştur
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL.id, {
          name: NOTIFICATION_CHANNEL.name,
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          sound: true,
          enableLights: true,
          lightColor: '#FF0000',
        });
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Bildirim servisi başlatılamadı:', error);
      return false;
    }
  }

  /**
   * Acil durum bildirimi gönderir
   * Sends an emergency notification
   */
  async sendEmergencyNotification(alertType, customMessage = null) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const message = customMessage || ALERT_MESSAGES[alertType] || 'Acil Durum!';

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Sağlık Uyarısı! ⚠️',
          body: message,
          data: { alertType, timestamp: Date.now() },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          vibrate: [0, 250, 250, 250],
        },
        trigger: null, // Hemen gönder - Send immediately
      });

      return true;
    } catch (error) {
      console.error('Bildirim gönderilemedi:', error);
      return false;
    }
  }

  /**
   * Zamanlanmış bildirim gönderir
   * Sends a scheduled notification
   */
  async scheduleNotification(title, body, delaySeconds = 0) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { timestamp: Date.now() },
        },
        trigger: delaySeconds > 0 ? { seconds: delaySeconds } : null,
      });

      return true;
    } catch (error) {
      console.error('Zamanlanmış bildirim gönderilemedi:', error);
      return false;
    }
  }

  /**
   * Tüm bekleyen bildirimleri iptal eder
   * Cancels all pending notifications
   */
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return true;
    } catch (error) {
      console.error('Bildirimler iptal edilemedi:', error);
      return false;
    }
  }

  /**
   * Bildirim listener'ı ekler
   * Adds notification listener
   */
  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Bildirim yanıt listener'ı ekler
   * Adds notification response listener
   */
  addNotificationResponseReceivedListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}

// Singleton instance
const notificationService = new NotificationService();

export default notificationService;
