import React, { useState, useRef } from "react";
import { Upload, FileImage, Trash2, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface ImageUploaderProps {
  onImageSelected: (base64Image: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export default function ImageUploader({
  onImageSelected,
  selectedImage,
  onClear,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        onImageSelected(reader.result);
      }
    };
    reader.readAsDataURL(file);
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
    <div className="w-full">
      {selectedImage ? (
        <div className="relative group bg-[#0d1117] rounded-xl border border-[#30363d] overflow-hidden aspect-video flex items-center justify-center">
          <img
            src={selectedImage}
            alt="Selected carbon item"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
          
          {/* Scanning corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#2ea44f] pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#2ea44f] pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#2ea44f] pointer-events-none"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#2ea44f] pointer-events-none"></div>
          
          {/* Scanning line animation */}
          <div className="absolute w-full h-0.5 bg-[#2ea44f] opacity-40 top-1/2 left-0 pointer-events-none animate-pulse"></div>

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={onClear}
              className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow"
              title="Remove image"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
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
            <Upload className="w-6 h-6 text-[#2ea44f]" />
          </motion.div>
          <p className="text-sm font-semibold text-[#f0f6fc]">
            Drag & drop appliance/vehicle image
          </p>
          <p className="text-xs mt-1 text-gray-500">
            or <span className="text-[#2ea44f] underline font-medium">browse local files</span>
          </p>
          <p className="text-[10px] mt-3 text-gray-600">
            Supports PNG, JPG, WEBP (Max 10MB)
          </p>
        </div>
      )}
    </div>
  );
}
