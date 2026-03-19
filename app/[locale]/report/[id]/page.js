'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Clock, MapPin, Camera, Trash2 } from 'lucide-react';
import { getReportById, getReportPhotos, deleteReport } from '@/lib/store';
import { getSeverityConfig, formatCoords } from '@/lib/utils';
import { getDictionary, timeAgoLocalized } from '@/lib/i18n';

const MiniMap = dynamic(() => import('@/components/MiniMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--bg-secondary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-tertiary)', fontSize: '13px',
    }}>
      Loading map...
    </div>
  ),
});

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale || 'en';
  const t = getDictionary(locale);
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
    if (confirm(t.deleteConfirm)) {
      await deleteReport(report.id);
      router.push(`/${locale}`);
    }
  };

  if (loading) {
    return (
      <div className="report-detail" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-secondary)',
      }}>
        {t.loading}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-detail" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '16px', color: 'var(--text-secondary)',
      }}>
        <div style={{ fontSize: '48px' }}>🔍</div>
        <div>{t.reportNotFound}</div>
        <button onClick={() => router.push(`/${locale}`)} style={{
          padding: '8px 20px', background: 'var(--accent-green)',
          color: 'var(--text-inverse)', borderRadius: '999px', fontWeight: 600, fontSize: '14px',
        }}>
          {t.backToMap}
        </button>
      </div>
    );
  }

  const severity = getSeverityConfig(report.severity);

  return (
    <div className="report-detail">
      <button className="report-detail-back" onClick={() => router.push(`/${locale}`)}>
        <ArrowLeft size={18} />
      </button>

      <div className="report-detail-gallery">
        {photos.length > 0 ? (
          <>
            <div className="report-detail-gallery-scroll">
              {photos.map((photo, index) => (
                <div key={index} className="report-detail-gallery-item">
                  <img src={photo} alt={`${t.photo} ${index + 1}`} className="report-detail-gallery-img" />
                </div>
              ))}
            </div>
            {photos.length > 1 && (
              <div className="report-detail-gallery-counter">
                {photos.length} {t.swipeToView}
              </div>
            )}
          </>
        ) : (
          <div className="report-detail-no-photos">
            <Camera size={48} className="report-detail-no-photos-icon" />
            <span>{t.noPhotos}</span>
          </div>
        )}
      </div>

      <div className="report-detail-body">
        <div className="report-detail-severity"
          style={{ color: severity.color, background: severity.bg }}>
          {severity.emoji} {locale === 'mk' ? getDictionary('mk')[`severity${report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}`] : severity.label} {t.severity}
        </div>

        <p className="report-detail-description">{report.description}</p>

        <div className="report-detail-info">
          <div className="report-detail-info-row">
            <Clock size={16} className="report-detail-info-icon" />
            <span className="report-detail-info-label">{t.reported}</span>
            <span className="report-detail-info-value">{timeAgoLocalized(report.createdAt, locale)}</span>
          </div>
          <div className="report-detail-info-row">
            <MapPin size={16} className="report-detail-info-icon" />
            <span className="report-detail-info-label">{t.location}</span>
            <span className="report-detail-info-value">{formatCoords(report.lat, report.lng)}</span>
          </div>
          <div className="report-detail-info-row">
            <Camera size={16} className="report-detail-info-icon" />
            <span className="report-detail-info-label">{t.photosLabel}</span>
            <span className="report-detail-info-value">
              {report.photoCount} {report.photoCount !== 1 ? t.photos : t.photo} {t.photosAttached}
            </span>
          </div>
        </div>

        <div className="report-detail-map">
          <MiniMap lat={report.lat} lng={report.lng} />
        </div>

        <button className="report-detail-delete" onClick={handleDelete}>
          <Trash2 size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          {t.deleteReport}
        </button>
      </div>
    </div>
  );
}
