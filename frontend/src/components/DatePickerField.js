import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';

import { fromYMD, toYMD } from '../utils/dateUtils';

const DatePickerField = ({
  label = 'Date',
  value, // YYYY-MM-DD
  onChange,
  disabled = false,
}) => {
  const [show, setShow] = useState(false);

  const dateValue = useMemo(() => {
    const parsed = fromYMD(value);
    return parsed || new Date();
  }, [value]);

  const open = () => {
    if (disabled) return;
    setShow(true);
  };

  const close = () => setShow(false);

  const handleChange = (_event, selectedDate) => {
    if (Platform.OS !== 'ios') {
      close();
    }
    if (!selectedDate) return;
    onChange?.(toYMD(selectedDate));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={open}
        style={[styles.input, disabled && styles.inputDisabled]}
      >
        <Calendar size={18} color={disabled ? '#9CA3AF' : '#4F46E5'} />
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value || 'Select date'}
        </Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleChange}
        />
      )}

      {show && Platform.OS === 'ios' && (
        <Pressable onPress={close} style={styles.iosDone}>
          <Text style={styles.iosDoneText}>Done</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
  },
  value: {
    fontSize: 14,
    color: '#111827',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  iosDone: {
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
  },
  iosDoneText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default DatePickerField;
