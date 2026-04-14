import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import { type Round } from '@/constants/round';
import { clearInProgressRound, loadInProgressRound } from '@/services/roundStorage';

function formatDate(iso: string): string {
  // Append time to avoid UTC offset shifting the date
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function HomeScreen() {
  const router = useRouter();
  const [inProgressRound, setInProgressRound] = useState<Round | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadInProgressRound().then(setInProgressRound);
    }, [])
  );

  const handleDiscard = async () => {
    await clearInProgressRound();
    setInProgressRound(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Resume banner */}
        {inProgressRound && (
          <View style={styles.resumeBanner}>
            <View style={styles.resumeInfo}>
              <Ionicons name="golf-outline" size={18} color="#4ade80" />
              <View style={styles.resumeText}>
                <Text style={styles.resumeTitle}>{inProgressRound.courseName}</Text>
                <Text style={styles.resumeDate}>{formatDate(inProgressRound.date)} · In progress</Text>
              </View>
            </View>
            <View style={styles.resumeActions}>
              <Pressable
                style={styles.resumeBtn}
                onPress={() =>
                  router.push({ pathname: '/round/[id]', params: { id: inProgressRound.id } })
                }
              >
                <Text style={styles.resumeBtnText}>Resume</Text>
              </Pressable>
              <Pressable onPress={handleDiscard} hitSlop={8}>
                <Ionicons name="close" size={18} color="#6b7280" />
              </Pressable>
            </View>
          </View>
        )}

        {/* Stats row — populated in Story 1.6 */}
        <View style={styles.statsRow}>
          {[
            { label: 'Rounds', value: '—' },
            { label: 'Avg Score', value: '—' },
            { label: 'Best Round', value: '—' },
          ].map(({ label, value }) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Start Round CTA */}
        <Pressable
          style={({ pressed }) => [styles.startBtn, pressed && styles.startBtnPressed]}
          onPress={() => router.push('/round/new')}
        >
          <Ionicons name="golf-outline" size={22} color="#ffffff" />
          <Text style={styles.startBtnText}>Start Round</Text>
        </Pressable>

        {/* Recent rounds placeholder — populated in Story 1.6 */}
        <View style={styles.recentSection}>
          <Text style={styles.recentHeader}>Recent Rounds</Text>
          <View style={styles.recentEmpty}>
            <Text style={styles.recentEmptyText}>No rounds yet.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  // Resume banner
  resumeBanner: {
    backgroundColor: '#0f2d1a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#16a34a',
    padding: 14,
    gap: 10,
  },
  resumeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resumeText: {
    flex: 1,
  },
  resumeTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  resumeDate: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  resumeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  resumeBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  resumeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  // Start Round button
  startBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  startBtnPressed: {
    backgroundColor: '#15803d',
  },
  startBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  // Recent rounds
  recentSection: {
    gap: 10,
  },
  recentHeader: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  recentEmpty: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  recentEmptyText: {
    color: '#4b5563',
    fontSize: 14,
  },
});
