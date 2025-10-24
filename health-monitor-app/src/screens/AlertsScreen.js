import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Button, Chip, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertCard from '../components/AlertCard';
import { COLORS, ALERT_TYPES, ALERT_MESSAGES } from '../utils/constants';

const STORAGE_KEY = '@health_monitor_alerts_history';
const MAX_ALERTS = 100; // Maksimum kaydedilecek uyarı sayısı

/**
 * Uyarı geçmişi ekranı
 * Alerts history screen
 */
const AlertsScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, searchQuery, selectedFilter]);

  const loadAlerts = async () => {
    try {
      const savedAlerts = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedAlerts) {
        const parsedAlerts = JSON.parse(savedAlerts);
        setAlerts(parsedAlerts);
      } else {
        // Demo verileri ekle
        generateDemoAlerts();
      }
    } catch (error) {
      console.error('Uyarılar yüklenemedi:', error);
      generateDemoAlerts();
    }
  };

  const saveAlerts = async (newAlerts) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAlerts));
    } catch (error) {
      console.error('Uyarılar kaydedilemedi:', error);
    }
  };

  const generateDemoAlerts = () => {
    const demoAlerts = [
      {
        id: '1',
        status: ALERT_TYPES.FALL,
        severity: 'critical',
        message: ALERT_MESSAGES[ALERT_TYPES.FALL],
        timestamp: Date.now() - 3600000, // 1 saat önce
      },
      {
        id: '2',
        status: ALERT_TYPES.HIGH_HEART_RATE,
        severity: 'high',
        message: ALERT_MESSAGES[ALERT_TYPES.HIGH_HEART_RATE] + ' (135 bpm)',
        timestamp: Date.now() - 7200000, // 2 saat önce
      },
      {
        id: '3',
        status: ALERT_TYPES.INACTIVITY,
        severity: 'high',
        message: ALERT_MESSAGES[ALERT_TYPES.INACTIVITY],
        timestamp: Date.now() - 10800000, // 3 saat önce
      },
      {
        id: '4',
        status: ALERT_TYPES.LOW_HEART_RATE,
        severity: 'high',
        message: ALERT_MESSAGES[ALERT_TYPES.LOW_HEART_RATE] + ' (38 bpm)',
        timestamp: Date.now() - 86400000, // 1 gün önce
      },
      {
        id: '5',
        status: ALERT_TYPES.MANUAL,
        severity: 'critical',
        message: ALERT_MESSAGES[ALERT_TYPES.MANUAL],
        timestamp: Date.now() - 172800000, // 2 gün önce
      },
    ];
    setAlerts(demoAlerts);
    saveAlerts(demoAlerts);
  };

  const filterAlerts = () => {
    let filtered = [...alerts];

    // Filtre uygula
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(alert => alert.status === selectedFilter);
    }

    // Arama uygula
    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tarihe göre sırala (en yeni önce)
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    setFilteredAlerts(filtered);
  };

  const handleDismissAlert = (alertId) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
    saveAlerts(updatedAlerts);
  };

  const handleClearAll = () => {
    setAlerts([]);
    saveAlerts([]);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadAlerts();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getFilterCount = (filterType) => {
    if (filterType === 'all') {
      return alerts.length;
    }
    return alerts.filter(alert => alert.status === filterType).length;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Uyarı Geçmişi</Text>
        <Text style={styles.headerSubtitle}>
          Toplam {alerts.length} uyarı kaydı
        </Text>
      </View>

      {/* Arama */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Uyarılarda ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {/* Filtreler */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => setSelectedFilter('all')}
          style={styles.filterChip}
          textStyle={styles.chipText}
        >
          Tümü ({getFilterCount('all')})
        </Chip>
        <Chip
          selected={selectedFilter === ALERT_TYPES.FALL}
          onPress={() => setSelectedFilter(ALERT_TYPES.FALL)}
          style={styles.filterChip}
          textStyle={styles.chipText}
        >
          Düşme ({getFilterCount(ALERT_TYPES.FALL)})
        </Chip>
        <Chip
          selected={selectedFilter === ALERT_TYPES.HIGH_HEART_RATE}
          onPress={() => setSelectedFilter(ALERT_TYPES.HIGH_HEART_RATE)}
          style={styles.filterChip}
          textStyle={styles.chipText}
        >
          Yüksek Nabız ({getFilterCount(ALERT_TYPES.HIGH_HEART_RATE)})
        </Chip>
        <Chip
          selected={selectedFilter === ALERT_TYPES.LOW_HEART_RATE}
          onPress={() => setSelectedFilter(ALERT_TYPES.LOW_HEART_RATE)}
          style={styles.filterChip}
          textStyle={styles.chipText}
        >
          Düşük Nabız ({getFilterCount(ALERT_TYPES.LOW_HEART_RATE)})
        </Chip>
        <Chip
          selected={selectedFilter === ALERT_TYPES.INACTIVITY}
          onPress={() => setSelectedFilter(ALERT_TYPES.INACTIVITY)}
          style={styles.filterChip}
          textStyle={styles.chipText}
        >
          Hareketsizlik ({getFilterCount(ALERT_TYPES.INACTIVITY)})
        </Chip>
        <Chip
          selected={selectedFilter === ALERT_TYPES.MANUAL}
          onPress={() => setSelectedFilter(ALERT_TYPES.MANUAL)}
          style={styles.filterChip}
          textStyle={styles.chipText}
        >
          Manuel ({getFilterCount(ALERT_TYPES.MANUAL)})
        </Chip>
      </ScrollView>

      {/* Uyarı Listesi */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAlerts.length > 0 ? (
          <>
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onDismiss={() => handleDismissAlert(alert.id)}
              />
            ))}

            {alerts.length > 0 && (
              <Button
                mode="outlined"
                onPress={handleClearAll}
                icon="delete"
                style={styles.clearButton}
                textColor={COLORS.danger}
              >
                Tüm Geçmişi Temizle
              </Button>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>
              {searchQuery || selectedFilter !== 'all'
                ? 'Uyarı Bulunamadı'
                : 'Henüz Uyarı Yok'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || selectedFilter !== 'all'
                ? 'Arama kriterleriyle eşleşen uyarı bulunamadı'
                : 'Uyarılar burada görünecektir'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchbar: {
    backgroundColor: COLORS.card,
    elevation: 2,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  clearButton: {
    marginTop: 16,
    borderColor: COLORS.danger,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default AlertsScreen;
