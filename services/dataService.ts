
import { Student, LoggedInUser, UserRole, ScoreRecord } from '../types';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';
import { getTodayDateString, areDatesConsecutive } from '../utils';

const DB_KEY = 'mentalMathsChallengeData';
const SESSION_KEY = 'mentalMathsChallengeSession';

interface AppData {
  students: { [username: string]: Student };
}

class DataService {
  private getData(): AppData {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : { students: {} };
  }

  private saveData(data: AppData): void {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  }

  initializeData(): void {
    if (!localStorage.getItem(DB_KEY)) {
      this.saveData({ students: {} });
    }
  }

  getLoggedInUser(): LoggedInUser | null {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
  
  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  login(username: string, grade?: number, password?: string): LoggedInUser | null {
    if (username.toLowerCase() === ADMIN_USERNAME) {
        if (password === ADMIN_PASSWORD) {
            const adminUser: LoggedInUser = { username: ADMIN_USERNAME, role: UserRole.Admin };
            localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
            return adminUser;
        }
        alert('Incorrect admin password.');
        return null;
    }

    const data = this.getData();
    let student = data.students[username];

    if (student) { // Existing student
      // Streak check on login
      const today = getTodayDateString();
      if(student.lastPlayedDate && !areDatesConsecutive(student.lastPlayedDate, today) && student.lastPlayedDate !== today) {
        student.streak = 0;
        data.students[username] = student;
        this.saveData(data);
      }
    } else { // New student
      if (!grade) {
        return null;
      }
      student = {
        username,
        grade,
        streak: 0,
        lastPlayedDate: null,
        scores: [],
        highestScore: 0,
      };
      data.students[username] = student;
      this.saveData(data);
    }
    
    const studentUser: LoggedInUser = { username, role: UserRole.Student };
    localStorage.setItem(SESSION_KEY, JSON.stringify(studentUser));
    return studentUser;
  }

  getStudent(username: string): Student | null {
    const data = this.getData();
    return data.students[username] || null;
  }

  getAllStudents(): Student[] {
    const data = this.getData();
    return Object.values(data.students);
  }

  updateStudentAfterGame(username: string, score: number): Student | null {
    const data = this.getData();
    const student = data.students[username];
    if (!student) return null;

    const today = getTodayDateString();
    
    // Update streak
    if (student.lastPlayedDate) {
        if (areDatesConsecutive(student.lastPlayedDate, today)) {
            student.streak += 1;
        } else if (student.lastPlayedDate !== today) {
            student.streak = 1; // Resetting and starting a new streak
        }
    } else {
        student.streak = 1; // First game
    }

    student.lastPlayedDate = today;

    // Add score
    const newScoreRecord: ScoreRecord = { date: today, score };
    student.scores.push(newScoreRecord);

    // Update highest score
    if(score > student.highestScore) {
        student.highestScore = score;
    }

    data.students[username] = student;
    this.saveData(data);
    return student;
  }
}

export const dataService = new DataService();
