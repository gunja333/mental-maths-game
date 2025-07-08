
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { dataService } from '../services/dataService';
import { Student } from '../types';
import Spinner from './shared/Spinner';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'username' | 'grade' | 'streak' | 'highestScore'>('username');

  useEffect(() => {
    const allStudents = dataService.getAllStudents();
    setStudents(allStudents);
    setIsLoading(false);
  }, []);

  const filteredAndSortedStudents = students
    .filter(s => s.username.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'username') return a.username.localeCompare(b.username);
      return b[sortBy] - a[sortBy];
    });

  const TableHeader: React.FC<{
    field: 'username' | 'grade' | 'streak' | 'highestScore';
    label: string;
  }> = ({ field, label }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => setSortBy(field)}>
      {label} {sortBy === field ? '▼' : ''}
    </th>
  );
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Monitor student progress</p>
          </div>
          <button
            onClick={logout}
            className="mt-4 sm:mt-0 px-4 py-2 bg-white text-brand-primary font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </header>

        <div className="mb-4">
            <input
                type="text"
                placeholder="Search for a student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-sm p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary text-gray-900"
            />
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader field="username" label="Student" />
                  <TableHeader field="grade" label="Grade" />
                  <TableHeader field="streak" label="Streak" />
                  <TableHeader field="highestScore" label="Highest Score (%)" />
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Played</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedStudents.length > 0 ? filteredAndSortedStudents.map(student => (
                  <tr key={student.username} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Grade {student.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-brand-primary">{student.streak} days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.highestScore}%</div>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.lastPlayedDate || 'Never'}</div>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-500">No students found.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;