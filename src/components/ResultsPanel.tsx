import React from "react";
import { Leaf, Info, AlertTriangle, ShieldCheck, HelpCircle, ArrowDown } from "lucide-react";
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
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#161b22] border border-[#30363d] rounded-xl text-center text-gray-400 border-dashed">
        <Leaf className="w-12 h-12 text-[#2ea44f] opacity-25 mb-3" />
        <h4 className="text-sm font-semibold text-gray-300">No Carbon Calculations Yet</h4>
        <p className="text-xs max-w-xs mt-1 text-gray-500">
          Upload or capture an item's photo on the left, then trigger the calculation engine to receive detailed impact analytics.
        </p>
      </div>
    );
  }

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-5 p-5 bg-[#161b22] border border-[#30363d] rounded-xl text-[#f0f6fc] shadow-lg"
    >
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#30363d] pb-3.5">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
            Calculated Analytics
          </span>
          <h3 className="text-base font-semibold leading-none mt-1">Footprint Results</h3>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${statusConfig.bgClass}`}>
          <span className={`w-2 h-2 rounded-full ${statusConfig.indicatorClass}`} />
          {statusConfig.title}
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Emission Output Card */}
        <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Total Emissions
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#f0f6fc] font-mono tracking-tight">
              {result.emissions.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 font-medium font-sans">kg CO2</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 line-clamp-1">
            Calculated from {quantity} {unit}
          </p>
        </div>

        {/* Tree Offset Card */}
        <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Yearly Tree Offset
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#2ea44f] font-mono tracking-tight">
              {result.treeOffset}
            </span>
            <span className="text-sm text-gray-400 font-medium font-sans">
              {result.treeOffset === 1 ? "Tree" : "Trees"}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mt-2 line-clamp-1">
            Sustained for 1 full year
          </p>
        </div>
      </div>

      {/* Detailed Meta Statement */}
      <div className="p-3.5 bg-[#0d1117]/50 rounded-lg border border-[#30363d]/50 text-xs text-gray-400 leading-normal flex items-start gap-2.5">
        <StatusIcon className="w-4 h-4 mt-0.5 text-gray-300 shrink-0" />
        <div>
          <p className="font-semibold text-gray-300 mb-0.5">{statusConfig.title} Context</p>
          <p className="text-[11px] text-gray-400">{statusConfig.description}</p>
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
        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
          Tailored AI Mitigation Advice
        </h4>
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
