import React, { useState, useEffect } from "react";
import { 
  Leaf, 
  ArrowRight, 
  Camera, 
  Zap, 
  Car, 
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
  Compass, 
  ExternalLink,
  Flame,
  HeartHandshake
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
  const [selectedHotspot, setSelectedHotspot] = useState<ClimateHotspot | null>(CLIMATE_HOTSPOTS[0]);
  const [pledgeSigned, setPledgeSigned] = useState<boolean>(() => {
    return localStorage.getItem("ecopulse_pledge_signed") === "true";
  });
  const [pledgeCount, setPledgeCount] = useState<number>(() => {
    const saved = localStorage.getItem("ecopulse_pledge_count");
    return saved ? parseInt(saved, 10) : 48293;
  });

  const [activeSampleIdx, setActiveSampleIdx] = useState<number>(0);

  const handleSignPledge = () => {
    if (!pledgeSigned) {
      setPledgeSigned(true);
      const newCount = pledgeCount + 1;
      setPledgeCount(newCount);
      localStorage.setItem("ecopulse_pledge_signed", "true");
      localStorage.setItem("ecopulse_pledge_count", newCount.toString());

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#2ea44f", "#38bdf8", "#f59e0b", "#10b981"],
      });
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-16 text-[#f0f6fc]">
      {/* ---------------- 1. HERO SECTION WITH 3D EARTH ---------------- */}
      <section className="relative pt-2 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Vision Pitch & Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* UN SDG 13 Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2ea44f]/15 border border-[#2ea44f]/35 text-[#2ea44f] text-xs font-bold uppercase tracking-wider w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>UN SDG 13: CLIMATE ACTION INITIATIVE</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
              AI Vision for <br />
              <span className="bg-gradient-to-r from-[#2ea44f] via-[#38bdf8] to-[#10b981] bg-clip-text text-transparent">
                Planetary Decarbonization
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base text-gray-300 leading-relaxed">
              Transform everyday visual reality into empirical carbon intelligence. Using 
              multimodal <strong className="text-white">Gemini Vision AI</strong>, EcoPulse 
              instantly audits vehicles, appliances, energy grids, and suggests precise botanical 
              tree offsets to combat global climate change.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onNavigateToDashboard}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#2ea44f] to-[#238636] hover:from-[#34c759] hover:to-[#2ea44f] text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-[#2ea44f]/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Launch AI Carbon Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateToHowItWorks}
                className="px-4 py-3 rounded-xl bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-gray-200 hover:text-white font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-[#38bdf8]" />
                <span>How Model Works</span>
              </button>
            </div>

            {/* Micro Stats List */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#30363d]/60">
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-white">0.4s</span>
                <span className="text-[11px] text-gray-400 font-medium">Vision Latency</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-[#2ea44f]">100%</span>
                <span className="text-[11px] text-gray-400 font-medium">GHG Protocol Align</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-[#38bdf8]">20 kg</span>
                <span className="text-[11px] text-gray-400 font-medium">CO2/Tree Sequestration</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Three.js Earth Space Stage */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 h-[460px] sm:h-[520px] w-full"
          >
            <ThreeEarthSpace 
              onSelectHotspot={(hotspot) => setSelectedHotspot(hotspot)}
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* ---------------- 2. REAL-TIME GLOBAL CLIMATE TELEMETRY ---------------- */}
      <section className="bg-[#161b22]/90 border border-[#30363d] rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#30363d]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2ea44f]/15 text-[#2ea44f] border border-[#2ea44f]/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Planetary Climate Telemetry & UN SDG 13 Targets
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ea44f] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2ea44f]"></span>
                </span>
              </h2>
              <p className="text-xs text-gray-400">Continuous observation metrics grounded in IPCC & NOAA data standards</p>
            </div>
          </div>
          <button
            onClick={onNavigateToNews}
            className="text-xs text-[#38bdf8] hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Explore Live SDG 13 News</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          {/* Card 1: CO2 PPM */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">Atmospheric CO2</span>
              <Flame className="w-4 h-4 text-red-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-white">426.8</span>
              <span className="text-xs text-gray-400 ml-1">ppm</span>
            </div>
            <div className="mt-2 text-[11px] text-amber-400 font-medium flex items-center gap-1">
              <span>▲ +2.4 ppm vs 2024</span>
              <span className="text-gray-500">• Baseline 350ppm</span>
            </div>
          </div>

          {/* Card 2: Global Temp Rise */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">Mean Temp Anomaly</span>
              <TrendingDown className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-amber-300">+1.28</span>
              <span className="text-xs text-gray-400 ml-1">°C above pre-industrial</span>
            </div>
            <div className="mt-2 text-[11px] text-gray-400 font-medium">
              <span>Paris 1.5°C threshold limit</span>
            </div>
          </div>

          {/* Card 3: Renewable Share */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">Renewables In Grid</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-cyan-300">31.8%</span>
              <span className="text-xs text-gray-400 ml-1">Global Electricity</span>
            </div>
            <div className="mt-2 text-[11px] text-[#2ea44f] font-medium">
              <span>▲ +14% Year-over-Year growth</span>
            </div>
          </div>

          {/* Card 4: Community Trees Tracked */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">Community Tree Targets</span>
              <TreePine className="w-4 h-4 text-[#2ea44f]" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-[#2ea44f]">148,290+</span>
              <span className="text-xs text-gray-400 ml-1">Trees Planted</span>
            </div>
            <div className="mt-2 text-[11px] text-gray-400 font-medium">
              <span>Sequestering ~2,965 tonnes CO2/yr</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. FOUR PILLARS OF ECOPULSE INTELLIGENCE ---------------- */}
      <section className="flex flex-col gap-6">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="text-xs font-bold text-[#2ea44f] tracking-widest uppercase">System Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Built On Rigorous Environmental Science
          </h2>
          <p className="text-sm text-gray-300">
            How EcoPulse transforms camera inputs into verified decarbonization actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#2ea44f]/60 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Multimodal AI Vision</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Powered by Gemini 3.7 Flash Multimodal Intelligence to classify appliances, vehicles, and fuel types directly from images or real-time webcam streams.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#30363d]/60 text-[11px] font-semibold text-purple-400">
              Zero-Shot Object Recognition
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#2ea44f]/60 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[#2ea44f] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Empirical GHG Engine</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Calculates precise carbon output in kg CO2 using standardized GHG Protocol coefficients for electricity grids, internal combustion, and cooling refrigerants.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#30363d]/60 text-[11px] font-semibold text-[#2ea44f]">
              GHG Scope 1, 2 & 3 Standard
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#2ea44f]/60 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TreePine className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Botanical Tree Offset</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Calculates the exact number of mature trees required to neutralize emitted carbon, assuming an average absorption rate of ~20 kg CO2 per tree per year.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#30363d]/60 text-[11px] font-semibold text-cyan-400">
              Formula: ⌈Emissions / 20⌉
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#2ea44f]/60 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">UN SDG 13 Direct Action</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Empowers citizens and institutions with real-time audit PDF reports, voice read-aloud advice, and measurable carbon budget tracking.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#30363d]/60 text-[11px] font-semibold text-amber-400">
              Target 13.3 Climate Education
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. INTERACTIVE INSTANT SAMPLE SCANNER ---------------- */}
      <section className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2ea44f] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Live Demo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Test Carbon Analysis on Real-World Baselines
            </h2>
          </div>
          <button
            onClick={onNavigateToDashboard}
            className="px-4 py-2 rounded-xl bg-[#2ea44f] hover:bg-[#34c759] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Full Scanner Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sample Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {SAMPLE_ITEMS.map((sample, idx) => {
            const isSelected = activeSampleIdx === idx;
            return (
              <button
                key={sample.id}
                onClick={() => {
                  setActiveSampleIdx(idx);
                  if (onSelectSample) onSelectSample(sample);
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#2ea44f]/20 border-[#2ea44f] shadow-lg shadow-[#2ea44f]/15"
                    : "bg-[#0d1117] border-[#30363d] hover:bg-[#21262d] text-gray-300"
                }`}
              >
                <img
                  src={sample.image}
                  alt={sample.name}
                  className="w-12 h-12 rounded-lg object-cover border border-[#30363d]"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">{sample.name}</span>
                  <span className="text-[11px] text-gray-400 capitalize">{sample.category}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Sample Live Projection Box */}
        {SAMPLE_ITEMS[activeSampleIdx] && (
          <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-4">
              <img
                src={SAMPLE_ITEMS[activeSampleIdx].image}
                alt={SAMPLE_ITEMS[activeSampleIdx].name}
                className="w-20 h-20 rounded-xl object-cover border border-[#30363d] shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#2ea44f] uppercase tracking-wider">
                  {SAMPLE_ITEMS[activeSampleIdx].category}
                </span>
                <h4 className="text-lg font-bold text-white">
                  {SAMPLE_ITEMS[activeSampleIdx].name}
                </h4>
                <p className="text-xs text-gray-400">
                  Standard usage: {SAMPLE_ITEMS[activeSampleIdx].default_quantity} {SAMPLE_ITEMS[activeSampleIdx].default_unit}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-[#161b22] rounded-xl border border-[#30363d]/60">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Emission Factor</span>
                <span className="text-sm font-bold text-white">
                  {SAMPLE_ITEMS[activeSampleIdx].default_factor} kg/{SAMPLE_ITEMS[activeSampleIdx].default_unit}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">CO2 Output</span>
                <span className="text-base font-black text-amber-400">
                  {(SAMPLE_ITEMS[activeSampleIdx].default_quantity * SAMPLE_ITEMS[activeSampleIdx].default_factor).toFixed(1)} kg CO2
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 font-medium">Tree Offset Requirement:</span>
                <span className="text-[#2ea44f] font-bold">
                  {Math.ceil((SAMPLE_ITEMS[activeSampleIdx].default_quantity * SAMPLE_ITEMS[activeSampleIdx].default_factor) / 20)} Tree(s) / Year
                </span>
              </div>
              <button
                onClick={() => {
                  if (onSelectSample) onSelectSample(SAMPLE_ITEMS[activeSampleIdx]);
                  onNavigateToDashboard();
                }}
                className="w-full py-2.5 rounded-lg bg-[#2ea44f]/20 hover:bg-[#2ea44f] text-[#2ea44f] hover:text-white border border-[#2ea44f]/40 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Audit This in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ---------------- 5. GLOBAL CLIMATE PLEDGE & CITIZEN ACTION ---------------- */}
      <section className="bg-gradient-to-r from-[#1b4332] via-[#0d1117] to-[#0b2545] border border-[#2ea44f]/40 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl flex flex-col gap-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2ea44f]/30 border border-[#2ea44f]/60 text-white text-xs font-bold w-fit">
            <HeartHandshake className="w-4 h-4 text-[#2ea44f]" />
            <span>UN SDG 13 Global Climate Pledge</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Commit to Lowering Your Footprint by 20% This Year
          </h2>

          <p className="text-sm text-gray-200 leading-relaxed">
            By signing the EcoPulse Climate Pledge, you agree to audit everyday carbon emissions, 
            choose renewable alternatives, and support community tree planting programs. Join 
            thousands of climate champions worldwide.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleSignPledge}
              disabled={pledgeSigned}
              className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2.5 shadow-lg transition-all cursor-pointer ${
                pledgeSigned
                  ? "bg-[#2ea44f] text-white cursor-default"
                  : "bg-gradient-to-r from-[#2ea44f] to-[#38bdf8] hover:from-[#34c759] hover:to-[#0ea5e9] text-white transform hover:-translate-y-0.5"
              }`}
            >
              {pledgeSigned ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Pledge Signed! Thank You!</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Sign the SDG 13 Pledge</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
              <span className="text-emerald-400 font-extrabold text-base">
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
