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

import { useLocalSearchParams, useRouter } from 'expo-router';

import { type Course, type Hole, type Tee } from '@/constants/course';
import { getCourseById, upsertCourse } from '@/services/courseStorage';

const PARS = [3, 4, 5] as const;
const TEES: { key: Tee; label: string; color: string }[] = [
  { key: 'blue', label: 'Blue', color: '#3b82f6' },
  { key: 'white', label: 'White', color: '#ffffff' },
  { key: 'red', label: 'Red', color: '#ef4444' },
  { key: 'gold', label: 'Gold', color: '#facc15' },
];

type YardageState = Record<Tee, string>;

function holeToState(hole: Hole): { par: number; yardages: YardageState; handicapIndex: string } {
  return {
    par: hole.par,
    yardages: {
      blue: hole.yardages.blue !== undefined ? String(hole.yardages.blue) : '',
      white: hole.yardages.white !== undefined ? String(hole.yardages.white) : '',
      red: hole.yardages.red !== undefined ? String(hole.yardages.red) : '',
      gold: hole.yardages.gold !== undefined ? String(hole.yardages.gold) : '',
    },
    handicapIndex: String(hole.handicapIndex),
  };
}

function applyStateToHole(hole: Hole, par: number, yardages: YardageState, handicapIndex: string): Hole {
  const parseY = (s: string) => {
    const n = parseInt(s, 10);
    return isNaN(n) || s.trim() === '' ? undefined : n;
  };
  const hdcp = parseInt(handicapIndex, 10);
  return {
    ...hole,
    par,
    yardages: {
      blue: parseY(yardages.blue),
      white: parseY(yardages.white),
      red: parseY(yardages.red),
      gold: parseY(yardages.gold),
    },
    handicapIndex: isNaN(hdcp) ? hole.handicapIndex : Math.min(18, Math.max(1, hdcp)),
  };
}

export default function CourseSetupScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [par, setPar] = useState(4);
  const [yardages, setYardages] = useState<YardageState>({ blue: '', white: '', red: '', gold: '' });
  const [handicapIndex, setHandicapIndex] = useState('1');

  useEffect(() => {
    getCourseById(id).then((c) => {
      if (!c) return;
      setCourse(c);
      const state = holeToState(c.holes[0]);
      setPar(state.par);
      setYardages(state.yardages);
      setHandicapIndex(state.handicapIndex);
    });
  }, [id]);

  if (!course) return null;

  const totalHoles = course.holes.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalHoles - 1;
  const currentHole = course.holes[currentIndex];

  const buildUpdatedCourse = (): Course => {
    const updatedHole = applyStateToHole(currentHole, par, yardages, handicapIndex);
    return {
      ...course,
      holes: course.holes.map((h) => (h.number === updatedHole.number ? updatedHole : h)),
    };
  };

  const goToHole = (updatedCourse: Course, index: number) => {
    setCourse(updatedCourse);
    setCurrentIndex(index);
    const state = holeToState(updatedCourse.holes[index]);
    setPar(state.par);
    setYardages(state.yardages);
    setHandicapIndex(state.handicapIndex);
  };

  const handlePrevious = () => {
    const updated = buildUpdatedCourse();
    goToHole(updated, currentIndex - 1);
  };

  const handleNext = async () => {
    const updated = buildUpdatedCourse();
    try {
      await upsertCourse(updated);
    } catch {}
    goToHole(updated, currentIndex + 1);
  };

  const handleFinish = async () => {
    const updated = buildUpdatedCourse();
    try {
      await upsertCourse(updated);
    } catch {}
    router.replace({ pathname: '/course/[id]', params: { id } });
  };

  const progress = (currentIndex + 1) / totalHoles;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.courseName} numberOfLines={1}>{course.name}</Text>
            <Text style={styles.holeSubtitle}>
              Hole {currentIndex + 1} of {totalHoles}
            </Text>
          </View>
          <Pressable onPress={handleFinish} hitSlop={10}>
            <Text style={styles.skipBtn}>Skip to End</Text>
          </Pressable>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
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
                returnKeyType="next"
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

        {/* Footer navigation */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.footerBtn, styles.footerBtnSecondary, isFirst && styles.footerBtnDisabled]}
            onPress={handlePrevious}
            disabled={isFirst}
          >
            <Text style={[styles.footerBtnText, isFirst && styles.footerBtnTextDisabled]}>
              Previous
            </Text>
          </Pressable>
          <Pressable
            style={[styles.footerBtn, styles.footerBtnPrimary]}
            onPress={isLast ? handleFinish : handleNext}
          >
            <Text style={styles.footerBtnPrimaryText}>
              {isLast ? 'Finish' : 'Next'}
            </Text>
          </Pressable>
        </View>
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
  courseName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  holeSubtitle: {
    color: '#16a34a',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  skipBtn: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#1f1f1f',
  },
  progressFill: {
    height: 3,
    backgroundColor: '#16a34a',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  label: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 10,
  },
  parRow: {
    flexDirection: 'row',
    gap: 10,
  },
  parBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
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
    fontSize: 20,
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
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerBtnSecondary: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  footerBtnPrimary: {
    backgroundColor: '#16a34a',
  },
  footerBtnDisabled: {
    opacity: 0.35,
  },
  footerBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  footerBtnTextDisabled: {
    color: '#6b7280',
  },
  footerBtnPrimaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
