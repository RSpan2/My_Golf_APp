export type StatKey = 'carry' | 'distance' | 'quarter' | 'half' | 'threeQuarter';
export type ClubType = 'wood' | 'hybrid' | 'iron' | 'wedge';

export interface ClubDefinition {
  id: string;
  name: string;
  shortName: string;
  type: ClubType;
}

export interface StatColumn {
  id: StatKey;
  label: string;
}

export const CLUB_GROUP_ORDER: ClubType[] = ['wood', 'hybrid', 'iron', 'wedge'];

export const CLUB_GROUP_LABELS: Record<ClubType, string> = {
  wood: 'Woods',
  hybrid: 'Hybrids',
  iron: 'Irons',
  wedge: 'Wedges',
};

export const ALL_CLUBS: ClubDefinition[] = [
  { id: 'driver',       name: 'Driver',         shortName: '1W', type: 'wood'   },
  { id: '3wood',        name: '3 Wood',          shortName: '3W', type: 'wood'   },
  { id: '5wood',        name: '5 Wood',          shortName: '5W', type: 'wood'   },
  { id: '7wood',        name: '7 Wood',          shortName: '7W', type: 'wood'   },
  { id: '2hybrid',      name: '2 Hybrid',        shortName: '2H', type: 'hybrid' },
  { id: '3hybrid',      name: '3 Hybrid',        shortName: '3H', type: 'hybrid' },
  { id: '4hybrid',      name: '4 Hybrid',        shortName: '4H', type: 'hybrid' },
  { id: '5hybrid',      name: '5 Hybrid',        shortName: '5H', type: 'hybrid' },
  { id: '2iron',        name: '2 Iron',          shortName: '2i', type: 'iron'   },
  { id: '3iron',        name: '3 Iron',          shortName: '3i', type: 'iron'   },
  { id: '4iron',        name: '4 Iron',          shortName: '4i', type: 'iron'   },
  { id: '5iron',        name: '5 Iron',          shortName: '5i', type: 'iron'   },
  { id: '6iron',        name: '6 Iron',          shortName: '6i', type: 'iron'   },
  { id: '7iron',        name: '7 Iron',          shortName: '7i', type: 'iron'   },
  { id: '8iron',        name: '8 Iron',          shortName: '8i', type: 'iron'   },
  { id: '9iron',        name: '9 Iron',          shortName: '9i', type: 'iron'   },
  { id: 'pw',           name: 'Pitching Wedge',  shortName: 'PW', type: 'wedge'  },
  { id: 'gw',           name: 'Gap Wedge',       shortName: 'GW', type: 'wedge'  },
  { id: 'sw',           name: 'Sand Wedge',      shortName: 'SW', type: 'wedge'  },
  { id: 'lw',           name: 'Lob Wedge',       shortName: 'LW', type: 'wedge'  },
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
