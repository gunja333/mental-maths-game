
import React from 'react';
import { BRONZE_MEDAL_STREAK, SILVER_MEDAL_STREAK, GOLD_MEDAL_STREAK } from '../../constants';

interface MedalProgressProps {
  streak: number;
}

const MedalIcon: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
    <div className={`relative flex flex-col items-center p-2 ${color} rounded-lg`}>
        <svg className="w-10 h-10 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 00-1 1v1.586l-1.707-1.707a1 1 0 00-1.414 1.414L7.586 6H6a1 1 0 00-1 1v1.586l-1.707-1.707a1 1 0 00-1.414 1.414L3.586 10H2a1 1 0 000 2h1.586l-1.707 1.707a1 1 0 001.414 1.414L6 13.586V15a1 1 0 001 1h1.586l-1.707 1.707a1 1 0 001.414 1.414L10 16.414l1.707 1.707a1 1 0 001.414-1.414L11.414 15H13a1 1 0 001-1v-1.586l1.707 1.707a1 1 0 001.414-1.414L14.414 11H16a1 1 0 100-2h-1.586l1.707-1.707a1 1 0 00-1.414-1.414L13 6.414V5a1 1 0 00-1-1h-1.586l1.707-1.707a1 1 0 00-1.414-1.414L10 3.586V3a1 1 0 00-1-1zm0 9a3 3 0 100-6 3 3 0 000 6z"/>
        </svg>
        <div className="text-center font-semibold text-sm text-white">{children}</div>
    </div>
);


const MedalProgress: React.FC<MedalProgressProps> = ({ streak }) => {
  const medals = [
    { name: 'Bronze', goal: BRONZE_MEDAL_STREAK, color: 'bg-bronze' },
    { name: 'Silver', goal: SILVER_MEDAL_STREAK, color: 'bg-silver' },
    { name: 'Gold', goal: GOLD_MEDAL_STREAK, color: 'bg-gold' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="font-bold text-xl text-gray-800 mb-4">Medal Chase</h3>
        <div className="grid grid-cols-3 gap-4">
        {medals.map((medal) => {
            const progress = Math.min((streak / medal.goal) * 100, 100);
            const hasMedal = streak >= medal.goal;

            return (
            <div key={medal.name} className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${hasMedal ? medal.color : 'bg-gray-100'}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${hasMedal ? 'bg-opacity-20 bg-white' : 'bg-gray-200'}`}>
                    <span className={`font-bold text-2xl ${hasMedal ? 'text-white' : 'text-gray-500'}`}>
                         {hasMedal ? '★' : `${Math.floor(progress)}%`}
                    </span>
                </div>
                <div className={`font-semibold ${hasMedal ? 'text-white' : 'text-gray-700'}`}>{medal.name}</div>
                <div className={`text-xs ${hasMedal ? 'text-white' : 'text-gray-500'}`}>{medal.goal} Days</div>
            </div>
            );
        })}
        </div>
    </div>
  );
};

export default MedalProgress;
