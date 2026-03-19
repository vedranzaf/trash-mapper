'use client';

import { supabase } from './supabase';

const BUCKET = 'report-photos';

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
              resolve(blob);
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

// Upload a blob to Supabase Storage and return its public URL
async function uploadPhoto(blob) {
  const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, blob, { contentType: 'image/jpeg', upsert: false });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return publicUrl;
}

// Get all reports from Supabase
export async function getReports() {
  const { data, error } = await supabase
    .from('incident_reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch reports:', error);
    return [];
  }
  return data || [];
}

// Get a single report by ID
export async function getReportById(id) {
  const { data, error } = await supabase
    .from('incident_reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

// Save a new report — uploads photos to Storage then inserts a row
export async function addReport(report) {
  // Upload photos (report.photos is an array of File blobs or data URLs)
  let photoUrls = [];
  let thumbnailUrl = null;

  if (report.photos && report.photos.length > 0) {
    for (const photo of report.photos) {
      try {
        let blob = photo;
        // If it's a data URL string (legacy), convert to blob
        if (typeof photo === 'string' && photo.startsWith('data:')) {
          const res = await fetch(photo);
          blob = await res.blob();
        }
        const url = await uploadPhoto(blob);
        photoUrls.push(url);
      } catch (err) {
        console.error('Failed to upload photo:', err);
      }
    }
    thumbnailUrl = photoUrls[0] || null;
  }

  const row = {
    lat: report.lat,
    lng: report.lng,
    description: report.description,
    severity: report.severity,
    photo_urls: photoUrls,
    thumbnail_url: thumbnailUrl,
  };

  const { data, error } = await supabase
    .from('incident_reports')
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a report
export async function deleteReport(id) {
  const { error } = await supabase
    .from('incident_reports')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Subscribe to realtime changes and call onUpdate with fresh report list
export function subscribeToReports(onUpdate) {
  const channel = supabase
    .channel('incident_reports_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'incident_reports' },
      async () => {
        // Any change → re-fetch the full list
        const reports = await getReports();
        onUpdate(reports);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => supabase.removeChannel(channel);
}
