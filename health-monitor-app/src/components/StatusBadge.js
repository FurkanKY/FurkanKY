import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { COLORS, ALERT_TYPES } from '../utils/constants';
import { getStatusColor } from '../utils/helpers';

/**
 * Durum rozeti bileşeni
 * Status badge component
 */
const StatusBadge = ({ status, size = 'medium' }) => {
  const color = getStatusColor(status);

  const getIcon = () => {
    switch (status) {
      case ALERT_TYPES.NORMAL:
        return 'check-circle';
      case ALERT_TYPES.FALL:
        return 'alert-circle';
      case ALERT_TYPES.INACTIVITY:
        return 'sleep';
      case ALERT_TYPES.HIGH_HEART_RATE:
      case ALERT_TYPES.LOW_HEART_RATE:
        return 'heart-pulse';
      case ALERT_TYPES.MANUAL:
        return 'bell-alert';
      default:
        return 'information';
    }
  };

  const getLabel = () => {
    switch (status) {
      case ALERT_TYPES.NORMAL:
        return 'Normal';
      case ALERT_TYPES.FALL:
        return 'Düşme';
      case ALERT_TYPES.INACTIVITY:
        return 'Hareketsiz';
      case ALERT_TYPES.HIGH_HEART_RATE:
        return 'Yüksek Nabız';
      case ALERT_TYPES.LOW_HEART_RATE:
        return 'Düşük Nabız';
      case ALERT_TYPES.MANUAL:
        return 'Acil Durum';
      default:
        return 'Bilinmeyen';
    }
  };

  const iconSize = size === 'large' ? 24 : size === 'small' ? 16 : 20;
  const fontSize = size === 'large' ? 16 : size === 'small' ? 12 : 14;

  return (
    <View style={[styles.container, { backgroundColor: color + '20' }]}>
      <Icon source={getIcon()} size={iconSize} color={color} />
      <Text style={[styles.label, { color, fontSize }]}>
        {getLabel()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default StatusBadge;
