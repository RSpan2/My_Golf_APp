import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { STAT_COLUMNS, type ClubDefinition } from '@/constants/clubs';
import type { ClubEntry } from '@/services/clubStorage';

interface ClubCardProps {
  club: ClubDefinition;
  entry: ClubEntry;
  onPress: () => void;
}

const ClubCard = ({ club, entry, onPress }: ClubCardProps) => {
  const populatedStats = STAT_COLUMNS.filter(
    (col) => entry.stats[col.id] !== undefined
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* Club name + badge + chevron */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.clubName}>{club.name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{club.shortName}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#4b5563" />
      </View>

      {/* Stat chips — display only */}
      {populatedStats.length > 0 ? (
        <View style={styles.chipsRow}>
          {populatedStats.map((col) => (
            <View key={col.id} style={styles.chip}>
              <Text style={styles.chipLabel}>{col.label}</Text>
              <Text style={styles.chipValue}>{entry.stats[col.id]} yds</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyHint}>Tap to add distances</Text>
      )}
    </Pressable>
  );
};

export default ClubCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardPressed: {
    backgroundColor: '#222222',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clubName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#1e3a2f',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    backgroundColor: '#242424',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipLabel: {
    color: '#6b7280',
    fontSize: 11,
  },
  chipValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyHint: {
    color: '#4b5563',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
  },
});
