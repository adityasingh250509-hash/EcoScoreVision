import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowRight, 
  Camera, 
  Zap, 
  Globe, 
  ShieldCheck, 
  TrendingDown, 
  Sparkles, 
  CheckCircle, 
  Award, 
  Activity, 
  Layers, 
  Cpu, 
  TreePine, 
  ExternalLink,
  Flame,
  HeartHandshake,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Radio,
  Satellite
} from "lucide-react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import ThreeEarthSpace, { CLIMATE_HOTSPOTS } from "./ThreeEarthSpace";
import { SAMPLE_ITEMS, SampleItem } from "../constants/samples";
import { ClimateHotspot } from "../types";

interface HomeViewProps {
  onNavigateToDashboard: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToNews: () => void;
  onSelectSample?: (sample: SampleItem) => void;
}

export default function HomeView({
  onNavigateToDashboard,
  onNavigateToHowItWorks,
  onNavigateToNews,
  onSelectSample,
}: HomeViewProps) {
  const [pledgeSigned, setPledgeSigned] = useState<boolean>(() => {
    return localStorage.getItem("ecopulse_pledge_signed") === "true";
  });
  const [pledgeCount, setPledgeCount] = useState<number>(() => {
    const saved = localStorage.getItem("ecopulse_pledge_count");
    return saved ? parseInt(saved, 10) : 48293;
  });

  const [activeSampleIdx, setActiveSampleIdx] = useState<number>(0);
  
  // View mode for Hero: "video" (Earth at Night from space) or "interactive-3d" (Three.js globe)
  const [heroMode, setHeroMode] = useState<"video" | "interactive-3d">("video");
  
  // Video playback controls
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: muted video autoplay
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => setIsPlaying(false));
        }
      });
    }
  }, [heroMode]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleSignPledge = () => {
    if (!pledgeSigned) {
      setPledgeSigned(true);
      const newCount = pledgeCount + 1;
      setPledgeCount(newCount);
      localStorage.setItem("ecopulse_pledge_signed", "true");
      localStorage.setItem("ecopulse_pledge_count", newCount.toString());

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.7 },
        colors: ["#10b981", "#38bdf8", "#a855f7", "#ffffff"],
      });
    }
  };

  return (
    <div className="flex flex-col gap-14 pb-20 text-[#f1f5f9]">
      {/* ---------------- 1. DEEP SPACE CINEMATIC HERO ---------------- */}
      <section className="relative pt-2 pb-4">
        {/* Ambient Top Glow */}
        <div 
          aria-hidden="true" 
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none rounded-full"
        />

        <div className="flex flex-col gap-8">
          {/* Top Hero Pitch Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-3 max-w-2xl"
            >
              {/* Vision Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono w-fit backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                <span className="text-white font-semibold tracking-wider">ORBITAL CLIMATE VISION</span>
                <span className="text-slate-600">//</span>
                <span className="text-slate-400">ROBOFLOW & GEMINI</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white [text-wrap:balance]">
                Planetary Vision in <br />
                <span className="bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                  Deep Space Orbit
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                Real-time visual decarbonization intelligence powered by neural models. 
                Using a custom <strong className="text-white">Roboflow Model</strong> (<span className="text-violet-300 font-mono text-xs">electrical-appliance-detector</span>) 
                paired with <strong className="text-white">Gemini verification</strong>, EcoPulse audits everyday appliances, vehicles, and energy infrastructures directly from planetary orbit.
              </p>
            </motion.div>

            {/* Quick Actions & Telemetry Mode Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0"
            >
              <button
                onClick={onNavigateToDashboard}
                className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                <Camera className="w-4 h-4 text-black" />
                <span>Launch Scanner Studio</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                onClick={onNavigateToHowItWorks}
                className="px-5 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-white font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap backdrop-blur-md"
              >
                <Cpu className="w-4 h-4 text-violet-400" />
                <span>Model Architecture</span>
              </button>
            </motion.div>
          </div>

          {/* ---------------- CINEMATIC EARTH IN SPACE PORTAL ---------------- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative w-full h-[450px] sm:h-[540px] rounded-3xl border border-white/[0.12] bg-black overflow-hidden shadow-[0_20px_80px_-15px_rgba(0,0,0,0.9),0_0_50px_-10px_rgba(16,185,129,0.2)]"
          >
            {heroMode === "video" ? (
              /* Deep Space Earth Video */
              <div className="relative w-full h-full bg-black">
                <video
                  ref={videoRef}
                  src="/videos/earth_space.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-cover"
                />

                {videoError && (
                  /* Fallback to external pin video or procedural canvas if local has an issue */
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    src="https://v1.pinimg.com/videos/iht/720p/7e/0d/8a/7e0d8a030d775e0bd7ecb3b473fae299.mp4"
                  />
                )}

                {/* Subtle Cinematic Vignette Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />
              </div>
            ) : (
              /* Three.js Interactive 3D Orbit */
              <div className="w-full h-full bg-[#02050c]">
                <ThreeEarthSpace className="w-full h-full" />
              </div>
            )}

            {/* Top Bar HUD inside Video */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              {/* Left Telemetry Marker */}
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/[0.1] text-white shadow-xl pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-[11px] font-mono tracking-wider font-semibold">
                  {heroMode === "video" ? "EARTH AT NIGHT // SPACE ORBIT TELEMETRY" : "3D INTERACTIVE HOTSPOTS"}
                </span>
              </div>

              {/* Center Mode Switcher */}
              <div className="flex items-center gap-1 bg-black/75 backdrop-blur-xl p-1 rounded-full border border-white/[0.1] pointer-events-auto shadow-xl">
                <button
                  onClick={() => setHeroMode("video")}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all cursor-pointer ${
                    heroMode === "video"
                      ? "bg-white text-black shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Deep Space Video
                </button>
                <button
                  onClick={() => setHeroMode("interactive-3d")}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all cursor-pointer ${
                    heroMode === "interactive-3d"
                      ? "bg-white text-black shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Interactive 3D Sphere
                </button>
              </div>

              {/* Right Video Controls */}
              {heroMode === "video" && (
                <div className="hidden sm:flex items-center gap-1.5 bg-black/70 backdrop-blur-xl p-1.5 rounded-full border border-white/[0.1] pointer-events-auto">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.2] text-white transition-colors cursor-pointer"
                    title={isPlaying ? "Pause Video" : "Play Video"}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.2] text-white transition-colors cursor-pointer"
                    title={isMuted ? "Unmute Sound" : "Mute Sound"}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Overlay: Holographic Orbital Specs Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/75 backdrop-blur-2xl border border-white/[0.1] text-white shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Satellite className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono tracking-wide text-white">ORBITAL SENSOR ARRAY</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    Low Earth Orbit (408 km) • 27,600 km/h • Global Continental Emissions Detection
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col text-right font-mono text-[11px] text-slate-400">
                  <span>Carbon Baseline: <strong className="text-white">426.8 ppm</strong></span>
                  <span>UN Target: <strong className="text-emerald-400">350 ppm</strong></span>
                </div>
                <button
                  onClick={onNavigateToDashboard}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Scan Appliance</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- 2. REAL-TIME GLOBAL CLIMATE TELEMETRY ---------------- */}
      <section className="bg-black/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Deep Space Planetary Telemetry & UN SDG 13 Targets
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">Calibrated with IPCC, NOAA, and orbital satellite sensors</p>
            </div>
          </div>
          <button
            onClick={onNavigateToNews}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Explore Live SDG 13 Wire</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Atmospheric CO2</span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">426.8</span>
              <span className="text-xs text-slate-400 ml-1 font-mono">ppm</span>
            </div>
            <div className="mt-2 text-[11px] text-amber-400 font-mono">
              ▲ +2.4 ppm vs 2024 · Target 350
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Mean Temp Anomaly</span>
              <TrendingDown className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-300">+1.28</span>
              <span className="text-xs text-slate-400 ml-1 font-mono">°C</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 font-mono">
              Paris 1.5°C threshold limit
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Renewables In Grid</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-cyan-300">31.8%</span>
              <span className="text-xs text-slate-400 ml-1 font-mono">Global</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-400 font-mono">
              ▲ +14% YoY generation growth
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Community Tree Targets</span>
              <TreePine className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-400">148,290+</span>
              <span className="text-xs text-slate-400 ml-1 font-mono">Trees</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 font-mono">
              ~2,965 tonnes CO2/yr sequestered
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. FOUR PILLARS OF SYSTEM ARCHITECTURE ---------------- */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider">System Architecture</span>
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            Scientific Deep-Space Decarbonization Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            How EcoPulse transforms visual camera inputs into verified greenhouse gas computations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.08] hover:border-violet-500/40 transition-all flex flex-col justify-between backdrop-blur-md">
            <div>
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 flex items-center justify-center mb-3.5">
                <Cpu className="w-4 h-4 text-violet-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">Roboflow Computer Vision</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trained custom model (<span className="text-violet-300 font-mono">electrical-appliance-detector</span>) delivering sub-second serverless inference, cross-verified with Gemini for hardware extraction.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Roboflow Hosted API</span>
              <span className="text-emerald-400 font-semibold">Sub-second</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between backdrop-blur-md">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3.5">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">Empirical GHG Matrix</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates precise carbon output in kg CO2 using standardized GHG Protocol coefficients for electricity grids, combustion, and refrigerants.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400">
              GHG Scope 1, 2 & 3 Standard
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.08] hover:border-cyan-500/40 transition-all flex flex-col justify-between backdrop-blur-md">
            <div>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3.5">
                <TreePine className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">Botanical Tree Offset</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates exact mature tree equivalents based on peer-reviewed EPA forestry absorption rates of ~20 kg CO2 per tree per calendar year.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-cyan-400">
              Formula: ⌈Emissions / 20⌉
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.08] hover:border-amber-500/40 transition-all flex flex-col justify-between backdrop-blur-md">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">UN SDG 13 Direct Action</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowers users with verifiable PDF audit records, voice synthesis read-aloud advice, and downloadable teacher dataset CSVs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-amber-400">
              Target 13.3 Climate Education
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. INTERACTIVE INSTANT SAMPLE BENCH ---------------- */}
      <section className="bg-black/60 border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider">Simulation Bench</span>
            <h2 className="text-lg sm:text-2xl font-bold text-white mt-0.5">
              Audit Everyday Appliances & Hardware
            </h2>
          </div>
          <button
            onClick={onNavigateToDashboard}
            className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-black font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sample Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          {SAMPLE_ITEMS.map((sample, idx) => {
            const isSelected = activeSampleIdx === idx;
            return (
              <button
                key={sample.id}
                onClick={() => {
                  setActiveSampleIdx(idx);
                  if (onSelectSample) onSelectSample(sample);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white/[0.08] border-emerald-500/60 shadow-lg"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] text-slate-400"
                }`}
              >
                <img
                  src={sample.image}
                  alt={sample.name}
                  className="w-11 h-11 rounded-xl object-cover border border-white/[0.08]"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate">{sample.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono capitalize">{sample.category}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Sample Live Projection Box */}
        {SAMPLE_ITEMS[activeSampleIdx] && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            <div className="flex items-center gap-3.5">
              <img
                src={SAMPLE_ITEMS[activeSampleIdx].image}
                alt={SAMPLE_ITEMS[activeSampleIdx].name}
                className="w-16 h-16 rounded-2xl object-cover border border-white/[0.08]"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wide">
                  {SAMPLE_ITEMS[activeSampleIdx].category}
                </span>
                <h4 className="text-sm font-bold text-white">
                  {SAMPLE_ITEMS[activeSampleIdx].name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Usage: {SAMPLE_ITEMS[activeSampleIdx].default_quantity} {SAMPLE_ITEMS[activeSampleIdx].default_unit}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-black/50 rounded-xl border border-white/[0.06]">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Emission Factor</span>
                <span className="text-xs font-mono font-semibold text-white mt-0.5">
                  {SAMPLE_ITEMS[activeSampleIdx].default_factor} kg/{SAMPLE_ITEMS[activeSampleIdx].default_unit}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-mono">CO2 Output</span>
                <span className="text-sm font-mono font-bold text-amber-400 mt-0.5">
                  {(SAMPLE_ITEMS[activeSampleIdx].default_quantity * SAMPLE_ITEMS[activeSampleIdx].default_factor).toFixed(1)} kg CO2
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Tree Offset:</span>
                <span className="text-emerald-400 font-bold">
                  {Math.ceil((SAMPLE_ITEMS[activeSampleIdx].default_quantity * SAMPLE_ITEMS[activeSampleIdx].default_factor) / 20)} Tree(s) / Year
                </span>
              </div>
              <button
                onClick={() => {
                  if (onSelectSample) onSelectSample(SAMPLE_ITEMS[activeSampleIdx]);
                  onNavigateToDashboard();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                <span>Audit This in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ---------------- 5. GLOBAL CLIMATE PLEDGE & CITIZEN ACTION ---------------- */}
      <section className="bg-gradient-to-r from-emerald-950/30 via-slate-950 to-black border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="max-w-3xl flex flex-col gap-3.5 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <HeartHandshake className="w-4 h-4" />
            <span>UN SDG 13 GLOBAL CLIMATE PLEDGE</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            Commit to Lowering Your Planetary Footprint by 20%
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            By signing the EcoPulse Climate Pledge, you agree to audit everyday carbon emissions, 
            choose renewable alternatives, and support community tree planting programs. Join 
            thousands of climate advocates worldwide.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              onClick={handleSignPledge}
              disabled={pledgeSigned}
              className={`px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all cursor-pointer ${
                pledgeSigned
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                  : "bg-white hover:bg-slate-100 text-black shadow-lg shadow-white/10"
              }`}
            >
              {pledgeSigned ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Pledge Signed!</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Sign the SDG 13 Pledge</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="text-emerald-400 font-bold text-sm">
                {pledgeCount.toLocaleString()}
              </span>
              <span>Advocates Pledged Worldwide</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
