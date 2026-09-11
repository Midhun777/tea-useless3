/**
 * ChaiScript Parser & Command Specification.
 * Strict tokenization and validation without arbitrary eval().
 */

export const COMMAND_LIST = [
  "chai.init",
  "chai.help",
  "chai.add tea",
  "chai.add milk",
  "chai.add sugar",
  "chai.add ginger",
  "chai.add cardamom",
  "chai.remove",
  "chai.foam small",
  "chai.foam medium",
  "chai.foam large",
  "chai.foam chaotic",
  "chai.bubbles",
  "chai.boil",
  "chai.stir",
  "chai.status",
  "chai.brew",
  "chai.reset",
  "chai.debug",
  "chai.chaos",
  "chai.secret",
];

export const HELP_TEXT = `
AVAILABLE CHAISCRIPT COMMANDS:
  chai.init                Initialize ChaiScript environment
  chai.add tea <amount>    Add spoons of tea leaves (e.g. chai.add tea 2)
  chai.add milk <amount>   Add ml of milk (e.g. chai.add milk 120)
  chai.add sugar <amount>  Add spoons of sugar (e.g. chai.add sugar 3)
  chai.add ginger          Add crushed ginger root
  chai.add cardamom        Add aromatic green cardamom
  chai.remove <ingredient> Remove ingredient (tea, milk, sugar, ginger, cardamom)
  chai.foam <type>         Set foam profile: small | medium | large | chaotic
  chai.bubbles <0-100>     Set target bubble density percentage (0-100%)
  chai.boil <0-100>        Set boiling temperature intensity (0-100%)
  chai.stir                Stir the chai mixture
  chai.status              Inspect current chai build configuration
  chai.brew                Start brewing & compilation sequence
  chai.reset               Reset recipe and terminal state
`.trim();

/**
 * Tokenize and parse a ChaiScript input string.
 * @param {string} rawInput
 * @returns {{ valid: boolean, action: string, args: string[], raw: string, error?: string }}
 */
export function parseChaiCommand(rawInput) {
  const input = (rawInput || "").trim();
  if (!input) {
    return { valid: false, action: "empty", args: [], raw: input };
  }

  // Tokenize by whitespace
  const tokens = input.split(/\s+/);
  const head = tokens[0].toLowerCase();

  // Check prefix
  if (!head.startsWith("chai.")) {
    // Check if user tried coffee or random command
    if (head === "coffee" || head.includes("coffee")) {
      return {
        valid: false,
        action: "coffee_error",
        raw: input,
        error: `ERROR CHAI_001\n\nCoffee detected.\nThis compiler only supports chai.\n\nTry:\nchai.add tea 2`,
      };
    }

    return {
      valid: false,
      action: "invalid_syntax",
      raw: input,
      error: `ERROR CHAI_400: Invalid syntax.\nCommands must begin with 'chai.'\nType chai.help for command list.`,
    };
  }

  const subCommand = head;
  const args = tokens.slice(1);

  // Exact matching for single-word commands
  if (subCommand === "chai.init") {
    return { valid: true, action: "init", args, raw: input };
  }
  if (subCommand === "chai.help") {
    return { valid: true, action: "help", args, raw: input };
  }
  if (subCommand === "chai.status") {
    return { valid: true, action: "status", args, raw: input };
  }
  if (subCommand === "chai.brew") {
    return { valid: true, action: "brew", args, raw: input };
  }
  if (subCommand === "chai.reset") {
    return { valid: true, action: "reset", args, raw: input };
  }
  if (subCommand === "chai.stir") {
    return { valid: true, action: "stir", args, raw: input };
  }
  if (subCommand === "chai.debug") {
    return { valid: true, action: "debug", args, raw: input };
  }
  if (subCommand === "chai.chaos") {
    return { valid: true, action: "chaos", args, raw: input };
  }
  if (subCommand === "chai.secret") {
    return { valid: true, action: "secret", args, raw: input };
  }

  // chai.add
  if (subCommand === "chai.add") {
    const item = (args[0] || "").toLowerCase();
    const valStr = args[1];

    if (!item) {
      return {
        valid: false,
        action: "add_error",
        raw: input,
        error: `ERROR CHAI_101: Missing ingredient.\nUsage: chai.add <tea|milk|sugar|ginger|cardamom> [amount]`,
      };
    }

    if (["tea", "milk", "sugar"].includes(item)) {
      const amount = parseInt(valStr, 10);
      if (isNaN(amount) || amount <= 0) {
        return {
          valid: false,
          action: "add_error",
          raw: input,
          error: `ERROR CHAI_102: Invalid amount for ${item}.\nPlease specify a positive number (e.g. chai.add ${item} 2).`,
        };
      }
      return { valid: true, action: "add", args: [item, amount], raw: input };
    }

    if (["ginger", "cardamom"].includes(item)) {
      return { valid: true, action: "add", args: [item, true], raw: input };
    }

    if (item === "coffee") {
      return {
        valid: false,
        action: "coffee_error",
        raw: input,
        error: `ERROR CHAI_001\n\nCoffee detected.\nThis compiler only supports chai.\n\nTry:\nchai.add tea 2`,
      };
    }

    return {
      valid: false,
      action: "add_error",
      raw: input,
      error: `ERROR CHAI_103: Unknown ingredient '${item}'.\nSupported ingredients: tea, milk, sugar, ginger, cardamom.`,
    };
  }

  // chai.remove
  if (subCommand === "chai.remove") {
    const item = (args[0] || "").toLowerCase();
    if (!item) {
      return {
        valid: false,
        action: "remove_error",
        raw: input,
        error: `ERROR CHAI_104: Missing ingredient to remove.\nUsage: chai.remove <tea|milk|sugar|ginger|cardamom>`,
      };
    }
    return { valid: true, action: "remove", args: [item], raw: input };
  }

  // chai.foam
  if (subCommand === "chai.foam") {
    const type = (args[0] || "").toLowerCase();
    if (!["small", "medium", "large", "chaotic"].includes(type)) {
      return {
        valid: false,
        action: "foam_error",
        raw: input,
        error: `ERROR CHAI_105: Invalid foam profile.\nSupported options: small | medium | large | chaotic`,
      };
    }
    return { valid: true, action: "foam", args: [type], raw: input };
  }

  // chai.bubbles
  if (subCommand === "chai.bubbles") {
    const density = parseInt(args[0], 10);
    if (isNaN(density) || density < 0 || density > 100) {
      return {
        valid: false,
        action: "bubbles_error",
        raw: input,
        error: `ERROR CHAI_106: Invalid bubble density.\nPlease enter a percentage between 0 and 100 (e.g. chai.bubbles 85).`,
      };
    }
    return { valid: true, action: "bubbles", args: [density], raw: input };
  }

  // chai.boil
  if (subCommand === "chai.boil") {
    const temp = parseInt(args[0], 10);
    if (isNaN(temp) || temp < 0 || temp > 100) {
      return {
        valid: false,
        action: "boil_error",
        raw: input,
        error: `ERROR CHAI_107: Invalid boil temperature.\nPlease enter a value between 0 and 100 (e.g. chai.boil 90).`,
      };
    }
    return { valid: true, action: "boil", args: [temp], raw: input };
  }

  return {
    valid: false,
    action: "unknown",
    raw: input,
    error: `ERROR CHAI_404: Unknown command '${subCommand}'.\nType chai.help for available commands.`,
  };
}
