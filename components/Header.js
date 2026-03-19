'use client';

import { useRouter, usePathname } from 'next/navigation';
import { MapPin, Globe } from 'lucide-react';
import { getDictionary } from '@/lib/i18n';

export default function Header({ reportCount, locale = 'en' }) {
  const t = getDictionary(locale);
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'mk' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    // Set cookie for persistence
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    router.push(newPath);
  };

  return (
    <header className="header">
      <div className="header-logo">
        <div className="header-logo-icon">🗺️</div>
        <span className="header-title">{t.appName}</span>
      </div>

      <div className="header-divider" />

      <div className="header-stats">
        <MapPin size={14} />
        <span>
          <span className="header-stat-count">{reportCount}</span>{' '}
          {reportCount !== 1 ? t.reports : t.report}
        </span>
      </div>

      <div className="header-divider" />

      <button
        className="lang-switch"
        onClick={toggleLocale}
        title={locale === 'en' ? 'Промени на Македонски' : 'Switch to English'}
      >
        <Globe size={14} />
        <span>{locale === 'en' ? 'MK' : 'EN'}</span>
      </button>
    </header>
  );
}
