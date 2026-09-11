import React from "react";
import { COMMAND_LIST } from "./ChaiParser";

/**
 * Autocomplete Component
 * Floating suggestion box triggered when user types 'chai.'
 */
export default function Autocomplete({
  inputValue,
  selectedIndex,
  onSelect,
}) {
  const query = (inputValue || "").trim().toLowerCase();

  if (!query.startsWith("chai.")) return null;

  const matches = COMMAND_LIST.filter((cmd) => cmd.startsWith(query));

  if (matches.length === 0) return null;

  return (
    <div className="mb-2 p-1.5 bg-[#2A1D16] border-2 border-[#E5A83B]/60 rounded-lg shadow-sketch font-mono text-xs text-[#EFE4D2] max-h-48 overflow-y-auto custom-scrollbar">
      <div className="px-2 py-0.5 text-[10px] text-[#A68F7A] uppercase font-technical font-bold border-b border-[#3D2C22] mb-1 flex justify-between">
        <span>Suggested Commands</span>
        <span>Use ↑ ↓ Enter / Tab</span>
      </div>
      {matches.map((cmd, idx) => {
        const isSelected = idx === selectedIndex;
        return (
          <div
            key={cmd}
            onClick={() => onSelect(cmd)}
            className={`px-2.5 py-1 rounded cursor-pointer transition-colors flex items-center justify-between ${
              isSelected
                ? "bg-[#E5A83B] text-[#1E1610] font-bold"
                : "hover:bg-[#3D2C22] text-[#EFE4D2]"
            }`}
          >
            <span>{cmd}</span>
            <span className="text-[10px] opacity-70">Execute</span>
          </div>
        );
      })}
    </div>
  );
}
