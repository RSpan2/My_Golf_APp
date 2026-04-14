import { type Tee } from '@/constants/course';

export type FairwayResult = 'hit' | 'missLeft' | 'missRight';

export interface HoleScore {
  hole: number;
  par: number;
  yardage: number;
  score: number; // 0 = not yet entered
  putts?: number;
  fairwayHit?: FairwayResult;
  adjustedScore?: number; // for handicap (Epic 2)
}

export interface Round {
  id: string;
  courseId: string;
  courseName: string;
  date: string; // "YYYY-MM-DD"
  tee: Tee;
  holes: HoleScore[];
  shotTrackingEnabled: boolean;
  isComplete: boolean;
}
