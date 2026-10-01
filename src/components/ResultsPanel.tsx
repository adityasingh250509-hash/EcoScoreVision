import React, { useState, useEffect } from "react";
import { 
  Leaf, 
  Info, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingDown, 
  Award,
  Activity,
  Calendar,
  Volume2,
  VolumeX
} from "lucide-react";
import { motion } from "motion/react";
import { CalculationResult } from "../types";

interface ResultsPanelProps {
  result: CalculationResult | null;
  itemName: string;
  quantity: number;
  unit: string;
  factorLabel: string;
}

export default function ResultsPanel({
  result,
  itemName,
  quantity,
  unit,
  factorLabel,
}: ResultsPanelProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [result]);

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0b0f19] border border-white/[0.08] rounded-2xl text-center text-slate-400 border-dashed min-h-[420px]">
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          <Leaf className="w-12 h-12 text-emerald-400/40 mb-3" />
        </motion.div>
        <h4 className="text-sm font-semibold text-white">No Carbon Calculations Yet</h4>
        <p className="text-xs max-w-xs mt-1 text-slate-400">
          Upload a photo or select an instant test sample to automatically compile carbon scores, ecological graphs, and mitigation forecasts.
        </p>
      </div>
    );
  }

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      
      const cleanAdvice = result?.advice || [];
      if (cleanAdvice.length === 0) return;

      const textToSpeak = `Here is your tailored AI mitigation advice. ${cleanAdvice.map((tip, idx) => `Tip ${idx + 1}: ${tip}`).join(". ")}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Dynamic EcoScore (0-100)
  const calculateEcoScore = (emissions: number) => {
    if (emissions <= 1) return { score: 98, grade: "A+", desc: "Exemplary Green Footprint", color: "#10b981" };
    if (emissions <= 3) return { score: 92, grade: "A", desc: "Highly Sustainable", color: "#10b981" };
    if (emissions <= 5) return { score: 86, grade: "B+", desc: "Very Good Efficiency", color: "#34d399" };
    if (emissions <= 8) return { score: 78, grade: "B", desc: "Standard Footprint", color: "#f59e0b" };
    if (emissions <= 12) return { score: 65, grade: "C+", desc: "Moderate Consumption", color: "#f97316" };
    if (emissions <= 15) return { score: 54, grade: "C", desc: "Elevated Output", color: "#f97316" };
    if (emissions <= 25) return { score: 38, grade: "D", desc: "Heavy Carbon Load", color: "#ef4444" };
    return { score: 18, grade: "F", desc: "Severe Climate Strain", color: "#ef4444" };
  };

  const scoreData = calculateEcoScore(result.emissions);

  // Status configuration
  const statusConfig = {
    low: {
      title: "Low Impact",
      bgClass: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400",
      indicatorClass: "bg-emerald-500",
      description: "This item has a minimal carbon footprint. Excellent job maintaining a low-emissions impact!",
      icon: ShieldCheck,
    },
    moderate: {
      title: "Moderate Footprint",
      bgClass: "bg-amber-500/10 border-amber-500/25 text-amber-400",
      indicatorClass: "bg-amber-500",
      description: "This item falls within average carbon parameters. Active optimizations could lower this further.",
      icon: Info,
    },
    high: {
      title: "High Impact",
      bgClass: "bg-rose-500/10 border-rose-500/25 text-rose-400",
      indicatorClass: "bg-rose-500",
      description: "Significant climate impact! Mitigation actions and immediate offsetting are strongly recommended.",
      icon: AlertTriangle,
    },
  }[result.status];

  const StatusIcon = statusConfig.icon;

  // Comparison thresholds
  const targetThreshold = 4.0;
  const categoryAverage = result.status === "low" ? 2.5 : result.status === "moderate" ? 9.5 : 22.0;
  const maxBarValue = Math.max(result.emissions, targetThreshold, categoryAverage) * 1.15;
  
  const getPercentOfMax = (val: number) => {
    return Math.min(100, Math.max(8, (val / maxBarValue) * 100));
  };

  // 12-Month Accumulation Line Graph Points
  const months = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];
  const baselineMonthly = result.emissions * 4.3;
  const optimizedMonthly = baselineMonthly * 0.55;

  const baselineAccumulated = months.map((_, i) => baselineMonthly * (i + 1));
  const optimizedAccumulated = months.map((_, i) => optimizedMonthly * (i + 1));
  const maxAccumulated = Math.max(baselineAccumulated[11], 0.001);

  const animationKey = `${itemName}-${result.emissions}-${quantity}`;

  return (
    <motion.div
      key={animationKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-5 p-5 bg-[#0b0f19] border border-white/[0.08] rounded-2xl text-[#f1f5f9] shadow-xl"
    >
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Automated Impact Analysis
          </span>
          <h3 className="text-base font-bold leading-none mt-1 text-white">Footprint Results</h3>
        </div>
        <div className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 ${statusConfig.bgClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.indicatorClass}`} />
          {statusConfig.title}
        </div>
      </div>

      {/* Main Stats Row + Circular Score Ring */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Emission Output Card */}
        <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
            Total Emissions
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
              {result.emissions.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-mono">kg CO2</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            From {quantity} {unit} via auto-detected standard factors.
          </p>
        </div>

        {/* Tree Offset Card */}
        <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
            Yearly Tree Offset
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums tracking-tight">
              {result.treeOffset}
            </span>
            <span className="text-xs text-slate-400">
              {result.treeOffset === 1 ? "Tree" : "Trees"}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Requires {result.treeOffset} trees absorbing 20kg CO2/year.
          </p>
        </div>

        {/* Circular Eco-Score Gauge Card */}
        <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-between gap-2.5">
          <div className="flex flex-col justify-between h-full">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              Eco Score
            </span>
            <div className="mt-1.5">
              <span className="text-xl font-bold font-mono" style={{ color: scoreData.color }}>
                {scoreData.grade}
              </span>
              <p className="text-[10px] text-slate-300 font-medium mt-0.5">{scoreData.desc}</p>
            </div>
            <span className="text-[9px] font-mono text-slate-500">Scale of 100</span>
          </div>

          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                className="stroke-white/[0.08]"
                strokeWidth="4"
                fill="transparent"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="22"
                stroke={scoreData.color}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 22}
                initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 22 - (scoreData.score / 100) * (2 * Math.PI * 22) }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold font-mono tabular-nums" style={{ color: scoreData.color }}>
                {scoreData.score}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GRAPH 1: Emissions Comparison Index (Horizontal Bar Chart) */}
      <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] text-slate-300 font-bold uppercase font-mono tracking-wider">
            Relative Footprint Index
          </span>
        </div>

        <div className="flex flex-col gap-3.5 mt-1.5">
          {/* Target Green Budget */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>UN Target Sustainable Threshold</span>
              <span className="font-mono text-emerald-400 font-semibold">{targetThreshold.toFixed(1)} kg</span>
            </div>
            <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.05]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getPercentOfMax(targetThreshold)}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-emerald-400 rounded-full"
              />
            </div>
          </div>

          {/* This Item Emissions */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-200 mb-1">
              <span className="flex items-center gap-1.5 text-slate-200">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: scoreData.color }} />
                Detected: {itemName || "This item"}
              </span>
              <span className="font-mono" style={{ color: scoreData.color }}>
                {result.emissions.toFixed(2)} kg
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.05] p-[1px]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getPercentOfMax(result.emissions)}%` }}
                transition={{ duration: 1.0, delay: 0.2 }}
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: scoreData.color,
                }}
              />
            </div>
          </div>

          {/* Category Average */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Category Average ({factorLabel})</span>
              <span className="font-mono text-slate-300">{categoryAverage.toFixed(1)} kg</span>
            </div>
            <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.05]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getPercentOfMax(categoryAverage)}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-slate-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* GRAPH 2: 12-Month Cumulative Carbon Area Forecast */}
      <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] text-slate-300 font-bold uppercase font-mono tracking-wider">
              12-Month Accumulation Forecast
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-0.5 bg-rose-400" /> Standard Path
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-0.5 bg-emerald-400" /> Optimized
            </span>
          </div>
        </div>

        {/* Render fully customized interactive line/area chart inside SVG */}
        <div className="h-44 w-full relative mt-1.5 bg-[#070a11] border border-white/[0.06] rounded-lg p-2 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 130" preserveAspectRatio="none">
            {/* Horizontal Gridlines */}
            <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Area gradients */}
            <defs>
              <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="optimizedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area Path: Baseline Accumulation */}
            <path
              d={`M 0 120 ${months.map((_, i) => {
                const x = (i / 11) * 400;
                const y = 120 - (baselineAccumulated[i] / maxAccumulated) * 100;
                return `L ${x} ${y}`;
              }).join(" ")} L 400 120 Z`}
              fill="url(#baselineGrad)"
            />

            {/* Area Path: Optimized Accumulation */}
            <path
              d={`M 0 120 ${months.map((_, i) => {
                const x = (i / 11) * 400;
                const y = 120 - (optimizedAccumulated[i] / maxAccumulated) * 100;
                return `L ${x} ${y}`;
              }).join(" ")} L 400 120 Z`}
              fill="url(#optimizedGrad)"
            />

            {/* Line Path: Baseline */}
            <motion.path
              d={months.map((_, i) => {
                const x = (i / 11) * 400;
                const y = 120 - (baselineAccumulated[i] / maxAccumulated) * 100;
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
              }).join(" ")}
              fill="transparent"
              stroke="#f43f5e"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2 }}
            />

            {/* Line Path: Optimized */}
            <motion.path
              d={months.map((_, i) => {
                const x = (i / 11) * 400;
                const y = 120 - (optimizedAccumulated[i] / maxAccumulated) * 100;
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
              }).join(" ")}
              fill="transparent"
              stroke="#10b981"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.1 }}
            />

            {/* Anchor point markers */}
            {months.map((_, i) => {
              if (i === 11 || i === 0 || i === 5) {
                const x = (i / 11) * 400;
                const by = 120 - (baselineAccumulated[i] / maxAccumulated) * 100;
                const oy = 120 - (optimizedAccumulated[i] / maxAccumulated) * 100;
                return (
                  <g key={i}>
                    <circle cx={x} cy={by} r="3" fill="#f43f5e" />
                    <circle cx={x} cy={oy} r="3" fill="#10b981" />
                  </g>
                );
              }
              return null;
            })}
          </svg>

          {/* Floating labels inside the chart */}
          <div className="absolute top-2 left-3 bg-[#0b0f19]/90 backdrop-blur-md border border-white/[0.08] rounded-md px-2 py-0.5 text-[9px] text-slate-300 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Savings: <strong className="text-emerald-400 font-mono">-{((1 - optimizedMonthly/baselineMonthly)*100).toFixed(0)}%</strong></span>
          </div>

          <div className="absolute bottom-2 right-3 bg-[#0b0f19]/90 backdrop-blur-md border border-white/[0.08] rounded-md px-2 py-0.5 text-[9px] text-slate-400 flex flex-col font-mono text-right leading-tight">
            <span>BAU: <strong className="text-rose-400 font-bold">{maxAccumulated.toFixed(0)} kg</strong></span>
            <span>Optimized: <strong className="text-emerald-400 font-bold">{optimizedAccumulated[11].toFixed(0)} kg</strong></span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono px-1">
          <span>Month 1</span>
          <span>Month 6</span>
          <span>Month 12 Forecast (Total Annual Offset Difference)</span>
        </div>
      </div>

      {/* Detailed Meta Statement */}
      <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.06] text-xs text-slate-400 leading-normal flex items-start gap-2.5">
        <StatusIcon className="w-4 h-4 mt-0.5 text-slate-300 shrink-0" />
        <div>
          <p className="font-semibold text-slate-200 mb-0.5">{statusConfig.title} Context</p>
          <p className="text-[11px] text-slate-400">
            {statusConfig.description} Implementing the custom AI tips below could improve your Eco Score from <strong className="text-white">{scoreData.grade}</strong> to <strong className="text-emerald-400">A+</strong>.
          </p>
        </div>
      </div>

      {/* Forest Sequestration Visual */}
      <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Offset Forest Canopy</span>
          <span className="text-[11px] text-emerald-400 font-semibold font-mono">
            {result.treeOffset} Sequestration Targets
          </span>
        </div>
        
        {/* Animated Trees Grid */}
        <div className="flex flex-wrap gap-2.5 p-3.5 bg-[#070a11] border border-white/[0.06] rounded-lg min-h-[50px] items-center justify-center">
          {result.treeOffset === 0 ? (
            <span className="text-xs text-slate-500 italic">No offset targets needed. Keep up the high efficiency!</span>
          ) : (
            Array.from({ length: Math.min(result.treeOffset, 30) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.3, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.03, type: "spring", stiffness: 100 }}
                className="text-emerald-400"
                title={`Tree ${i + 1} offsets 20kg CO2/year`}
              >
                <Leaf className="w-5 h-5 fill-emerald-500/20 hover:scale-125 transition-transform cursor-pointer" />
              </motion.div>
            ))
          )}
          {result.treeOffset > 30 && (
            <span className="text-xs font-mono font-bold text-slate-500 pl-1">
              +{result.treeOffset - 30} more trees
            </span>
          )}
        </div>
      </div>

      {/* AI Mitigation Advice Bullet Points */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase font-mono text-slate-400 tracking-wider">
              Tailored AI Mitigation Advice
            </h4>
          </div>
          {typeof window !== "undefined" && window.speechSynthesis && (
            <button
              onClick={toggleSpeech}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md border transition-all cursor-pointer ${
                isSpeaking 
                  ? "bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/20" 
                  : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20"
              }`}
              title={isSpeaking ? "Stop Reading" : "Read Aloud"}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                  <span>Stop Reading</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Read Aloud</span>
                </>
              )}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {result.advice.map((bullet, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-2.5 p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs leading-normal"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold font-mono text-[10px]">
                {idx + 1}
              </div>
              <p className="text-slate-300">{bullet}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
