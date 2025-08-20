import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
  acceptedFileTypes = "image/*"
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxFileSize) {
      setError(`File size must be less than ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    // Validate file type
    if (acceptedFileTypes !== "*" && !file.type.match(acceptedFileTypes)) {
      setError('Please select a valid image file (JPG, PNG, GIF)');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get upload parameters from parent component
      const { url } = await onGetUploadParameters();

      // Upload file to object storage
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          setIsUploading(false);
          if (xhr.status === 200) {
            setUploadedFile(file);
            setUploadProgress(100);
            
            // Call completion callback with upload URL
            if (onComplete) {
              onComplete({
                successful: [{
                  uploadURL: url,
                  name: file.name,
                  size: file.size
                }]
              });
            }
          } else {
            setError('Upload failed. Please try again.');
            setUploadProgress(0);
          }
        }
      };

      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);

    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      setError('Upload failed. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetUploader = () => {
    setUploadedFile(null);
    setError(null);
    setUploadProgress(0);
    setIsUploading(false);
    // Reset file input
    const fileInput = document.getElementById('file-upload-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <input
        type="file"
        id="file-upload-input"
        accept={acceptedFileTypes}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={isUploading || uploadedFile}
      />
      
      <button
        type="button"
        onClick={() => {
          if (uploadedFile) {
            resetUploader();
          } else {
            document.getElementById('file-upload-input').click();
          }
        }}
        disabled={isUploading}
        className={buttonClassName}
        style={{
          width: '100%',
          padding: '12px',
          border: `2px dashed ${error ? '#ef4444' : uploadedFile ? '#10b981' : '#d1d5db'}`,
          borderRadius: '8px',
          backgroundColor: error ? '#fef2f2' : uploadedFile ? '#f0fdf4' : '#f9fafb',
          color: error ? '#ef4444' : uploadedFile ? '#10b981' : '#6b7280',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500',
          ...(!children && { minHeight: '120px', flexDirection: 'column' })
        }}
        data-testid="button-upload-screenshot"
      >
        {children || (
          <>
            {isUploading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #e5e7eb',
                  borderTop: '2px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span>Uploading... {Math.round(uploadProgress)}%</span>
              </>
            ) : uploadedFile ? (
              <>
                <CheckCircle size={20} />
                <div style={{ textAlign: 'center' }}>
                  <div>{uploadedFile.name}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB - Click to change
                  </div>
                </div>
              </>
            ) : (
              <>
                <Upload size={24} />
                <div style={{ textAlign: 'center' }}>
                  <div>Upload Payment Screenshot</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    Click to select file (Max {(maxFileSize / 1024 / 1024).toFixed(1)}MB)
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </button>

      {error && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#ef4444',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {isUploading && (
        <div style={{
          marginTop: '8px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '4px',
            backgroundColor: '#3b82f6',
            width: `${uploadProgress}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}