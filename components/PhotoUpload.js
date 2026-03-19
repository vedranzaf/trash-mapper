'use client';

import { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { compressImage } from '@/lib/store';
import { getDictionary } from '@/lib/i18n';

// photos is an array of { previewUrl: string, blob: Blob }
export default function PhotoUpload({ photos, setPhotos, maxPhotos = 5, locale = 'en' }) {
  const fileInputRef = useRef(null);
  const t = getDictionary(locale);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = maxPhotos - photos.length;
    const filesToProcess = files.slice(0, remaining);

    for (const file of filesToProcess) {
      try {
        const blob = await compressImage(file);
        const previewUrl = URL.createObjectURL(blob);
        setPhotos((prev) => [...prev, { previewUrl, blob }]);
      } catch (err) {
        console.error('Failed to process photo:', err);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => {
      // Revoke preview URL to avoid memory leaks
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="photo-upload-grid">
      {photos.map((photo, index) => (
        <div key={index} className="photo-upload-item">
          <img src={photo.previewUrl} alt={`${t.photo} ${index + 1}`} className="photo-upload-preview" />
          <button type="button" className="photo-upload-remove"
            onClick={() => removePhoto(index)} aria-label="Remove">
            <X size={12} />
          </button>
        </div>
      ))}

      {photos.length < maxPhotos && (
        <label className="photo-upload-add" htmlFor="photo-input">
          <Camera size={24} className="photo-upload-add-icon" />
          <span className="photo-upload-add-text">
            {photos.length === 0 ? t.addPhotos : t.addMore}
          </span>
          <input ref={fileInputRef} id="photo-input" type="file"
            accept="image/*" multiple
            onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
      )}
    </div>
  );
}
