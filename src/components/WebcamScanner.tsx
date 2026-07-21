import React, { useRef, useState, useEffect } from "react";
import { Camera, VideoOff, RefreshCw, Check, AlertCircle } from "lucide-react";
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
        setError("Your browser or preview environment does not support video capture. Please open the application in a new tab (by clicking the button in the top right) or use the 'File Upload' tab instead.");
      } else if (
        err.name === "NotAllowedError" || 
        err.name === "PermissionDeniedError" || 
        err.name?.toLowerCase().includes("permission") ||
        err.message?.toLowerCase().includes("permission") ||
        err.message?.includes("Permission denied")
      ) {
        setError("Camera permission was denied. If you are using the in-editor preview iframe, please click 'Open in a new tab' at the top right of the preview to grant camera access, or use the 'File Upload' tab to process an image.");
      } else {
        setError("Unable to access camera. Please verify permissions, try opening the app in a new tab, or upload an image instead.");
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
        // Flip horizontally if facing user, but since environment is default, we can draw normally
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const base64Image = canvas.toDataURL("image/jpeg", 0.85);
        onCapture(base64Image);
        
        // Stop stream after capture to release camera
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-xl">
      <div className="relative w-full max-w-md aspect-video bg-[#0d1117] rounded-lg overflow-hidden flex items-center justify-center border border-[#30363d]">
        {isInitializing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#f0f6fc] gap-2">
            <RefreshCw className="w-8 h-8 text-[#2ea44f] animate-spin" />
            <span className="text-sm text-gray-400">Requesting camera access...</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-[#f0f6fc] bg-[#0d1117] gap-3">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={startWebcam}
              className="px-4 py-2 bg-[#21262d] text-[#f0f6fc] hover:bg-[#30363d] rounded-lg text-xs flex items-center gap-1 border border-[#30363d] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
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
        
        {/* Scanning corner brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#2ea44f] pointer-events-none"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#2ea44f] pointer-events-none"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#2ea44f] pointer-events-none"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#2ea44f] pointer-events-none"></div>
        
        {/* Scanning line animation */}
        <div className="absolute w-full h-0.5 bg-[#2ea44f] opacity-40 top-1/2 left-0 pointer-events-none animate-pulse"></div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex items-center gap-3 mt-4 w-full justify-center">
        {!error && !isInitializing && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={captureFrame}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2ea44f] hover:bg-[#2c974b] text-[#f0f6fc] text-sm font-semibold rounded-lg shadow transition-colors"
          >
            <Camera className="w-4 h-4" /> Capture Photo
          </motion.button>
        )}
        
        {onClose && (
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] text-sm font-medium rounded-lg border border-[#30363d] transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
