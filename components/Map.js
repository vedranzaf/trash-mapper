'use client';

import { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { getSeverityConfig } from '@/lib/utils';

// Create a custom marker icon based on severity
function createMarkerIcon(severity) {
  const config = getSeverityConfig(severity);
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-pin severity-${severity}"><span class="marker-pin-inner">🗑️</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

// Create placement marker icon
function createPlacementIcon() {
  return L.divIcon({
    className: 'placement-marker',
    html: `<div class="placement-pin"><span class="placement-pin-inner">📍</span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

// Component to handle map click events
function MapClickHandler({ isPlacing, onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (isPlacing) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

// Component to fly to a position
function FlyToLocation({ position, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom || map.getZoom(), { duration: 1.2 });
    }
  }, [position, zoom, map]);
  return null;
}

// Component to set initial user location
function UserLocationSetter({ onLocationFound }) {
  const map = useMap();
  const hasSet = useRef(false);

  useEffect(() => {
    if (hasSet.current) return;
    hasSet.current = true;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.flyTo([latitude, longitude], 14, { duration: 1.5 });
          if (onLocationFound) {
            onLocationFound({ lat: latitude, lng: longitude });
          }
        },
        () => {
          // Permission denied or error — keep default position
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [map, onLocationFound]);

  return null;
}

export default function Map({
  center,
  zoom,
  reports,
  isPlacing,
  placementLocation,
  onMapClick,
  onReportClick,
  flyToPosition,
  onLocationFound,
}) {
  return (
    <div className="map-wrapper">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapClickHandler isPlacing={isPlacing} onMapClick={onMapClick} />
        <UserLocationSetter onLocationFound={onLocationFound} />

        {flyToPosition && (
          <FlyToLocation position={flyToPosition} zoom={16} />
        )}

        {/* Existing report markers */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={createMarkerIcon(report.severity)}
            eventHandlers={{
              click: () => onReportClick && onReportClick(report),
            }}
          >
            <Popup>
              <div className="popup-content">
                {report.thumbnail_url && (
                  <img
                    src={report.thumbnail_url}
                    alt="Report"
                    className="popup-thumbnail"
                  />
                )}
                <div
                  className="popup-severity"
                  style={{
                    color: getSeverityConfig(report.severity).color,
                    background: getSeverityConfig(report.severity).bg,
                  }}
                >
                  {getSeverityConfig(report.severity).emoji}{' '}
                  {getSeverityConfig(report.severity).label}
                </div>
                <p className="popup-description">{report.description}</p>
                <div className="popup-meta">
                  {(report.photo_urls?.length > 0 || report.photoCount > 0) && (
                    <span className="popup-photos">
                      📷 {report.photo_urls?.length || report.photoCount} photo{(report.photo_urls?.length || report.photoCount) !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Placement marker */}
        {isPlacing && placementLocation && (
          <Marker
            position={[placementLocation.lat, placementLocation.lng]}
            icon={createPlacementIcon()}
          />
        )}
      </MapContainer>
    </div>
  );
}
