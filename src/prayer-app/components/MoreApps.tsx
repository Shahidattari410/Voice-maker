import React from 'react';
import {
  ChevronRight,
  BookOpen,
  Library,
  Heart,
  Volume2,
  Award,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { usePrayer } from '../context/PrayerContext';
import { MORE_APPS } from '../data/prayerData';

export const MoreApps: React.FC = () => {
  const { setActiveTab } = usePrayer();

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24 text-right">
      {/* Red Header (Exact match to screenshot 9) */}
      <div className="bg-[#b91c1c] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <button
          onClick={() => setActiveTab('home')}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 rtl:rotate-0" />
        </button>

        <h1 className="text-xl font-bold urdu-title">
          مزید ایپلیکیشن
        </h1>

        <div className="w-8" />
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* 3-Column Grid of Apps (Exact match to screenshot 9) */}
        <div className="grid grid-cols-3 gap-2.5">
          {MORE_APPS.map((app) => (
            <div
              key={app.id}
              onClick={() => alert(`${app.titleUrdu} (${app.titleEn})\n${app.description}`)}
              className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xs flex flex-col items-center text-center justify-between hover:shadow-md transition-all cursor-pointer active:scale-95 group"
            >
              {/* Icon Container */}
              <div
                className={`w-14 h-14 rounded-2xl ${app.iconColor} text-white flex flex-col items-center justify-center shadow-xs p-1 mb-1.5`}
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-[8px] font-bold font-sans mt-0.5">{app.badge}</span>
              </div>

              {/* Title En & Urdu */}
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-slate-800 font-sans line-clamp-2 leading-tight">
                  {app.titleEn}
                </div>
                <div className="text-[10px] text-slate-500 font-urdu line-clamp-1">
                  {app.titleUrdu}
                </div>
              </div>
            </div>
          ))}

          {/* Web Browser button */}
          <div
            onClick={() => alert('دعوت اسلامی کی ویب سائٹ وزٹ کریں: dawateislami.net')}
            className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xs flex flex-col items-center text-center justify-between hover:shadow-md transition-all cursor-pointer active:scale-95"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs mb-1.5">
              <Globe className="w-7 h-7" />
            </div>
            <div className="text-[11px] font-bold text-slate-800 font-sans">
              Website
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
