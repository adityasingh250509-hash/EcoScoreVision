import React, { useState } from "react";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  FileText, 
  RefreshCw, 
  AlertCircle, 
  Trash2, 
  TreePine, 
  Flame, 
  Zap, 
  Car, 
  Sliders, 
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import ImageUploader from "./ImageUploader";
import WebcamScanner from "./WebcamScanner";
import DynamicForm from "./DynamicForm";
import ResultsPanel from "./ResultsPanel";
import HistoryList from "./HistoryList";
import { SAMPLE_ITEMS, SampleItem } from "../constants/samples";
import { DetectedItem, CalculationResult, HistoryItem } from "../types";
import { generateCarbonAuditReport } from "../utils/pdfGenerator";

interface DashboardViewProps {
  selectedImage: string | null;
  onImageSelected: (img: string) => void;
  onClearImage: () => void;
  onAnalyze?: () => void;
  detectedItem: DetectedItem | null;
  calculationResult: CalculationResult | null;
  calcInputs: {
    quantity: number;
    unit: string;
    factorLabel: string;
  } | null;
  isAnalyzing: boolean;
  isCalculating: boolean;
  analysisError: string | null;
  onCalculate: (formData: {
    quantity: number;
    factor: number;
    unitName: string;
    factorLabel: string;
  }) => void;
  onSelectSample: (sample: SampleItem) => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onReauditHistoryItem: (item: HistoryItem) => void;
  onNavigateToHowItWorks: () => void;
}

