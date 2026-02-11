import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Icon, IconButton } from 'react-native-paper';
import { COLORS } from '../utils/constants';
import { formatDateTime } from '../utils/helpers';

/**
 * Uyarı kartı bileşeni
 * Alert card component
 */
const AlertCard = ({ alert, onDismiss }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return COLORS.danger;
      case 'high':
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'alert-circle';
      case 'high':
        return 'alert';
      default:
        return 'information';
    }
  };

  const severityColor = getSeverityColor(alert.severity);
  const icon = getSeverityIcon(alert.severity);

  return (
    <Card style={[styles.card, { borderLeftColor: severityColor }]} elevation={2}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Icon source={icon} size={24} color={severityColor} />
            <View style={styles.titleContainer}>
              <Text style={[styles.status, { color: severityColor }]}>
                {alert.status.toUpperCase()}
              </Text>
              <Text style={styles.timestamp}>
                {formatDateTime(alert.timestamp)}
              </Text>
            </View>
          </View>
          {onDismiss && (
            <IconButton
              icon="close"
              size={20}
              onPress={onDismiss}
              iconColor={COLORS.textSecondary}
            />
          )}
        </View>

        <Text style={styles.message}>{alert.message}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    marginVertical: 6,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  titleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  message: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginLeft: 36,
  },
});

export default AlertCard;
