import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Card, Divider, Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThresholdSlider from '../components/ThresholdSlider';
import sensorDataService from '../services/SensorDataService';
import { COLORS, DEFAULT_THRESHOLDS } from '../utils/constants';

const STORAGE_KEY = '@health_monitor_thresholds';

/**
 * Ayarlar ekranı - Bakıcıların eşik değerlerini özelleştirmesi için
 * Settings screen - For caregivers to customize threshold values
 */
const SettingsScreen = () => {
  const [heartRateMin, setHeartRateMin] = useState(DEFAULT_THRESHOLDS.heartRate.min);
  const [heartRateMax, setHeartRateMax] = useState(DEFAULT_THRESHOLDS.heartRate.max);
  const [inactivityDuration, setInactivityDuration] = useState(DEFAULT_THRESHOLDS.inactivityDuration / 60); // Dakika cinsinden
  const [fallThreshold, setFallThreshold] = useState(DEFAULT_THRESHOLDS.fallDetection.accelerationThreshold);
  const [fallInactivityDuration, setFallInactivityDuration] = useState(DEFAULT_THRESHOLDS.fallDetection.inactivityAfterFall);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Component mount olduğunda kaydedilmiş ayarları yükle
  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setHeartRateMin(settings.heartRateMin);
        setHeartRateMax(settings.heartRateMax);
        setInactivityDuration(settings.inactivityDuration);
        setFallThreshold(settings.fallThreshold);
        setFallInactivityDuration(settings.fallInactivityDuration);
        setNotificationsEnabled(settings.notificationsEnabled ?? true);
        setSoundEnabled(settings.soundEnabled ?? true);

        // Sensor servisine uygula
        applySensorThresholds(settings);
      }
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = {
        heartRateMin,
        heartRateMax,
        inactivityDuration,
        fallThreshold,
        fallInactivityDuration,
        notificationsEnabled,
        soundEnabled,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      applySensorThresholds(settings);

      Alert.alert(
        'Başarılı',
        'Ayarlar kaydedildi ve uygulandı.',
        [{ text: 'Tamam' }]
      );
    } catch (error) {
      Alert.alert(
        'Hata',
        'Ayarlar kaydedilemedi: ' + error.message,
        [{ text: 'Tamam' }]
      );
    }
  };

  const applySensorThresholds = (settings) => {
    sensorDataService.updateThresholds({
      heartRate: {
        min: settings.heartRateMin,
        max: settings.heartRateMax,
      },
      inactivityDuration: settings.inactivityDuration * 60, // Saniyeye çevir
      fallDetection: {
        accelerationThreshold: settings.fallThreshold,
        inactivityAfterFall: settings.fallInactivityDuration,
      },
    });
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Varsayılana Sıfırla',
      'Tüm ayarları varsayılan değerlere döndürmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: () => {
            setHeartRateMin(DEFAULT_THRESHOLDS.heartRate.min);
            setHeartRateMax(DEFAULT_THRESHOLDS.heartRate.max);
            setInactivityDuration(DEFAULT_THRESHOLDS.inactivityDuration / 60);
            setFallThreshold(DEFAULT_THRESHOLDS.fallDetection.accelerationThreshold);
            setFallInactivityDuration(DEFAULT_THRESHOLDS.fallDetection.inactivityAfterFall);
            setNotificationsEnabled(true);
            setSoundEnabled(true);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ayarlar</Text>
          <Text style={styles.headerSubtitle}>
            Eşik değerlerini ve bildirimleri özelleştirin
          </Text>
        </View>

        {/* Kalp Atış Hızı Ayarları */}
        <Card style={styles.card}>
          <Card.Title title="Kalp Atış Hızı Eşikleri" titleStyle={styles.cardTitle} />
          <Card.Content>
            <ThresholdSlider
              label="Minimum Nabız"
              value={heartRateMin}
              onValueChange={setHeartRateMin}
              minimumValue={30}
              maximumValue={80}
              step={5}
              unit="bpm"
            />

            <ThresholdSlider
              label="Maximum Nabız"
              value={heartRateMax}
              onValueChange={setHeartRateMax}
              minimumValue={90}
              maximumValue={180}
              step={5}
              unit="bpm"
            />

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Nabız bu değerlerin dışına çıktığında uyarı verilir.
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Hareketsizlik Ayarları */}
        <Card style={styles.card}>
          <Card.Title title="Hareketsizlik Tespiti" titleStyle={styles.cardTitle} />
          <Card.Content>
            <ThresholdSlider
              label="Hareketsizlik Süresi"
              value={inactivityDuration}
              onValueChange={setInactivityDuration}
              minimumValue={5}
              maximumValue={60}
              step={5}
              unit="dakika"
            />

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Kullanıcı bu süre boyunca hareketsiz kalırsa uyarı verilir.
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Düşme Tespiti Ayarları */}
        <Card style={styles.card}>
          <Card.Title title="Düşme Tespiti" titleStyle={styles.cardTitle} />
          <Card.Content>
            <ThresholdSlider
              label="İvme Eşiği"
              value={fallThreshold}
              onValueChange={setFallThreshold}
              minimumValue={1.5}
              maximumValue={4.0}
              step={0.1}
              unit="g"
            />

            <ThresholdSlider
              label="Düşme Sonrası Hareketsizlik"
              value={fallInactivityDuration}
              onValueChange={setFallInactivityDuration}
              minimumValue={5}
              maximumValue={30}
              step={5}
              unit="saniye"
            />

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Yüksek ivme ve ardından hareketsizlik tespit edildiğinde düşme uyarısı verilir.
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Bildirim Ayarları */}
        <Card style={styles.card}>
          <Card.Title title="Bildirim Ayarları" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.switchTitle}>Bildirimler</Text>
                <Text style={styles.switchSubtitle}>
                  Uyarılar için bildirim göster
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={COLORS.primary}
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchLabel}>
                <Text style={styles.switchTitle}>Ses</Text>
                <Text style={styles.switchSubtitle}>
                  Bildirimler için ses çal
                </Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                color={COLORS.primary}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Kontrol Butonları */}
        <View style={styles.buttonsContainer}>
          <Button
            mode="contained"
            onPress={saveSettings}
            icon="content-save"
            style={styles.button}
            buttonColor={COLORS.primary}
          >
            Ayarları Kaydet
          </Button>

          <Button
            mode="outlined"
            onPress={resetToDefaults}
            icon="restore"
            style={styles.button}
            textColor={COLORS.textSecondary}
          >
            Varsayılana Sıfırla
          </Button>
        </View>

        {/* Bilgi */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ayarları değiştirdikten sonra "Kaydet" butonuna basmalısınız.
          </Text>
        </View>
      </ScrollView>
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
    marginBottom: 20,
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
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  switchSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    marginVertical: 12,
  },
  buttonsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  footer: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SettingsScreen;
