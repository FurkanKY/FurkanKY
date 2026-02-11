import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slider } from 'react-native-paper';
import { COLORS } from '../utils/constants';

/**
 * Eşik değeri ayarlama slider bileşeni
 * Threshold adjustment slider component
 */
const ThresholdSlider = ({
  label,
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step = 1,
  unit = '',
  disabled = false
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value} {unit}
        </Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        value={value}
        onValueChange={onValueChange}
        step={step}
        disabled={disabled}
        minimumTrackTintColor={COLORS.primary}
        maximumTrackTintColor={COLORS.border}
        thumbTintColor={COLORS.primary}
      />

      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>
          {minimumValue} {unit}
        </Text>
        <Text style={styles.rangeText}>
          {maximumValue} {unit}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  rangeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default ThresholdSlider;
