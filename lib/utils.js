// Format relative time (e.g., "2 hours ago")
export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}

// Get severity config (color, label, icon)
export function getSeverityConfig(severity) {
  const configs = {
    low: {
      label: 'Low',
      color: '#22c55e',
      bg: 'rgba(34, 197, 94, 0.15)',
      emoji: '🟢',
    },
    medium: {
      label: 'Medium',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.15)',
      emoji: '🟡',
    },
    high: {
      label: 'High',
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.15)',
      emoji: '🟠',
    },
    critical: {
      label: 'Critical',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.15)',
      emoji: '🔴',
    },
  };
  return configs[severity] || configs.low;
}

// Format coordinates for display
export function formatCoords(lat, lng) {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

// Default map center (Europe)
export const DEFAULT_CENTER = [41.9981, 21.4254];
export const DEFAULT_ZOOM = 13;
