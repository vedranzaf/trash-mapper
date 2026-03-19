'use client';

import { MapPin } from 'lucide-react';

export default function Header({ reportCount }) {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="header-logo-icon">🗺️</div>
        <span className="header-title">TrashMapper</span>
      </div>

      <div className="header-divider" />

      <div className="header-stats">
        <MapPin size={14} />
        <span>
          <span className="header-stat-count">{reportCount}</span>{' '}
          report{reportCount !== 1 ? 's' : ''}
        </span>
      </div>
    </header>
  );
}
