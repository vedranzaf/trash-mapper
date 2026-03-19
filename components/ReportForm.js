'use client';

import { useState } from 'react';
import { X, MapPin, Send } from 'lucide-react';
import PhotoUpload from './PhotoUpload';
import { addReport } from '@/lib/store';
import { formatCoords, getSeverityConfig } from '@/lib/utils';
import { getDictionary, getSeverityLabel } from '@/lib/i18n';

const SEVERITIES = ['low', 'medium', 'high', 'critical'];

export default function ReportForm({ location, onClose, onSuccess, locale = 'en' }) {
  const t = getDictionary(locale);
  // photos: array of { previewUrl, blob }
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const canSubmit = location && description.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setUploadProgress(photos.length > 0 ? (locale === 'mk' ? 'Се прикачуваат фотографии...' : 'Uploading photos...') : '');

    try {
      const report = {
        lat: location.lat,
        lng: location.lng,
        description: description.trim(),
        severity,
        // Pass blobs for Supabase Storage upload
        photos: photos.map((p) => p.blob),
      };
      await addReport(report);
      onSuccess(report);
    } catch (err) {
      console.error('Failed to save report:', err);
      setUploadProgress('');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-handle"><div className="modal-handle-bar" /></div>

        <div className="modal-header">
          <h2 className="modal-title">{t.formTitle}</h2>
          <button className="modal-close" onClick={onClose} aria-label={t.cancel}>
            <X size={16} />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {/* Location */}
          <div className="form-group">
            <label className="form-label">📍 {t.locationLabel}</label>
            {location ? (
              <div className="location-display">
                <MapPin size={18} className="location-display-icon" />
                <div className="location-display-text">
                  <div className="location-display-label">{t.pinPlaced}</div>
                  <div className="location-display-coords">{formatCoords(location.lat, location.lng)}</div>
                </div>
              </div>
            ) : (
              <div className="location-display location-missing">
                <MapPin size={18} className="location-display-icon" />
                <div className="location-display-text">
                  <div className="location-display-label">{t.noLocation}</div>
                  <div className="location-display-coords">{t.noLocationHint}</div>
                </div>
              </div>
            )}
          </div>

          {/* Photos */}
          <div className="form-group">
            <label className="form-label">
              📸 {t.photosLabel}
              <span className="form-hint" style={{ display: 'inline', marginLeft: '8px', fontWeight: 400 }}>
                {t.photosHint}
              </span>
            </label>
            <PhotoUpload photos={photos} setPhotos={setPhotos} locale={locale} />
          </div>

          {/* Severity */}
          <div className="form-group">
            <label className="form-label">
              ⚠️ {t.severityLabel}<span className="form-label-required">*</span>
            </label>
            <div className="severity-selector">
              {SEVERITIES.map((sev) => {
                const config = getSeverityConfig(sev);
                const label = getSeverityLabel(sev, locale);
                return (
                  <button key={sev} type="button"
                    className={`severity-option ${severity === sev ? 'selected' : ''}`}
                    onClick={() => setSeverity(sev)}
                    style={severity === sev ? { borderColor: config.color, background: config.bg } : {}}>
                    <span className="severity-option-emoji">{config.emoji}</span>
                    <span className="severity-option-label">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="report-description">
              📝 {t.descriptionLabel}<span className="form-label-required">*</span>
            </label>
            <textarea id="report-description" className="form-textarea"
              placeholder={t.descriptionPlaceholder}
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={4} maxLength={500} />
            <div className="form-hint">{description.length}/500 {t.characters}</div>
          </div>

          {/* Upload progress */}
          {uploadProgress && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px',
              background: 'var(--accent-green-soft)', border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)', color: 'var(--accent-green)',
              fontSize: '13px',
            }}>
              {uploadProgress}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="btn-submit" disabled={!canSubmit || submitting}>
            <Send size={16} />
            {submitting ? t.submitting : t.submitReport}
          </button>
        </form>
      </div>
    </div>
  );
}
