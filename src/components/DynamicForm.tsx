import React, { useState, useEffect } from "react";
import { Zap, Car, Wind, RefreshCw, Trash2, Sliders, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { DetectedItem, CategoryType, UnitType } from "../types";

interface DynamicFormProps {
  detectedItem: DetectedItem;
  onCalculate: (data: {
    quantity: number;
    factor: number;
    unitName: string;
    factorLabel: string;
  }) => void;
  isCalculating: boolean;
}

export default function DynamicForm({
  detectedItem,
  onCalculate,
  isCalculating,
}: DynamicFormProps) {
  // Determine initial state based on detected item
  const [quantity, setQuantity] = useState<number>(10);
  const [selectedFactorKey, setSelectedFactorKey] = useState<string>("");
  const [customFactor, setCustomFactor] = useState<number>(1.0);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Official Baseline Factors
  const BASELINE_FACTORS: Record<
    CategoryType,
    Array<{ key: string; label: string; value: number; unit: UnitType }>
  > = {
    appliance: [
      { key: "ac", label: "Air Conditioner (Standard)", value: 1.5, unit: "hours" },
      { key: "fridge", label: "Energy-Star Refrigerator", value: 0.15, unit: "hours" },
      { key: "heater", label: "Space Heater", value: 1.2, unit: "hours" },
    ],
    transport: [
      { key: "petrol", label: "Petrol Passenger Car", value: 0.12, unit: "km" },
      { key: "diesel", label: "Diesel Passenger Car", value: 0.14, unit: "km" },
      { key: "hybrid", label: "Hybrid/Electric Vehicle", value: 0.04, unit: "km" },
    ],
    energy: [
      { key: "grid", label: "National Grid Electricity", value: 0.82, unit: "kWh" },
      { key: "solar_offset", label: "Solar Micro-Generation", value: 0.05, unit: "kWh" },
    ],
    waste: [
      { key: "landfill", label: "Mixed Landfill Waste", value: 0.45, unit: "hours" },
      { key: "recycled", label: "Recyclable / Compost", value: 0.08, unit: "hours" },
    ],
  };

  const getCategoryOptions = () => {
    const baseOptions = BASELINE_FACTORS[detectedItem.category] || [];
    if (detectedItem.estimated_factor !== undefined && detectedItem.factor_label !== undefined) {
      const aiOption = {
        key: "ai_estimate",
        label: `AI Suggested (${detectedItem.factor_label})`,
        value: detectedItem.estimated_factor,
        unit: detectedItem.default_unit
      };
      return [aiOption, ...baseOptions];
    }
    return baseOptions;
  };

  // Reset/Adjust selections when detected item changes
  useEffect(() => {
    if (detectedItem.estimated_quantity !== undefined) {
      setQuantity(detectedItem.estimated_quantity);
    } else {
      if (detectedItem.default_unit === "km") {
        setQuantity(50);
      } else if (detectedItem.default_unit === "kWh") {
        setQuantity(30);
      } else {
        setQuantity(8);
      }
    }

    if (detectedItem.estimated_factor !== undefined) {
      setSelectedFactorKey("ai_estimate");
      setCustomFactor(detectedItem.estimated_factor);
    } else {
      const options = getCategoryOptions();
      let matchedOption = options[0];
      const nameLower = detectedItem.item_name.toLowerCase();
      
      if (nameLower.includes("ac") || nameLower.includes("conditioner")) {
        matchedOption = options.find(o => o.key === "ac") || options[0];
      } else if (nameLower.includes("petrol") || nameLower.includes("gasoline")) {
        matchedOption = options.find(o => o.key === "petrol") || options[0];
      } else if (nameLower.includes("diesel")) {
        matchedOption = options.find(o => o.key === "diesel") || options[0];
      } else if (nameLower.includes("grid") || nameLower.includes("electricity") || nameLower.includes("power")) {
        matchedOption = options.find(o => o.key === "grid") || options[0];
      }

      if (matchedOption) {
        setSelectedFactorKey(matchedOption.key);
        setCustomFactor(matchedOption.value);
      } else {
        setSelectedFactorKey("custom");
        setCustomFactor(1.0);
      }
    }
    
    setIsCustom(false);
  }, [detectedItem]);

  const activeOption = getCategoryOptions().find((o) => o.key === selectedFactorKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const factorValue = isCustom ? customFactor : (activeOption?.value ?? 1.0);
    const label = isCustom 
      ? "Custom Emissions Metric" 
      : (activeOption?.label ?? `${detectedItem.item_name} standard`);

    onCalculate({
      quantity,
      factor: factorValue,
      unitName: detectedItem.default_unit,
      factorLabel: label,
    });
  };

  const unitLabels: Record<UnitType, { heading: string; placeholder: string; helper: string }> = {
    hours: {
      heading: "Hours used",
      placeholder: "e.g. 8",
      helper: "Enter total hours of operational usage per cycle/day."
    },
    km: {
      heading: "Kilometers traveled",
      placeholder: "e.g. 50",
      helper: "Enter total physical distance traveled in kilometers."
    },
    kWh: {
      heading: "Units consumed (kWh)",
      placeholder: "e.g. 30",
      helper: "Enter total energy consumption in kilowatt-hours."
    },
  };

  const activeUnitConfig = unitLabels[detectedItem.default_unit] || unitLabels.hours;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-[#0b0f19] border border-white/[0.08] rounded-2xl flex flex-col gap-4 text-[#f1f5f9] shadow-xl"
    >
      <div className="flex items-start gap-3 border-b border-white/[0.06] pb-3 mb-1">
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 mt-1 shrink-0">
          {detectedItem.category === "appliance" && <Wind className="w-5 h-5" />}
          {detectedItem.category === "transport" && <Car className="w-5 h-5" />}
          {detectedItem.category === "energy" && <Zap className="w-5 h-5" />}
          {detectedItem.category === "waste" && <Trash2 className="w-5 h-5" />}
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">
            Detected Hardware / Entity
          </span>
          <h3 className="text-base font-bold leading-tight text-white">{detectedItem.item_name}</h3>
          <p className="text-xs text-slate-400 capitalize mt-0.5 font-mono">
            Category: {detectedItem.category} &bull; Unit: {detectedItem.default_unit}
          </p>
        </div>
      </div>

      {/* Emission Factor Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>Carbon Emission Profile</span>
          <button
            type="button"
            onClick={() => setIsCustom(!isCustom)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono cursor-pointer transition-colors"
          >
            <Sliders className="w-3 h-3" /> {isCustom ? "Use Baseline" : "Customize"}
          </button>
        </label>

        {isCustom ? (
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.001"
                min="0"
                value={customFactor}
                onChange={(e) => setCustomFactor(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-[#070a11] border border-white/[0.1] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <span className="absolute right-3.5 top-3 text-xs text-slate-400 font-mono">
                kg CO2 / {detectedItem.default_unit}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {getCategoryOptions().map((opt) => (
              <label
                key={opt.key}
                onClick={() => {
                  setSelectedFactorKey(opt.key);
                  setCustomFactor(opt.value);
                }}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedFactorKey === opt.key
                    ? "border-emerald-500/60 bg-emerald-500/10 text-white shadow-sm"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    selectedFactorKey === opt.key ? "border-emerald-400" : "border-slate-600"
                  }`}>
                    {selectedFactorKey === opt.key && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </div>
                  <span className="text-xs font-medium text-slate-200">{opt.label}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {opt.value} <span className="text-[10px] text-slate-500 font-normal">kg/unit</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Usage Quantity Field */}
      <div className="flex flex-col gap-1.5 mt-1">
        <label className="text-xs font-semibold text-slate-300">
          {activeUnitConfig.heading}
        </label>
        <div className="relative">
          <input
            type="number"
            min="0.1"
            step="0.1"
            required
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 bg-[#070a11] border border-white/[0.1] rounded-xl text-sm text-white font-mono font-semibold focus:outline-none focus:border-emerald-500"
            placeholder={activeUnitConfig.placeholder}
          />
          <span className="absolute right-3.5 top-3 text-xs text-slate-400 font-mono capitalize">
            {detectedItem.default_unit}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 leading-normal">{activeUnitConfig.helper}</p>
      </div>

      {/* Compute Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={isCalculating || quantity <= 0}
        className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-black rounded-xl text-xs font-bold uppercase font-mono tracking-wider shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        {isCalculating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Calculating Carbon Impact...
          </>
        ) : (
          <>
            Calculate Footprint
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </form>
  );
}
