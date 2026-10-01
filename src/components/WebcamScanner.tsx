import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface WebcamScannerProps {
  onCapture: (base64Image: string) => void;
  onClose?: () => void;
}

export default function WebcamScanner({ onCapture, onClose }: WebcamScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const startWebcam = async () => {
    setIsInitializing(true);
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("NotSupportedError");
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Webcam access error:", err);
      if (err.message === "NotSupportedError") {
        setError("Your browser or preview environment does not support video capture. Please open the application in a new tab or use the 'File Upload' tab instead.");
      } else if (
        err.name === "NotAllowedError" || 
        err.name === "PermissionDeniedError" || 
        err.name?.toLowerCase().includes("permission") ||
        err.message?.toLowerCase().includes("permission") ||
        err.message?.includes("Permission denied")
      ) {
        setError("Camera permission was denied. If using the preview iframe, open in a new tab to grant camera access, or use 'File Upload'.");
      } else {
        setError("Unable to access camera. Please verify permissions or upload an image instead.");
      }
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    startWebcam();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const base64Image = canvas.toDataURL("image/jpeg", 0.85);
        onCapture(base64Image);
        
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-[#0b0f19] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
      <div className="relative w-full max-w-md aspect-video bg-[#070a11] rounded-xl overflow-hidden flex items-center justify-center border border-white/[0.08]">
        {isInitializing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-2 font-mono">
            <RefreshCw className="w-7 h-7 text-emerald-400 animate-spin" />
            <span className="text-xs text-slate-400">Initializing Optical Sensor...</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white bg-[#070a11] gap-3">
            <AlertCircle className="w-8 h-8 text-rose-400" />
            <p className="text-xs font-medium text-slate-300 max-w-xs">{error}</p>
            <button
              onClick={startWebcam}
              className="px-3.5 py-1.5 bg-white/[0.06] text-white hover:bg-white/[0.1] rounded-lg text-xs font-mono flex items-center gap-1.5 border border-white/[0.1] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Sensor
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${error || isInitializing ? "hidden" : "block"}`}
        />
        
        {/* Reticles */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-emerald-400/80 pointer-events-none" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-emerald-400/80 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-emerald-400/80 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-emerald-400/80 pointer-events-none" />
        
        {/* Scanning line animation */}
        <div className="absolute w-full h-0.5 bg-emerald-400/50 top-1/2 left-0 pointer-events-none animate-pulse" />
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex items-center gap-3 mt-4 w-full justify-center">
        {!error && !isInitializing && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={captureFrame}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/10 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4" /> Capture Frame
          </motion.button>
        )}
        
        {onClose && (
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-mono rounded-xl border border-white/[0.08] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
