'use client';

import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import ReportCard from './ReportCard';
import { getDictionary } from '@/lib/i18n';

export default function Sidebar({ reports, onReportClick, locale = 'en' }) {
  const t = getDictionary(locale);
  const [sheetState, setSheetState] = useState('peek');

  const toggleSheet = () => {
    if (sheetState === 'collapsed') setSheetState('peek');
    else if (sheetState === 'peek') setSheetState('full');
    else setSheetState('peek');
  };

  const severityCounts = {
    critical: reports.filter((r) => r.severity === 'critical').length,
    high: reports.filter((r) => r.severity === 'high').length,
    medium: reports.filter((r) => r.severity === 'medium').length,
    low: reports.filter((r) => r.severity === 'low').length,
  };

  return (
    <aside className={`sidebar ${sheetState}`}>
      <div className="sidebar-handle" onClick={toggleSheet}>
        <div className="sidebar-handle-bar" />
      </div>

      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="sidebar-title">{t.reportsTitle}</h2>
        </div>

        <div className="sidebar-stats">
          {severityCounts.critical > 0 && (
            <div className="sidebar-stat">
              <div className="sidebar-stat-dot" style={{ background: 'var(--severity-critical)' }} />
              {severityCounts.critical} {t.critical}
            </div>
          )}
          {severityCounts.high > 0 && (
            <div className="sidebar-stat">
              <div className="sidebar-stat-dot" style={{ background: 'var(--severity-high)' }} />
              {severityCounts.high} {t.high}
            </div>
          )}
          {severityCounts.medium > 0 && (
            <div className="sidebar-stat">
              <div className="sidebar-stat-dot" style={{ background: 'var(--severity-medium)' }} />
              {severityCounts.medium} {t.medium}
            </div>
          )}
          {severityCounts.low > 0 && (
            <div className="sidebar-stat">
              <div className="sidebar-stat-dot" style={{ background: 'var(--severity-low)' }} />
              {severityCounts.low} {t.low}
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-list">
        {reports.length === 0 ? (
          <div className="sidebar-empty">
            <div className="sidebar-empty-icon">📍</div>
            <div className="sidebar-empty-text">{t.noReports}</div>
            <div className="sidebar-empty-subtext">{t.noReportsHint}</div>
          </div>
        ) : (
          reports.map((report) => (
            <ReportCard key={report.id} report={report}
              onClick={() => onReportClick(report)} locale={locale} />
          ))
        )}
      </div>
    </aside>
  );
}
