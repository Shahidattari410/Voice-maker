import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { azanAudio } from '../utils/azanSound';
import {
  calculatePrayerTimes,
  Coordinates,
  CalculatedPrayerTimes,
  POPULAR_CITIES,
} from '../utils/solarCalculations';

export type PrayerTab =
  | 'home'
  | 'schedule'
  | 'qaza'
  | 'questions'
  | 'durood'
  | 'rohani'
  | 'settings'
  | 'more-apps';

export type PrayerThemeId =
  | 'midnight-mosque'
  | 'madani-green'
  | 'royal-burgundy'
  | 'golden-kaaba'
  | 'ocean-teal';

interface PrayerContextType {
  activeTab: PrayerTab;
  setActiveTab: (t: PrayerTab) => void;
  showSplash: boolean;
  setShowSplash: (s: boolean) => void;

  // Location & Coordinates (Real GPS & Astronomical Calculations)
  currentCity: string;
  setCurrentCity: (c: string) => void;
  coordinates: Coordinates;
  setCoordinates: (coords: Coordinates) => void;
  detectLocationViaGPS: () => Promise<{ success: boolean; message: string }>;
  isDetectingGPS: boolean;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (o: boolean) => void;
  calculatedTimes: CalculatedPrayerTimes;

  // Settings & Fiqh
  fiqh: 'hanafi' | 'shafii';
  setFiqh: (f: 'hanafi' | 'shafii') => void;
  silentMode: boolean;
  setSilentMode: (s: boolean) => void;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
  alarmsEnabled: boolean;
  setAlarmsEnabled: (a: boolean) => void;
  endTimeAlertEnabled: boolean;
  setEndTimeAlertEnabled: (a: boolean) => void;
  surahMulkAlertEnabled: boolean;
  setSurahMulkAlertEnabled: (a: boolean) => void;
  surahMulkTime: string;
  setSurahMulkTime: (t: string) => void;

  // Theme
  prayerTheme: PrayerThemeId;
  setPrayerTheme: (t: PrayerThemeId) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (o: boolean) => void;

  // Qaza Prayers
  qazaCounts: Record<string, number>;
  updateQazaCount: (prayerId: string, delta: number) => void;
  setQazaCountDirect: (prayerId: string, val: number) => void;
  totalQaza: number;
  saveQaza: () => void;

  // Durood Tracker
  duroodCount: number;
  incrementDurood: () => void;
  resetDuroodToday: () => void;
  duroodTarget: number;
  setDuroodTarget: (t: number) => void;

  // Sound
  playAdhanPreview: () => void;

  // App Switcher back to Naik Amaal
  switchToNaikAmaal: () => void;
}

const PrayerContext = createContext<PrayerContextType | null>(null);

const STORAGE_KEY_QAZA = 'prayer_app_qaza_v2';
const STORAGE_KEY_DUROOD = 'prayer_app_durood_v2';
const STORAGE_KEY_CITY = 'prayer_app_city_v2';
const STORAGE_KEY_COORDS = 'prayer_app_coords_v2';
const STORAGE_KEY_FIQH = 'prayer_app_fiqh_v2';
const STORAGE_KEY_DARK = 'prayer_app_dark_v2';
const STORAGE_KEY_THEME = 'prayer_app_theme_v2';
const STORAGE_KEY_ALARMS = 'prayer_app_alarms_v2';
const STORAGE_KEY_END_ALERT = 'prayer_app_end_alert_v2';
const STORAGE_KEY_MULK_ALERT = 'prayer_app_mulk_alert_v2';

