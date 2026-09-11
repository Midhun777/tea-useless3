import React, { useRef, useEffect } from "react";
import TerminalHeader from "./TerminalHeader";
import TerminalOutput from "./TerminalOutput";
import TerminalInput from "./TerminalInput";
import Autocomplete from "./Autocomplete";

/**
 * ChaiTerminal Component
 * Main terminal shell with scroll management and responsive layout.
 */
export default function ChaiTerminal({
  history,
  inputValue,
  onInputChange,
  onSubmitCommand,
  onKeyDown,
  onResetSession,
  autocompleteIdx,
  onSelectAutocomplete,
}) {
  const outputEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="w-full max-w-4xl rounded-2xl bg-[#1E1610] border-3 border-ink shadow-sketch-lg overflow-hidden flex flex-col min-h-[500px] max-h-[75vh] cursor-text"
      style={{
        borderRadius: "20px 20px 20px 20px",
      }}
    >
      <TerminalHeader onReset={onResetSession} />

      <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between custom-scrollbar bg-[#1E1610]">
        <div className="flex flex-col gap-3">
          <TerminalOutput history={history} />
          <div ref={outputEndRef} />
        </div>

        <div className="flex flex-col mt-3">
          <Autocomplete
            inputValue={inputValue}
            selectedIndex={autocompleteIdx}
            onSelect={onSelectAutocomplete}
          />
          <TerminalInput
            inputRef={inputRef}
            value={inputValue}
            onChange={onInputChange}
            onSubmit={onSubmitCommand}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </div>
  );
}
