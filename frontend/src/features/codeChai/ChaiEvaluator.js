/**
 * ChaiEvaluator — Evaluates user recipe parameters and generates quality score,
 * rating tier, title, and humorous tea sommelier critique.
 */

export function evaluateChaiQuality(recipe) {
  const {
    tea = 0,
    milk = 0,
    sugar = 0,
    ginger = false,
    cardamom = false,
    foam = { type: "medium", density: 50 },
    boil = 50,
    stirred = false,
  } = recipe;

  let score = 50; // base score
  let badge = "DECENT";
  let title = "Decent Street Stall Chai";
  let description = "A reasonable cup of tea. Drinkable without complaints.";
  let color = "#E89635"; // amber

  const totalVol = Math.max(1, tea * 30 + milk);
  const teaRatio = (tea * 30) / totalVol;

  // 1. Extreme Edge Cases
  if (sugar >= 12) {
    return {
      score: 18,
      rating: "TERRIBLE",
      title: "🍯 Diabetic Caramel Syrup",
      description: "This is no longer tea. This is liquid molasses with tea flavoring. A dentist's worst nightmare.",
      color: "#D97706",
      flavorNotes: ["Excessive Sweetness", "Zero Astringency", "Sticky Meniscus"],
    };
  }

  if (tea >= 7 && milk < 40) {
    return {
      score: 22,
      rating: "HAZARDOUS",
      title: "⚡ Battery Acid Black Tar",
      description: "Industrial strength decoction. Will strip paint off wooden tables and dissolve spoon handles.",
      color: "#DC2626",
      flavorNotes: ["Lethal Tannins", "Zero Creaminess", "Sleep Deprivation"],
    };
  }

  if (milk > 200 && tea <= 1) {
    return {
      score: 30,
      rating: "QUESTIONABLE",
      title: "🥛 Sad Warm Milk",
      description: "You have created warm milk that briefly glanced at a tea bag from across the room.",
      color: "#9CA3AF",
      flavorNotes: ["Heavy Dairy", "Missing Tea", "Existential Regret"],
    };
  }

  // 2. High Quality Combinations
  if (tea >= 2 && tea <= 4 && milk >= 80 && milk <= 160 && sugar >= 1 && sugar <= 4) {
    score += 25;

    if (ginger && cardamom && boil >= 70 && stirred) {
      score = 98;
      return {
        score: 98,
        rating: "LEGENDARY",
        title: "🌟 Masterpiece Dhaba Kadak",
        description: "Absolute perfection! Rich aroma, balanced creaminess, warming ginger throat heat, and cardamom top notes.",
        color: "#16A34A",
        flavorNotes: ["Velvety Menu", "Aromatic Spices", "Golden Meniscus"],
      };
    }

    if (ginger || cardamom) {
      score = 88;
      return {
        score: 88,
        rating: "GREAT",
        title: "☕ Artisanal Masala Chai",
        description: "Sublime tea flavor with delightful spice notes. Highly recommended for afternoon tea rituals.",
        color: "#059669",
        flavorNotes: ["Balanced Cream", "Warm Spices", "Satisfying Finish"],
      };
    }

    return {
      score: 82,
      rating: "GREAT",
      title: "🫖 Classic Cutting Chai",
      description: "Smooth, satisfying, and authentically brewed cutting chai. Ready for immediate biscuit dunking.",
      color: "#2563EB",
      flavorNotes: ["Classic Flavor", "Balanced Sweetness", "Stall Quality"],
    };
  }

  // 3. Medium & Moderate Builds
  if (boil < 30) {
    score -= 15;
    title = "❄️ Lukewarm Steam-less Tea";
    description = "Under-boiled tea. Lacks the kinetic froth energy of a proper boiling kettle.";
    badge = "QUESTIONABLE";
    color = "#E11D48";
  } else if (!stirred) {
    score -= 10;
    title = "🥄 Unstirred Stratified Layer";
    description = "Sugar sits at the bottom while milk floats on top. Give it a stir with chai.stir!";
    badge = "DECENT";
  }

  return {
    score: Math.max(10, Math.min(100, score)),
    rating: badge,
    title,
    description,
    color,
    flavorNotes: ["Custom Blend", "Experimental Aeration", "Handcrafted"],
  };
}
