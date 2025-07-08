import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ADMIN_USERNAME } from '../constants';

const LoginView: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<number>(3);
  const [isNewUser, setIsNewUser] = useState(false);
  const { login } = useAuth();

  const showAdminPassword = !isNewUser && username.toLowerCase() === ADMIN_USERNAME;

  useEffect(() => {
    if (username.toLowerCase() !== ADMIN_USERNAME) {
      setPassword('');
    }
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      alert('Please enter a username.');
      return;
    }
    login(username, isNewUser ? grade : undefined, password);
  };

  const gradeOptions = Array.from({ length: 7 }, (_, i) => i + 3); // Grades 3 to 9

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary to-green-400 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 transform hover:scale-105 transition-transform duration-300">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-brand-dark" style={{fontFamily: "'Pacifico', cursive"}}>Mental Maths</h1>
            <p className="text-gray-500 mt-2">Your daily brain workout!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. student_name or 'admin'"
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition text-gray-900"
              required
              autoComplete="username"
            />
          </div>

          {showAdminPassword && (
             <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition text-gray-900"
                  required
                  autoComplete="current-password"
                />
            </div>
          )}

          {isNewUser && username.toLowerCase() !== ADMIN_USERNAME && (
            <div>
              <label htmlFor="grade" className="text-sm font-medium text-gray-700">Grade (K-)</label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition text-gray-900"
              >
                {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3 px-4 bg-brand-primary hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-300 transform hover:-translate-y-1"
          >
            {isNewUser ? 'Create Account & Play' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          {isNewUser ? 'Already have an account? ' : 'First time here? '}
          <button 
            onClick={() => setIsNewUser(!isNewUser)} 
            className="font-medium text-brand-primary hover:underline focus:outline-none"
          >
            {isNewUser ? 'Login' : 'Create an Account'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginView;
