'use client';

import { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { compressImage } from '@/lib/store';

export default function PhotoUpload({ photos, setPhotos, maxPhotos = 5 }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = maxPhotos - photos.length;
    const filesToProcess = files.slice(0, remaining);

    for (const file of filesToProcess) {
      try {
        const compressed = await compressImage(file);
        setPhotos((prev) => [...prev, compressed]);
      } catch (err) {
        console.error('Failed to process photo:', err);
      }
    }

    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="photo-upload-grid">
      {photos.map((photo, index) => (
        <div key={index} className="photo-upload-item">
          <img src={photo} alt={`Photo ${index + 1}`} className="photo-upload-preview" />
          <button
            type="button"
            className="photo-upload-remove"
            onClick={() => removePhoto(index)}
            aria-label="Remove photo"
          >
            <X size={12} />
          </button>
        </div>
      ))}

      {photos.length < maxPhotos && (
        <label className="photo-upload-add" htmlFor="photo-input">
          <Camera size={24} className="photo-upload-add-icon" />
          <span className="photo-upload-add-text">
            {photos.length === 0 ? 'Add Photos' : 'Add More'}
          </span>
          <input
            ref={fileInputRef}
            id="photo-input"
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
      )}
    </div>
  );
}