export default function DashboardView({
  selectedImage,
  onImageSelected,
  onClearImage,
  onAnalyze,
  detectedItem,
  calculationResult,
  calcInputs,
  isAnalyzing,
  isCalculating,
  analysisError,
  onCalculate,
  onSelectSample,
  history,
  onClearHistory,
  onReauditHistoryItem,
  onNavigateToHowItWorks,
}: DashboardViewProps) {
  const [activeInputTab, setActiveInputTab] = useState<"upload" | "webcam" | "samples">("upload");
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const totalEmissions = history.reduce((sum, item) => sum + item.emissions, 0);
  const totalTrees = history.reduce((sum, item) => sum + item.treeOffset, 0);

  const handleDownloadFullAuditPDF = () => {
    setIsExportingPDF(true);
    try {
      if (calculationResult && detectedItem && calcInputs) {
        generateCarbonAuditReport({
          itemName: detectedItem.item_name,
          category: detectedItem.category,
          quantity: calcInputs.quantity,
          unit: calcInputs.unit,
          factorLabel: calcInputs.factorLabel,
          emissions: calculationResult.emissions,
          treeOffset: calculationResult.treeOffset,
          status: calculationResult.status,
          advice: calculationResult.advice,
          timestamp: new Date().toLocaleString(),
        });
      } else if (history.length > 0) {
        const latest = history[0];
        generateCarbonAuditReport({
          itemName: latest.item_name,
          category: latest.category,
          quantity: latest.quantity,
          unit: latest.unit,
          factorLabel: "Historical Baseline Standard",
          emissions: latest.emissions,
          treeOffset: latest.treeOffset,
          status: latest.emissions > 15 ? "high" : latest.emissions > 5 ? "moderate" : "low",
          advice: [
            "Consider reducing daily usage to minimize greenhouse impact.",
            "Plant trees to neutralize emitted carbon output.",
            "Transition to energy-efficient appliances."
          ],
          timestamp: latest.timestamp,
        });
      }
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16 text-[#f1f5f9]">
      {/* Top Telemetry Summary Banner */}
      <div className="bg-[#0b0f19] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Carbon Intelligence Studio
              </h1>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                ROBOFLOW + GEMINI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multimodal image recognition and automated lifecycle carbon accounting
            </p>
          </div>
        </div>

        {/* Action Controls & Audit Export */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-4 px-3.5 py-1.5 bg-white/[0.02] rounded-xl border border-white/[0.06]">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Audited CO2</span>
              <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-amber-400">{totalEmissions.toFixed(1)} kg</span>
            </div>
            <div className="h-5 w-[1px] bg-white/[0.1]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Tree Offsets</span>
              <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-emerald-400">{totalTrees} Trees</span>
            </div>
          </div>

          {(calculationResult || history.length > 0) && (
            <button
              onClick={handleDownloadFullAuditPDF}
              disabled={isExportingPDF}
              className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              title="Download Official Carbon Audit Report"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Grid (Intake & Analysis on Left, Calculated Insights on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Intake Studio (Upload, Webcam, Presets, Dynamic Form) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Intake Method Tabs */}
          <div className="bg-[#0b0f19] border border-white/[0.08] rounded-xl p-1 flex items-center gap-1">
            <button
              onClick={() => setActiveInputTab("upload")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeInputTab === "upload"
                  ? "bg-white/[0.1] text-white font-semibold shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>

            <button
              onClick={() => setActiveInputTab("webcam")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeInputTab === "webcam"
                  ? "bg-white/[0.1] text-white font-semibold shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Camera</span>
            </button>

            <button
              onClick={() => setActiveInputTab("samples")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeInputTab === "samples"
                  ? "bg-white/[0.1] text-white font-semibold shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Presets</span>
            </button>
          </div>

          {/* Active Intake Component */}
          <div className="bg-[#0b0f19] border border-white/[0.08] rounded-2xl p-5 shadow-xl">
            {activeInputTab === "upload" && (
              <ImageUploader
                onImageSelected={onImageSelected}
                selectedImage={selectedImage}
                onClear={onClearImage}
                onAnalyze={onAnalyze}
                isAnalyzing={isAnalyzing}
              />
            )}

            {activeInputTab === "webcam" && (
              <WebcamScanner
                onCapture={onImageSelected}
              />
            )}

            {activeInputTab === "samples" && (
              <div className="flex flex-col gap-3">
                <span className="text-xs font-medium text-slate-300">
                  Select a calibrated baseline to analyze instantly:
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {SAMPLE_ITEMS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => onSelectSample(sample)}
                      className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/60 hover:bg-white/[0.05] flex items-center gap-2.5 text-left transition-all cursor-pointer group"
                    >
                      <img
                        src={sample.image}
                        alt={sample.name}
                        className="w-9 h-9 rounded-lg object-cover border border-white/[0.08]"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-white group-hover:text-emerald-300 truncate">
                          {sample.name}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {sample.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Vision Analyzing Spinner */}
            {isAnalyzing && (
              <div className="mt-4 p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30 flex items-center justify-center gap-2.5 text-xs font-mono text-emerald-400 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Roboflow & Gemini multimodal audit...</span>
              </div>
            )}

            {/* Error Message */}
            {analysisError && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Analysis Notice</strong>
                  <span>{analysisError}</span>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Configuration Form */}
          {detectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DynamicForm
                detectedItem={detectedItem}
                onCalculate={onCalculate}
                isCalculating={isCalculating}
              />
            </motion.div>
          )}

          {/* Quick Guidance Box */}
          <div className="p-4 bg-[#0b0f19] border border-white/[0.08] rounded-xl flex items-start gap-3 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-medium">UN SDG 13 Standard: </strong>
              All carbon factors are cross-referenced with international GHG Protocol Scope 1-3 standards.
              <button
                onClick={onNavigateToHowItWorks}
                className="ml-1 text-emerald-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                Inspect model <ArrowRight className="w-3 h-3 inline" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations, Graphs & History Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <ResultsPanel
            result={calculationResult}
            itemName={detectedItem?.item_name || "Unknown Item"}
            quantity={calcInputs?.quantity || 1}
            unit={calcInputs?.unit || "units"}
            factorLabel={calcInputs?.factorLabel || "Standard"}
          />

          {/* Audited Session History Drawer */}
          <div className="bg-[#0b0f19] border border-white/[0.08] rounded-2xl p-5 shadow-xl">
            <HistoryList
              history={history}
              onClearHistory={onClearHistory}
              onSelectHistoryItem={onReauditHistoryItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
