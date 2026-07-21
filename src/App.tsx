import React, { useState, useEffect } from "react";
import {
  Leaf,
  Github,
  Camera,
  Upload,
  RefreshCw,
  Globe,
  Info,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { motion } from "motion/react";

import WebcamScanner from "./components/WebcamScanner";
import ImageUploader from "./components/ImageUploader";
import DynamicForm from "./components/DynamicForm";
import ResultsPanel from "./components/ResultsPanel";
import HistoryList from "./components/HistoryList";
import { SAMPLE_ITEMS, SampleItem } from "./constants/samples";
import { DetectedItem, CalculationResult, HistoryItem, CategoryType, UnitType } from "./types";

export default function App() {
  // Input Selection Tab
  const [activeTab, setActiveTab] = useState<"upload" | "webcam">("upload");
  
  // Selected / Captured Image (Base64)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // States for analysis & process
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  // Detected Item State
  const [detectedItem, setDetectedItem] = useState<DetectedItem | null>(null);
  
  // Calculation result State
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  
  // Calculation Inputs for Results component
  const [calcInputs, setCalcInputs] = useState<{
    quantity: number;
    unit: string;
    factorLabel: string;
  } | null>(null);

  // History state loaded from localStorage
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ecopulse_vision_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local carbon history", e);
    }
  }, []);

  // Sync history to localStorage
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("ecopulse_vision_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save local carbon history", e);
    }
  };

  // Calculate Cumulative carbon score
  const cumulativeCarbonScore = history.reduce((sum, item) => sum + item.emissions, 0);

  // Clear overall history
  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all audited carbon records? This will reset your live counter.")) {
      saveHistory([]);
    }
  };

  // Process selected image with backend Gemini Vision endpoint
  const handleProcessImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    setDetectedItem(null);
    setCalculationResult(null);
    setCalcInputs(null);

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selectedImage }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data: DetectedItem = await response.json();
      setDetectedItem(data);

      // Trigger automatic emissions calculation instantly using AI suggested metrics
      const qty = data.estimated_quantity ?? (data.default_unit === "km" ? 50 : data.default_unit === "kWh" ? 30 : 8);
      const factor = data.estimated_factor ?? 1.0;
      const label = data.factor_label ?? "AI Baseline Standard";

      await handleCalculateEmissions({
        quantity: qty,
        factor,
        unitName: data.default_unit,
        factorLabel: label,
      }, data);

    } catch (error: any) {
      console.error("AI Analysis failed:", error);
      setAnalysisError(error.message || "Failed to analyze image. Please try a different photo or select a test sample.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run emissions engine calculation + trigger custom AI advice
  const handleCalculateEmissions = async (formData: {
    quantity: number;
    factor: number;
    unitName: string;
    factorLabel: string;
  }, customItem?: DetectedItem) => {
    const item = customItem || detectedItem;
    if (!item) return;
    
    setIsCalculating(true);
    const { quantity, factor, unitName, factorLabel } = formData;
    
    // Core engine logic: Emissions = Quantity * Factor
    const emissions = quantity * factor;
    // Tree sequestration target (Math.ceil(Emissions / 20))
    const treeOffset = Math.ceil(emissions / 20);
    
    // Assign color status based on standards
    // Green (< 5 kg): "low", Yellow (5-15 kg): "moderate", Red (> 15 kg): "high"
    let status: 'low' | 'moderate' | 'high' = 'low';
    if (emissions > 15) {
      status = 'high';
    } else if (emissions >= 5) {
      status = 'moderate';
    }

    try {
      // Trigger API to get custom advice based on calculations
      const response = await fetch("/api/get-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_name: item.item_name,
          category: item.category,
          quantity,
          unit: unitName,
          emissions,
          tree_offset: treeOffset,
        }),
      });

      let advice: string[] = [];
      if (response.ok) {
        const data = await response.json();
        advice = data.advice || [];
      } else {
        throw new Error("Failed to get custom advice");
      }

      const result: CalculationResult = {
        emissions,
        treeOffset,
        status,
        advice,
      };

      setCalculationResult(result);
      setCalcInputs({
        quantity,
        unit: unitName,
        factorLabel,
      });

      // Append to local history list
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ", " + new Date().toLocaleDateString([], { month: "short", day: "numeric" });
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp,
        item_name: item.item_name,
        category: item.category,
        quantity,
        unit: unitName as UnitType,
        emissions,
        treeOffset,
      };

      saveHistory([newHistoryItem, ...history]);

    } catch (err) {
      console.error("Emissions Advice API error, using fallbacks:", err);
      
      // Fallback advice block in case advice endpoint times out
      const fallbackTips: Record<CategoryType, string[]> = {
        appliance: [
          `Consider upgrading your ${item.item_name} to an Energy Star high-efficiency rating to save on carbon output.`,
          "Reduce operational usage times during high-tariff peak grid load cycles.",
          `Planting ${treeOffset} tree(s) this season directly offsets this operational footprint.`
        ],
        transport: [
          "Carpool or combine multi-destination trips to optimize fuel consumption.",
          "Check tire pressure and engine health regularly to improve average fuel economy metrics.",
          "Investigate transitioning to public electric transit networks for frequent urban travel."
        ],
        energy: [
          "Conduct a residential energy audit to find hidden heat losses and power vampires.",
          "Shift heavy energy chores (washing machines, dishwashers) to solar peak generation windows.",
          "Switch to 100% LED bulbs and smart power strips to lower background grid consumption."
        ],
        waste: [
          "Initiate a composting setup for organic waste to divert high-emission methane from municipal landfills.",
          "Double down on aluminum and glass recycling protocols, saving up to 90% in material production energy.",
          "Transition to reusable containers to eliminate single-use plastics from your household stream."
        ]
      };

      const result: CalculationResult = {
        emissions,
        treeOffset,
        status,
        advice: fallbackTips[item.category] || fallbackTips.appliance,
      };

      setCalculationResult(result);
      setCalcInputs({
        quantity,
        unit: unitName,
        factorLabel,
      });

      // Save to history list anyway
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ", " + new Date().toLocaleDateString([], { month: "short", day: "numeric" });
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp,
        item_name: item.item_name,
        category: item.category,
        quantity,
        unit: unitName as UnitType,
        emissions,
        treeOffset,
      };
      saveHistory([newHistoryItem, ...history]);

    } finally {
      setIsCalculating(false);
    }
  };

  // Helper to load sample image instantly
  const handleSelectSample = (sample: SampleItem) => {
    setSelectedImage(sample.image);
    const itemData: DetectedItem = {
      item_name: sample.name,
      category: sample.category,
      default_unit: sample.default_unit,
      estimated_quantity: sample.default_unit === "km" ? 50 : sample.default_unit === "kWh" ? 30 : 8,
      estimated_factor: sample.category === "appliance" ? 1.5 : sample.category === "transport" ? 0.12 : sample.category === "energy" ? 0.82 : 0.45,
      factor_label: sample.category === "appliance" ? "Air Conditioner (Standard)" : sample.category === "transport" ? "Petrol Passenger Car" : sample.category === "energy" ? "National Grid Electricity" : "Mixed Landfill Waste"
    };
    setDetectedItem(itemData);
    setCalculationResult(null);
    setCalcInputs(null);
    setAnalysisError(null);

    // Run emissions calculation instantly for selected test samples as well
    handleCalculateEmissions({
      quantity: itemData.estimated_quantity!,
      factor: itemData.estimated_factor!,
      unitName: itemData.default_unit,
      factorLabel: itemData.factor_label!
    }, itemData);
  };

  // Load a historic scan back into the workspace
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setDetectedItem({
      item_name: item.item_name,
      category: item.category,
      default_unit: item.unit,
    });
    
    // Determine status
    let status: 'low' | 'moderate' | 'high' = 'low';
    if (item.emissions > 15) {
      status = 'high';
    } else if (item.emissions >= 5) {
      status = 'moderate';
    }

    setCalculationResult({
      emissions: item.emissions,
      treeOffset: item.treeOffset,
      status,
      advice: [
        `Historical Audit Entry from: ${item.timestamp}`,
        `Measured consumption level: ${item.quantity} ${item.unit}.`,
        `Complete year-long carbon absorption requires planting ${item.treeOffset} tree(s).`
      ],
    });

    setCalcInputs({
      quantity: item.quantity,
      unit: item.unit,
      factorLabel: "Historical saved audit log",
    });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] font-sans text-[#f0f6fc] flex flex-col antialiased">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#161b22]/90 backdrop-blur-md border-b border-[#30363d] px-4 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#2ea44f]/10 rounded-lg border border-[#2ea44f]/30">
            <Globe className="w-5 h-5 text-[#2ea44f]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-[#f0f6fc]">EcoPulse Vision</h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">UN SDG 13: Climate Action</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Cumulative Score Badge */}
          <div className="bg-[#0d1117] border border-[#30363d] rounded-full px-3.5 py-1.5 flex items-center gap-2 text-xs">
            <Leaf className="w-4 h-4 text-[#2ea44f]" />
            <span className="text-gray-400 font-medium">Cumulative Audited Footprint:</span>
            <span className="font-mono font-bold text-[#f0f6fc] bg-[#161b22] px-2 py-0.5 rounded-md border border-[#30363d]">
              {cumulativeCarbonScore.toFixed(1)} kg CO2
            </span>
          </div>

          {/* GitHub Documentation */}
          <a
            href="https://github.com/unsdg-climate-action/ecopulse-vision"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#f0f6fc] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg px-3 py-1.5 font-semibold transition-all"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">Docs</span>
          </a>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column (Input, Webcam, Samples, Dynamic Form) */}
        <section className="col-span-1 md:col-span-6 flex flex-col gap-6">
          <div className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col gap-4 shadow-md">
            <div>
              <h2 className="text-base font-bold text-gray-200">Emissions Intake Hub</h2>
              <p className="text-xs text-gray-400 mt-1">
                Upload a picture, snap a fresh camera frame, or select a pre-loaded sample representing common emitters.
              </p>
            </div>

            {/* Input Selection Tabs */}
            <div className="flex bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
              <button
                onClick={() => {
                  setActiveTab("upload");
                  setSelectedImage(null);
                  setDetectedItem(null);
                  setCalculationResult(null);
                }}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === "upload"
                    ? "bg-[#2ea44f] text-[#f0f6fc]"
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#161b22]"
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> File Upload
              </button>
              <button
                onClick={() => {
                  setActiveTab("webcam");
                  setSelectedImage(null);
                  setDetectedItem(null);
                  setCalculationResult(null);
                }}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === "webcam"
                    ? "bg-[#2ea44f] text-[#f0f6fc]"
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#161b22]"
                }`}
              >
                <Camera className="w-3.5 h-3.5" /> Live Webcam
              </button>
            </div>

            {/* Selected intake method */}
            {activeTab === "upload" ? (
              <ImageUploader
                onImageSelected={(img) => {
                  setSelectedImage(img);
                  setDetectedItem(null);
                  setCalculationResult(null);
                  setAnalysisError(null);
                }}
                selectedImage={selectedImage}
                onClear={() => {
                  setSelectedImage(null);
                  setDetectedItem(null);
                  setCalculationResult(null);
                  setAnalysisError(null);
                }}
              />
            ) : (
              selectedImage ? (
                <div className="relative group bg-[#0d1117] rounded-xl border border-[#30363d] overflow-hidden aspect-video flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Captured snapshot"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 p-2 text-center">
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setDetectedItem(null);
                        setCalculationResult(null);
                      }}
                      className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] text-xs text-red-400 font-semibold rounded-lg border border-[#30363d]"
                    >
                      Retake Snapshot
                    </button>
                  </div>
                </div>
              ) : (
                <WebcamScanner
                  onCapture={(img) => {
                    setSelectedImage(img);
                    setDetectedItem(null);
                    setCalculationResult(null);
                    setAnalysisError(null);
                  }}
                />
              )
            )}

            {/* Submit to AI Button */}
            {selectedImage && !detectedItem && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleProcessImage}
                disabled={isAnalyzing}
                className="w-full py-2.5 bg-[#2ea44f] hover:bg-[#2c974b] disabled:bg-gray-600 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-md transition-colors text-[#f0f6fc]"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing item with Gemini AI...
                  </>
                ) : (
                  <>
                    Process Image with AI
                    <ChevronRight className="w-4.5 h-4.5" />
                  </>
                )}
              </motion.button>
            )}

            {/* Error messaging */}
            {analysisError && (
              <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{analysisError}</span>
              </div>
            )}

            {/* Quick-test sample items panel */}
            <div className="border-t border-[#30363d] pt-3.5 mt-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Or select a baseline test sample:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {SAMPLE_ITEMS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-2.5 bg-[#0d1117] border border-[#30363d] hover:border-[#2ea44f] rounded-lg text-left transition-all flex items-center gap-2 group"
                  >
                    <div className="p-1 bg-[#161b22] rounded text-gray-400 group-hover:text-[#2ea44f] transition-colors">
                      <Leaf className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-300 group-hover:text-[#f0f6fc] line-clamp-1">
                      {sample.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic input fields section */}
          {detectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4"
            >
              <DynamicForm
                detectedItem={detectedItem}
                onCalculate={handleCalculateEmissions}
                isCalculating={isCalculating}
              />
            </motion.div>
          )}
        </section>

        {/* Right Column (Results Panel, Audited History) */}
        <section className="col-span-1 md:col-span-6 flex flex-col gap-6">
          <ResultsPanel
            result={calculationResult}
            itemName={detectedItem?.item_name || ""}
            quantity={calcInputs?.quantity || 0}
            unit={calcInputs?.unit || ""}
            factorLabel={calcInputs?.factorLabel || ""}
          />

          <HistoryList
            history={history}
            onClearHistory={handleClearHistory}
            onSelectHistoryItem={handleSelectHistoryItem}
          />
        </section>
      </main>

      {/* Sustainable footer metrics info */}
      <footer className="mt-auto bg-[#161b22] border-t border-[#30363d] px-6 py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#2ea44f]" />
            <span>Dedicated to Climate Action & SDG 13 Solutions</span>
          </div>
          <p className="text-[11px]">
            &copy; 2026 EcoPulse Vision &bull; Built with Gemini 3.5 Flash server-side AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
