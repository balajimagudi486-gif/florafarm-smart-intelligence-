// FloraFarm — Crop Uploader Component
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, ImageIcon, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CropUploaderProps {
  onImageReady: (file: File, previewUrl: string) => void;
  onAnalyze: () => void;
  analyzing?: boolean;
  disabled?: boolean;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const CropUploader: React.FC<CropUploaderProps> = ({
  onImageReady,
  onAnalyze,
  analyzing = false,
  disabled = false,
}) => {
  const { t } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError('');
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(t.errors.invalidImage);
        return;
      }
      if (file.size > MAX_SIZE) {
        setError(t.errors.imageTooBig);
        return;
      }
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileName(file.name);
      onImageReady(file, url);
    },
    [onImageReady, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const removeImage = () => {
    setPreview(null);
    setFileName('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {!preview ? (
        /* Drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-5 transition-all duration-200 cursor-pointer ${
            dragging
              ? 'border-FloraFarm-green bg-FloraFarm-green/5 scale-[1.01]'
              : 'border-emerald-200 bg-FloraFarm-soft hover:border-FloraFarm-green hover:bg-FloraFarm-green/5'
          }`}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label={t.cropAI.uploadLabel}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          {/* Upload icon */}
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-200 ${
            dragging ? 'bg-FloraFarm-green/20 scale-110' : 'bg-emerald-100'
          }`}>
            <Upload size={36} className={dragging ? 'text-FloraFarm-green' : 'text-FloraFarm-emerald'} strokeWidth={1.5} />
          </div>

          <div className="text-center">
            <p className="text-base font-semibold text-FloraFarm-forest mb-1">
              {t.cropAI.uploadDragText}{' '}
              <span className="text-FloraFarm-green underline underline-offset-2">{t.cropAI.uploadBrowse}</span>
            </p>
            <p className="text-sm text-FloraFarm-text/50">{t.cropAI.uploadHint}</p>
          </div>

          {/* Camera button for mobile */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
            className="flex items-center gap-2 btn-secondary py-2 px-5 text-sm"
            aria-label={t.cropAI.uploadMobile}
          >
            <Camera size={16} />
            {t.cropAI.uploadMobile}
          </button>

          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Upload crop image file"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Take photo of crop"
          />
        </div>
      ) : (
        /* Image preview */
        <div className="relative rounded-2xl overflow-hidden border-2 border-FloraFarm-green/40 shadow-FloraFarm">
          <img
            src={preview}
            alt="Uploaded crop"
            className="w-full object-cover max-h-72 sm:max-h-96"
          />
          {/* Overlay with filename + remove */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-FloraFarm-dark/80 to-transparent p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon size={14} className="text-FloraFarm-green" />
              <span className="text-xs text-white truncate max-w-[200px]">{fileName}</span>
            </div>
            <button
              onClick={removeImage}
              className="flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 bg-red-900/40 hover:bg-red-900/60 px-2.5 py-1.5 rounded-lg transition-colors"
              aria-label={t.cropAI.removeImage}
            >
              <X size={12} />
              {t.cropAI.removeImage}
            </button>
          </div>

          {/* AI frame corners */}
          <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-FloraFarm-green rounded-tl-md" />
          <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-FloraFarm-green rounded-tr-md" />
          <div className="absolute bottom-12 left-3 w-6 h-6 border-l-2 border-b-2 border-FloraFarm-green rounded-bl-md" />
          <div className="absolute bottom-12 right-3 w-6 h-6 border-r-2 border-b-2 border-FloraFarm-green rounded-br-md" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-3 flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl p-3" role="alert">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Analyze button */}
      {preview && (
        <button
          onClick={onAnalyze}
          disabled={analyzing || disabled}
          className={`mt-5 btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base ${
            analyzing ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          id="analyze-crop-btn"
          aria-busy={analyzing}
        >
          {analyzing ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-FloraFarm-dark/30 border-t-FloraFarm-dark animate-spin" />
              {t.cropAI.analyzing}
            </>
          ) : (
            t.cropAI.analyzeBtn
          )}
        </button>
      )}
    </div>
  );
};

export default CropUploader;
