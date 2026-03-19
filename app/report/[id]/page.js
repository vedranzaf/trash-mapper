'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Clock, MapPin, Camera, Trash2 } from 'lucide-react';
import { getReportById, getReportPhotos, deleteReport } from '@/lib/store';
import { timeAgo, getSeverityConfig, formatCoords } from '@/lib/utils';

const MiniMap = dynamic(() => import('@/components/MiniMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-tertiary)',
      fontSize: '13px',
    }}>
      Loading map...
    </div>
  ),
});

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const r = getReportById(params.id);
      if (r) {
        setReport(r);
        getReportPhotos(params.id).then((p) => {
          setPhotos(p);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this report?')) {
      await deleteReport(report.id);
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="report-detail" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
      }}>
        Loading...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-detail" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        color: 'var(--text-secondary)',
      }}>
        <div style={{ fontSize: '48px' }}>🔍</div>
        <div>Report not found</div>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '8px 20px',
            background: 'var(--accent-green)',
            color: 'var(--text-inverse)',
            borderRadius: '999px',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          Back to Map
        </button>
      </div>
    );
  }

  const severity = getSeverityConfig(report.severity);

  return (
    <div className="report-detail">
      {/* Back button */}
      <button className="report-detail-back" onClick={() => router.push('/')}>
        <ArrowLeft size={18} />
      </button>

      {/* Photo Gallery */}
      <div className="report-detail-gallery">
        {photos.length > 0 ? (
          <>
            <div className="report-detail-gallery-scroll">
              {photos.map((photo, index) => (
                <div key={index} className="report-detail-gallery-item">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="report-detail-gallery-img"
                  />
                </div>
              ))}
            </div>
            {photos.length > 1 && (
              <div className="report-detail-gallery-counter">
                {photos.length} photos — swipe to view
              </div>
            )}
          </>
        ) : (
          <div className="report-detail-no-photos">
            <Camera size={48} className="report-detail-no-photos-icon" />
            <span>No photos attached</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="report-detail-body">
        <div
          className="report-detail-severity"
          style={{ color: severity.color, background: severity.bg }}
        >
          {severity.emoji} {severity.label} Severity
        </div>

        <p className="report-detail-description">{report.description}</p>

        <div className="report-detail-info">
          <div className="report-detail-info-row">
            <Clock size={16} className="report-detail-info-icon" />
            <span className="report-detail-info-label">Reported</span>
            <span className="report-detail-info-value">{timeAgo(report.createdAt)}</span>
          </div>

          <div className="report-detail-info-row">
            <MapPin size={16} className="report-detail-info-icon" />
            <span className="report-detail-info-label">Location</span>
            <span className="report-detail-info-value">
              {formatCoords(report.lat, report.lng)}
            </span>
          </div>

          <div className="report-detail-info-row">
            <Camera size={16} className="report-detail-info-icon" />
            <span className="report-detail-info-label">Photos</span>
            <span className="report-detail-info-value">
              {report.photoCount} photo{report.photoCount !== 1 ? 's' : ''} attached
            </span>
          </div>
        </div>

        {/* Mini map */}
        <div className="report-detail-map">
          <MiniMap lat={report.lat} lng={report.lng} />
        </div>

        {/* Delete button */}
        <button className="report-detail-delete" onClick={handleDelete}>
          <Trash2 size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          Delete Report
        </button>
      </div>
    </div>
  );
}
