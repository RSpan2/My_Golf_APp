import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import {
  ALL_CLUBS,
  CLUB_GROUP_LABELS,
  CLUB_GROUP_ORDER,
} from '@/constants/clubs';
import { loadClubData, saveClubData } from '@/services/clubStorage';
import type { ClubEntry } from '@/services/clubStorage';

export default function ClubSettingsScreen() {
  const router = useRouter();
  const [clubData, setClubData] = useState<Record<string, ClubEntry>>({});

  useEffect(() => {
    loadClubData().then(setClubData);
  }, []);

  const handleToggleClub = (clubId: string) => {
    const updated = {
      ...clubData,
      [clubId]: { ...clubData[clubId], active: !clubData[clubId].active },
    };
    setClubData(updated);
    saveClubData(updated);
  };

  const grouped = CLUB_GROUP_ORDER
    .map((type) => ({
      type,
      label: CLUB_GROUP_LABELS[type],
      clubs: ALL_CLUBS.filter((c) => c.type === type),
    }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.pageDescription}>
          Select which clubs are in your bag.
        </Text>

        {grouped.map((group) => (
          <View key={group.type}>
            <Text style={styles.sectionHeader}>{group.label}</Text>
            <View style={styles.groupCard}>
              {group.clubs.map((club, index) => {
                const entry = clubData[club.id];
                const isLast = index === group.clubs.length - 1;
                return (
                  <View key={club.id}>
                    <View style={styles.row}>
                      <View style={styles.rowLeft}>
                        <Text style={styles.clubName}>{club.name}</Text>
                        <Text style={styles.clubShort}>{club.shortName}</Text>
                      </View>
                      <Switch
                        value={entry?.active ?? false}
                        onValueChange={() => handleToggleClub(club.id)}
                        trackColor={{ false: '#2a2a2a', true: '#16a34a' }}
                        thumbColor="#ffffff"
                      />
                    </View>
                    {!isLast && <View style={styles.divider} />}
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.bottomSpacer} />
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
    marginRight: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  pageDescription: {
    color: '#6b7280',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
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
  groupCard: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clubName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
  },
  clubShort: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#1e3a2f',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#2a2a2a',
    marginLeft: 16,
  },
  bottomSpacer: {
    height: 40,
  },
});
