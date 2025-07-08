
export interface ScoreRecord {
  date: string; // YYYY-MM-DD
  score: number; // percentage
}

export interface Student {
  username: string;
  grade: number; // K-3 to K-9 represented as 3 to 9
  streak: number;
  lastPlayedDate: string | null; // YYYY-MM-DD
  scores: ScoreRecord[];
  highestScore: number;
}

export enum UserRole {
  Student = 'student',
  Admin = 'admin',
}

export interface LoggedInUser {
  username: string;
  role: UserRole;
}

export interface MathQuestion {
  question: string;
  answer: number;
}
