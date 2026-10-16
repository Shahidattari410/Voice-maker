import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  Navigation,
  Search,
  Check,
  Compass,
  RotateCw,
} from 'lucide-react';
import { usePrayer } from '../context/PrayerContext';
import { POPULAR_CITIES, Coordinates } from '../utils/solarCalculations';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    currentCity,
    setCurrentCity,
    setCoordinates,
    coordinates,
    detectLocationViaGPS,
    isDetectingGPS,
  } = usePrayer();

  const [searchQuery, setSearchQuery] = useState('');
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (city: typeof POPULAR_CITIES[0]) => {
    setCurrentCity(city.name);
    setCoordinates({ lat: city.lat, lng: city.lng, altitudeFeet: city.altitude });
    setIsLocationModalOpen(false);
  };

  const handleGPSClick = async () => {
    setGpsStatus('براؤزر سے سیٹلائٹ جی پی ایس لوکیشن تلاش کی جا رہی ہے...');
    const result = await detectLocationViaGPS();
    setGpsStatus(result.message);
    if (result.success) {
      setTimeout(() => {
        setIsLocationModalOpen(false);
        setGpsStatus(null);
      }, 1500);
    }
  };

  return (
    <AnimatePresence>
      {isLocationModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 text-right overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]"
          >
            {/* Header */}
            <div className="bg-[#b91c1c] text-white px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-bold urdu-title">
                لوکیشن اور مقام کا انتخاب
              </h3>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              {/* Real Auto GPS Detect Button */}
              <button
                onClick={handleGPSClick}
                disabled={isDetectingGPS}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
              >
                {isDetectingGPS ? (
                  <RotateCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4 fill-white" />
                )}
                <span>
                  {isDetectingGPS
                    ? 'جی پی ایس لوکیشن تلاش ہو رہی ہے...'
                    : '📍 میری اصل لوکیشن خودکار حاصل کریں (GPS Auto Detect)'}
                </span>
              </button>

              {gpsStatus && (
                <div className="p-2.5 rounded-xl bg-slate-100 text-xs text-slate-800 font-medium text-center border border-slate-200">
                  {gpsStatus}
                </div>
              )}

              {/* Current Active Location Info */}
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                  <MapPin className="w-3.5 h-3.5 text-sky-700" />
                  <span>موجودہ فعال مقام:</span>
                </div>
                <div className="text-xs text-slate-800 font-bold">{currentCity}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  عرض بلد: {coordinates.lat.toFixed(2)}° | طول بلد: {coordinates.lng.toFixed(2)}° | بلندی: {coordinates.altitudeFeet || 298} Feet
                </div>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="شہر کا نام تلاش کریں..."
                  className="w-full text-xs pr-9 pl-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 bg-slate-50"
                />
              </div>

              {/* Popular Cities List */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-500">
                  معروف شہر و مقامات:
                </div>
                {filteredCities.map((city, idx) => {
                  const isSelected =
                    Math.abs(city.lat - coordinates.lat) < 0.05 &&
                    Math.abs(city.lng - coordinates.lng) < 0.05;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectCity(city)}
                      className={`w-full p-2.5 rounded-xl border text-right flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400 font-mono">
                        {city.altitude}ft
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{city.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="py-1.5 px-4 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                بند کریں
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
