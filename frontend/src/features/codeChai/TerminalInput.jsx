import React from "react";

/**
 * TerminalInput Component
 * Prompt input line ($ _), input handling, and focus management.
 */
export default function TerminalInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  inputRef,
}) {
  return (
    <div className="flex items-center gap-2 pt-2 font-mono text-xs sm:text-sm text-[#F7EEDF]">
      <span className="text-[#DE764E] font-bold select-none">$</span>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex-1 flex items-center"
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="type chai.init to start..."
          className="w-full bg-transparent text-[#F7EEDF] outline-none border-none font-mono focus:ring-0 placeholder:text-[#8C7565] placeholder:italic"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
}
