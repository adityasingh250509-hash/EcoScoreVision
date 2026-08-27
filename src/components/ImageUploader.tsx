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
      alert("Please upload a valid image file (PNG, JPEG, WebP).");
      return;
    }
    try {
      setIsCompressing(true);
      const normalizedBase64 = await normalizeImageForAnalysis(file);
      onImageSelected(normalizedBase64);
    } catch (err) {
      console.error("Failed to process uploaded image:", err);
      // Fallback
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
          <div className="relative group bg-[#0d1117] rounded-xl border border-[#30363d] overflow-hidden aspect-video flex items-center justify-center shadow-inner">
            <img
              src={selectedImage}
              alt="Selected carbon item"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            
            {/* Scanning corner brackets */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#2ea44f] pointer-events-none"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#2ea44f] pointer-events-none"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#2ea44f] pointer-events-none"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#2ea44f] pointer-events-none"></div>
            
            {/* Scanning line animation when analyzing */}
            {isAnalyzing && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#2ea44f] to-transparent animate-pulse top-1/2 -translate-y-1/2"></div>
            )}

            {/* Quick status pill */}
            <div className="absolute top-3 left-3 bg-[#0d1117]/80 backdrop-blur-md border border-[#30363d] px-2.5 py-1 rounded-md text-[11px] font-semibold text-gray-200 flex items-center gap-1.5 shadow">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2ea44f]" />
              <span>Image Loaded</span>
            </div>

            {/* Hover overlay for quick remove */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onClear}
                className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg transition-colors shadow"
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
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#2ea44f] to-[#238636] hover:from-[#34c759] hover:to-[#2ea44f] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#2ea44f]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Analyze with Gemini AI</span>
                </>
              )}
            </button>

            <button
              onClick={triggerFileInput}
              disabled={isAnalyzing}
              className="w-full py-2.5 px-4 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-gray-200 hover:text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
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
          className={`w-full aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-[#2ea44f] bg-[#2ea44f]/10 text-[#f0f6fc]"
              : "border-[#30363d] bg-[#0d1117] hover:border-gray-500 text-gray-400 hover:text-gray-200"
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
            animate={{ y: isDragging ? -5 : 0 }}
            className="p-3 bg-[#161b22] border border-[#30363d] rounded-full mb-3 shadow"
          >
            {isCompressing ? (
              <RefreshCw className="w-6 h-6 text-[#2ea44f] animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-[#2ea44f]" />
            )}
          </motion.div>
          <p className="text-sm font-semibold text-[#f0f6fc]">
            {isCompressing ? "Preparing image..." : "Drag & drop appliance/vehicle image"}
          </p>
          <p className="text-xs mt-1 text-gray-500">
            or <span className="text-[#2ea44f] underline font-medium">browse local files</span>
          </p>
          <p className="text-[10px] mt-3 text-gray-600">
            Supports PNG, JPG, WEBP (Instant AI Vision Processing)
          </p>
        </div>
      )}
    </div>
  );
}
