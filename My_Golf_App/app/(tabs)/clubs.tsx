import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import ClubCard from '@/components/clubs/ClubRow';
import {
  ALL_CLUBS,
  CLUB_GROUP_LABELS,
  CLUB_GROUP_ORDER,
} from '@/constants/clubs';
import { loadClubData, type ClubEntry } from '@/services/clubStorage';

export default function ClubsScreen() {
  const router = useRouter();
  const [clubData, setClubData] = useState<Record<string, ClubEntry>>({});

  const loadData = useCallback(async () => {
    const data = await loadClubData();
    setClubData(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const activeClubs = ALL_CLUBS.filter((c) => clubData[c.id]?.active);

  const grouped = CLUB_GROUP_ORDER
    .map((type) => ({
      type,
      label: CLUB_GROUP_LABELS[type],
      clubs: activeClubs.filter((c) => c.type === type),
    }))
    .filter((g) => g.clubs.length > 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clubs</Text>
        <Pressable onPress={() => router.push('/club-settings')} hitSlop={10}>
          <Ionicons name="settings-outline" size={22} color="#9ca3af" />
        </Pressable>
      </View>

      {activeClubs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="golf-outline" size={48} color="#374151" />
          <Text style={styles.emptyText}>
            No clubs added yet.{'\n'}Tap the settings icon to manage your clubs.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {grouped.map((group) => (
            <View key={group.type}>
              <Text style={styles.sectionHeader}>{group.label}</Text>
              {group.clubs.map((club) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  entry={clubData[club.id]}
                  onPress={() => router.push(`/club/${club.id}`)}
                />
              ))}
            </View>
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
  },
  sectionHeader: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  bottomSpacer: {
    height: 32,
  },
});
