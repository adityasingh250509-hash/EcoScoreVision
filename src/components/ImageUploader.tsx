import React, { useState, useRef } from "react";
import { Upload, Sparkles, RefreshCw, Trash2, Camera, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { normalizeImageForAnalysis } from "../utils/imageUtils";

interface ImageUploaderProps {
  onImageSelected: (base64Image: string) => void;
  selectedImage: string | null;
  onClear: () => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

export default function ImageUploader({
  onImageSelected,
  selectedImage,
  onClear,
  onAnalyze,
  isAnalyzing = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }
    try {
      setIsCompressing(true);
      const normalizedBase64 = await normalizeImageForAnalysis(file);
      onImageSelected(normalizedBase64);
    } catch (err) {
      console.error("Failed to process uploaded image:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onImageSelected(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {selectedImage ? (
        <div className="flex flex-col gap-3">
          <div className="relative group bg-[#070a11] rounded-2xl border border-white/[0.08] overflow-hidden aspect-video flex items-center justify-center shadow-2xl">
            <img
              src={selectedImage}
              alt="Selected carbon item"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            
            {/* Precision corner reticles */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-emerald-400/80 pointer-events-none" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-emerald-400/80 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-emerald-400/80 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-emerald-400/80 pointer-events-none" />
            
            {/* Scanning line animation when analyzing */}
            {isAnalyzing && (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse top-1/2 -translate-y-1/2" />
            )}

            {/* Quick status badge */}
            <div className="absolute top-3 left-3 bg-[#0b0f19]/90 backdrop-blur-md border border-white/[0.08] px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-200 flex items-center gap-1.5 shadow">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Image Loaded</span>
            </div>

            {/* Hover overlay for quick remove */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onClear}
                className="p-1.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-lg transition-colors shadow cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => onAnalyze ? onAnalyze() : onImageSelected(selectedImage)}
              disabled={isAnalyzing}
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Processing Neural Scan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Run Dual AI Vision</span>
                </>
              )}
            </button>

            <button
              onClick={triggerFileInput}
              disabled={isAnalyzing}
              className="w-full py-2.5 px-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 hover:text-white font-mono text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Change Photo</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`w-full aspect-video border border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-emerald-400 bg-emerald-500/10 text-white"
              : "border-white/[0.12] bg-[#070a11] hover:border-emerald-500/50 text-slate-400 hover:text-slate-200"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <motion.div
            animate={{ y: isDragging ? -4 : 0 }}
            className="p-3.5 bg-[#0b0f19] border border-white/[0.08] rounded-xl mb-3 shadow"
          >
            {isCompressing ? (
              <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-emerald-400" />
            )}
          </motion.div>
          <p className="text-sm font-semibold text-white">
            {isCompressing ? "Normalizing image..." : "Drag & drop appliance or vehicle photo"}
          </p>
          <p className="text-xs mt-1 text-slate-400">
            or <span className="text-emerald-400 underline font-medium">browse local files</span>
          </p>
          <p className="text-[10px] font-mono mt-3 text-slate-500">
            Supports PNG, JPG, WEBP (Roboflow Inference + Gemini Verification)
          </p>
        </div>
      )}
    </div>
  );
}
