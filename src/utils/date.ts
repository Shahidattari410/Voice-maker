export const URDU_DAYS = [
  'اتوار',
  'پیر',
  'منگل',
  'بدھ',
  'جمعرات',
  'جمعہ',
  'ہفتہ',
];

export const URDU_MONTHS = [
  'جنوری',
  'فروری',
  'مارچ',
  'اپریل',
  'مئی',
  'جون',
  'جولائی',
  'اگست',
  'ستمبر',
  'اکتوبر',
  'نومبر',
  'دسمبر',
];

export function toUrduNumber(num: number | string): string {
  const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (w) => urduDigits[+w]);
}

export function formatDateUrdu(dateStr: string): {
  dayName: string;
  dayNum: number;
  monthName: string;
  year: number;
  formatted: string;
  shortDay: string;
} {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayIndex = dateObj.getDay();
  const dayName = URDU_DAYS[dayIndex];
  const monthName = URDU_MONTHS[m - 1];

  return {
    dayName,
    dayNum: d,
    monthName,
    year: y,
    shortDay: `${dayName} ${d}`,
    formatted: `${dayName} ${d} ${monthName} ${y}`,
  };
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getHijriDateUrdu(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    // Use Intl with Islamic calendar
    const formatter = new Intl.DateTimeFormat('ur-PK-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(dateObj) + 'ھ';
  } catch {
    return '۱۴۴۶ھ';
  }
}

export function shiftDate(dateStr: string, daysOffset: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  dateObj.setDate(dateObj.getDate() + daysOffset);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const PAST_MONTHS_SAMPLE = [
  { key: 'jan', label: 'جنوری', completed: 47 },
  { key: 'dec', label: 'دسمبر', completed: 41 },
  { key: 'nov', label: 'نومبر', completed: 36 },
  { key: 'oct', label: 'اکتوبر', completed: 2 },
  { key: 'sep', label: 'ستمبر', completed: 2 },
  { key: 'aug', label: 'اگست', completed: 2 },
];
