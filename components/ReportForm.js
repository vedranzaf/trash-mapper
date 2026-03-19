'use client';

import { useState } from 'react';
import { X, MapPin, Send } from 'lucide-react';
import PhotoUpload from './PhotoUpload';
import { addReport, generateId } from '@/lib/store';
import { formatCoords, getSeverityConfig } from '@/lib/utils';

const SEVERITIES = ['low', 'medium', 'high', 'critical'];

export default function ReportForm({ location, onClose, onSuccess }) {
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = location && description.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    try {
      const report = {
        id: generateId(),
        lat: location.lat,
        lng: location.lng,
        description: description.trim(),
        severity,
        photos,
      };

      await addReport(report);
      onSuccess(report);
    } catch (err) {
      console.error('Failed to save report:', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-handle">
          <div className="modal-handle-bar" />
        </div>

        <div className="modal-header">
          <h2 className="modal-title">Report Illegal Dump</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {/* Location */}
          <div className="form-group">
            <label className="form-label">
              📍 Location
            </label>
            {location ? (
              <div className="location-display">
                <MapPin size={18} className="location-display-icon" />
                <div className="location-display-text">
                  <div className="location-display-label">Pin placed on map</div>
                  <div className="location-display-coords">
                    {formatCoords(location.lat, location.lng)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="location-display location-missing">
                <MapPin size={18} className="location-display-icon" />
                <div className="location-display-text">
                  <div className="location-display-label">No location set</div>
                  <div className="location-display-coords">Click on the map to place a pin</div>
                </div>
              </div>
            )}
          </div>

          {/* Photos */}
          <div className="form-group">
            <label className="form-label">
              📸 Photos
              <span className="form-hint" style={{ display: 'inline', marginLeft: '8px', fontWeight: 400 }}>
                (up to 5)
              </span>
            </label>
            <PhotoUpload photos={photos} setPhotos={setPhotos} />
          </div>

          {/* Severity */}
          <div className="form-group">
            <label className="form-label">
              ⚠️ Severity<span className="form-label-required">*</span>
            </label>
            <div className="severity-selector">
              {SEVERITIES.map((sev) => {
                const config = getSeverityConfig(sev);
                return (
                  <button
                    key={sev}
                    type="button"
                    className={`severity-option ${severity === sev ? 'selected' : ''}`}
                    onClick={() => setSeverity(sev)}
                    style={
                      severity === sev
                        ? { borderColor: config.color, background: config.bg }
                        : {}
                    }
                  >
                    <span className="severity-option-emoji">{config.emoji}</span>
                    <span className="severity-option-label">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="report-description">
              📝 Description<span className="form-label-required">*</span>
            </label>
            <textarea
              id="report-description"
              className="form-textarea"
              placeholder="Describe what you see — type of trash, approximate amount, accessibility, any hazards..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className="form-hint">{description.length}/500 characters</div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-submit"
            disabled={!canSubmit || submitting}
          >
            <Send size={16} />
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
