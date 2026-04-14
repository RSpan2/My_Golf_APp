import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { type Course } from '@/constants/course';
import { deleteCourse, getCourseById } from '@/services/courseStorage';

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    getCourseById(id).then((c) => setCourse(c ?? null));
  }, [id]);

  const handleDelete = async () => {
    await deleteCourse(id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {course?.name ?? ''}
        </Text>
        <Pressable onPress={() => setShowDeleteModal(true)} hitSlop={10}>
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </Pressable>
      </View>

      {/* Body — placeholder until Story 1.2 */}
      <View style={styles.body}>
        {course ? (
          <>
            <Text style={styles.courseName}>{course.name}</Text>
            {(course.city || course.state) ? (
              <Text style={styles.courseLocation}>
                {[course.city, course.state].filter(Boolean).join(', ')}
              </Text>
            ) : null}
            <Text style={styles.holeCount}>{course.holes.length} holes</Text>
            <Text style={styles.comingSoon}>Hole details coming in Story 1.2</Text>
          </>
        ) : null}
      </View>

      {/* Delete confirmation modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowDeleteModal(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Delete Course?</Text>
            <Text style={styles.modalBody}>
              "{course?.name}" will be permanently removed.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnDelete]}
                onPress={handleDelete}
              >
                <Text style={styles.modalBtnDeleteText}>Delete</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  courseName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  courseLocation: {
    color: '#6b7280',
    fontSize: 15,
    marginTop: 6,
  },
  holeCount: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  comingSoon: {
    color: '#374151',
    fontSize: 13,
    marginTop: 32,
    textAlign: 'center',
  },
  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalBody: {
    color: '#9ca3af',
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#2a2a2a',
  },
  modalBtnCancelText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  modalBtnDelete: {
    backgroundColor: '#ef4444',
  },
  modalBtnDeleteText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
