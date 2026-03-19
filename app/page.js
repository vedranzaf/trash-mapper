'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Crosshair, X, Check } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ReportForm from '@/components/ReportForm';
import { getReports } from '@/lib/store';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/utils';

// Dynamic import of Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      Loading map...
    </div>
  ),
});

export default function Home() {
  const [reports, setReports] = useState([]);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placementLocation, setPlacementLocation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [flyToPosition, setFlyToPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Load reports from localStorage on mount
  useEffect(() => {
    setReports(getReports());
  }, []);

  // Handle map click during placement mode
  const handleMapClick = useCallback((location) => {
    setPlacementLocation(location);
  }, []);

  // Start placement mode
  const startPlacing = () => {
    setIsPlacing(true);
    setPlacementLocation(null);
  };

  // Cancel placement mode
  const cancelPlacing = () => {
    setIsPlacing(false);
    setPlacementLocation(null);
  };

  // Confirm placement and open form
  const confirmPlacement = () => {
    if (placementLocation) {
      setShowForm(true);
      setIsPlacing(false);
    }
  };

  // Handle report click — fly to location
  const handleReportClick = (report) => {
    setFlyToPosition([report.lat, report.lng]);
    // Reset flyTo after animation
    setTimeout(() => setFlyToPosition(null), 1500);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setPlacementLocation(null);
  };

  // Handle successful submission
  const handleSuccess = () => {
    setShowForm(false);
    setShowSuccess(true);
    setPlacementLocation(null);
    setReports(getReports());

    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  // Handle user location found
  const handleLocationFound = useCallback((location) => {
    setUserLocation(location);
  }, []);

  // Use my location for pin placement
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
        () => alert('Could not get your location. Please enable location services.'),
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="app-container">
      {/* Map */}
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

      {/* Header */}
      <Header reportCount={reports.length} />

      {/* Sidebar / Bottom Sheet */}
      <Sidebar reports={reports} onReportClick={handleReportClick} />

      {/* Map instruction banner — shown during placement mode */}
      {isPlacing && (
        <div className="map-instruction">
          📍 Tap the map to place a pin
          <button className="map-instruction-cancel" onClick={cancelPlacing} aria-label="Cancel">
            <X size={11} />
          </button>
        </div>
      )}

      {/* FAB Buttons */}
      <div className="fab-container">
        {isPlacing ? (
          <>
            <button
              className="fab"
              onClick={confirmPlacement}
              disabled={!placementLocation}
              style={!placementLocation ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              <Check size={18} className="fab-icon" />
              Confirm Location
            </button>
            <button className="fab fab-secondary" onClick={useMyLocation}>
              <Crosshair size={16} className="fab-icon" />
              Use My Location
            </button>
            <button className="fab fab-secondary" onClick={cancelPlacing}>
              <X size={16} className="fab-icon" />
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="fab" onClick={startPlacing}>
              <Plus size={18} className="fab-icon" />
              Report Trash
            </button>
          </>
        )}
      </div>

      {/* Report Form Modal */}
      {showForm && (
        <ReportForm
          location={placementLocation}
          onClose={handleFormClose}
          onSuccess={handleSuccess}
        />
      )}

      {/* Success Animation */}
      {showSuccess && (
        <div className="success-overlay" onClick={() => setShowSuccess(false)}>
          <div className="success-content">
            <div className="success-icon">✓</div>
            <h3 className="success-title">Report Submitted!</h3>
            <p className="success-subtitle">Thank you for helping keep our community clean</p>
          </div>
        </div>
      )}
    </div>
  );
}
