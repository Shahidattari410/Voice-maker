export interface PrayerTimeItem {
  id: string;
  name: string;
  arabicName: string;
  startTime: string;
  endTime?: string;
  fiqhSuffix?: string;
  icon: string;
}

export interface QazaPrayerItem {
  id: string;
  name: string;
  badgeColor: string;
  count: number;
}

export interface QAItem {
  id: string;
  title: string;
  category: string;
  answer: string;
  reference?: string;
}

export interface AppItem {
  id: string;
  titleUrdu: string;
  titleEn: string;
  iconColor: string;
  badge: string;
  description: string;
}

export const INITIAL_PRAYER_TIMES: PrayerTimeItem[] = [
  {
    id: 'fajr',
    name: 'فجر',
    arabicName: 'الفجر',
    startTime: '04:58:18 AM',
    endTime: '06:15:37 AM',
    icon: 'sunrise',
  },
  {
    id: 'dhuhr',
    name: 'ظہر',
    arabicName: 'الظهر',
    startTime: '12:04:26 PM',
    endTime: '04:14:00 PM',
    icon: 'sun',
  },
  {
    id: 'asr',
    name: 'عصر',
    arabicName: 'العصر',
    startTime: '04:14:07 PM',
    endTime: '05:52:00 PM',
    fiqhSuffix: 'حنفی',
    icon: 'sun-dim',
  },
  {
    id: 'maghrib',
    name: 'مغرب',
    arabicName: 'المغرب',
    startTime: '05:52:51 PM',
    endTime: '07:10:00 PM',
    icon: 'sunset',
  },
  {
    id: 'isha',
    name: 'عشاء',
    arabicName: 'العشاء',
    startTime: '07:10:06 PM',
    endTime: '04:58:00 AM',
    fiqhSuffix: 'حنفی',
    icon: 'moon',
  },
];

export const OTHER_TIMES = [
  { id: 'tulu', name: 'طلوع آفتاب', time: '06:16:23 AM', icon: 'sunrise' },
  { id: 'ishraq', name: 'اشراق', time: '06:36:23 AM', icon: 'sun' },
  { id: 'chasht', name: 'ضحوۃ کبریٰ (چاشت)', time: '11:25:01 AM', icon: 'sun' },
  { id: 'nisf', name: 'نصف اللیل', time: '11:34:00 PM', icon: 'moon' },
  { id: 'sahoor', name: 'سحری کا اختتام', time: '04:48:00 AM', icon: 'clock' },
  { id: 'iftar', name: 'غروب آفتاب / افطار', time: '05:52:51 PM', icon: 'sunset' },
];

