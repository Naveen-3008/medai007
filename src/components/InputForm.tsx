import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  X,
  FileImage,
  Sparkles,
  RotateCcw,
  Sliders,
  Clock,
  Activity,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal';

interface InputFormProps {
  symptoms: string;
  onSymptomsChange: (val: string) => void;
  painLevel: number;
  onPainLevelChange: (val: number) => void;
  duration: string;
  onDurationChange: (val: string) => void;
  selectedImage: string | null;
  onImageChange: (image: string | null, mimeType?: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  symptoms,
  onSymptomsChange,
  painLevel,
  onPainLevelChange,
  duration,
  onDurationChange,
  selectedImage,
  onImageChange,
  onSubmit,
  onReset,
  isLoading,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickSymptomTags = [
    'Swelling & Edema',
    'Sharp Throbbing Pain',
    'Red Erythema',
    'Blister Formation',
    'Bruising / Hematoma',
    'Intense Itching',
    'Skin Abrasion',
    'Burning Sensation',
    'Joint Stiffness',
  ];

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onImageChange(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const addSymptomTag = (tag: string) => {
    if (symptoms.includes(tag)) return;
    const newText = symptoms ? `${symptoms.trim()}, ${tag}` : tag;
    onSymptomsChange(newText);
  };

  const getPainDescriptor = (val: number) => {
    if (val === 0) return { label: 'No Pain (0/10)', color: 'text-slate-500' };
    if (val <= 3) return { label: `Mild Discomfort (${val}/10)`, color: 'text-emerald-600 dark:text-emerald-400' };
    if (val <= 6) return { label: `Moderate Pain (${val}/10)`, color: 'text-amber-600 dark:text-amber-400' };
    if (val <= 8) return { label: `Severe Pain (${val}/10)`, color: 'text-orange-600 dark:text-orange-400' };
    return { label: `Intense / Acute Pain (${val}/10)`, color: 'text-rose-600 dark:text-rose-400 font-bold' };
  };

  const durationOptions = [
    'Just happened (< 30 mins)',
    '1 - 3 hours ago',
    'Today (4 - 12 hours)',
    '1 - 2 days ago',
    '3 - 7 days ago',
    'Chronic (> 1 week)',
  ];

  return (
    <section
      id="streamlit-input-container"
      aria-labelledby="heading-clinical-input"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-6"
    >
      {/* Streamlit Form Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono text-xs font-semibold uppercase">
              st.form
            </span>
            <h2 id="heading-clinical-input" className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Clinical Assessment & Injury Input
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Provide symptom text description and/or upload an injury photo for 5-point evaluation.
          </p>
        </div>

        <button
          id="btn-reset-form"
          type="button"
          onClick={onReset}
          disabled={isLoading || (!symptoms && !selectedImage)}
          className="self-start sm:self-auto text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 disabled:opacity-30 flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Form
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-6"
      >
        {/* 1. Symptoms Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="textarea-symptoms"
              className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4 text-rose-500" />
              <span>1. Describe Symptoms & How Injury Occurred *</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {symptoms.length} chars
            </span>
          </div>

          <textarea
            id="textarea-symptoms"
            rows={4}
            value={symptoms}
            onChange={(e) => onSymptomsChange(e.target.value)}
            placeholder="e.g., Twisted my right ankle stepping off stairs. Swelling developed within 15 minutes, throbbing pain when standing, skin is warm and tender to touch..."
            className="w-full p-3.5 text-sm bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none transition leading-relaxed"
          />

          {/* Quick Tag Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick tags:
            </span>
            {quickSymptomTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addSymptomTag(tag)}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200/80 dark:border-slate-700/80 transition cursor-pointer"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Pain Scale Slider & Duration in 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Pain Scale Widget */}
          <div className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="input-pain-slider"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-rose-500" />
                Pain Scale (1 - 10)
              </label>
              <span className={`text-xs font-medium ${getPainDescriptor(painLevel).color}`}>
                {getPainDescriptor(painLevel).label}
              </span>
            </div>

            <input
              id="input-pain-slider"
              type="range"
              min="0"
              max="10"
              step="1"
              value={painLevel}
              onChange={(e) => onPainLevelChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 (None)</span>
              <span>5 (Moderate)</span>
              <span>10 (Worst)</span>
            </div>
          </div>

          {/* Onset / Duration Widget */}
          <div className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 rounded-xl space-y-2">
            <label
              htmlFor="select-duration"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              Onset / Symptom Duration
            </label>

            <select
              id="select-duration"
              value={duration}
              onChange={(e) => onDurationChange(e.target.value)}
              className="w-full text-xs py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {durationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Helps differentiate acute trauma from progressive conditions.
            </p>
          </div>
        </div>

        {/* 3. Injury Photo Upload (st.file_uploader) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FileImage className="w-4 h-4 text-rose-500" />
              <span>2. Upload Injury Photo (Optional / Multi-modal)</span>
            </label>
            <span className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP</span>
          </div>

          {selectedImage ? (
            /* Selected Image Preview Card */
            <div
              id="uploaded-image-preview"
              className="p-4 bg-rose-50/30 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900/60 rounded-xl flex flex-col sm:flex-row items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-black/10 shrink-0">
                  <img
                    src={selectedImage}
                    alt="Uploaded injury visual"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <FileImage className="w-3.5 h-3.5 text-rose-500" />
                    Injury Image Attached
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Ready for multimodal visual AI assessment
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  id="btn-take-another-photo"
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Retake
                </button>
                <button
                  id="btn-remove-image"
                  type="button"
                  onClick={() => onImageChange(null)}
                  className="py-1.5 px-3 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 dark:hover:bg-rose-900/60 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                isDragging
                  ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/40 dark:bg-slate-800/30'
              }`}
            >
              <input
                ref={fileInputRef}
                id="file-upload-injury"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-2.5">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-xs text-rose-500 border border-slate-200 dark:border-slate-700">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Drag and drop your injury photo here, or browse
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Clear lighting and sharp focus help improve model recognition.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    id="btn-browse-file"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Browse Files
                  </button>
                  <span className="text-xs text-slate-400">or</span>
                  <button
                    id="btn-open-camera"
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-rose-500" />
                    Use Device Camera
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Primary CTA */}
        <div className="pt-3">
          <button
            id="btn-submit-assessment"
            type="submit"
            disabled={isLoading || (!symptoms.trim() && !selectedImage)}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-800 text-white font-bold text-sm shadow-md shadow-rose-500/25 hover:shadow-rose-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Synthesizing 5-Point Medical Guide with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate 5-Point Medical Treatment Guide</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => onImageChange(img, 'image/jpeg')}
      />
    </section>
  );
};
