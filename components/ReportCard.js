'use client';

import { MapPin, Camera } from 'lucide-react';
import { timeAgo, getSeverityConfig } from '@/lib/utils';

export default function ReportCard({ report, onClick }) {
  const severity = getSeverityConfig(report.severity);

  return (
    <div className="report-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="report-card-top">
        {report.thumbnail ? (
          <img
            src={report.thumbnail}
            alt="Report"
            className="report-card-thumbnail"
          />
        ) : (
          <div className="report-card-no-photo">🗑️</div>
        )}

        <div className="report-card-info">
          <div className="report-card-header">
            <span
              className="report-card-severity"
              style={{ color: severity.color, background: severity.bg }}
            >
              {severity.emoji} {severity.label}
            </span>
            <span className="report-card-time">{timeAgo(report.createdAt)}</span>
          </div>

          <p className="report-card-description">
            {report.description || 'No description provided'}
          </p>

          <div className="report-card-footer">
            {report.photoCount > 0 && (
              <span className="report-card-footer-item">
                <Camera size={12} />
                {report.photoCount} photo{report.photoCount !== 1 ? 's' : ''}
              </span>
            )}
            <span className="report-card-footer-item">
              <MapPin size={12} />
              {report.lat.toFixed(3)}, {report.lng.toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
