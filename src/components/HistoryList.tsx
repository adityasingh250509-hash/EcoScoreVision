import React from "react";
import { HistoryItem, CategoryType } from "../types";
import { Trash2, Wind, Car, Zap, Clock, History, Download } from "lucide-react";
import { generatePDFReport } from "../utils/pdfGenerator";

interface HistoryListProps {
  history: HistoryItem[];
  userName?: string;
  onClearHistory: () => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export default function HistoryList({
  history,
  userName = "Climate Advocate",
  onClearHistory,
  onSelectHistoryItem,
}: HistoryListProps) {
  const getIcon = (category: CategoryType) => {
    switch (category) {
      case "appliance":
        return <Wind className="w-4 h-4 text-emerald-400" />;
      case "transport":
        return <Car className="w-4 h-4 text-amber-400" />;
      case "energy":
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case "waste":
        return <Trash2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 bg-[#0b0f19] border border-white/[0.08] rounded-2xl text-[#f1f5f9] shadow-xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white font-mono">Audit History</h3>
        </div>
        {history.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => generatePDFReport(history, userName)}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono font-semibold transition-colors bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> PDF Report
            </button>
            <button
              onClick={onClearHistory}
              className="text-[11px] text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Purge
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500 font-mono">
          No audit entries recorded. Submit your first analysis to populate this timeline.
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04] rounded-xl cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#070a11] rounded-lg border border-white/[0.06]">
                  {getIcon(item.category)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-white">
                    {item.item_name}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-2.5 h-2.5" /> {item.timestamp}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono font-bold text-white">
                  {item.emissions.toFixed(1)} <span className="text-[9px] font-normal text-slate-400">kg</span>
                </p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  {item.treeOffset} {item.treeOffset === 1 ? "tree" : "trees"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
