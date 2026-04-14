export type Tee = 'blue' | 'white' | 'red' | 'gold';

export interface TeeRatings {
  courseRating: number;
  slope: number;
}

export interface HoleYardages {
  blue?: number;
  white?: number;
  red?: number;
  gold?: number;
}

export interface Hole {
  number: number;
  par: number;
  yardages: HoleYardages;
  handicapIndex: number;
}

export interface Course {
  id: string;
  name: string;
  city: string;
  state: string;
  holes: Hole[];
  isHome: boolean;
  ratings: Partial<Record<Tee, TeeRatings>>;
}

export function buildDefaultHoles(count: 9 | 18): Hole[] {
  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    par: 4,
    yardages: {},
    handicapIndex: i + 1,
  }));
}
