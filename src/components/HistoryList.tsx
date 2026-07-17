import React from "react";
import { HistoryItem, CategoryType } from "../types";
import { Trash2, Wind, Car, Zap, RefreshCw, Clock, History } from "lucide-react";
import { motion } from "motion/react";

interface HistoryListProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export default function HistoryList({
  history,
  onClearHistory,
  onSelectHistoryItem,
}: HistoryListProps) {
  const getIcon = (category: CategoryType) => {
    switch (category) {
      case "appliance":
        return <Wind className="w-4 h-4 text-sky-400" />;
      case "transport":
        return <Car className="w-4 h-4 text-amber-400" />;
      case "energy":
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case "waste":
        return <Trash2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5 bg-[#161b22] border border-[#30363d] rounded-xl text-[#f0f6fc]">
      <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#2ea44f]" />
          <h3 className="text-sm font-semibold">Audit History</h3>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[11px] text-red-400 hover:text-red-500 hover:underline flex items-center gap-1 font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Purge Scans
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-6 text-center text-xs text-gray-500">
          No audit entries recorded. Submit your first analysis to populate this timeline.
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className="flex items-center justify-between p-3 bg-[#0d1117] border border-[#30363d] hover:border-gray-500 rounded-lg cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#161b22] rounded-lg">
                  {getIcon(item.category)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-200 line-clamp-1">
                    {item.item_name}
                  </span>
                  <span className="text-[9px] text-gray-500 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {item.timestamp}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono font-bold text-gray-200">
                  {item.emissions.toFixed(1)} <span className="text-[9px] font-normal text-gray-400">kg</span>
                </p>
                <p className="text-[9px] text-[#2ea44f] font-mono">
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
