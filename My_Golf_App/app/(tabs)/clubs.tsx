import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import ClubRow from '@/components/clubs/ClubRow';
import { ALL_CLUBS, STAT_COLUMNS, type StatKey } from '@/constants/clubs';
import { loadClubData, loadVisibleColumns, type ClubEntry } from '@/services/clubStorage';

export default function ClubsScreen() {
  const router = useRouter();
  const [clubData, setClubData] = useState<Record<string, ClubEntry>>({});
  const [visibleColumns, setVisibleColumns] = useState<StatKey[]>([]);

  const loadData = useCallback(async () => {
    const [data, cols] = await Promise.all([loadClubData(), loadVisibleColumns()]);
    setClubData(data);
    setVisibleColumns(cols);
  }, []);

  // Reload every time the screen comes back into focus (e.g. returning from settings)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const activeClubs = ALL_CLUBS.filter((c) => clubData[c.id]?.active);

  return (
    <SafeAreaView className="flex-1 bg-gray-950" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3 bg-gray-900 border-b border-gray-700">
        <Text className="text-white text-xl font-bold">Clubs</Text>
        <Pressable onPress={() => router.push('/club-settings')} hitSlop={10}>
          <Ionicons name="settings-outline" size={22} color="#9ca3af" />
        </Pressable>
      </View>

      {activeClubs.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="golf-outline" size={48} color="#374151" />
          <Text className="text-gray-500 text-base text-center mt-4">
            No clubs added yet.{'\n'}Tap the settings icon to manage your clubs.
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          {/* Column header row */}
          <View className="flex-row items-center px-4 py-2 bg-gray-900 border-b border-gray-700">
            <Text className="text-gray-500 text-xs font-semibold uppercase" style={{ width: 120 }}>
              Club
            </Text>
            {visibleColumns.map((colId) => {
              const col = STAT_COLUMNS.find((c) => c.id === colId);
              return (
                <Text
                  key={colId}
                  className="flex-1 text-gray-500 text-xs font-semibold uppercase text-center"
                >
                  {col?.label}
                </Text>
              );
            })}
          </View>

          {activeClubs.map((club) => (
            <ClubRow
              key={club.id}
              club={club}
              entry={clubData[club.id]}
              visibleColumns={visibleColumns}
            />
          ))}

          <View className="h-8" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
