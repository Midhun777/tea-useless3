import React from "react";

/**
 * TerminalOutput Component
 * Renders terminal log messages with rich formatting (success, warnings, tables, errors).
 */
export default function TerminalOutput({ history }) {
  return (
    <div className="flex flex-col gap-2 font-mono text-xs sm:text-sm text-[#F7EEDF] leading-relaxed">
      {/* Welcome Banner */}
      <div className="p-3 rounded bg-[#2A1D16] border border-[#3D2C22] text-[#DFB98A] text-xs font-technical leading-relaxed">
        <div className="font-bold text-[#F5CA80] mb-1">
          ☕ CHAISCRIPT INTERACTIVE COMPILER v1.0
        </div>
        <p className="text-[#CDB397]">
          Welcome to the terminal ചായ laboratory. Type commands to craft your recipe.
        </p>
        <div className="mt-2 text-[11px] text-[#A68F7A]">
          Type <code className="text-[#F5CA80] font-bold">chai.init</code> to start or <code className="text-[#F5CA80] font-bold">chai.help</code> for commands.
        </div>
      </div>

      {/* History Items */}
      {history.map((item, idx) => (
        <div key={idx} className="flex flex-col gap-1 my-0.5">
          {/* User Command Input Line */}
          {item.command && (
            <div className="flex items-center gap-2 text-[#F4B362]">
              <span className="text-[#DE764E] font-bold select-none">$</span>
              <span className="font-semibold">{item.command}</span>
            </div>
          )}

          {/* Execution Response Line */}
          {item.output && (
            <div
              className={`whitespace-pre-wrap ${
                item.type === "error"
                  ? "text-[#FF6B6B] font-bold bg-[#3A1818]/60 p-2 rounded border border-[#FF6B6B]/30"
                  : item.type === "warning"
                  ? "text-[#F4B362] bg-[#3A2A18]/60 p-2 rounded border border-[#F4B362]/30"
                  : item.type === "success"
                  ? "text-[#6CE070]"
                  : "text-[#EFE4D2]"
              }`}
            >
              {item.output}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
