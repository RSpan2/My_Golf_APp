import { useEffect, useState } from 'react';
import {
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

import { type Course, type Tee } from '@/constants/course';
import { type Round } from '@/constants/round';
import { loadCourses } from '@/services/courseStorage';
import { saveInProgressRound } from '@/services/roundStorage';

const TEE_OPTIONS: { key: Tee; label: string; color: string }[] = [
  { key: 'blue', label: 'Blue', color: '#3b82f6' },
  { key: 'white', label: 'White', color: '#e5e7eb' },
  { key: 'red', label: 'Red', color: '#ef4444' },
  { key: 'gold', label: 'Gold', color: '#facc15' },
];

function todayISO(): string {
  // Use local date to avoid UTC offset shifting the day
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function availableTees(course: Course): Tee[] {
  const tees: Tee[] = ['blue', 'white', 'red', 'gold'];
  const withYardages = tees.filter((tee) =>
    course.holes.some((h) => (h.yardages[tee] ?? 0) > 0)
  );
  // If no yardages entered yet, show all tees so the user can still start
  return withYardages.length > 0 ? withYardages : tees;
}

export default function StartRoundScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTee, setSelectedTee] = useState<Tee | null>(null);
  const [date, setDate] = useState(todayISO());

  useEffect(() => {
    loadCourses().then(setCourses);
  }, []);

  const canStart = selectedCourse !== null && selectedTee !== null && date.trim().length > 0;

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    // Reset tee when course changes
    setSelectedTee(null);
  };

  const handleStart = async () => {
    if (!selectedCourse || !selectedTee) return;

    const round: Round = {
      id: Date.now().toString(),
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      date: date.trim(),
      tee: selectedTee,
      holes: selectedCourse.holes.map((hole) => ({
        hole: hole.number,
        par: hole.par,
        yardage: hole.yardages[selectedTee] ?? 0,
        score: 0,
      })),
      shotTrackingEnabled: false,
      isComplete: false,
    };

    await saveInProgressRound(round);
    router.replace({ pathname: '/round/[id]', params: { id: round.id } });
  };

  const teesForCourse = selectedCourse ? availableTees(selectedCourse) : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>Start Round</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Date */}
        <Text style={styles.sectionLabel}>Date</Text>
        <TextInput
          style={styles.dateInput}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#4b5563"
          keyboardType="numbers-and-punctuation"
          returnKeyType="done"
          maxLength={10}
        />

        {/* Course picker */}
        <Text style={styles.sectionLabel}>Select Course</Text>
        {courses.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No courses yet. Add one in the Courses tab.</Text>
          </View>
        ) : (
          courses.map((course) => {
            const selected = selectedCourse?.id === course.id;
            return (
              <Pressable
                key={course.id}
                style={[styles.courseCard, selected && styles.courseCardSelected]}
                onPress={() => handleSelectCourse(course)}
              >
                <View style={styles.courseCardMain}>
                  <Text style={[styles.courseName, selected && styles.courseNameSelected]}>
                    {course.name}
                  </Text>
                  {(course.city || course.state) ? (
                    <Text style={styles.courseLocation}>
                      {[course.city, course.state].filter(Boolean).join(', ')}
                    </Text>
                  ) : null}
                </View>
                <Text style={styles.holeCount}>{course.holes.length}H</Text>
                {selected && (
                  <Ionicons name="checkmark-circle" size={20} color="#16a34a" style={styles.checkIcon} />
                )}
              </Pressable>
            );
          })
        )}

        {/* Tee selector */}
        {selectedCourse && (
          <>
            <Text style={styles.sectionLabel}>Select Tee</Text>
            <View style={styles.teeRow}>
              {TEE_OPTIONS.filter((t) => teesForCourse.includes(t.key)).map((tee) => {
                const selected = selectedTee === tee.key;
                return (
                  <Pressable
                    key={tee.key}
                    style={[styles.teeBtn, selected && styles.teeBtnSelected]}
                    onPress={() => setSelectedTee(tee.key)}
                  >
                    <View style={[styles.teeDot, { backgroundColor: tee.color }]} />
                    <Text style={[styles.teeLabel, selected && styles.teeLabelSelected]}>
                      {tee.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Start button */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
          onPress={handleStart}
          disabled={!canStart}
        >
          <Text style={styles.startBtnText}>Start Round</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
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
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 10,
  },
  dateInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  emptyBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  courseCardSelected: {
    borderColor: '#16a34a',
    backgroundColor: '#0f2d1a',
  },
  courseCardMain: {
    flex: 1,
  },
  courseName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  courseNameSelected: {
    color: '#4ade80',
  },
  courseLocation: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 2,
  },
  holeCount: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 8,
  },
  checkIcon: {
    marginLeft: 4,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  teeBtnSelected: {
    borderColor: '#16a34a',
    backgroundColor: '#0f2d1a',
  },
  teeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  teeLabel: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  teeLabelSelected: {
    color: '#4ade80',
  },
  bottomSpacer: {
    height: 24,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
  },
  startBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startBtnDisabled: {
    backgroundColor: '#1a2e1f',
  },
  startBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
