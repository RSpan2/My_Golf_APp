import AsyncStorage from '@react-native-async-storage/async-storage';

import { type Round } from '@/constants/round';

const ROUNDS_KEY = '@golf_rounds';
const IN_PROGRESS_KEY = '@golf_round_in_progress';

export async function loadRounds(): Promise<Round[]> {
  const raw = await AsyncStorage.getItem(ROUNDS_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Round[];
}

export async function saveRound(round: Round): Promise<void> {
  const rounds = await loadRounds();
  const index = rounds.findIndex((r) => r.id === round.id);
  if (index >= 0) {
    rounds[index] = round;
  } else {
    rounds.push(round);
  }
  await AsyncStorage.setItem(ROUNDS_KEY, JSON.stringify(rounds));
}

export async function getRoundById(id: string): Promise<Round | undefined> {
  const rounds = await loadRounds();
  return rounds.find((r) => r.id === id);
}

export async function deleteRound(id: string): Promise<void> {
  const rounds = await loadRounds();
  await AsyncStorage.setItem(ROUNDS_KEY, JSON.stringify(rounds.filter((r) => r.id !== id)));
}

export async function loadInProgressRound(): Promise<Round | null> {
  const raw = await AsyncStorage.getItem(IN_PROGRESS_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as Round;
}

export async function saveInProgressRound(round: Round): Promise<void> {
  await AsyncStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(round));
}

export async function clearInProgressRound(): Promise<void> {
  await AsyncStorage.removeItem(IN_PROGRESS_KEY);
}
