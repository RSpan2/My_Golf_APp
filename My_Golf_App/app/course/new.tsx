import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { buildDefaultHoles, type Course } from '@/constants/course';
import { upsertCourse } from '@/services/courseStorage';

export default function NewCourseScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [holeCount, setHoleCount] = useState<9 | 18>(18);

  const canSave = name.trim().length > 0;

  const handleSave = async () => {
    if (!canSave) return;
    const course: Course = {
      id: Date.now().toString(),
      name: name.trim(),
      city: city.trim(),
      state: state.trim().toUpperCase(),
      holes: buildDefaultHoles(holeCount),
      isHome: false,
      ratings: {},
    };
    await upsertCourse(course);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </Pressable>
          <Text style={styles.headerTitle}>New Course</Text>
          <Pressable
            onPress={handleSave}
            disabled={!canSave}
            hitSlop={10}
          >
            <Text style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}>
              Save
            </Text>
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          {/* Course Name */}
          <Text style={styles.label}>Course Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Augusta National"
            placeholderTextColor="#4b5563"
            autoFocus
            returnKeyType="next"
          />

          {/* City */}
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="e.g. Augusta"
            placeholderTextColor="#4b5563"
            returnKeyType="next"
          />

          {/* State */}
          <Text style={styles.label}>State</Text>
          <TextInput
            style={[styles.input, styles.inputShort]}
            value={state}
            onChangeText={(t) => setState(t.slice(0, 2))}
            placeholder="e.g. GA"
            placeholderTextColor="#4b5563"
            autoCapitalize="characters"
            maxLength={2}
            returnKeyType="done"
          />

          {/* Hole Count */}
          <Text style={styles.label}>Number of Holes</Text>
          <View style={styles.toggleRow}>
            {([9, 18] as const).map((count) => (
              <Pressable
                key={count}
                style={[styles.toggleButton, holeCount === count && styles.toggleButtonActive]}
                onPress={() => setHoleCount(count)}
              >
                <Text style={[styles.toggleText, holeCount === count && styles.toggleTextActive]}>
                  {count}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  saveButton: {
    color: '#16a34a',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: '#374151',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  label: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  inputShort: {
    width: 80,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleButton: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  toggleButtonActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  toggleText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  bottomSpacer: {
    height: 40,
  },
});
