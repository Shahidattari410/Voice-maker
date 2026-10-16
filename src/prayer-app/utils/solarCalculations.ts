// Astronomical Solar Calculations for Accurate Islamic Prayer Times
// Standard Karachi University / Dawat-e-Islami calculation method (Fajr 18°, Isha 18°)

export interface Coordinates {
  lat: number;
  lng: number;
  altitudeFeet?: number;
}

export interface CalculatedPrayerTimes {
  fajr: string;
  fajrEnd: string;
  sunrise: string;
  ishraq: string;
  chasht: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nisf: string;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

function formatTime(hoursFloat: number): string {
  let normalized = hoursFloat % 24;
  if (normalized < 0) normalized += 24;

  const hours = Math.floor(normalized);
  const minutesFloat = (normalized - hours) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.floor((minutesFloat - minutes) * 60);

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;

  const hStr = String(displayHours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  return `${hStr}:${mStr}:${sStr} ${period}`;
}

export function calculatePrayerTimes(
  coords: Coordinates,
  date: Date = new Date(),
  fiqh: 'hanafi' | 'shafii' = 'hanafi',
  timezoneOffsetHours: number = 5 // Default PKT (UTC+5)
): CalculatedPrayerTimes {
  const { lat, lng } = coords;

  // Day of year
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Solar declination (approximate Spencer formula)
  const gamma = (2 * Math.PI * (dayOfYear - 1)) / 365;
  const declination =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Equation of time in minutes
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  // Solar noon in hours (UTC + offset)
  const solarNoon = 12 + timezoneOffsetHours - lng / 15 - eqTime / 60;

  // Helper to calculate hour angle for a given solar altitude angle (alpha)
  const hourAngle = (alphaDeg: number): number => {
    const latRad = toRadians(lat);
    const alphaRad = toRadians(alphaDeg);

    const cosH =
      (Math.sin(alphaRad) - Math.sin(latRad) * Math.sin(declination)) /
      (Math.cos(latRad) * Math.cos(declination));

    if (cosH > 1) return 0; // Sun never rises
    if (cosH < -1) return 180; // Sun never sets

    return toDegrees(Math.acos(cosH));
  };

  // Fajr: Sun 18° below horizon (-18°)
  const haFajr = hourAngle(-18);
  const fajrTime = solarNoon - haFajr / 15;

  // Sunrise: Sun center -0.833°
  const haSunrise = hourAngle(-0.833);
  const sunriseTime = solarNoon - haSunrise / 15;

  // Sunset / Maghrib: Sun center -0.833°
  const sunsetTime = solarNoon + haSunrise / 15;

  // Isha: Sun 18° below horizon (-18°)
  const haIsha = hourAngle(-18);
  const ishaTime = solarNoon + haIsha / 15;

  // Asr hour angle:
  // shadow factor = 1 for Shafi'i, 2 for Hanafi
  const shadowFactor = fiqh === 'hanafi' ? 2 : 1;
  const latDeg = lat;
  const decDeg = toDegrees(declination);
  const zenithDiff = Math.abs(latDeg - decDeg);
  const asrAltitude = toDegrees(
    Math.atan(1 / (shadowFactor + Math.tan(toRadians(zenithDiff))))
  );
  const haAsr = hourAngle(asrAltitude);
  const asrTime = solarNoon + haAsr / 15;

  // Dhuhr: solar noon + 2 min buffer
  const dhuhrTime = solarNoon + 2 / 60;

  // Ishraq: 20 minutes after sunrise
  const ishraqTime = sunriseTime + 20 / 60;

  // Chasht (Dhuha al-Kubra): halfway between sunrise and sunset
  const chashtTime = (sunriseTime + sunsetTime) / 2 - 40 / 60;

  // Nisf al-Layl (Midnight): midway between Sunset and Fajr next morning
  const nisfTime = sunsetTime + ((24 + fajrTime - sunsetTime) % 24) / 2;

  return {
    fajr: formatTime(fajrTime),
    fajrEnd: formatTime(sunriseTime),
    sunrise: formatTime(sunriseTime),
    ishraq: formatTime(ishraqTime),
    chasht: formatTime(chashtTime),
    dhuhr: formatTime(dhuhrTime),
    asr: formatTime(asrTime),
    maghrib: formatTime(sunsetTime),
    isha: formatTime(ishaTime),
    nisf: formatTime(nisfTime),
  };
}

// Preset cities with real coordinates
export const POPULAR_CITIES = [
  { name: 'بستی چوہدری عبد الحمید سوئی گیس پل کمبیرہ میانو (رحیم یار خان)', lat: 28.42, lng: 70.30, altitude: 298 },
  { name: 'Sardargarh (Rahim Yar Khan), PK', lat: 28.43, lng: 70.32, altitude: 298 },
  { name: 'کراچی (Karachi, Sindh)', lat: 24.86, lng: 67.01, altitude: 26 },
  { name: 'لاہور (Lahore, Punjab)', lat: 31.52, lng: 74.35, altitude: 712 },
  { name: 'اسلام آباد (Islamabad, Capital)', lat: 33.68, lng: 73.04, altitude: 1770 },
  { name: 'راولپنڈی (Rawalpindi)', lat: 33.59, lng: 73.04, altitude: 1667 },
  { name: 'فیصل آباد (Faisalabad)', lat: 31.45, lng: 73.13, altitude: 604 },
  { name: 'ملتان (Multan Sharif)', lat: 30.15, lng: 71.52, altitude: 400 },
  { name: 'پشاور (Peshawar, KPK)', lat: 34.01, lng: 71.52, altitude: 1178 },
  { name: 'کوئٹہ (Quetta, Balochistan)', lat: 30.17, lng: 66.97, altitude: 5500 },
  { name: 'بہاولپور (Bahawalpur)', lat: 29.35, lng: 71.69, altitude: 381 },
  { name: 'سکھر (Sukkur, Sindh)', lat: 27.70, lng: 68.85, altitude: 220 },
  { name: 'مکہ مکرمہ (Makkah Al-Mukarramah)', lat: 21.42, lng: 39.82, altitude: 909 },
  { name: 'مدینہ منورہ (Madinah Al-Munawwarah)', lat: 24.46, lng: 39.61, altitude: 1995 },
];
