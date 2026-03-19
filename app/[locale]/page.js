'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Plus, Crosshair, X, Check } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ReportForm from '@/components/ReportForm';
import { getReports } from '@/lib/store';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/utils';
import { getDictionary } from '@/lib/i18n';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-secondary)', fontSize: '14px', fontFamily: 'Inter, sans-serif',
    }}>
      Loading map...
    </div>
  ),
});

export default function Home() {
  const params = useParams();
  const locale = params.locale || 'en';
  const t = getDictionary(locale);

  const [reports, setReports] = useState([]);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placementLocation, setPlacementLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [flyToPosition, setFlyToPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    setReports(getReports());
  }, []);

  const handleMapClick = useCallback((location) => {
    setPlacementLocation(location);
  }, []);

  const startPlacing = () => {
    setIsPlacing(true);
    setPlacementLocation(null);
  };

  const cancelPlacing = () => {
    setIsPlacing(false);
    setPlacementLocation(null);
  };

  const confirmPlacement = () => {
    if (placementLocation) {
      setShowForm(true);
      setIsPlacing(false);
    }
  };

  const handleReportClick = (report) => {
    setFlyToPosition([report.lat, report.lng]);
    setTimeout(() => setFlyToPosition(null), 1500);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setPlacementLocation(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setShowSuccess(true);
    setPlacementLocation(null);
    setReports(getReports());
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handleLocationFound = useCallback((location) => {
    setUserLocation(location);
  }, []);

  const useMyLocation = () => {
    if (userLocation) {
      setPlacementLocation(userLocation);
      setFlyToPosition([userLocation.lat, userLocation.lng]);
      setTimeout(() => setFlyToPosition(null), 1500);
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setPlacementLocation(loc);
          setFlyToPosition([loc.lat, loc.lng]);
          setTimeout(() => setFlyToPosition(null), 1500);
        },
        () => alert('Could not get your location.'),
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="app-container">
      <Map
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        reports={reports}
        isPlacing={isPlacing}
        placementLocation={placementLocation}
        onMapClick={handleMapClick}
        onReportClick={handleReportClick}
        flyToPosition={flyToPosition}
        onLocationFound={handleLocationFound}
      />

      <Header reportCount={reports.length} locale={locale} />

      <Sidebar reports={reports} onReportClick={handleReportClick} locale={locale} />

      {isPlacing && (
        <div className="map-instruction">
          📍 {t.tapToPlace}
          <button className="map-instruction-cancel" onClick={cancelPlacing} aria-label={t.cancel}>
            <X size={11} />
          </button>
        </div>
      )}

      <div className="fab-container">
        {isPlacing ? (
          <>
            <button className="fab" onClick={confirmPlacement}
              disabled={!placementLocation}
              style={!placementLocation ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
              <Check size={18} className="fab-icon" />
              {t.confirmLocation}
            </button>
            <button className="fab fab-secondary" onClick={useMyLocation}>
              <Crosshair size={16} className="fab-icon" />
              {t.useMyLocation}
            </button>
            <button className="fab fab-secondary" onClick={cancelPlacing}>
              <X size={16} className="fab-icon" />
              {t.cancel}
            </button>
          </>
        ) : (
          <button className="fab" onClick={startPlacing}>
            <Plus size={18} className="fab-icon" />
            {t.reportTrash}
          </button>
        )}
      </div>

      {showForm && (
        <ReportForm
          location={placementLocation}
          onClose={handleFormClose}
          onSuccess={handleSuccess}
          locale={locale}
        />
      )}

      {showSuccess && (
        <div className="success-overlay" onClick={() => setShowSuccess(false)}>
          <div className="success-content">
            <div className="success-icon">✓</div>
            <h3 className="success-title">{t.reportSubmitted}</h3>
            <p className="success-subtitle">{t.thankYou}</p>
          </div>
        </div>
      )}
    </div>
  );
}
