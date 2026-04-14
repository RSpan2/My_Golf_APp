import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import HoleEditor from '@/components/course/HoleEditor';
import { type Course, type Hole } from '@/constants/course';
import { deleteCourse, getCourseById, upsertCourse } from '@/services/courseStorage';

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [editingHole, setEditingHole] = useState<Hole | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    getCourseById(id).then((c) => setCourse(c ?? null));
  }, [id]);

  const handleHoleSave = async (updated: Hole) => {
    if (!course) return;
    const updatedCourse: Course = {
      ...course,
      holes: course.holes.map((h) => (h.number === updated.number ? updated : h)),
    };
    setCourse(updatedCourse);
    setEditingHole(null);
    await upsertCourse(updatedCourse);
  };

  const handleDelete = async () => {
    await deleteCourse(id);
    router.back();
  };

  const totalPar = course?.holes.reduce((sum, h) => sum + h.par, 0) ?? 0;
  const totalWhiteYards = course?.holes.reduce((sum, h) => sum + (h.yardages.white ?? 0), 0) ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {course?.name ?? ''}
        </Text>
        <View style={styles.headerRight}>
          <Pressable
            onPress={() => router.push({ pathname: '/course/edit/[id]', params: { id } })}
            hitSlop={10}
            style={styles.headerBtn}
          >
            <Ionicons name="pencil-outline" size={20} color="#9ca3af" />
          </Pressable>
          <Pressable onPress={() => setShowDeleteModal(true)} hitSlop={10}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </Pressable>
        </View>
      </View>

      {course && (
        <>
          {/* Summary strip */}
          <View style={styles.summaryStrip}>
            <View style={styles.summaryChip}>
              <Text style={styles.summaryValue}>{course.holes.length}</Text>
              <Text style={styles.summaryLabel}>Holes</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryChip}>
              <Text style={styles.summaryValue}>{totalPar}</Text>
              <Text style={styles.summaryLabel}>Par</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryChip}>
              <Text style={styles.summaryValue}>
                {totalWhiteYards > 0 ? totalWhiteYards.toLocaleString() : '—'}
              </Text>
              <Text style={styles.summaryLabel}>White Yds</Text>
            </View>
          </View>

          {/* Column headers */}
          <View style={styles.columnHeader}>
            <Text style={[styles.colLabel, styles.colHole]}>Hole</Text>
            <Text style={[styles.colLabel, styles.colPar]}>Par</Text>
            <Text style={[styles.colLabel, styles.colYards]}>Yards</Text>
            <Text style={[styles.colLabel, styles.colHdcp]}>Hdcp</Text>
          </View>

          <ScrollView style={styles.list}>
            {course.holes.map((hole) => (
              <Pressable
                key={hole.number}
                style={({ pressed }) => [styles.holeRow, pressed && styles.holeRowPressed]}
                onPress={() => setEditingHole(hole)}
              >
                <View style={styles.holeNumberBadge}>
                  <Text style={styles.holeNumber}>{hole.number}</Text>
                </View>
                <Text style={[styles.cell, styles.colPar]}>{hole.par}</Text>
                <Text style={[styles.cell, styles.colYards]}>
                  {hole.yardages.white !== undefined ? hole.yardages.white : '—'}
                </Text>
                <Text style={[styles.cell, styles.colHdcp]}>{hole.handicapIndex}</Text>
                <Ionicons name="chevron-forward" size={14} color="#374151" />
              </Pressable>
            ))}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </>
      )}

      {/* Hole Editor modal */}
      {editingHole && (
        <HoleEditor
          visible={!!editingHole}
          hole={editingHole}
          onSave={handleHoleSave}
          onClose={() => setEditingHole(null)}
        />
      )}

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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerBtn: {},
  summaryStrip: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  summaryChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#2a2a2a',
    marginVertical: 10,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  colLabel: {
    color: '#4b5563',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  colHole: {
    width: 48,
  },
  colPar: {
    width: 48,
    textAlign: 'center',
  },
  colYards: {
    flex: 1,
    textAlign: 'right',
  },
  colHdcp: {
    width: 52,
    textAlign: 'right',
    marginRight: 20,
  },
  list: {
    flex: 1,
  },
  holeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
  },
  holeRowPressed: {
    backgroundColor: '#161616',
  },
  holeNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  holeNumber: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '700',
  },
  cell: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 32,
  },
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
