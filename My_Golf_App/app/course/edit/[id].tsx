import { useEffect, useState } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';

import { resolveDisplayTee, teesWithData, type Course, type Tee } from '@/constants/course';
import { getCourseById, upsertCourse } from '@/services/courseStorage';

const TEES: { key: Tee; label: string; color: string }[] = [
  { key: 'blue', label: 'Blue', color: '#3b82f6' },
  { key: 'white', label: 'White', color: '#ffffff' },
  { key: 'red', label: 'Red', color: '#ef4444' },
  { key: 'gold', label: 'Gold', color: '#facc15' },
];

type RatingFields = { courseRating: string; slope: string };

export default function EditCourseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [displayTee, setDisplayTee] = useState<Tee>('white');
  const [ratings, setRatings] = useState<Record<Tee, RatingFields>>({
    blue: { courseRating: '', slope: '' },
    white: { courseRating: '', slope: '' },
    red: { courseRating: '', slope: '' },
    gold: { courseRating: '', slope: '' },
  });

  useEffect(() => {
    getCourseById(id).then((c) => {
      if (!c) return;
      setCourse(c);
      setName(c.name);
      setCity(c.city);
      setState(c.state);
      setDisplayTee(resolveDisplayTee(c));
      setRatings({
        blue: {
          courseRating: c.ratings.blue ? String(c.ratings.blue.courseRating) : '',
          slope: c.ratings.blue ? String(c.ratings.blue.slope) : '',
        },
        white: {
          courseRating: c.ratings.white ? String(c.ratings.white.courseRating) : '',
          slope: c.ratings.white ? String(c.ratings.white.slope) : '',
        },
        red: {
          courseRating: c.ratings.red ? String(c.ratings.red.courseRating) : '',
          slope: c.ratings.red ? String(c.ratings.red.slope) : '',
        },
        gold: {
          courseRating: c.ratings.gold ? String(c.ratings.gold.courseRating) : '',
          slope: c.ratings.gold ? String(c.ratings.gold.slope) : '',
        },
      });
    });
  }, [id]);

  const canSave = name.trim().length > 0;

  const updateRating = (tee: Tee, field: keyof RatingFields, value: string) => {
    setRatings((prev) => ({ ...prev, [tee]: { ...prev[tee], [field]: value } }));
  };

  const handleSave = async () => {
    if (!course || !canSave) return;

    const parsedRatings: Course['ratings'] = {};
    for (const { key } of TEES) {
      const r = parseFloat(ratings[key].courseRating);
      const s = parseInt(ratings[key].slope, 10);
      if (!isNaN(r) && !isNaN(s)) {
        parsedRatings[key] = { courseRating: r, slope: s };
      }
    }

    try {
      await upsertCourse({
        ...course,
        name: name.trim(),
        city: city.trim(),
        state: state.trim().toUpperCase(),
        ratings: parsedRatings,
        displayTee,
      });
      router.back();
    } catch {
      // Storage failure — stay on screen
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Course</Text>
          <Pressable onPress={handleSave} disabled={!canSave} hitSlop={10}>
            <Text style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}>Save</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Course Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Augusta National"
            placeholderTextColor="#4b5563"
            returnKeyType="next"
          />

          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="e.g. Augusta"
            placeholderTextColor="#4b5563"
            returnKeyType="next"
          />

          <Text style={styles.label}>State</Text>
          <TextInput
            style={[styles.input, styles.inputShort]}
            value={state}
            onChangeText={setState}
            placeholder="e.g. GA"
            placeholderTextColor="#4b5563"
            autoCapitalize="characters"
            maxLength={2}
            returnKeyType="done"
          />

          {/* Display Tee */}
          <Text style={styles.label}>Display Tee</Text>
          <Text style={styles.hint}>Yardages shown for this tee on the course detail screen.</Text>
          <View style={styles.teeRow}>
            {TEES.filter(({ key }) =>
              course ? teesWithData(course.holes).includes(key) : true
            ).map(({ key, label, color }) => (
              <Pressable
                key={key}
                style={[styles.teeBtn, displayTee === key && styles.teeBtnActive]}
                onPress={() => setDisplayTee(key)}
              >
                <View style={[styles.teeDot, { backgroundColor: color }]} />
                <Text style={[styles.teeBtnLabel, displayTee === key && styles.teeBtnLabelActive]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
          {course && teesWithData(course.holes).length === 0 && (
            <Text style={styles.noTeeHint}>
              Add yardages to holes first, then select a display tee.
            </Text>
          )}

          {/* Tee Ratings */}
          <Text style={styles.label}>Tee Ratings</Text>
          <Text style={styles.hint}>Used for handicap calculations.</Text>
          <View style={styles.ratingsTable}>
            <View style={styles.ratingsHeaderRow}>
              <View style={styles.ratingsTeCol} />
              <Text style={styles.ratingsColHeader}>Course Rating</Text>
              <Text style={styles.ratingsColHeader}>Slope</Text>
            </View>
            {TEES.map(({ key, label, color }) => (
              <View key={key} style={styles.ratingsRow}>
                <View style={styles.ratingsTeCol}>
                  <View style={[styles.teeDot, { backgroundColor: color }]} />
                  <Text style={styles.teeLabel}>{label}</Text>
                </View>
                <TextInput
                  style={styles.ratingInput}
                  value={ratings[key].courseRating}
                  onChangeText={(v) => updateRating(key, 'courseRating', v)}
                  keyboardType="decimal-pad"
                  placeholder="72.4"
                  placeholderTextColor="#4b5563"
                  maxLength={5}
                  returnKeyType="next"
                />
                <TextInput
                  style={styles.ratingInput}
                  value={ratings[key].slope}
                  onChangeText={(v) => updateRating(key, 'slope', v)}
                  keyboardType="number-pad"
                  placeholder="113"
                  placeholderTextColor="#4b5563"
                  maxLength={3}
                  returnKeyType="next"
                />
              </View>
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
  saveBtn: {
    color: '#16a34a',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtnDisabled: {
    color: '#374151',
  },
  scroll: {
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
  hint: {
    color: '#4b5563',
    fontSize: 13,
    marginBottom: 12,
    marginTop: -4,
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
  ratingsTable: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
  },
  ratingsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  ratingsColHeader: {
    flex: 1,
    color: '#4b5563',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  ratingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
    gap: 8,
  },
  ratingsTeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 64,
    gap: 6,
  },
  teeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  teeLabel: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  ratingInput: {
    flex: 1,
    backgroundColor: '#242424',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    textAlign: 'center',
  },
  teeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  teeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  teeBtnActive: {
    borderColor: '#16a34a',
    backgroundColor: '#0f2d1a',
  },
  teeBtnLabel: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  teeBtnLabelActive: {
    color: '#4ade80',
  },
  noTeeHint: {
    color: '#4b5563',
    fontSize: 13,
    marginTop: 8,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 40,
  },
});
