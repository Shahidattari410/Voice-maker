/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { WorkPlanView } from './components/WorkPlanView';
import { ReportsView } from './components/ReportsView';
import { SettingsModal } from './components/SettingsModal';
import { AddQuestionModal } from './components/AddQuestionModal';
import { PrintReportModal } from './components/PrintReportModal';
import { OtherWebModal } from './components/OtherWebModal';
import { FullscreenWebViewer } from './components/FullscreenWebViewer';
import { PrayerApp } from './prayer-app/PrayerApp';
import { SpeechStudioApp } from './speech-studio/SpeechStudioApp';

const MainContent: React.FC = () => {
  const { view, fontId, fontSize, customFontName, activeAppSuite, setActiveAppSuite, setIsOtherWebModalOpen } = useApp();

  // Dynamically update document font family and font size
  useEffect(() => {
    let chosenFont = "'Noto Nastaliq Urdu', serif";
    if (fontId === 'gulzar') {
      chosenFont = "'Gulzar', serif";
    } else if (fontId === 'amiri') {
      chosenFont = "'Amiri', serif";
    } else if (fontId === 'lateef') {
      chosenFont = "'Lateef', serif";
    } else if (fontId === 'noto-sans-arabic') {
      chosenFont = "'Noto Sans Arabic', sans-serif";
    } else if (fontId === 'custom-uploaded' && customFontName) {
      chosenFont = `"${customFontName}", 'Noto Nastaliq Urdu', serif`;
    }

    document.documentElement.style.setProperty('--app-font-family', chosenFont);
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontId, fontSize, customFontName]);

  // If AI Motivational Speech & Voice Cloning Studio is active, render in full isolation!
  if (activeAppSuite === 'speech-studio') {
    return <SpeechStudioApp onSwitchToNaikAmaal={() => setActiveAppSuite('naik-amaal')} />;
  }

  // If Prayer Times App is active, render it in full isolation!
  if (activeAppSuite === 'prayer-times') {
    return <PrayerApp onSwitchToNaikAmaal={() => setActiveAppSuite('naik-amaal')} />;
  }

  // Otherwise render Naik Amaal App in full isolation!
  return (
    <div className="min-h-screen flex flex-col font-urdu text-slate-800 antialiased bg-slate-100 relative">
      {/* Opening Splash Screen Wallpaper (matching screenshot 3) */}
      <SplashScreen />

      {/* Main Top Header and App Bar */}
      <Header />

      {/* Main App Canvas */}
      <main className="flex-1 w-full pb-16">
        {view === 'dashboard' && <DashboardView />}
        {view === 'workplan' && <WorkPlanView />}
        {view === 'reports' && <ReportsView />}
      </main>

      {/* Floating Quick Switchers: Speech Studio & Other Web */}
      <div className="fixed bottom-3 left-3 z-40 flex items-center gap-2">
        <button
          onClick={() => setActiveAppSuite('speech-studio')}
          className="py-2 px-3.5 bg-gradient-to-r from-indigo-700 via-purple-800 to-indigo-950 hover:from-indigo-800 hover:to-purple-950 text-white rounded-full text-xs font-bold shadow-xl border border-indigo-400/50 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
          title="اے آئی موٹیویشنل اسپیچ اسٹوڈیو اور وائس کلوننگ کھولیں"
        >
          <span>🎙️ اسپیچ اسٹوڈیو (AI)</span>
        </button>

        <button
          onClick={() => setIsOtherWebModalOpen(true)}
          className="py-2 px-3 bg-gradient-to-r from-emerald-700 to-teal-900 hover:from-emerald-800 hover:to-teal-950 text-white rounded-full text-xs font-bold shadow-xl border border-emerald-400/50 flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
          title="دوسری ویب سائٹ یا اوقات الصلوٰۃ ایپ کھولیں"
        >
          <span>🌐 دوسری ویب</span>
        </button>
      </div>

      {/* Modals and Fullscreen Viewers */}
      <OtherWebModal />
      <FullscreenWebViewer />
      <SettingsModal />
      <AddQuestionModal />
      <PrintReportModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
