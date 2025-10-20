import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import { COLORS } from '../utils/constants';
import { getStatusColor } from '../utils/helpers';

/**
 * Sağlık verisini gösteren kart bileşeni
 * Health data card component
 */
const HealthCard = ({ title, value, unit, icon, status = 'normal', subtitle }) => {
  const statusColor = getStatusColor(status);

  return (
    <Card style={styles.card} elevation={2}>
      <Card.Content>
        <View style={styles.header}>
          <Icon source={icon} size={24} color={statusColor} />
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.value, { color: statusColor }]}>
            {value}
            <Text style={styles.unit}> {unit}</Text>
          </Text>
        </View>

        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    marginVertical: 8,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default HealthCard;
