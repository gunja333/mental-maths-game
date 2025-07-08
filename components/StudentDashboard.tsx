
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { dataService } from '../services/dataService';
import { Student } from '../types';
import GameView from './GameView';
import Spinner from './shared/Spinner';
import MedalProgress from './shared/MedalProgress';
import { getTodayDateString } from '../utils';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  
  useEffect(() => {
    if (user) {
      const data = dataService.getStudent(user.username);
      setStudentData(data);
      if (data?.lastPlayedDate === getTodayDateString()) {
        setHasPlayedToday(true);
      }
    }
    setIsLoading(false);
  }, [user]);

  const handleGameFinish = (score: number) => {
    if(user) {
        const updatedStudent = dataService.updateStudentAfterGame(user.username, score);
        setStudentData(updatedStudent);
    }
    setIsPlaying(false);
    setHasPlayedToday(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
  }

  if (!studentData) {
    return <div className="p-4 text-center text-red-500">Could not load student data.</div>;
  }

  if (isPlaying) {
    return <GameView grade={studentData.grade} onGameFinish={handleGameFinish} />;
  }

  const streakColor = studentData.streak > 0 ? 'text-brand-secondary' : 'text-gray-500';

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {studentData.username}!</h1>
            <p className="text-gray-500">Grade {studentData.grade} | Ready to sharpen your mind?</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-white text-brand-primary font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </header>

        <main className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
              <h3 className="font-bold text-xl text-gray-800 mb-2">Current Streak</h3>
              <p className={`text-7xl font-bold ${streakColor}`}>{studentData.streak}</p>
              <p className="text-gray-500">days in a row!</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
                <h3 className="font-bold text-xl text-gray-800 mb-2">Highest Score</h3>
                <p className="text-7xl font-bold text-brand-primary">{studentData.highestScore}%</p>
                <p className="text-gray-500">Keep aiming higher!</p>
            </div>
          </div>
          
          <MedalProgress streak={studentData.streak} />

          <div className="text-center mt-8">
            <button
              onClick={() => setIsPlaying(true)}
              disabled={hasPlayedToday}
              className="w-full md:w-auto px-12 py-4 bg-brand-secondary text-white font-bold rounded-lg shadow-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:-translate-y-1 text-xl"
            >
              {hasPlayedToday ? "Great job today! See you tomorrow!" : "Play Today's Challenge"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
