import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { type Round } from '@/constants/round';
import { loadInProgressRound } from '@/services/roundStorage';

export default function ScorecardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [round, setRound] = useState<Round | null>(null);

  useEffect(() => {
    loadInProgressRound().then((r) => {
      if (r?.id === id) setRound(r);
    });
  }, [id]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {round?.courseName ?? 'Scorecard'}
        </Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.body}>
        <Text style={styles.placeholder}>Scorecard coming in Story 1.4</Text>
        {round && (
          <Text style={styles.info}>
            {round.tee} tee · {round.holes.length} holes · {round.date}
          </Text>
        )}
      </View>
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
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  placeholder: {
    color: '#6b7280',
    fontSize: 16,
  },
  info: {
    color: '#4b5563',
    fontSize: 13,
  },
});
