import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import EditDistanceModal from '@/components/clubs/EditDistanceModal';
import { ALL_CLUBS, STAT_COLUMNS, type StatKey } from '@/constants/clubs';
import {
  loadClubData,
  loadVisibleColumns,
  saveClubData,
  saveVisibleColumns,
  type ClubEntry,
} from '@/services/clubStorage';

interface EditTarget {
  clubId: string;
  statKey: StatKey;
}

export default function ClubSettingsScreen() {
  const router = useRouter();
  const [clubData, setClubData] = useState<Record<string, ClubEntry>>({});
  const [visibleColumns, setVisibleColumns] = useState<StatKey[]>([]);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);

  useEffect(() => {
    Promise.all([loadClubData(), loadVisibleColumns()]).then(([data, cols]) => {
      setClubData(data);
      setVisibleColumns(cols);
    });
  }, []);

  const handleToggleColumn = (colId: StatKey) => {
    const updated = visibleColumns.includes(colId)
      ? visibleColumns.filter((c) => c !== colId)
      : [...visibleColumns, colId];
    setVisibleColumns(updated);
    saveVisibleColumns(updated);
  };

  const handleToggleClub = (clubId: string) => {
    const updated = {
      ...clubData,
      [clubId]: { ...clubData[clubId], active: !clubData[clubId].active },
    };
    setClubData(updated);
    saveClubData(updated);
  };

  const handleEditStat = (clubId: string, statKey: StatKey) => {
    setEditTarget({ clubId, statKey });
  };

  const handleSaveStat = (value: number | undefined) => {
    if (!editTarget) return;
    const { clubId, statKey } = editTarget;
    const updated = {
      ...clubData,
      [clubId]: {
        ...clubData[clubId],
        stats: { ...clubData[clubId].stats, [statKey]: value },
      },
    };
    setClubData(updated);
    saveClubData(updated);
    setEditTarget(null);
  };

  const editClub = editTarget ? ALL_CLUBS.find((c) => c.id === editTarget.clubId) : null;
  const editColLabel = editTarget
    ? (STAT_COLUMNS.find((c) => c.id === editTarget.statKey)?.label ?? '')
    : '';

  return (
    <SafeAreaView className="flex-1 bg-gray-950" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 pt-4 pb-3 bg-gray-900 border-b border-gray-700">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </Pressable>
        <Text className="text-white text-xl font-bold">Club Settings</Text>
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* ── Columns section ── */}
        <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-4 pt-6 pb-2">
          Show Columns
        </Text>
        <View className="bg-gray-900 border-t border-b border-gray-700">
          {STAT_COLUMNS.map((col, index) => (
            <View
              key={col.id}
              className={`flex-row items-center justify-between px-4 py-4 ${
                index < STAT_COLUMNS.length - 1 ? 'border-b border-gray-800' : ''
              }`}
            >
              <Text className="text-white text-base">{col.label}</Text>
              <Switch
                value={visibleColumns.includes(col.id)}
                onValueChange={() => handleToggleColumn(col.id)}
                trackColor={{ false: '#374151', true: '#16a34a' }}
                thumbColor="#ffffff"
              />
            </View>
          ))}
        </View>

        {/* ── Clubs section ── */}
        <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-4 pt-6 pb-2">
          My Clubs
        </Text>
        <View className="bg-gray-900 border-t border-b border-gray-700">
          {ALL_CLUBS.map((club, index) => {
            const entry = clubData[club.id];
            if (!entry) return null;
            return (
              <View
                key={club.id}
                className={`px-4 py-3 ${
                  index < ALL_CLUBS.length - 1 ? 'border-b border-gray-800' : ''
                }`}
              >
                {/* Club name row with active toggle */}
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-white font-semibold text-sm">{club.name}</Text>
                    <Text className="text-gray-500 text-xs">{club.shortName}</Text>
                  </View>
                  <Switch
                    value={entry.active}
                    onValueChange={() => handleToggleClub(club.id)}
                    trackColor={{ false: '#374151', true: '#16a34a' }}
                    thumbColor="#ffffff"
                  />
                </View>

                {/* Stat cells row */}
                <View className="flex-row gap-2">
                  {STAT_COLUMNS.map((col) => {
                    const value = entry.stats[col.id];
                    return (
                      <Pressable
                        key={col.id}
                        onPress={() => handleEditStat(club.id, col.id)}
                        className="flex-1 items-center bg-gray-800 rounded-lg py-2 active:bg-gray-700"
                      >
                        <Text className="text-gray-500 text-xs mb-1">{col.label}</Text>
                        <Text className="text-white text-sm font-medium">
                          {value !== undefined ? `${value}` : '—'}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        <View className="h-12" />
      </ScrollView>

      <EditDistanceModal
        visible={editTarget !== null}
        clubName={editClub?.name ?? ''}
        statLabel={editColLabel}
        currentValue={editTarget ? clubData[editTarget.clubId]?.stats[editTarget.statKey] : undefined}
        onSave={handleSaveStat}
        onClose={() => setEditTarget(null)}
      />
    </SafeAreaView>
  );
}
