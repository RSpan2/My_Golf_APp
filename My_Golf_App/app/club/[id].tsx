import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router';

import EditDistanceModal from '@/components/clubs/EditDistanceModal';
import { ALL_CLUBS, STAT_COLUMNS, type StatKey } from '@/constants/clubs';
import { loadClubData, saveClubData, type ClubEntry } from '@/services/clubStorage';

export default function ClubDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [clubData, setClubData] = useState<Record<string, ClubEntry>>({});
  const [editStat, setEditStat] = useState<StatKey | null>(null);

  const club = ALL_CLUBS.find((c) => c.id === id);

  const loadData = useCallback(async () => {
    const data = await loadClubData();
    setClubData(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleSave = (value: number | undefined) => {
    if (!editStat || !id) return;
    const updated = {
      ...clubData,
      [id]: {
        ...clubData[id],
        stats: { ...clubData[id]?.stats, [editStat]: value },
      },
    };
    setClubData(updated);
    saveClubData(updated);
    setEditStat(null);
  };

  if (!club) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Club not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const entry: ClubEntry = clubData[id] ?? { active: false, stats: {} };
  const editColLabel = editStat
    ? (STAT_COLUMNS.find((c) => c.id === editStat)?.label ?? '')
    : '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </Pressable>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>{club.name}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{club.shortName}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionHeader}>Distances</Text>

        <View style={styles.chipsGrid}>
          {STAT_COLUMNS.map((col) => {
            const value = entry.stats[col.id];
            return (
              <Pressable
                key={col.id}
                onPress={() => setEditStat(col.id)}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
              >
                <Text style={styles.chipLabel}>{col.label}</Text>
                <Text style={[styles.chipValue, value === undefined && styles.chipEmpty]}>
                  {value !== undefined ? `${value} yds` : '—'}
                </Text>
                <View style={styles.chipEditHint}>
                  <Ionicons name="pencil-outline" size={10} color="#4b5563" />
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <EditDistanceModal
        visible={editStat !== null}
        clubName={club.name}
        statLabel={editColLabel}
        currentValue={editStat ? entry.stats[editStat] : undefined}
        onSave={handleSave}
        onClose={() => setEditStat(null)}
      />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    marginRight: 8,
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#1e3a2f',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#4ade80',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  chip: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minWidth: '44%',
    flex: 1,
  },
  chipPressed: {
    backgroundColor: '#242424',
  },
  chipLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  chipValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  chipEmpty: {
    color: '#374151',
  },
  chipEditHint: {
    marginTop: 6,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 40,
  },
});
