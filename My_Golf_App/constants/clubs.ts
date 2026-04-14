export type StatKey = 'carry' | 'distance' | 'quarter' | 'half' | 'threeQuarter';

export interface ClubDefinition {
  id: string;
  name: string;
  shortName: string;
}

export interface StatColumn {
  id: StatKey;
  label: string;
}

export const ALL_CLUBS: ClubDefinition[] = [
  { id: 'driver',       name: 'Driver',         shortName: '1W' },
  { id: '3wood',        name: '3 Wood',          shortName: '3W' },
  { id: '5wood',        name: '5 Wood',          shortName: '5W' },
  { id: '7wood',        name: '7 Wood',          shortName: '7W' },
  { id: '2hybrid',      name: '2 Hybrid',        shortName: '2H' },
  { id: '3hybrid',      name: '3 Hybrid',        shortName: '3H' },
  { id: '4hybrid',      name: '4 Hybrid',        shortName: '4H' },
  { id: '5hybrid',      name: '5 Hybrid',        shortName: '5H' },
  { id: '2iron',        name: '2 Iron',          shortName: '2i' },
  { id: '3iron',        name: '3 Iron',          shortName: '3i' },
  { id: '4iron',        name: '4 Iron',          shortName: '4i' },
  { id: '5iron',        name: '5 Iron',          shortName: '5i' },
  { id: '6iron',        name: '6 Iron',          shortName: '6i' },
  { id: '7iron',        name: '7 Iron',          shortName: '7i' },
  { id: '8iron',        name: '8 Iron',          shortName: '8i' },
  { id: '9iron',        name: '9 Iron',          shortName: '9i' },
  { id: 'pw',           name: 'Pitching Wedge',  shortName: 'PW' },
  { id: 'gw',           name: 'Gap Wedge',       shortName: 'GW' },
  { id: 'sw',           name: 'Sand Wedge',      shortName: 'SW' },
  { id: 'lw',           name: 'Lob Wedge',       shortName: 'LW' },
];

export const STAT_COLUMNS: StatColumn[] = [
  { id: 'carry',        label: 'Carry' },
  { id: 'distance',     label: 'Distance' },
  { id: 'quarter',      label: '1/4' },
  { id: 'half',         label: '1/2' },
  { id: 'threeQuarter', label: '3/4' },
];

export const DEFAULT_ACTIVE_IDS = new Set([
  'driver', '3wood', '5wood',
  '4iron', '5iron', '6iron', '7iron', '8iron', '9iron',
  'pw',
]);
