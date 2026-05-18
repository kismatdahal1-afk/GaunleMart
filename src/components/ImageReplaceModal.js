// ImageReplaceModal.js - Uploads image to Cloudinary using Render API
import React, { useState } from 'react';
import './ImageReplaceModal.css';

const ImageReplaceModal = ({ product, onClose, onReplace }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image (JPEG, PNG, or WEBP)');
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    setError('');
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle replace button click - Upload to Cloudinary first using Render API
  const handleReplace = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setUploading(true);
    setError('');

    // Create FormData for Cloudinary upload
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // UPDATED: Using environment variable for Render API URL
      const uploadResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        setError('Failed to upload image to Cloudinary');
        setUploading(false);
        return;
      }

      // Call the replace function with the Cloudinary URL
      await onReplace(product._id, uploadResult.imageUrl);
      
    } catch (error) {
      console.error('Error replacing image:', error);
      setError('Network error. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Replace Product Image</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <div className="current-image">
            <label>Current Image:</label>
            <img src={product.imageUrl} alt={product.name} />
          </div>
          
          <div className="new-image">
            <label>Select New Image:</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileSelect}
              className="file-input-modal"
              disabled={uploading}
            />
            {preview && (
              <div className="image-preview-modal">
                <p>Preview:</p>
                <img src={preview} alt="Preview" />
              </div>
            )}
            {error && <p className="modal-error">{error}</p>}
            {uploading && <p className="modal-uploading">Uploading to Cloudinary...</p>}
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="modal-cancel-btn" disabled={uploading}>
            Cancel
          </button>
          <button onClick={handleReplace} className="modal-replace-btn" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Replace Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageReplaceModal;