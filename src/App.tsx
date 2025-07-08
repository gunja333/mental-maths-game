import React, { useState, useEffect, createContext, useCallback } from 'react';
import { LoggedInUser, UserRole } from './types';
import { ADMIN_USERNAME } from './constants';
import { dataService } from './services/dataService';
import LoginView from './components/LoginView';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import Spinner from './components/shared/Spinner';

interface AuthContextType {
  user: LoggedInUser | null;
  login: (username: string, grade?: number, password?: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const App: React.FC = () => {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dataService.initializeData();
    const storedUser = dataService.getLoggedInUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, grade?: number, password?: string) => {
    const loggedInUser = dataService.login(username, grade, password);
    if (loggedInUser) {
      setUser(loggedInUser);
    } else if (username.toLowerCase() !== ADMIN_USERNAME) {
      // Avoid showing a generic failed login for a failed admin attempt, as dataService already shows an alert.
      alert('Login failed. For new students, please provide a username and select a grade.');
    }
  }, []);

  const logout = useCallback(() => {
    dataService.logout();
    setUser(null);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }
    if (!user) {
      return <LoginView />;
    }
    if (user.role === UserRole.Admin) {
      return <AdminDashboard />;
    }
    if (user.role === UserRole.Student) {
      return <StudentDashboard />;
    }
    return <LoginView />; // Fallback
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="min-h-screen bg-gray-50 font-sans">
        {renderContent()}
      </div>
    </AuthContext.Provider>
  );
};

export default App;
