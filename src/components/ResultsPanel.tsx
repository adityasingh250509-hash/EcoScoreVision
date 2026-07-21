import React from "react";
import { 
  Leaf, 
  Info, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  TrendingDown, 
  TrendingUp,
  Award,
  Activity,
  Calendar
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
  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#161b22] border border-[#30363d] rounded-xl text-center text-gray-400 border-dashed min-h-[400px]">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Leaf className="w-14 h-14 text-[#2ea44f] opacity-25 mb-3" />
        </motion.div>
        <h4 className="text-sm font-semibold text-gray-300">No Carbon Calculations Yet</h4>
        <p className="text-xs max-w-xs mt-1 text-gray-500">
          Upload a picture or select an instant test sample to automatically compile detailed carbon scores, ecological graphs, and mitigation forecasts!
        </p>
      </div>
    );
  }

  // Calculate dynamic EcoScore (0-100) based on emissions
  // Lower emissions = higher score
  // Low: < 5 kg (score 85 - 100)
  // Moderate: 5 - 15 kg (score 50 - 84)
  // High: > 15 kg (score 10 - 49)
  const calculateEcoScore = (emissions: number) => {
    if (emissions <= 1) return { score: 98, grade: "A+", desc: "Exemplary Green Footprint", color: "#2ea44f" };
    if (emissions <= 3) return { score: 92, grade: "A", desc: "Highly Sustainable", color: "#2ea44f" };
    if (emissions <= 5) return { score: 86, grade: "B+", desc: "Very Good Efficiency", color: "#85ea2e" };
    if (emissions <= 8) return { score: 78, grade: "B", desc: "Standard Footprint", color: "#e2b13c" };
    if (emissions <= 12) return { score: 65, grade: "C+", desc: "Moderate Consumption", color: "#e29c3c" };
    if (emissions <= 15) return { score: 54, grade: "C", desc: "Elevated Output", color: "#e2793c" };
    if (emissions <= 25) return { score: 38, grade: "D", desc: "Heavy Carbon Load", color: "#e24c3c" };
    return { score: 18, grade: "F", desc: "Severe Climate Strain", color: "#f85149" };
  };

  const scoreData = calculateEcoScore(result.emissions);
  
  // Circular gauge definitions
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreData.score / 100) * circumference;

  // Define colors and styles based on impact level
  const statusConfig = {
    low: {
      title: "Low Impact",
      bgClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      indicatorClass: "bg-emerald-500",
      description: "This item has a minimal carbon footprint. Excellent job maintaining a low-emissions impact!",
      icon: ShieldCheck,
    },
    moderate: {
      title: "Moderate Footprint",
      bgClass: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      indicatorClass: "bg-amber-500",
      description: "This item falls within average carbon parameters. Active optimizations could lower this further.",
      icon: Info,
    },
    high: {
      title: "High Impact",
      bgClass: "bg-red-500/10 border-red-500/30 text-red-400",
      indicatorClass: "bg-red-500",
      description: "Significant climate impact! Mitigation actions and immediate offsetting are strongly recommended.",
      icon: AlertTriangle,
    },
  }[result.status];

  const StatusIcon = statusConfig.icon;

  // Horizontal Comparison index calculations
  // Let's compare with a target standard threshold of 4.0 kg (daily eco budget)
  const targetThreshold = 4.0;
  const categoryAverage = result.status === "low" ? 2.5 : result.status === "moderate" ? 9.5 : 22.0;
  const maxBarValue = Math.max(result.emissions, targetThreshold, categoryAverage) * 1.15;
  
  const getPercentOfMax = (val: number) => {
    return Math.min(100, Math.max(8, (val / maxBarValue) * 100));
  };

  // 12-Month Accumulation Line Graph Points (business-as-usual vs. optimized path with AI tips)
  const months = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];
  const baselineMonthly = result.emissions * 4.3; // assuming 4.3 instances per month
  const optimizedMonthly = baselineMonthly * 0.55; // 45% carbon reduction through suggestions

  const baselineAccumulated = months.map((_, i) => baselineMonthly * (i + 1));
  const optimizedAccumulated = months.map((_, i) => optimizedMonthly * (i + 1));
  const maxAccumulated = baselineAccumulated[11];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 p-5 bg-[#161b22] border border-[#30363d] rounded-xl text-[#f0f6fc] shadow-lg"
    >
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-3.5">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Automated Impact Analysis
          </span>
          <h3 className="text-base font-bold leading-none mt-1">Footprint Results</h3>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${statusConfig.bgClass}`}>
          <span className={`w-2 h-2 rounded-full ${statusConfig.indicatorClass}`} />
          {statusConfig.title}
        </div>
      </div>

      {/* Main Stats Row + Circular Score Ring */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Emission Output Card */}
        <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Total Emissions
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#f0f6fc] font-mono tracking-tight">
              {result.emissions.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400 font-medium font-sans">kg CO2</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 line-clamp-2">
            Calculated from {quantity} {unit} via auto-detected standard coefficients.
          </p>
        </div>

        {/* Tree Offset Card */}
        <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Yearly Tree Offset
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#2ea44f] font-mono tracking-tight">
              {result.treeOffset}
            </span>
            <span className="text-xs text-gray-400 font-medium font-sans">
              {result.treeOffset === 1 ? "Tree" : "Trees"}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 line-clamp-2">
            Requires {result.treeOffset} trees absorbing 20kg of carbon annually for 1 year.
          </p>
        </div>

        {/* Circular Eco-Score Gauge Card */}
        <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center justify-between gap-2.5">
          <div className="flex flex-col justify-between h-full">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Eco Score
            </span>
            <div className="mt-2">
              <span className="text-xl font-extrabold" style={{ color: scoreData.color }}>
                {scoreData.grade}
              </span>
              <p className="text-[10px] text-gray-300 font-semibold mt-1">{scoreData.desc}</p>
            </div>
            <span className="text-[9px] text-gray-500">Scale of 100</span>
          </div>

          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-gray-800"
                strokeWidth="4.5"
                fill="transparent"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="26"
                stroke={scoreData.color}
                strokeWidth="4.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 26}
                initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 26 - (scoreData.score / 100) * (2 * Math.PI * 26) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-black font-mono tracking-tighter" style={{ color: scoreData.color }}>
                {scoreData.score}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GRAPH 1: Emissions Comparison Index (Horizontal Bar Chart) */}
      <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <span className="text-[11px] text-gray-300 font-bold uppercase tracking-wider">
            Relative Footprint Index
          </span>
        </div>

        <div className="flex flex-col gap-3.5 mt-1.5">
          {/* Target Green Budget */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
              <span>UN Target Sustainable Threshold</span>
              <span className="font-mono text-[#2ea44f] font-semibold">{targetThreshold.toFixed(1)} kg</span>
            </div>
            <div className="w-full h-2.5 bg-[#161b22] rounded-full overflow-hidden border border-[#30363d]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getPercentOfMax(targetThreshold)}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              />
            </div>
          </div>

          {/* This Item Emissions */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-200 mb-1">
              <span className="flex items-center gap-1.5 text-gray-100">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: scoreData.color }} />
                Detected: {itemName || "This item"}
              </span>
              <span className="font-mono text-gray-100" style={{ color: scoreData.color }}>
                {result.emissions.toFixed(2)} kg
              </span>
            </div>
            <div className="w-full h-3.5 bg-[#161b22] rounded-full overflow-hidden border border-[#30363d] p-[2px]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getPercentOfMax(result.emissions)}%` }}
                transition={{ duration: 1.0, delay: 0.2 }}
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: scoreData.color,
                  boxShadow: `0 0 10px ${scoreData.color}50`
                }}
              />
            </div>
          </div>

          {/* Category Average */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
              <span>Category Average ({factorLabel})</span>
              <span className="font-mono text-gray-300">{categoryAverage.toFixed(1)} kg</span>
            </div>
            <div className="w-full h-2.5 bg-[#161b22] rounded-full overflow-hidden border border-[#30363d]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${getPercentOfMax(categoryAverage)}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-gray-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* GRAPH 2: 12-Month Cumulative Carbon Area Forecast */}
      <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] text-gray-300 font-bold uppercase tracking-wider">
              12-Month Accumulation Forecast
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-gray-400">
              <span className="w-2 h-0.5 bg-red-400" /> Standard Path
            </span>
            <span className="flex items-center gap-1 text-[#2ea44f]">
              <span className="w-2 h-0.5 bg-[#2ea44f]" /> Optimized
            </span>
          </div>
        </div>

        {/* Render fully customized interactive line/area chart inside SVG */}
        <div className="h-44 w-full relative mt-1.5 bg-[#161b22]/30 border border-[#30363d]/50 rounded-lg p-2 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 130" preserveAspectRatio="none">
            {/* Horizontal Gridlines */}
            <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(48,54,61,0.3)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(48,54,61,0.3)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(48,54,61,0.3)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Area gradients */}
            <defs>
              <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f85149" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f85149" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="optimizedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2ea44f" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#2ea44f" stopOpacity="0" />
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
              stroke="#f85149"
              strokeWidth="2.5"
              strokeOpacity="0.8"
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
              stroke="#2ea44f"
              strokeWidth="2.5"
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
                    <circle cx={x} cy={by} r="3" fill="#f85149" />
                    <circle cx={x} cy={oy} r="3" fill="#2ea44f" />
                  </g>
                );
              }
              return null;
            })}
          </svg>

          {/* Floating labels inside the chart */}
          <div className="absolute top-2 left-3 bg-[#0d1117]/80 backdrop-blur-sm border border-[#30363d] rounded-md px-2 py-0.5 text-[9px] text-gray-400 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-[#2ea44f]" />
            <span>AI Savings: <strong className="text-emerald-400 font-mono">-{((1 - optimizedMonthly/baselineMonthly)*100).toFixed(0)}%</strong></span>
          </div>

          <div className="absolute bottom-2 right-3 bg-[#0d1117]/80 backdrop-blur-sm border border-[#30363d] rounded-md px-2 py-0.5 text-[9px] text-gray-400 flex flex-col font-mono text-right leading-tight">
            <span>BAU: <strong className="text-red-400 font-bold">{maxAccumulated.toFixed(0)} kg</strong></span>
            <span>Optimized: <strong className="text-emerald-400 font-bold">{optimizedAccumulated[11].toFixed(0)} kg</strong></span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] text-gray-500 font-mono px-1">
          <span>Month 1</span>
          <span>Month 6</span>
          <span>Month 12 Forecast (Total Annual Offset Difference)</span>
        </div>
      </div>

      {/* Detailed Meta Statement */}
      <div className="p-3.5 bg-[#0d1117]/50 rounded-lg border border-[#30363d]/50 text-xs text-gray-400 leading-normal flex items-start gap-2.5">
        <StatusIcon className="w-4 h-4 mt-0.5 text-gray-300 shrink-0 animate-pulse" />
        <div>
          <p className="font-semibold text-gray-300 mb-0.5">{statusConfig.title} Context</p>
          <p className="text-[11px] text-gray-400">
            {statusConfig.description} Implementing the custom AI tips below could improve your Eco Score from <strong className="text-[#f0f6fc]">{scoreData.grade}</strong> to <strong className="text-emerald-400">A+</strong>.
          </p>
        </div>
      </div>

      {/* Forest Sequestration Visual */}
      <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-300">Offset Forest Canopy</span>
          <span className="text-[11px] text-[#2ea44f] font-semibold font-mono">
            {result.treeOffset} Sequestration Targets
          </span>
        </div>
        
        {/* Animated Trees Grid */}
        <div className="flex flex-wrap gap-2.5 p-3.5 bg-[#161b22] border border-[#30363d] rounded-lg min-h-[50px] items-center justify-center">
          {result.treeOffset === 0 ? (
            <span className="text-xs text-gray-500 italic">No offset targets needed. Keep up the high efficiency!</span>
          ) : (
            Array.from({ length: Math.min(result.treeOffset, 30) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.3, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.03, type: "spring", stiffness: 100 }}
                className="text-[#2ea44f]"
                title={`Tree ${i + 1} offsets 20kg CO2/year`}
              >
                <Leaf className="w-5 h-5 fill-[#2ea44f]/20 hover:scale-125 transition-transform cursor-pointer" />
              </motion.div>
            ))
          )}
          {result.treeOffset > 30 && (
            <span className="text-xs font-mono font-bold text-gray-500 pl-1">
              +{result.treeOffset - 30} more trees
            </span>
          )}
        </div>
      </div>

      {/* AI Mitigation Advice Bullet Points */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#2ea44f]" />
          <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
            Tailored AI Mitigation Advice
          </h4>
        </div>
        <div className="flex flex-col gap-2">
          {result.advice.map((bullet, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-2.5 p-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs leading-normal"
            >
              <div className="w-5 h-5 rounded-full bg-[#2ea44f]/10 border border-[#2ea44f]/30 flex items-center justify-center text-[#2ea44f] shrink-0 font-bold font-mono text-[10px]">
                {idx + 1}
              </div>
              <p className="text-gray-300">{bullet}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
