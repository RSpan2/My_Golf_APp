import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import { type Course } from '@/constants/course';
import { loadCourses } from '@/services/courseStorage';

export default function CoursesScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadCourses().then(setCourses);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Courses</Text>
        <Pressable onPress={() => router.push('/course/new')} hitSlop={10}>
          <Ionicons name="add" size={26} color="#ffffff" />
        </Pressable>
      </View>

      {courses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="map-outline" size={48} color="#374151" />
          <Text style={styles.emptyText}>
            No courses added yet.{'\n'}Tap + to add your first course.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {courses.map((course) => (
            <Pressable
              key={course.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => router.push({ pathname: '/course/[id]', params: { id: course.id } })}
            >
              <View style={styles.cardMain}>
                <Text style={styles.courseName}>{course.name}</Text>
                {(course.city || course.state) ? (
                  <Text style={styles.courseLocation}>
                    {[course.city, course.state].filter(Boolean).join(', ')}
                  </Text>
                ) : null}
              </View>
              <View style={styles.cardRight}>
                <View style={styles.holeBadge}>
                  <Text style={styles.holeBadgeText}>{course.holes.length}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#6b7280" style={styles.chevron} />
              </View>
            </Pressable>
          ))}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
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
    fontSize: 20,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 14,
    padding: 16,
  },
  cardPressed: {
    backgroundColor: '#222222',
  },
  cardMain: {
    flex: 1,
  },
  courseName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  courseLocation: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 2,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  holeBadge: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  holeBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  chevron: {
    marginLeft: 4,
  },
  bottomSpacer: {
    height: 32,
  },
});
