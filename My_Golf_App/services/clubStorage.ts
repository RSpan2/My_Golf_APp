import AsyncStorage from '@react-native-async-storage/async-storage';

import { ALL_CLUBS, DEFAULT_ACTIVE_IDS, STAT_COLUMNS, type StatKey } from '@/constants/clubs';

export interface ClubStats {
  carry?: number;
  distance?: number;
  quarter?: number;
  half?: number;
  threeQuarter?: number;
}

export interface ClubEntry {
  active: boolean;
  stats: ClubStats;
}

const STORAGE_KEY = '@golf_club_data';
const COLUMNS_KEY = '@golf_visible_columns';

function buildDefaults(): Record<string, ClubEntry> {
  return Object.fromEntries(
    ALL_CLUBS.map((club) => [
      club.id,
      { active: DEFAULT_ACTIVE_IDS.has(club.id), stats: {} },
    ])
  );
}

export async function loadClubData(): Promise<Record<string, ClubEntry>> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const defaults = buildDefaults();
  if (!raw) return defaults;

  const stored: Record<string, ClubEntry> = JSON.parse(raw);
  // Merge: ensure every club has an entry (handles newly added clubs after first install)
  for (const club of ALL_CLUBS) {
    if (!stored[club.id]) {
      stored[club.id] = defaults[club.id];
    }
  }
  return stored;
}

export async function saveClubData(data: Record<string, ClubEntry>): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function loadVisibleColumns(): Promise<StatKey[]> {
  const raw = await AsyncStorage.getItem(COLUMNS_KEY);
  if (!raw) return STAT_COLUMNS.map((c) => c.id);
  return JSON.parse(raw) as StatKey[];
}

export async function saveVisibleColumns(cols: StatKey[]): Promise<void> {
  await AsyncStorage.setItem(COLUMNS_KEY, JSON.stringify(cols));
}
