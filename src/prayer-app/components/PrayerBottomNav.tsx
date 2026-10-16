import React from 'react';
import {
  Calendar,
  Settings,
  Clock,
  Heart,
  Compass,
  Sunset,
} from 'lucide-react';
import { usePrayer, PrayerTab } from '../context/PrayerContext';

export const PrayerBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = usePrayer();

  const navItems: { id: PrayerTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'qaza',
      label: 'قضا نمازیں',
      icon: <Sunset className="w-5 h-5" />,
    },
    {
      id: 'rohani',
      label: 'روحانی علاج',
      icon: <Heart className="w-5 h-5" />,
    },
    {
      id: 'home',
      label: 'روزانہ',
      icon: <Clock className="w-6 h-6" />,
    },
    {
      id: 'settings',
      label: 'ترتیب',
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: 'schedule',
      label: 'کلینڈر',
      icon: <Calendar className="w-5 h-5" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1e293b] text-white border-t border-slate-700 max-w-md mx-auto shadow-2xl">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isCenter = item.id === 'home';

          if (isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab('home')}
                className="flex flex-col items-center justify-center relative -top-3 cursor-pointer group"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg border-2 border-[#1e293b] transition-transform group-active:scale-95 ${
                    isActive ? 'bg-[#15803d] text-white' : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold mt-0.5 text-emerald-400">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="relative">{item.icon}</div>
              <span className="text-[10px] tracking-tight mt-1 truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
