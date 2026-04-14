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
  displayTee?: Tee; // which tee's yardages to show on the course detail screen
}

/** Returns the tees that have at least one hole yardage entered. */
export function teesWithData(holes: Hole[]): Tee[] {
  const all: Tee[] = ['blue', 'white', 'red', 'gold'];
  return all.filter((tee) => holes.some((h) => (h.yardages[tee] ?? 0) > 0));
}

/** Returns the tee to display: saved displayTee if valid, otherwise first tee with data, otherwise 'white'. */
export function resolveDisplayTee(course: Course): Tee {
  const available = teesWithData(course.holes);
  if (course.displayTee && available.includes(course.displayTee)) return course.displayTee;
  return available[0] ?? 'white';
}

export function buildDefaultHoles(count: 9 | 18): Hole[] {
  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    par: 4,
    yardages: {},
    handicapIndex: i + 1,
  }));
}
