import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import HealthCard from '../components/HealthCard';
import StatusBadge from '../components/StatusBadge';
import sensorDataService from '../services/SensorDataService';
import bluetoothService from '../services/BluetoothService';
import notificationService from '../services/NotificationService';
import { COLORS, ALERT_TYPES } from '../utils/constants';
import { formatDateTime } from '../utils/helpers';

/**
 * Ana gösterge paneli ekranı
 * Main dashboard screen
 */
const DashboardScreen = () => {
  const [sensorData, setSensorData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [overallStatus, setOverallStatus] = useState(ALERT_TYPES.NORMAL);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [bluetoothStatus, setBluetoothStatus] = useState({ isConnected: false, device: null });
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Bildirim servisini başlat
    notificationService.initialize();

    // Bluetooth durumunu kontrol et
    const btStatus = bluetoothService.getConnectionStatus();
    setBluetoothStatus(btStatus);

    // Bluetooth listener'ı ekle
    const btListener = (event) => {
      if (event.type === 'connected' || event.type === 'disconnected') {
        setBluetoothStatus(bluetoothService.getConnectionStatus());
      }
    };
    bluetoothService.addListener(btListener);

    return () => {
      bluetoothService.removeListener(btListener);
      sensorDataService.stop();
    };
  }, []);

  useEffect(() => {
    if (isMonitoring) {
      // Sensör veri listener'ı ekle
      const handleSensorData = (analysis) => {
        setSensorData(analysis.data);
        setAlerts(analysis.alerts);
        setOverallStatus(analysis.overallStatus);

        // Kritik uyarılar için bildirim gönder
        analysis.alerts.forEach(alert => {
          if (alert.severity === 'critical') {
            notificationService.sendEmergencyNotification(alert.status, alert.message);
          }
        });
      };

      sensorDataService.addListener(handleSensorData);

      return () => {
        sensorDataService.removeListener(handleSensorData);
      };
    }
  }, [isMonitoring]);

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    sensorDataService.start();
    showSnackbar('İzleme başlatıldı');
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    sensorDataService.stop();
    showSnackbar('İzleme durduruldu');
  };

  const handleConnectBluetooth = async () => {
    try {
      showSnackbar('Cihaz aranıyor...');
      const devices = await bluetoothService.scanDevices();

      if (devices.length > 0) {
        await bluetoothService.connect(devices[0].id);
        showSnackbar('Cihaz bağlandı');
      } else {
        showSnackbar('Cihaz bulunamadı');
      }
    } catch (error) {
      showSnackbar('Bağlantı hatası: ' + error.message);
    }
  };

  const handleDisconnectBluetooth = async () => {
    await bluetoothService.disconnect();
    showSnackbar('Cihaz bağlantısı kesildi');
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showSnackbar('Yenilendi');
    }, 1000);
  }, []);

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sağlık İzleme</Text>
          <Text style={styles.headerSubtitle}>
            {sensorData ? formatDateTime(sensorData.timestamp) : 'Veri bekleniyor...'}
          </Text>
        </View>

        {/* Durum Rozeti */}
        <View style={styles.statusContainer}>
          <StatusBadge status={overallStatus} size="large" />
        </View>

        {/* Bluetooth Durumu */}
        <View style={styles.bluetoothContainer}>
          <View style={styles.bluetoothInfo}>
            <Text style={styles.bluetoothLabel}>Bluetooth:</Text>
            <Text style={[
              styles.bluetoothStatus,
              { color: bluetoothStatus.isConnected ? COLORS.success : COLORS.textSecondary }
            ]}>
              {bluetoothStatus.isConnected
                ? `Bağlı - ${bluetoothStatus.device?.name}`
                : 'Bağlı Değil (Mock Veri Kullanılıyor)'}
            </Text>
          </View>
          <Button
            mode="outlined"
            onPress={bluetoothStatus.isConnected ? handleDisconnectBluetooth : handleConnectBluetooth}
            compact
            style={styles.bluetoothButton}
          >
            {bluetoothStatus.isConnected ? 'Bağlantıyı Kes' : 'Bağlan'}
          </Button>
        </View>

        {/* Sağlık Verileri */}
        {sensorData ? (
          <View style={styles.dataContainer}>
            <HealthCard
              title="Kalp Atış Hızı"
              value={sensorData.heartRate}
              unit="bpm"
              icon="heart-pulse"
              status={
                alerts.find(a => a.status === ALERT_TYPES.HIGH_HEART_RATE || a.status === ALERT_TYPES.LOW_HEART_RATE)?.status || ALERT_TYPES.NORMAL
              }
              subtitle="Normal aralık: 60-100 bpm"
            />

            <HealthCard
              title="Hareket Sensörü"
              value={Math.sqrt(
                sensorData.accelerometer.x ** 2 +
                sensorData.accelerometer.y ** 2 +
                sensorData.accelerometer.z ** 2
              ).toFixed(2)}
              unit="g"
              icon="axis-arrow"
              status={alerts.find(a => a.status === ALERT_TYPES.FALL)?.status || ALERT_TYPES.NORMAL}
              subtitle={`X: ${sensorData.accelerometer.x.toFixed(2)} Y: ${sensorData.accelerometer.y.toFixed(2)} Z: ${sensorData.accelerometer.z.toFixed(2)}`}
            />

            <HealthCard
              title="Aktivite Durumu"
              value={alerts.find(a => a.status === ALERT_TYPES.INACTIVITY) ? 'Hareketsiz' : 'Aktif'}
              unit=""
              icon="run"
              status={alerts.find(a => a.status === ALERT_TYPES.INACTIVITY)?.status || ALERT_TYPES.NORMAL}
            />

            {sensorData.isButtonPressed && (
              <HealthCard
                title="Acil Durum Butonu"
                value="BASIN"
                unit=""
                icon="bell-alert"
                status={ALERT_TYPES.MANUAL}
              />
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.emptyText}>
              {isMonitoring ? 'Veri alınıyor...' : 'İzlemeyi başlatın'}
            </Text>
          </View>
        )}

        {/* Uyarılar */}
        {alerts.length > 0 && (
          <View style={styles.alertsContainer}>
            <Text style={styles.alertsTitle}>Aktif Uyarılar ({alerts.length})</Text>
            {alerts.map((alert, index) => (
              <View key={index} style={[styles.alertItem, { borderLeftColor: alert.severity === 'critical' ? COLORS.danger : COLORS.warning }]}>
                <Text style={styles.alertMessage}>{alert.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Kontrol Butonları */}
        <View style={styles.controlsContainer}>
          {!isMonitoring ? (
            <Button
              mode="contained"
              onPress={handleStartMonitoring}
              icon="play"
              style={styles.button}
              buttonColor={COLORS.success}
            >
              İzlemeyi Başlat
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleStopMonitoring}
              icon="stop"
              style={styles.button}
              buttonColor={COLORS.danger}
            >
              İzlemeyi Durdur
            </Button>
          )}
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Tamam',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bluetoothContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  bluetoothInfo: {
    flex: 1,
  },
  bluetoothLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bluetoothStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  bluetoothButton: {
    marginLeft: 8,
  },
  dataContainer: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  alertsContainer: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  alertItem: {
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: COLORS.text,
  },
  controlsContainer: {
    marginTop: 8,
  },
  button: {
    paddingVertical: 8,
  },
});

export default DashboardScreen;
