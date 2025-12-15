export type BallType =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | 'W'
  | 'WD'
  | 'NB';
export type ThemeColor =
  | 'purple'
  | 'teal'
  | 'emerald'
  | 'rose'
  | 'blue'
  | 'orange'
  | 'pink'
  | 'black'
  | 'white';

export interface Ball {
  type: BallType;
  runs: number;
}

export interface PlayerStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  innings: number;
}

export interface BowlerStats {
  name: string;
  runsConceded: number;
  wickets: number;
  overs: number;
  balls: number;
  innings: number;
}
