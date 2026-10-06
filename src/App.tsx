import React, { useState, useEffect } from "react";
import {
  Globe,
  Leaf,
  Camera,
  Cpu,
  Newspaper,
  User,
  ShieldCheck,
  Zap,
  Flame,
  TreePine,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import HomeView from "./components/HomeView";
import DashboardView from "./components/DashboardView";
import HowModelWorksView from "./components/HowModelWorksView";
import NewsView from "./components/NewsView";
import AccountView from "./components/AccountView";

import { SAMPLE_ITEMS, SampleItem } from "./constants/samples";
import { DetectedItem, CalculationResult, HistoryItem, CategoryType, UnitType } from "./types";
import { normalizeImageForAnalysis } from "./utils/imageUtils";

export type NavPage = "home" | "dashboard" | "how-it-works" | "news" | "account";

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<NavPage>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication State
  const [isSignedIn, setIsSignedIn] = useState<boolean>(() => {
    return localStorage.getItem("ecopulse_signed_in") === "true";
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem("ecopulse_user_email") || "addy250509@gmail.com";
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("ecopulse_user_name") || "Climate Advocate";
  });

  const handleSignIn = (name: string, email: string) => {
    setIsSignedIn(true);
    setUserName(name);
    setUserEmail(email);
    localStorage.setItem("ecopulse_signed_in", "true");
    localStorage.setItem("ecopulse_user_name", name);
    localStorage.setItem("ecopulse_user_email", email);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    localStorage.removeItem("ecopulse_signed_in");
  };

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

  // Clear overall history
  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all audited carbon records?")) {
      saveHistory([]);
    }
  };

  // Re-audit an item from history
  const handleReauditHistoryItem = (item: HistoryItem) => {
    setDetectedItem({
      item_name: item.item_name,
      category: item.category,
      default_unit: item.unit,
      estimated_quantity: item.quantity,
    });
    setCalculationResult({
      emissions: item.emissions,
      treeOffset: item.treeOffset,
      status: item.emissions > 15 ? "high" : item.emissions > 5 ? "moderate" : "low",
      advice: [
        `Re-audited ${item.item_name} with ${item.quantity} ${item.unit}.`,
        `Preserve energy efficiency settings to lower future carbon peaks.`,
        `Maintain active tree offset targets (~20 kg CO2 / tree / year).`
      ],
    });
    setCalcInputs({
      quantity: item.quantity,
      unit: item.unit,
      factorLabel: "Historical Record Factor",
    });
    setCurrentPage("dashboard");
  };

  // Process selected image with backend Gemini Vision endpoint
  const handleProcessImage = async (imageToProcess?: string) => {
    let img = imageToProcess || selectedImage;
    if (!img) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Normalize and compress if raw string/file
      try {
        img = await normalizeImageForAnalysis(img);
      } catch (e) {
        console.warn("Image pre-normalization skipped:", e);
      }

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: img }),
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

  // Automatically trigger processing and calculation when an image is uploaded or captured
  const handleAutoAnalyzeImage = async (img: string) => {
    setSelectedImage(img);
    setDetectedItem(null);
    setCalculationResult(null);
    setAnalysisError(null);
    setCalcInputs(null);
    setCurrentPage("dashboard");
    await handleProcessImage(img);
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
    
    // Core Formula: Carbon Output (kg) = Quantity * Factor
    const emissions = parseFloat((quantity * factor).toFixed(2));
    
    // Offset Formula: 1 tree absorbs ~20 kg CO2 / year
    const treeOffset = Math.max(1, Math.ceil(emissions / 20));
    
    // Determine status tier
    const status: "low" | "moderate" | "high" = 
      emissions < 5 ? "low" : emissions <= 15 ? "moderate" : "high";

    setCalcInputs({ quantity, unit: unitName, factorLabel });

    // Store in history
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      item_name: item.item_name,
      category: item.category,
      quantity,
      unit: item.default_unit,
      emissions,
      treeOffset,
    };
    saveHistory([newHistoryItem, ...history.slice(0, 19)]); // keep latest 20

    // Fetch dynamic AI Mitigation Advice
    try {
      const res = await fetch("/api/get-advice", {
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

      if (res.ok) {
        const data = await res.json();
        setCalculationResult({
          emissions,
          treeOffset,
          status,
          advice: data.advice || [],
        });
      } else {
        throw new Error("Failed to get tailored advice");
      }
    } catch (err) {
      console.warn("Using fallback advice rulebook:", err);
      // Fallback advice rulebook
      setCalculationResult({
        emissions,
        treeOffset,
        status,
        advice: [
          `Reduce operational duration of ${item.item_name} by 20% to prevent peak carbon buildup.`,
          `Offset this carbon load by planting approximately ${treeOffset} mature tree(s) over the next year.`,
          `Switch to renewable energy micro-generation or high-efficiency star-rated models where feasible.`
        ],
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle Preset Sample selection
  const handleSelectSample = (sample: SampleItem) => {
    setSelectedImage(sample.image);
    const item: DetectedItem = {
      item_name: sample.name,
      category: sample.category,
      default_unit: sample.default_unit,
      estimated_quantity: sample.default_quantity,
      estimated_factor: sample.default_factor,
      factor_label: sample.factor_label,
    };
    setDetectedItem(item);
    handleCalculateEmissions({
      quantity: sample.default_quantity,
      factor: sample.default_factor,
      unitName: sample.default_unit,
      factorLabel: sample.factor_label,
    }, item);
  };

  const totalEmissions = history.reduce((sum, item) => sum + item.emissions, 0);
  const totalTrees = history.reduce((sum, item) => sum + item.treeOffset, 0);

  return (
    <div className="min-h-screen bg-black text-[#f1f5f9] flex flex-col font-sans space-stars-bg selection:bg-emerald-500 selection:text-black relative overflow-x-hidden">
      {/* Background Ambient Cosmic Glows */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(16,185,129,0.12),transparent_70%)]" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.06),transparent_70%)]" 
      />

      {/* ---------------- TOP BAR CONTRACT (ZONE 1, ZONE 2, ZONE 3) ---------------- */}
      <header className="sticky top-0 z-40 bg-black/75 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setCurrentPage("home")}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.15] flex items-center justify-center text-white group-hover:border-emerald-400 group-hover:text-emerald-400 transition-colors shadow-sm">
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                EcoPulse <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AI VISION</span>
              </span>
              <span className="text-[9px] font-mono text-slate-500 -mt-0.5">Planetary Intelligence</span>
            </div>
          </button>

          {/* Zone 2: 4-5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.08] backdrop-blur-md">
            {[
              { id: "home", label: "Home" },
              { id: "dashboard", label: "Scanner Studio" },
              { id: "how-it-works", label: "How Model Works" },
              { id: "news", label: "SDG 13 News" },
            ].map((tab) => {
              const isActive = currentPage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentPage(tab.id as NavPage)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage("account")}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-medium transition-colors cursor-pointer ${
                currentPage === "account"
                  ? "bg-white/[0.12] border-white/[0.25] text-white"
                  : "bg-transparent border-white/[0.08] text-slate-400 hover:text-slate-200 hover:border-white/[0.15]"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{isSignedIn ? userName.split(" ")[0] : "Sign In"}</span>
            </button>

            <button
              onClick={() => setCurrentPage("dashboard")}
              className="px-5 py-2 rounded-full bg-white hover:bg-slate-200 text-black font-semibold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Camera className="w-3.5 h-3.5 text-black" />
              <span>Launch Studio</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-2 border-t border-white/[0.08] mt-3 flex flex-col gap-1.5">
            {[
              { id: "home", label: "Home Overview", icon: Globe },
              { id: "dashboard", label: "Scanner Studio", icon: Camera },
              { id: "how-it-works", label: "How Model Works", icon: Cpu },
              { id: "news", label: "SDG 13 News", icon: Newspaper },
              { id: "account", label: isSignedIn ? "My Profile" : "Sign In", icon: User },
            ].map((tab) => {
              const isActive = currentPage === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentPage(tab.id as NavPage);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 text-left transition-all ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* ---------------- MAIN VIEW ROUTER ---------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-6 relative z-10">
        <AnimatePresence mode="wait">
          {currentPage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <HomeView
                onNavigateToDashboard={() => setCurrentPage("dashboard")}
                onNavigateToHowItWorks={() => setCurrentPage("how-it-works")}
                onNavigateToNews={() => setCurrentPage("news")}
                onSelectSample={(sample) => {
                  handleSelectSample(sample);
                  setCurrentPage("dashboard");
                }}
              />
            </motion.div>
          )}

          {currentPage === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <DashboardView
                selectedImage={selectedImage}
                onImageSelected={handleAutoAnalyzeImage}
                onClearImage={() => {
                  setSelectedImage(null);
                  setDetectedItem(null);
                  setCalculationResult(null);
                  setAnalysisError(null);
                  setCalcInputs(null);
                }}
                onAnalyze={() => handleProcessImage()}
                detectedItem={detectedItem}
                calculationResult={calculationResult}
                calcInputs={calcInputs}
                isAnalyzing={isAnalyzing}
                isCalculating={isCalculating}
                analysisError={analysisError}
                onCalculate={handleCalculateEmissions}
                onSelectSample={handleSelectSample}
                history={history}
                onClearHistory={handleClearHistory}
                onReauditHistoryItem={handleReauditHistoryItem}
                onNavigateToHowItWorks={() => setCurrentPage("how-it-works")}
              />
            </motion.div>
          )}

          {currentPage === "how-it-works" && (
            <motion.div
              key="how-it-works"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <HowModelWorksView />
            </motion.div>
          )}

          {currentPage === "news" && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <NewsView />
            </motion.div>
          )}

          {currentPage === "account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <AccountView
                isSignedIn={isSignedIn}
                userEmail={userEmail}
                userName={userName}
                onSignIn={handleSignIn}
                onSignOut={handleSignOut}
                totalEmissions={totalEmissions}
                totalTrees={totalTrees}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-white/[0.08] bg-[#070a11] px-4 sm:px-8 py-8 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wide">EcoPulse Vision · UN SDG 13 Climate Platform</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Multi-agent visual carbon intelligence for empirical decarbonization.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400">
            <button
              onClick={() => setCurrentPage("home")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage("dashboard")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Scanner Studio
            </button>
            <button
              onClick={() => setCurrentPage("how-it-works")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              How Model Works
            </button>
            <button
              onClick={() => setCurrentPage("news")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              SDG 13 News
            </button>
            <button
              onClick={() => setCurrentPage("account")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Account
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
          <span>© 2026 EcoPulse Vision · UN Sustainable Development Goal 13</span>
          <div className="flex items-center gap-3">
            <span>Roboflow Vision + Gemini API</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">GHG Protocol Scope 1-3</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