export const PrayerProvider: React.FC<{
  children: ReactNode;
  onSwitchToNaikAmaal: () => void;
}> = ({ children, onSwitchToNaikAmaal }) => {
  const [activeTab, setActiveTab] = useState<PrayerTab>('home');
  const [showSplash, setShowSplash] = useState<boolean>(false);

  // Location & Coordinates
  const [currentCity, setCurrentCityState] = useState<string>(() => {
    return (
      localStorage.getItem(STORAGE_KEY_CITY) ||
      'بستی چوہدری عبد الحمید سوئی گیس پل کمبیرہ میانو (رحیم یار خان)'
    );
  });

  const [coordinates, setCoordinatesState] = useState<Coordinates>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY_COORDS);
      return s ? JSON.parse(s) : { lat: 28.42, lng: 70.30, altitudeFeet: 298 };
    } catch {
      return { lat: 28.42, lng: 70.30, altitudeFeet: 298 };
    }
  });

  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const setCurrentCity = (c: string) => {
    setCurrentCityState(c);
    localStorage.setItem(STORAGE_KEY_CITY, c);
  };

  const setCoordinates = (coords: Coordinates) => {
    setCoordinatesState(coords);
    localStorage.setItem(STORAGE_KEY_COORDS, JSON.stringify(coords));
  };

  // Real GPS Geolocation Detection with High-Accuracy GPS + Network IP fallback
  const detectLocationViaGPS = async (): Promise<{ success: boolean; message: string }> => {
    setIsDetectingGPS(true);

    const tryNetworkFallback = async (): Promise<{ success: boolean; message: string }> => {
      try {
        // Try multiple IP Geolocation endpoints in cascade
        const endpoints = [
          'https://ipapi.co/json/',
          'https://freeipapi.com/api/json',
          'https://ipwho.is/',
        ];

        for (const url of endpoints) {
          try {
            const resp = await fetch(url, { headers: { Accept: 'application/json' } });
            if (resp.ok) {
              const data = await resp.json();
              const lat = Number(data.latitude || data.lat);
              const lng = Number(data.longitude || data.lon);
              if (!isNaN(lat) && !isNaN(lng) && lat !== 0) {
                const newCoords: Coordinates = { lat, lng, altitudeFeet: 300 };
                setCoordinates(newCoords);
                const cityStr = data.city
                  ? `${data.city} (${data.country_name || data.country || 'پاکستان'})`
                  : `مقام (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
                setCurrentCity(cityStr);
                setIsDetectingGPS(false);
                return {
                  success: true,
                  message: `حقیقی لوکیشن نیٹ ورک سے خودکار حاصل ہو گئی: ${cityStr}`,
                };
              }
            }
          } catch {
            // try next endpoint
          }
        }
      } catch {
        // fallback
      }

      setIsDetectingGPS(false);
      return {
        success: false,
        message: 'لوکیشن خودکار نہیں مل سکی۔ برائے مہربانی نیچے شہروں کی فہرست سے اپنا شہر منتخب کریں۔',
      };
    };

    if (typeof window === 'undefined' || !navigator.geolocation) {
      return await tryNetworkFallback();
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const altitudeFeet = position.coords.altitude
            ? Math.round(position.coords.altitude * 3.28084)
            : 300;

          const newCoords: Coordinates = { lat, lng, altitudeFeet };
          setCoordinates(newCoords);

          // Reverse geocode to get human-readable location name
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            if (resp.ok) {
              const data = await resp.json();
              const detectedName =
                data.address?.city ||
                data.address?.town ||
                data.address?.county ||
                data.address?.state ||
                data.display_name?.split(',')[0] ||
                `مقام (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
              setCurrentCity(detectedName);
            } else {
              setCurrentCity(`مقام (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`);
            }
          } catch {
            setCurrentCity(`مقام (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`);
          }

          setIsDetectingGPS(false);
          resolve({
            success: true,
            message: `سیٹلائٹ GPS سے لوکیشن کامیابی سے حاصل کر لی گئی! (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
          });
        },
        async () => {
          // If browser GPS was blocked or timed out, seamlessly fallback to real IP Geolocation!
          const fallbackRes = await tryNetworkFallback();
          resolve(fallbackRes);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });
  };

  // Fiqh & Calculation
  const [fiqh, setFiqhState] = useState<'hanafi' | 'shafii'>(() => {
    return (localStorage.getItem(STORAGE_KEY_FIQH) as 'hanafi' | 'shafii') || 'hanafi';
  });

  const setFiqh = (f: 'hanafi' | 'shafii') => {
    setFiqhState(f);
    localStorage.setItem(STORAGE_KEY_FIQH, f);
  };

  // Live real calculated prayer times
  const calculatedTimes = useMemo(() => {
    return calculatePrayerTimes(coordinates, new Date(), fiqh, 5);
  }, [coordinates, fiqh]);

  // Alarms & Alerts
  const [silentMode, setSilentMode] = useState<boolean>(false);

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_DARK) === 'true';
  });

  const setDarkMode = (d: boolean) => {
    setDarkModeState(d);
    localStorage.setItem(STORAGE_KEY_DARK, String(d));
  };

  const [prayerTheme, setPrayerThemeState] = useState<PrayerThemeId>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as PrayerThemeId) || 'midnight-mosque';
  });

  const setPrayerTheme = (t: PrayerThemeId) => {
    setPrayerThemeState(t);
    localStorage.setItem(STORAGE_KEY_THEME, t);
  };

  const [alarmsEnabled, setAlarmsEnabledState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_ALARMS) !== 'false';
  });

  const setAlarmsEnabled = (val: boolean) => {
    setAlarmsEnabledState(val);
    localStorage.setItem(STORAGE_KEY_ALARMS, String(val));
    if (val) azanAudio.playTakbeer();
  };

  const [endTimeAlertEnabled, setEndTimeAlertEnabledState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_END_ALERT) !== 'false';
  });

  const setEndTimeAlertEnabled = (val: boolean) => {
    setEndTimeAlertEnabledState(val);
    localStorage.setItem(STORAGE_KEY_END_ALERT, String(val));
  };

  const [surahMulkAlertEnabled, setSurahMulkAlertEnabledState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_MULK_ALERT) !== 'false';
  });

  const setSurahMulkAlertEnabled = (val: boolean) => {
    setSurahMulkAlertEnabledState(val);
    localStorage.setItem(STORAGE_KEY_MULK_ALERT, String(val));
  };

  const [surahMulkTime, setSurahMulkTime] = useState<string>('09:30 PM');

  // Qaza Counts
  const [qazaCounts, setQazaCounts] = useState<Record<string, number>>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY_QAZA);
      return s
        ? JSON.parse(s)
        : {
            fajr: 0,
            dhuhr: 0,
            asr: 0,
            maghrib: 0,
            isha: 0,
            witr: 0,
          };
    } catch {
      return { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, witr: 0 };
    }
  });

  const updateQazaCount = (prayerId: string, delta: number) => {
    setQazaCounts((prev) => {
      const current = prev[prayerId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev, [prayerId]: next };
      localStorage.setItem(STORAGE_KEY_QAZA, JSON.stringify(updated));
      return updated;
    });
  };

  const setQazaCountDirect = (prayerId: string, val: number) => {
    setQazaCounts((prev) => {
      const updated = { ...prev, [prayerId]: Math.max(0, val) };
      localStorage.setItem(STORAGE_KEY_QAZA, JSON.stringify(updated));
      return updated;
    });
  };

  const saveQaza = () => {
    localStorage.setItem(STORAGE_KEY_QAZA, JSON.stringify(qazaCounts));
  };

  const totalQaza = Object.values(qazaCounts).reduce((a, b) => a + b, 0);

  // Durood Tracker
  const [duroodCount, setDuroodCount] = useState<number>(() => {
    const s = localStorage.getItem(STORAGE_KEY_DUROOD);
    return s ? Number(s) : 0;
  });

  const [duroodTarget, setDuroodTarget] = useState<number>(100);

  const incrementDurood = () => {
    setDuroodCount((prev) => {
      const next = prev + 1;
      localStorage.setItem(STORAGE_KEY_DUROOD, String(next));
      return next;
    });
  };

  const resetDuroodToday = () => {
    setDuroodCount(0);
    localStorage.setItem(STORAGE_KEY_DUROOD, '0');
  };

  const playAdhanPreview = () => {
    azanAudio.playTakbeer();
  };

  return (
    <PrayerContext.Provider
      value={{
        activeTab,
        setActiveTab,
        showSplash,
        setShowSplash,
        currentCity,
        setCurrentCity,
        coordinates,
        setCoordinates,
        detectLocationViaGPS,
        isDetectingGPS,
        isLocationModalOpen,
        setIsLocationModalOpen,
        calculatedTimes,
        fiqh,
        setFiqh,
        silentMode,
        setSilentMode,
        darkMode,
        setDarkMode,
        alarmsEnabled,
        setAlarmsEnabled,
        endTimeAlertEnabled,
        setEndTimeAlertEnabled,
        surahMulkAlertEnabled,
        setSurahMulkAlertEnabled,
        surahMulkTime,
        setSurahMulkTime,
        prayerTheme,
        setPrayerTheme,
        isThemeModalOpen,
        setIsThemeModalOpen,
        qazaCounts,
        updateQazaCount,
        setQazaCountDirect,
        totalQaza,
        saveQaza,
        duroodCount,
        incrementDurood,
        resetDuroodToday,
        duroodTarget,
        setDuroodTarget,
        playAdhanPreview,
        switchToNaikAmaal: onSwitchToNaikAmaal,
      }}
    >
      {children}
    </PrayerContext.Provider>
  );
};

export const usePrayer = () => {
  const context = useContext(PrayerContext);
  if (!context) {
    throw new Error('usePrayer must be used within PrayerProvider');
  }
  return context;
};