export const QA_CATEGORIES = [
  {
    category: 'معمولاتِ اہلِ سنت',
    items: [
      {
        id: 'qa_1',
        title: 'غیر اللہ سے مدد مانگنے کا شرعی حکم (استمداد و استعانت)؟',
        category: 'معمولاتِ اہلِ سنت',
        answer: 'اللہ تعالیٰ کے مقبول بندوں (انبیائے کرام اور اولیائے عظام) کو وسیلہ بنانا اور ان سے بطورِ مجاز و اذنِ الٰہی مدد طلب کرنا جائز اور سلف صالحین کا معمول ہے۔ حقیقی مددگار صرف اللہ تعالیٰ کی ذات ہے۔',
        reference: 'فتاویٰ رضویہ، جلد ۲۹ / بہارِ شریعت',
      },
      {
        id: 'qa_2',
        title: 'اذان و اقامت سے پہلے درود و سلام پڑھنے کا بیان؟',
        category: 'معمولاتِ اہلِ سنت',
        answer: 'اذان اور اقامت سے قبل درود و سلام پڑھنا مستحب اور باعثِ برکت ہے۔ شریعت میں کسی وقت درود شریف پڑھنے کی ممانعت نہیں سوائے مخصوص ممنوعہ حالتوں کے۔',
        reference: 'رد المحتار / الاذان والاقامہ',
      },
      {
        id: 'qa_3',
        title: 'بڑی راتوں (شبِ برات، شبِ معراج، شبِ قدر) میں عبادت؟',
        category: 'معمولاتِ اہلِ سنت',
        answer: 'ان مبارک راتوں میں کثرت سے نوافل ادا کرنا، تلاوتِ قرآن، توبہ و استغفار اور ایصالِ ثواب کرنا احادیثِ طیبہ اور ائمہ دین کے اقوال سے ثابت اور اجرِ عظیم کا باعث ہے۔',
        reference: 'مشکوٰۃ شریف / بہارِ شریعت',
      },
      {
        id: 'qa_4',
        title: 'چاروں ائمہ میں سے کسی ایک کی تقلید کا بیان؟',
        category: 'معمولاتِ اہلِ سنت',
        answer: 'مسائلِ شرعیہ میں ائمہ اربعہ (امام اعظم ابو حنیفہ، امام مالک، امام شافعی، امام احمد بن حنبل) میں سے کسی ایک امام کی تقلید واجب ہے تاکہ دین کے احکام پر درست انداز میں عمل ممکن ہو۔',
        reference: 'شرح العقائد النسفیہ',
      },
      {
        id: 'qa_5',
        title: 'پیری مریدی اور بیعت کی شرعی حیثیت؟',
        category: 'معمولاتِ اہلِ سنت',
        answer: 'کسی جامع الشرائط، سنی صحیح العقیدہ شیخِ کامل کے ہاتھ پر بیعت کرنا سنتِ صحابہ اور تزکیہ نفس کے لیے انتہائی مفید ہے۔',
        reference: 'بہارِ شریعت، حصہ نہم',
      },
    ],
  },
  {
    category: 'عبادات و فقہی احکام',
    items: [
      {
        id: 'qa_6',
        title: 'طہارت اور وضو کے فرائض و سنن کا بیان؟',
        category: 'عبادات و فقہی احکام',
        answer: 'وضو میں چار فرائض ہیں: چہرہ دھونا، کہنیوں سمیت دونوں ہاتھ دھونا، چوتھائی سر کا مسح کرنا اور ٹخنوں سمیت دونوں پاؤں دھونا۔',
        reference: 'نور الایضاح / بہارِ شریعت',
      },
      {
        id: 'qa_7',
        title: 'قضاء نمازوں کے حساب اور ادائیگی کا آسان طریقہ؟',
        category: 'عبادات و فقہی احکام',
        answer: 'جس شخص کے ذمے قضاء نمازیں ہوں وہ ہر وقتی فرض نماز کے ساتھ ایک قضاء نماز بھی ادا کرتا رہے، یا فرصت کے اوقات میں ترتیب وار نیت کر کے قضاء نمازیں مکمل کرے۔',
        reference: 'الدر المختار',
      },
      {
        id: 'qa_8',
        title: 'مسافر کی نماز (قصر نماز) کے احکام؟',
        category: 'عبادات و فقہی احکام',
        answer: 'شرعی مسافت (تقریباً ۹۲ کلومیٹر) کے ارادے سے سفر کرنے والا جب اپنی آبادی کی حدود سے باہر نکل جائے تو چار رکعت والے فرض (ظہر، عصر، عشاء) کو دو رکعت قصر کر کے پڑھے گا۔',
        reference: 'ہدایہ / بہارِ شریعت',
      },
      {
        id: 'qa_9',
        title: 'نمازِ تراویح کی رکعات اور جماعت کا حکم؟',
        category: 'عبادات و فقہی احکام',
        answer: 'ماہِ رمضان میں ۲۰ رکعت تراویح سنتِ مؤکدہ ہے۔ یہ حضرت عمر فاروق اور تمام صحابہ کرام رضی اللہ عنہم کے اجماع سے ثابت ہے۔',
        reference: 'مؤطا امام مالک / سنن بیہقی',
      },
      {
        id: 'qa_10',
        title: 'سجدۂ سہو کے اسباب اور طریقہ؟',
        category: 'عبادات و فقہی احکام',
        answer: 'نماز کے واجبات میں سے کسی واجب کو بھولے سے چھوڑ دینے یا تاخیر کرنے پر قعدہ اخیرہ میں تشہد کے بعد ایک طرف سلام پھیر کر دو سجدے کرنا اور پھر دوبارہ تشہد، درود و دعا پڑھ کر سلام پھیرنا واجب ہے۔',
        reference: 'رد المحتار علی الدر المختار',
      },
    ],
  },
  {
    category: 'معاملات و معاشرت',
    items: [
      {
        id: 'qa_11',
        title: 'سود اور غیر شرعی منافع کی ممانعت؟',
        category: 'معاملات و معاشرت',
        answer: 'شریعت میں سود قطعی حرام اور گناہِ کبیرہ ہے۔ اللہ تعالیٰ نے قرآن میں سود خوروں کے خلاف اعلانِ جنگ فرمایا ہے۔ ہر طرح کے سودی لین دین سے بچنا لازم ہے۔',
        reference: 'سورۃ البقرۃ / فتاویٰ رضویہ',
      },
      {
        id: 'qa_12',
        title: 'غیبت، چغلی اور حسد کی برائی و توبہ کا طریقہ؟',
        category: 'معاملات و معاشرت',
        answer: 'غیبت اپنے مسلمان بھائی کا پسِ پشت ایسا ذکر کرنا ہے جو اسے ناگوار گزرے۔ اس سے سچی توبہ اور جس کی غیبت کی ہو اگر اسے خبر پہنچ گئی ہو تو اس سے معافی مانگنا ضروری ہے۔',
        reference: 'احیاء العلوم / منہاج العابدین',
      },
    ],
  },
];

