'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PDFViewer.css';

interface PDFViewerProps {
  pdf: {
    public_id: string;
    secure_url: string;
    filename?: string;
    format?: string;
    created_at?: string;
  };
  index?: number;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdf, index = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // PDFs stored in Cloudinary's image storage have secure_url pointing to /image/upload/
  // But PDFs MUST be accessed via /raw/upload/ endpoint, not /image/upload/
  // Images work because they're meant to be served through /image/upload/
  // We need to convert PDF URLs from /image/upload/ to /raw/upload/ immediately
  const getPdfUrl = () => {
    if (!pdf.secure_url) {
      // Fallback: construct from public_id
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drasvxb0d';
      return `https://res.cloudinary.com/${cloudName}/raw/upload/${pdf.public_id}`;
    }
    
    // If URL uses /image/upload/, convert to /raw/upload/ immediately
    // This is required because PDFs can't be served through image endpoint
    if (pdf.secure_url.includes('/image/upload/')) {
      return pdf.secure_url.replace('/image/upload/', '/raw/upload/');
    }
    
    // If already using /raw/upload/, use as-is
    if (pdf.secure_url.includes('/raw/upload/')) {
      return pdf.secure_url;
    }
    
    // Otherwise use secure_url as-is (shouldn't happen for PDFs, but safe fallback)
    return pdf.secure_url;
  };

  const pdfUrl = getPdfUrl();
  const displayName = pdf.filename || pdf.public_id.split('/').pop() || 'Document';

  // Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen]);

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="pdf-card"
        onClick={() => setIsOpen(true)}
      >
        <div className="pdf-icon">📄</div>
        <div className="pdf-info">
          <h3 className="pdf-title">{displayName}</h3>
          {pdf.created_at && (
            <p className="pdf-date">
              {new Date(pdf.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
        <div className="pdf-overlay">
          <span className="pdf-view-text">View PDF</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pdf-modal"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="pdf-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pdf-modal-header">
                <h2 className="pdf-modal-title">{displayName}</h2>
                <button
                  className="pdf-modal-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close PDF viewer"
                  type="button"
                >
                  ×
                </button>
              </div>
              <div className="pdf-modal-body">
                {isLoading && !hasError && (
                  <div className="pdf-loading">
                    <div className="pdf-loading-spinner"></div>
                    <p>Loading document...</p>
                  </div>
                )}
                {hasError ? (
                  <div className="pdf-error">
                    <div className="pdf-error-icon">⚠️</div>
                    <p className="pdf-error-message">Unable to load PDF in viewer</p>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pdf-open-btn"
                    >
                      Open PDF in New Tab
                    </a>
                  </div>
                ) : (
                  <iframe
                    src={`${pdfUrl}#toolbar=1`}
                    className="pdf-iframe"
                    title={displayName}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    style={{ display: isLoading ? 'none' : 'block' }}
                    allow="fullscreen"
                  />
                )}
                <div className="pdf-modal-actions">
                  <a
                    href={pdfUrl}
                    download={displayName}
                    className="pdf-download-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
