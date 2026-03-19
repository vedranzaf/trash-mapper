'use client';

import { get, set, del, keys } from 'idb-keyval';

const REPORTS_KEY = 'trashmapper_reports';

// Generate a unique ID
export function generateId() {
  return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Compress an image file to reduce storage size
export async function compressImage(file, maxWidth = 1200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedReader = new FileReader();
              compressedReader.onload = () => resolve(compressedReader.result);
              compressedReader.onerror = reject;
              compressedReader.readAsDataURL(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Get all reports (metadata only, no photos)
export function getReports() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Get a single report by ID (metadata only)
export function getReportById(id) {
  const reports = getReports();
  return reports.find((r) => r.id === id) || null;
}

// Get photos for a report from IndexedDB
export async function getReportPhotos(reportId) {
  try {
    const photos = await get(`photos_${reportId}`);
    return photos || [];
  } catch {
    return [];
  }
}

// Save a new report
export async function addReport(report) {
  const reports = getReports();
  const reportMeta = {
    id: report.id,
    lat: report.lat,
    lng: report.lng,
    description: report.description,
    severity: report.severity,
    photoCount: report.photos.length,
    thumbnail: report.photos.length > 0 ? report.photos[0] : null,
    createdAt: new Date().toISOString(),
  };

  reports.unshift(reportMeta);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));

  // Store photos in IndexedDB
  if (report.photos.length > 0) {
    await set(`photos_${report.id}`, report.photos);
  }

  return reportMeta;
}

// Delete a report
export async function deleteReport(id) {
  const reports = getReports().filter((r) => r.id !== id);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  await del(`photos_${id}`);
}

// Get report statistics
export function getReportStats() {
  const reports = getReports();
  return {
    total: reports.length,
    critical: reports.filter((r) => r.severity === 'critical').length,
    high: reports.filter((r) => r.severity === 'high').length,
    medium: reports.filter((r) => r.severity === 'medium').length,
    low: reports.filter((r) => r.severity === 'low').length,
  };
}
