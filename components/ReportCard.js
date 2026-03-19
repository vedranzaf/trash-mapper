'use client';

import { MapPin, Camera } from 'lucide-react';
import { getSeverityConfig } from '@/lib/utils';
import { getDictionary, getSeverityLabel, timeAgoLocalized } from '@/lib/i18n';

export default function ReportCard({ report, onClick, locale = 'en' }) {
  const t = getDictionary(locale);
  const severity = getSeverityConfig(report.severity);
  const sevLabel = getSeverityLabel(report.severity, locale);

  return (
    <div className="report-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="report-card-top">
        {report.thumbnail_url ? (
          <img src={report.thumbnail_url} alt={t.report} className="report-card-thumbnail" />
        ) : (
          <div className="report-card-no-photo">🗑️</div>
        )}

        <div className="report-card-info">
          <div className="report-card-header">
            <span className="report-card-severity"
              style={{ color: severity.color, background: severity.bg }}>
              {severity.emoji} {sevLabel}
            </span>
            <span className="report-card-time">{timeAgoLocalized(report.created_at || report.createdAt, locale)}</span>
          </div>

          <p className="report-card-description">
            {report.description || (locale === 'mk' ? 'Нема опис' : 'No description provided')}
          </p>

          <div className="report-card-footer">
            {(report.photo_urls?.length > 0 || report.photoCount > 0) && (
              <span className="report-card-footer-item">
                <Camera size={12} />
                {(report.photo_urls?.length || report.photoCount)} {(report.photo_urls?.length || report.photoCount) !== 1 ? t.photos : t.photo}
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
