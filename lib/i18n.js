export const locales = ['en', 'mk'];
export const defaultLocale = 'en';

const dictionaries = {
  en: {
    // Header
    appName: 'TrashMapper',
    reports: 'reports',
    report: 'report',

    // FAB
    reportTrash: 'Report Trash',
    confirmLocation: 'Confirm Location',
    useMyLocation: 'Use My Location',
    cancel: 'Cancel',

    // Map instruction
    tapToPlace: 'Tap the map to place a pin',

    // Sidebar
    reportsTitle: 'Reports',
    noReports: 'No reports yet',
    noReportsHint: 'Tap "Report Trash" to add the first one',
    critical: 'critical',
    high: 'high',
    medium: 'medium',
    low: 'low',

    // Severity labels
    severityLow: 'Low',
    severityMedium: 'Medium',
    severityHigh: 'High',
    severityCritical: 'Critical',

    // Report Form
    formTitle: 'Report Illegal Dump',
    locationLabel: 'Location',
    pinPlaced: 'Pin placed on map',
    noLocation: 'No location set',
    noLocationHint: 'Click on the map to place a pin',
    photosLabel: 'Photos',
    photosHint: '(up to 5)',
    addPhotos: 'Add Photos',
    addMore: 'Add More',
    severityLabel: 'Severity',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Describe what you see — type of trash, approximate amount, accessibility, any hazards...',
    characters: 'characters',
    submitReport: 'Submit Report',
    submitting: 'Submitting...',

    // Success
    reportSubmitted: 'Report Submitted!',
    thankYou: 'Thank you for helping keep our community clean',

    // Report Detail
    severity: 'Severity',
    reported: 'Reported',
    location: 'Location',
    photos: 'photos',
    photo: 'photo',
    photosAttached: 'attached',
    noPhotos: 'No photos attached',
    swipeToView: 'photos — swipe to view',
    deleteReport: 'Delete Report',
    deleteConfirm: 'Are you sure you want to delete this report?',
    backToMap: 'Back to Map',
    reportNotFound: 'Report not found',
    loading: 'Loading...',
    loadingMap: 'Loading map...',

    // Time
    justNow: 'Just now',
    year: 'year',
    years: 'years',
    month: 'month',
    months: 'months',
    week: 'week',
    weeks: 'weeks',
    day: 'day',
    days: 'days',
    hour: 'hour',
    hours: 'hours',
    minute: 'minute',
    minutes: 'minutes',
    ago: 'ago',
  },
  mk: {
    // Header
    appName: 'ТрешМапер',
    reports: 'пријави',
    report: 'пријава',

    // FAB
    reportTrash: 'Пријави Отпад',
    confirmLocation: 'Потврди Локација',
    useMyLocation: 'Користи Моја Локација',
    cancel: 'Откажи',

    // Map instruction
    tapToPlace: 'Допри на мапата за да поставиш пин',

    // Sidebar
    reportsTitle: 'Пријави',
    noReports: 'Нема пријави',
    noReportsHint: 'Допри „Пријави Отпад" за да додадеш прва',
    critical: 'критично',
    high: 'високо',
    medium: 'средно',
    low: 'ниско',

    // Severity labels
    severityLow: 'Ниско',
    severityMedium: 'Средно',
    severityHigh: 'Високо',
    severityCritical: 'Критично',

    // Report Form
    formTitle: 'Пријави Нелегално Фрлање',
    locationLabel: 'Локација',
    pinPlaced: 'Пин е поставен на мапата',
    noLocation: 'Нема поставено локација',
    noLocationHint: 'Кликни на мапата за да поставиш пин',
    photosLabel: 'Фотографии',
    photosHint: '(до 5)',
    addPhotos: 'Додај Фотки',
    addMore: 'Додај Уште',
    severityLabel: 'Сериозност',
    descriptionLabel: 'Опис',
    descriptionPlaceholder: 'Опиши што гледаш — тип на отпад, приближна количина, пристапност, опасности...',
    characters: 'карактери',
    submitReport: 'Поднеси Пријава',
    submitting: 'Се поднесува...',

    // Success
    reportSubmitted: 'Пријавата е Поднесена!',
    thankYou: 'Ви благодариме што помагате да ја одржиме заедницата чиста',

    // Report Detail
    severity: 'Сериозност',
    reported: 'Пријавено',
    location: 'Локација',
    photos: 'фотки',
    photo: 'фотка',
    photosAttached: 'прикачени',
    noPhotos: 'Нема прикачено фотографии',
    swipeToView: 'фотки — лизгај за преглед',
    deleteReport: 'Избриши Пријава',
    deleteConfirm: 'Дали сте сигурни дека сакате да ја избришете оваа пријава?',
    backToMap: 'Назад кон Мапата',
    reportNotFound: 'Пријавата не е пронајдена',
    loading: 'Се вчитува...',
    loadingMap: 'Се вчитува мапа...',

    // Time
    justNow: 'Сега',
    year: 'година',
    years: 'години',
    month: 'месец',
    months: 'месеци',
    week: 'недела',
    weeks: 'недели',
    day: 'ден',
    days: 'дена',
    hour: 'час',
    hours: 'часа',
    minute: 'минута',
    minutes: 'минути',
    ago: 'пред',
  },
};

export function getDictionary(locale) {
  return dictionaries[locale] || dictionaries.en;
}

export function getSeverityLabel(severity, locale) {
  const t = getDictionary(locale);
  const labels = {
    low: t.severityLow,
    medium: t.severityMedium,
    high: t.severityHigh,
    critical: t.severityCritical,
  };
  return labels[severity] || labels.low;
}

// Localized time ago
export function timeAgoLocalized(dateString, locale) {
  const t = getDictionary(locale);
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { singular: t.year, plural: t.years, seconds: 31536000 },
    { singular: t.month, plural: t.months, seconds: 2592000 },
    { singular: t.week, plural: t.weeks, seconds: 604800 },
    { singular: t.day, plural: t.days, seconds: 86400 },
    { singular: t.hour, plural: t.hours, seconds: 3600 },
    { singular: t.minute, plural: t.minutes, seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      const label = count === 1 ? interval.singular : interval.plural;
      if (locale === 'mk') {
        return `пред ${count} ${label}`;
      }
      return `${count} ${label} ${t.ago}`;
    }
  }

  return t.justNow;
}
