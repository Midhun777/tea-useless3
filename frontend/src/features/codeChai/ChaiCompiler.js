import { parseChaiCommand, HELP_TEXT } from "./ChaiParser";

/**
 * ChaiCompiler — Executes parsed commands against the recipe state.
 * @param {string} input
 * @param {object} recipe
 * @param {function} updateRecipe
 * @returns {{ output: string, type: 'success'|'info'|'warning'|'error', action?: string }}
 */
export function executeChaiCommand(input, recipe, updateRecipe) {
  const parsed = parseChaiCommand(input);

  if (!parsed.valid) {
    return {
      output: parsed.error || "ERROR CHAI_400: Could not parse command.",
      type: "error",
    };
  }

  // Enforce chai.init check for recipe manipulation
  if (!recipe.initialized && parsed.action !== "init" && parsed.action !== "help" && parsed.action !== "reset") {
    return {
      output: `ERROR CHAI_000: Environment uninitialized.\n\nPlease initialize ChaiScript before programming your chai:\n$ chai.init`,
      type: "error",
    };
  }

  switch (parsed.action) {
    case "init": {
      updateRecipe({ initialized: true });
      return {
        output: "✓ ChaiScript environment initialized.\nReady for recipe configuration.",
        type: "success",
      };
    }

    case "help": {
      return {
        output: HELP_TEXT,
        type: "info",
      };
    }

    case "add": {
      const [item, amount] = parsed.args;

      if (item === "tea") {
        const newTotal = (recipe.tea || 0) + amount;
        updateRecipe({ tea: newTotal });
        if (newTotal > 8) {
          return {
            output: `✓ Added ${amount} spoons of tea (Total: ${newTotal}).\n\nWARNING CHAI_008: Extreme astringency detected.\nThis tea could dissolve small metal utensils. Proceed with caution.`,
            type: "warning",
          };
        }
        return {
          output: `✓ Added ${amount} spoon${amount > 1 ? "s" : ""} of tea (Total: ${newTotal}).`,
          type: "success",
        };
      }

      if (item === "milk") {
        const newTotal = (recipe.milk || 0) + amount;
        updateRecipe({ milk: newTotal });
        if (newTotal > 300) {
          return {
            output: `✓ Added ${amount}ml milk (Total: ${newTotal}ml).\n\nWARNING CHAI_300: High dairy ratio.\nYour chai is approaching warm milk status with tea flavorings.`,
            type: "warning",
          };
        }
        return {
          output: `✓ Added ${amount}ml milk (Total: ${newTotal}ml).`,
          type: "success",
        };
      }

      if (item === "sugar") {
        const newTotal = (recipe.sugar || 0) + amount;
        updateRecipe({ sugar: newTotal });
        if (newTotal >= 15) {
          return {
            output: `✓ Added ${amount} spoons of sugar (Total: ${newTotal}).\n\nWARNING CHAI_017\n${newTotal} spoons of sugar detected.\nThis is no longer tea.\nThis is a caramel-based software project.`,
            type: "warning",
          };
        }
        return {
          output: `✓ Added ${amount} spoon${amount > 1 ? "s" : ""} of sugar (Total: ${newTotal}).`,
          type: "success",
        };
      }

      if (item === "ginger") {
        updateRecipe({ ginger: true });
        return {
          output: "✓ Crushed ginger root added.\nMeniscus warmth coefficient increased.",
          type: "success",
        };
      }

      if (item === "cardamom") {
        updateRecipe({ cardamom: true });
        return {
          output: "✓ Aromatic green cardamom added.\nThermodynamic aroma enhanced.",
          type: "success",
        };
      }
      break;
    }

    case "remove": {
      const item = parsed.args[0];
      if (item === "ginger") {
        updateRecipe({ ginger: false });
        return { output: "✓ Removed ginger.", type: "success" };
      }
      if (item === "cardamom") {
        updateRecipe({ cardamom: false });
        return { output: "✓ Removed cardamom.", type: "success" };
      }
      if (["tea", "milk", "sugar"].includes(item)) {
        updateRecipe({ [item]: 0 });
        return { output: `✓ Reset ${item} amount to 0.`, type: "success" };
      }
      return { output: `ERROR CHAI_108: Could not remove '${item}'.`, type: "error" };
    }

    case "foam": {
      const profile = parsed.args[0];
      updateRecipe({ foam: { ...recipe.foam, type: profile } });
      return {
        output: `✓ Foam profile updated: ${profile.toUpperCase()}`,
        type: "success",
      };
    }

    case "bubbles": {
      const density = parsed.args[0];
      updateRecipe({ foam: { ...recipe.foam, density } });
      if (density === 100) {
        return {
          output: `✓ Bubble density set to 100%.\n\nWARNING CHAI_100\nMaximum bubble density reached.\nCHAOS MODE ENABLED.`,
          type: "warning",
        };
      }
      return {
        output: `✓ Bubble density set to ${density}%.`,
        type: "success",
      };
    }

    case "boil": {
      const temp = parsed.args[0];
      updateRecipe({ boil: temp });
      if (temp >= 95) {
        return {
          output: `✓ Boil intensity set to ${temp}%.\n\nWARNING CHAI_099: Vigorous boiling detected.\nKeep tea pan monitored to prevent countertop overflow.`,
          type: "warning",
        };
      }
      return {
        output: `✓ Boil intensity set to ${temp}%.`,
        type: "success",
      };
    }

    case "stir": {
      updateRecipe({ stirred: true });
      return {
        output: "✓ Chai mixture stirred thoroughly.\nSpices and sweetness harmonized.",
        type: "success",
      };
    }

    case "status": {
      const { tea, milk, sugar, ginger, cardamom, foam, boil, stirred } = recipe;
      const statusBox = `
╭──────────────────────────────────────────╮
│ CURRENT CHAI BUILD CONFIGURATION         │
├──────────────────────────────────────────┤
│ Tea Leaves     ${String(tea + " spoons").padEnd(25)} │
│ Milk           ${String(milk + " ml").padEnd(25)} │
│ Sugar          ${String(sugar + " spoons").padEnd(25)} │
│ Ginger         ${(ginger ? "✓ Enabled" : "✗ None").padEnd(25)} │
│ Cardamom       ${(cardamom ? "✓ Enabled" : "✗ None").padEnd(25)} │
│                                          │
│ Foam Profile   ${String((foam?.type || "medium").toUpperCase()).padEnd(25)} │
│ Bubble Density ${String((foam?.density || 50) + "%").padEnd(25)} │
│ Boil Intensity ${String(boil + "%").padEnd(25)} │
│ Stirred        ${(stirred ? "✓ Yes" : "✗ No").padEnd(25)} │
╰──────────────────────────────────────────╯`.trim();

      return {
        output: statusBox,
        type: "info",
      };
    }

    case "brew": {
      // Validate minimum ingredients
      if (recipe.tea === 0 && recipe.milk === 0) {
        return {
          output: `ERROR CHAI_404\n\nTea not found.\nYou have successfully created hot milk & air.\n\nAdd tea before brewing:\n$ chai.add tea 2`,
          type: "error",
        };
      }
      if (recipe.tea === 0) {
        return {
          output: `ERROR CHAI_404\n\nNo tea leaves detected.\nYou have created hot sweetened milk.\n\nAdd tea leaves:\n$ chai.add tea 2`,
          type: "error",
        };
      }

      return {
        output: "✓ Recipe valid. Starting compilation pipeline...",
        type: "success",
        action: "brew",
      };
    }

    case "reset": {
      updateRecipe({
        initialized: true,
        tea: 0,
        milk: 0,
        sugar: 0,
        ginger: false,
        cardamom: false,
        foam: { type: "medium", density: 50 },
        boil: 50,
        stirred: false,
      });
      return {
        output: "✓ Recipe reset to blank slate.",
        type: "info",
      };
    }

    case "debug": {
      return {
        output: `DEBUG MODE\n\nUseful functionality: 12%\nUnnecessary complexity: 88%\nReason for existence: unknown.\nStatus: deliciously over-engineered.`,
        type: "info",
      };
    }

    case "chaos": {
      updateRecipe({
        tea: 5,
        milk: 180,
        sugar: 8,
        ginger: true,
        cardamom: true,
        foam: { type: "chaotic", density: 95 },
        boil: 95,
        stirred: true,
      });
      return {
        output: "✓ CHAOS MODE ACTIVATED.\nMaximum ginger, high boil, chaotic foam profile loaded.",
        type: "warning",
      };
    }

    case "secret": {
      return {
        output: `☕ SECRET CHAI LORE:\nThe secret to authentic highway dhaba chai is boiling the milk twice and pouring from a height of exactly 1.4 meters.`,
        type: "info",
      };
    }

    default:
      return {
        output: "ERROR CHAI_400: Command not supported.",
        type: "error",
      };
  }
}
