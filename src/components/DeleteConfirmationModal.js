// DeleteConfirmationModal.js - Custom delete confirmation modal
import React, { useEffect } from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productName, isDeleting }) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <div className="delete-modal-icon">🗑️</div>
          <h3>Delete Product</h3>
        </div>
        
        <div className="delete-modal-body">
          <p>Are you sure you want to delete this product?</p>
          {productName && (
            <p className="product-name-warning">
              "<strong>{productName}</strong>" will be permanently removed.
            </p>
          )}
          <p className="warning-text">This action cannot be undone.</p>
        </div>
        
        <div className="delete-modal-footer">
          <button 
            onClick={onClose} 
            className="modal-cancel-btn"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="modal-delete-btn"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;