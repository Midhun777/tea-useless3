import React, { useState } from "react";
import useBubbleStore from "../../store/useBubbleStore";
import ChaiTerminal from "./ChaiTerminal";
import BrewingSequence from "./BrewingSequence";
import ResultScreen from "./ResultScreen";
import { executeChaiCommand } from "./ChaiCompiler";
import { COMMAND_LIST } from "./ChaiParser";

/**
 * CodeAChai Component (Page Root)
 * Terminal-based chai programming experience.
 * Manages states: TERMINAL -> COMPILING -> BREWING -> RESULT
 */
export default function CodeAChai() {
  const {
    chaiRecipe,
    updateRecipe,
    resetRecipe,
    codeChaiPhase,
    setCodeChaiPhase,
  } = useBubbleStore();

  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState([
    {
      command: "chai.init",
      output: "✓ ChaiScript environment initialized.\nReady for recipe configuration.",
      type: "success",
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState(["chai.init"]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [autocompleteIdx, setAutocompleteIdx] = useState(0);

  const handleInputChange = (val) => {
    setInputVal(val);
    setAutocompleteIdx(0);
  };

  const executeCommand = (cmdToRun) => {
    const command = (cmdToRun || inputVal).trim();
    if (!command) return;

    setInputVal("");
    setHistoryIdx(-1);
    setAutocompleteIdx(0);

    setCmdHistory((prev) => [command, ...prev.filter((c) => c !== command)]);

    const res = executeChaiCommand(command, chaiRecipe, updateRecipe);

    setHistory((prev) => [
      ...prev,
      {
        command,
        output: res.output,
        type: res.type,
      },
    ]);

    if (res.action === "brew") {
      setTimeout(() => {
        setCodeChaiPhase("COMPILING");
      }, 600);
    }
  };

  const handleKeyDown = (e) => {
    const query = inputVal.trim().toLowerCase();
    const isAutocomplete = query.startsWith("chai.");
    const matches = isAutocomplete
      ? COMMAND_LIST.filter((c) => c.startsWith(query))
      : [];

    if (e.key === "Tab" || (e.key === "Enter" && matches.length > 0 && inputVal.endsWith("."))) {
      if (matches.length > 0) {
        e.preventDefault();
        const selected = matches[autocompleteIdx] || matches[0];
        setInputVal(selected + " ");
        return;
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (isAutocomplete && matches.length > 0) {
        setAutocompleteIdx((prev) => (prev > 0 ? prev - 1 : matches.length - 1));
      } else if (cmdHistory.length > 0) {
        const nextIdx = Math.min(cmdHistory.length - 1, historyIdx + 1);
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (isAutocomplete && matches.length > 0) {
        setAutocompleteIdx((prev) => (prev < matches.length - 1 ? prev + 1 : 0));
      } else if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx] || "");
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal("");
      }
    }
  };

  const handleResetSession = () => {
    resetRecipe();
    setHistory([
      {
        command: "chai.reset",
        output: "✓ Session reset. Type chai.init to start.",
        type: "info",
      },
    ]);
  };

  return (
    <section className="relative min-h-[90vh] px-4 py-6 max-w-5xl mx-auto flex flex-col items-center justify-start">
      {/* Page Masthead Header */}
      <div className="text-center max-w-2xl mb-6">
        <span className="font-technical text-xs font-bold uppercase tracking-widest text-terracotta bg-saffron/10 px-3 py-1 rounded border border-terracotta/30 inline-block mb-2">
          DEVELOPER TERMINAL × CHAI LABORATORY
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink tracking-tight">
          Code a Chai
        </h1>
        <p className="font-handwritten text-xl sm:text-2xl text-chai font-semibold mt-1">
          Program your perfect cup using ChaiScript.
        </p>
      </div>

      {/* Internal State Switcher */}
      {codeChaiPhase === "TERMINAL" && (
        <ChaiTerminal
          history={history}
          inputValue={inputVal}
          onInputChange={handleInputChange}
          onSubmitCommand={() => executeCommand(inputVal)}
          onKeyDown={handleKeyDown}
          onResetSession={handleResetSession}
          autocompleteIdx={autocompleteIdx}
          onSelectAutocomplete={(cmd) => executeCommand(cmd)}
        />
      )}

      {codeChaiPhase === "COMPILING" && <BrewingSequence />}

      {(codeChaiPhase === "BREWING" || codeChaiPhase === "RESULT") && (
        <ResultScreen />
      )}
    </section>
  );
}
