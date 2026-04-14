import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type Hole, type Tee } from '@/constants/course';

interface HoleEditorProps {
  visible: boolean;
  hole: Hole;
  onSave: (updated: Hole) => void;
  onClose: () => void;
}

const PARS = [3, 4, 5] as const;
const TEES: { key: Tee; label: string; color: string }[] = [
  { key: 'blue', label: 'Blue', color: '#3b82f6' },
  { key: 'white', label: 'White', color: '#ffffff' },
  { key: 'red', label: 'Red', color: '#ef4444' },
  { key: 'gold', label: 'Gold', color: '#facc15' },
];

export default function HoleEditor({ visible, hole, onSave, onClose }: HoleEditorProps) {
  const [par, setPar] = useState(hole.par);
  const [yardages, setYardages] = useState<Record<Tee, string>>({
    blue: hole.yardages.blue !== undefined ? String(hole.yardages.blue) : '',
    white: hole.yardages.white !== undefined ? String(hole.yardages.white) : '',
    red: hole.yardages.red !== undefined ? String(hole.yardages.red) : '',
    gold: hole.yardages.gold !== undefined ? String(hole.yardages.gold) : '',
  });
  const [handicapIndex, setHandicapIndex] = useState(String(hole.handicapIndex));

  const handleOpen = () => {
    setPar(hole.par);
    setYardages({
      blue: hole.yardages.blue !== undefined ? String(hole.yardages.blue) : '',
      white: hole.yardages.white !== undefined ? String(hole.yardages.white) : '',
      red: hole.yardages.red !== undefined ? String(hole.yardages.red) : '',
      gold: hole.yardages.gold !== undefined ? String(hole.yardages.gold) : '',
    });
    setHandicapIndex(String(hole.handicapIndex));
  };

  const handleSave = () => {
    const parseYardage = (s: string) => {
      const n = parseInt(s, 10);
      return isNaN(n) || s.trim() === '' ? undefined : n;
    };
    const hdcp = parseInt(handicapIndex, 10);
    onSave({
      ...hole,
      par,
      yardages: {
        blue: parseYardage(yardages.blue),
        white: parseYardage(yardages.white),
        red: parseYardage(yardages.red),
        gold: parseYardage(yardages.gold),
      },
      handicapIndex: isNaN(hdcp) ? hole.handicapIndex : Math.min(18, Math.max(1, hdcp)),
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onShow={handleOpen}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Hole {hole.number}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.cancelBtn}>Cancel</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
            {/* Par */}
            <Text style={styles.label}>Par</Text>
            <View style={styles.parRow}>
              {PARS.map((p) => (
                <Pressable
                  key={p}
                  style={[styles.parBtn, par === p && styles.parBtnActive]}
                  onPress={() => setPar(p)}
                >
                  <Text style={[styles.parBtnText, par === p && styles.parBtnTextActive]}>
                    {p}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Yardages */}
            <Text style={styles.label}>Yardages</Text>
            {TEES.map(({ key, label, color }) => (
              <View key={key} style={styles.yardageRow}>
                <View style={[styles.teeDot, { backgroundColor: color }]} />
                <Text style={styles.teeLabel}>{label}</Text>
                <TextInput
                  style={styles.yardageInput}
                  value={yardages[key]}
                  onChangeText={(t) => setYardages((prev) => ({ ...prev, [key]: t }))}
                  keyboardType="number-pad"
                  placeholder="—"
                  placeholderTextColor="#4b5563"
                  maxLength={4}
                  returnKeyType="done"
                />
              </View>
            ))}

            {/* Handicap Index */}
            <Text style={styles.label}>Handicap Index</Text>
            <View style={styles.handicapRow}>
              <TextInput
                style={styles.handicapInput}
                value={handicapIndex}
                onChangeText={setHandicapIndex}
                keyboardType="number-pad"
                placeholder="1–18"
                placeholderTextColor="#4b5563"
                maxLength={2}
                returnKeyType="done"
              />
              <Text style={styles.handicapHint}>1 = hardest hole</Text>
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Save */}
          <Pressable
            style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>Save Hole</Text>
          </Pressable>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderColor: '#2a2a2a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelBtn: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '500',
  },
  scroll: {
    paddingHorizontal: 20,
  },
  label: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 10,
  },
  parRow: {
    flexDirection: 'row',
    gap: 10,
  },
  parBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#242424',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  parBtnActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  parBtnText: {
    color: '#6b7280',
    fontSize: 18,
    fontWeight: '700',
  },
  parBtnTextActive: {
    color: '#ffffff',
  },
  yardageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  teeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  teeLabel: {
    color: '#9ca3af',
    fontSize: 15,
    fontWeight: '500',
    width: 48,
  },
  yardageInput: {
    flex: 1,
    backgroundColor: '#242424',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    textAlign: 'right',
  },
  handicapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  handicapInput: {
    backgroundColor: '#242424',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    width: 80,
    textAlign: 'center',
  },
  handicapHint: {
    color: '#6b7280',
    fontSize: 13,
  },
  bottomSpacer: {
    height: 24,
  },
  saveBtn: {
    margin: 16,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: '#16a34a',
    alignItems: 'center',
  },
  saveBtnPressed: {
    backgroundColor: '#15803d',
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