export const ROHANI_ILAJ_ITEMS = [
  {
    id: 'roh_1',
    disease: 'بے خوابی اور پریشانی',
    dua: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ وَشَرِّ عِبَادِهِ',
    method: 'سوتے وقت تین مرتبہ پڑھ کر اپنے اوپر دم کر لیجیے۔',
  },
  {
    id: 'roh_2',
    disease: 'رزق میں برکت اور کشادگی',
    dua: 'يَا غَنِيُّ يَا مُغْنِي',
    method: 'روزانہ نمازِ عشاء کے بعد ۱۰۰۰ مرتبہ اول و آخر ۱۱ بار درود شریف کے ساتھ ورد کیجیے۔',
  },
  {
    id: 'roh_3',
    disease: 'سر درد اور شقیقہ',
    dua: 'بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ - لَا يُصَدَّعُونَ عَنْهَا وَلَا يُنْزِفُونَ',
    method: 'پیشانی پر ہاتھ رکھ کر تین مرتبہ پڑھ کر دم کیجیے۔',
  },
  {
    id: 'roh_4',
    disease: 'نیک اولاد کی طلب',
    dua: 'رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ',
    method: 'ہر نماز کے بعد ۳ بار پڑھنے کا معمول بنائیے۔',
  },
  {
    id: 'roh_5',
    disease: 'نظرِ بد اور حاسدین سے حفاظت',
    dua: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    method: 'صبح و شام تین تین مرتبہ پڑھ کر بچوں اور خود پر دم کریں۔',
  },
];

export const MORE_APPS: AppItem[] = [
  {
    id: 'quran_app',
    titleUrdu: 'القرآن الکریم',
    titleEn: 'Al Quran-ul-Kareem',
    iconColor: 'bg-emerald-700',
    badge: 'قرآن مجید',
    description: 'تلاوت مع اردو و انگریزی ترجمہ و خوبصورت آڈیو قراءت',
  },
  {
    id: 'tafseer_app',
    titleUrdu: 'صراط الجنان تفسیر القرآن',
    titleEn: 'Al Quran with Tafseer',
    iconColor: 'bg-teal-700',
    badge: 'تفسیر',
    description: 'آسان اور مستند اردو تفسیر برائے فہمِ قرآن',
  },
  {
    id: 'qaidah_app',
    titleUrdu: 'مدنی قاعدہ',
    titleEn: 'Madani Qaidah',
    iconColor: 'bg-amber-600',
    badge: 'تجوید',
    description: 'صحیح مخارج کے ساتھ قرآن سیکھنے کا ابتدائی قاعدہ',
  },
  {
    id: 'darulifta_app',
    titleUrdu: 'دار الافتاء اہلسنت',
    titleEn: 'Dar-ul-Ifta Ahlesunnat',
    iconColor: 'bg-emerald-800',
    badge: 'فتاویٰ',
    description: 'ہزاروں شرعی مسائل کے مدلل جوابات و فتاویٰ',
  },
  {
    id: 'library_app',
    titleUrdu: 'اسلامک ای بکس لائبریری',
    titleEn: 'Islamic eBooks Library',
    iconColor: 'bg-rose-700',
    badge: 'کتب خانہ',
    description: 'سینکڑوں مستند اسلامی کتب کا ڈیجیٹل ذخیرہ',
  },
  {
    id: 'durood_app',
    titleUrdu: 'درود و سلام کلیکشن',
    titleEn: 'Durood-o-Salam',
    iconColor: 'bg-emerald-600',
    badge: 'صلوٰۃ و سلام',
    description: 'مختلف درود و سلام کے صیغے اور فضائل',
  },
  {
    id: 'kalma_app',
    titleUrdu: 'کلمہ اور دعائیں',
    titleEn: 'Kalma and Dua',
    iconColor: 'bg-blue-600',
    badge: 'دعائیں',
    description: 'چھ کلمے اور روزمرہ کی مسنون دعائیں مع ترجمہ',
  },
  {
    id: 'naat_app',
    titleUrdu: 'نعتیہ کلام کلیکشن',
    titleEn: 'Naat Collection',
    iconColor: 'bg-emerald-500',
    badge: 'نعت شریف',
    description: 'اعلیٰ حضرت اور دیگر شعرائے اسلام کا پاکیزہ کلام',
  },
  {
    id: 'quiz_app',
    titleUrdu: 'ذہنی آزمائش',
    titleEn: 'Zehni Azmaish Quiz',
    iconColor: 'bg-indigo-700',
    badge: 'کوئز',
    description: 'اسلامی معلومات عامہ اور انعامی مقابلے',
  },
];
