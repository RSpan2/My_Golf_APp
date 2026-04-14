import { Text, View } from 'react-native';

import { STAT_COLUMNS, type ClubDefinition, type StatKey } from '@/constants/clubs';
import type { ClubEntry } from '@/services/clubStorage';

interface ClubRowProps {
  club: ClubDefinition;
  entry: ClubEntry;
  visibleColumns: StatKey[];
}

const ClubRow = ({ club, entry, visibleColumns }: ClubRowProps) => {
  return (
    <View className="flex-row items-center border-b border-gray-800 py-3 px-4">
      <Text className="text-white font-medium text-sm" style={{ width: 120 }} numberOfLines={1}>
        {club.name}
      </Text>
      {visibleColumns.map((colId) => {
        const value = entry.stats[colId];
        return (
          <Text
            key={colId}
            className="flex-1 text-gray-300 text-sm text-center"
          >
            {value !== undefined ? `${value}` : '—'}
          </Text>
        );
      })}
    </View>
  );
};

export default ClubRow;
