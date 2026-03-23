'use client';

import { useEffect, useRef, useMemo, memo } from 'react';
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

// SVG trash/garbage icon
const TRASH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;

// Cache marker icons by severity to avoid re-creating on every render
const markerIconCache = new Map();

function getMarkerIcon(severity) {
  if (markerIconCache.has(severity)) {
    return markerIconCache.get(severity);
  }
  const icon = L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-pin severity-${severity}"><span class="marker-pin-inner">${TRASH_SVG}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
  markerIconCache.set(severity, icon);
  return icon;
}

// Singleton placement icon
let placementIconCached = null;
function getPlacementIcon() {
  if (!placementIconCached) {
    placementIconCached = L.divIcon({
      className: 'placement-marker',
      html: `<div class="placement-pin"><span class="placement-pin-inner">${TRASH_SVG}</span></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }
  return placementIconCached;
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

// Memoized individual report marker to prevent re-renders
const ReportMarker = memo(function ReportMarker({ report, onReportClick }) {
  const config = useMemo(() => getSeverityConfig(report.severity), [report.severity]);
  const icon = useMemo(() => getMarkerIcon(report.severity), [report.severity]);

  return (
    <Marker
      position={[report.lat, report.lng]}
      icon={icon}
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
              loading="lazy"
            />
          )}
          <div
            className="popup-severity"
            style={{
              color: config.color,
              background: config.bg,
            }}
          >
            {config.emoji} {config.label}
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
  );
});

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
        preferCanvas={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={20}
          updateWhenIdle={true}
          updateWhenZooming={false}
          keepBuffer={4}
        />

        <MapClickHandler isPlacing={isPlacing} onMapClick={onMapClick} />
        <UserLocationSetter onLocationFound={onLocationFound} />

        {flyToPosition && (
          <FlyToLocation position={flyToPosition} zoom={16} />
        )}

        {/* Existing report markers — each memoized */}
        {reports.map((report) => (
          <ReportMarker
            key={report.id}
            report={report}
            onReportClick={onReportClick}
          />
        ))}

        {/* Placement marker */}
        {isPlacing && placementLocation && (
          <Marker
            position={[placementLocation.lat, placementLocation.lng]}
            icon={getPlacementIcon()}
          />
        )}
      </MapContainer>
    </div>
  );
}

