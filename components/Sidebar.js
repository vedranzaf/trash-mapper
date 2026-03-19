'use client';

import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import ReportCard from './ReportCard';

export default function Sidebar({ reports, onReportClick }) {
  const [sheetState, setSheetState] = useState('peek'); // collapsed, peek, full

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
          <h2 className="sidebar-title">Reports</h2>
          <button
            className="sidebar-toggle-mobile"
            onClick={toggleSheet}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <ChevronUp
              size={18}
              style={{
                transform: sheetState === 'full' ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </button>
        </div>

        <div className="sidebar-stats">
          {severityCounts.critical > 0 && (
            <div className="sidebar-stat">
              <div className="sidebar-stat-dot" style={{ background: 'var(--severity-critical)' }} />
              {severityCounts.critical} critical
            </div>
          )}
          {severityCounts.high > 0 && (
            <div className="sidebar-stat">
              <div className="sidebar-stat-dot" style={{ background: 'var(--severity-high)' }} />
              {severityCounts.high} high
            </div>
          )}
          {severityCounts.medium > 0 && (
            <div className="sidebar-stat">
              <div className="sidebar-stat-dot" style={{ background: 'var(--severity-medium)' }} />
              {severityCounts.medium} medium
            </div>
          )}
          {severityCounts.low > 0 && (
            <div className="sidebar-stat">
              <div className="sidebar-stat-dot" style={{ background: 'var(--severity-low)' }} />
              {severityCounts.low} low
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-list">
        {reports.length === 0 ? (
          <div className="sidebar-empty">
            <div className="sidebar-empty-icon">📍</div>
            <div className="sidebar-empty-text">No reports yet</div>
            <div className="sidebar-empty-subtext">
              Tap &quot;Report Trash&quot; to add the first one
            </div>
          </div>
        ) : (
          reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => onReportClick(report)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
