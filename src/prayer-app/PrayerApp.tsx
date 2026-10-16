import React from 'react';
import { PrayerProvider, usePrayer } from './context/PrayerContext';
import { PrayerSplash } from './components/PrayerSplash';
import { PrayerHome } from './components/PrayerHome';
import { QazaNamaz } from './components/QazaNamaz';
import { PrayerSchedule } from './components/PrayerSchedule';
import { QuestionsAnswers } from './components/QuestionsAnswers';
import { DuroodTracker } from './components/DuroodTracker';
import { PrayerSettings } from './components/PrayerSettings';
import { MoreApps } from './components/MoreApps';
import { RohaniIlaj } from './components/RohaniIlaj';
import { PrayerBottomNav } from './components/PrayerBottomNav';

const PrayerMainView: React.FC = () => {
  const { activeTab, switchToNaikAmaal } = usePrayer();

  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-slate-800 font-urdu select-none">
      {/* Opening Splash Screen */}
      <PrayerSplash />

      {/* Main Tab Render */}
      <main className="min-h-screen">
        {activeTab === 'home' && <PrayerHome />}
        {activeTab === 'schedule' && <PrayerSchedule />}
        {activeTab === 'qaza' && <QazaNamaz />}
        {activeTab === 'questions' && <QuestionsAnswers />}
        {activeTab === 'durood' && <DuroodTracker />}
        {activeTab === 'rohani' && <RohaniIlaj />}
        {activeTab === 'settings' && <PrayerSettings />}
        {activeTab === 'more-apps' && <MoreApps />}
      </main>

      {/* Bottom Navigation */}
      <PrayerBottomNav />
    </div>
  );
};

export const PrayerApp: React.FC<{ onSwitchToNaikAmaal: () => void }> = ({
  onSwitchToNaikAmaal,
}) => {
  return (
    <PrayerProvider onSwitchToNaikAmaal={onSwitchToNaikAmaal}>
      <PrayerMainView />
    </PrayerProvider>
  );
};
