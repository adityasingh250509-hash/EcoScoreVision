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
    <div className="min-h-screen bg-[#06090f] text-[#f0f6fc] flex flex-col font-sans selection:bg-[#2ea44f] selection:text-white">
      {/* ---------------- NAVIGATION HEADER ---------------- */}
      <header className="sticky top-0 z-40 bg-[#0d1117]/85 backdrop-blur-xl border-b border-[#30363d] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            onClick={() => setCurrentPage("home")}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2ea44f] to-[#38bdf8] p-0.5 shadow-lg shadow-[#2ea44f]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d1117] rounded-[10px] flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#2ea44f] group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">
                  EcoPulse<span className="text-[#2ea44f]">.vision</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2ea44f]/20 text-[#2ea44f] border border-[#2ea44f]/40">
                  SDG 13
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">Multimodal AI Climate Intelligence</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#161b22] p-1.5 rounded-2xl border border-[#30363d]">
            {[
              { id: "home", label: "Home", icon: Globe },
              { id: "dashboard", label: "Scanner Studio", icon: Camera },
              { id: "how-it-works", label: "How Model Works", icon: Cpu },
              { id: "news", label: "SDG 13 News", icon: Newspaper },
              { id: "account", label: isSignedIn ? userName.split(" ")[0] : "Sign In", icon: User },
            ].map((tab) => {
              const isActive = currentPage === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentPage(tab.id as NavPage)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#2ea44f] text-white shadow-md shadow-[#2ea44f]/25"
                      : "text-gray-400 hover:text-white hover:bg-[#21262d]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls (Quick Scanner CTA / Live Indicator) */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#30363d] text-xs">
              <TreePine className="w-4 h-4 text-[#2ea44f]" />
              <span className="text-gray-300 font-medium">Audited Trees:</span>
              <span className="font-bold text-white">{totalTrees}</span>
            </div>

            <button
              onClick={() => setCurrentPage("dashboard")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2ea44f] to-[#238636] hover:from-[#34c759] hover:to-[#2ea44f] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#2ea44f]/20 transition-all transform hover:scale-105 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan Item</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#161b22] border border-[#30363d] text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-2 border-t border-[#30363d] mt-3 flex flex-col gap-2">
            {[
              { id: "home", label: "Home Overview", icon: Globe },
              { id: "dashboard", label: "Scanner Studio", icon: Camera },
              { id: "how-it-works", label: "How Model Works", icon: Cpu },
              { id: "news", label: "SDG 13 News with Photos", icon: Newspaper },
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
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-left transition-all ${
                    isActive
                      ? "bg-[#2ea44f] text-white"
                      : "text-gray-300 hover:bg-[#21262d]"
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-8">
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
      <footer className="border-t border-[#30363d] bg-[#0d1117] px-4 sm:px-8 py-10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#2ea44f]/20 border border-[#2ea44f]/40 text-[#2ea44f]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">EcoPulse Vision • UN SDG 13 Climate Platform</span>
              <p className="text-xs text-gray-400">
                Empowering individuals and enterprises to observe, quantify, and neutralize carbon output.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400">
            <button
              onClick={() => setCurrentPage("home")}
              className="hover:text-emerald-400 transition-colors"
            >
              3D Earth Home
            </button>
            <button
              onClick={() => setCurrentPage("dashboard")}
              className="hover:text-emerald-400 transition-colors"
            >
              Scanner Studio
            </button>
            <button
              onClick={() => setCurrentPage("how-it-works")}
              className="hover:text-emerald-400 transition-colors"
            >
              Scientific Engine
            </button>
            <button
              onClick={() => setCurrentPage("news")}
              className="hover:text-emerald-400 transition-colors"
            >
              SDG 13 News
            </button>
            <button
              onClick={() => setCurrentPage("account")}
              className="hover:text-emerald-400 transition-colors"
            >
              Account
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-[#21262d] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <span>&copy; 2026 EcoPulse Vision. Grounded in UN Sustainable Development Goal 13 (Climate Action).</span>
          <div className="flex items-center gap-4">
            <span>Powered by Gemini 3.7 Flash Multimodal Intelligence</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">100% GHG Protocol Scope 1-3 Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
