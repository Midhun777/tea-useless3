/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ["'Caveat'", "cursive"],
        display: ["'Kalam'", "cursive"],
        technical: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
      },
      colors: {
        paper: {
          DEFAULT: "#FAF6EE",
          dark: "#F3EBDD",
          warm: "#EFE4D2",
          border: "#E2D5C0",
        },
        chai: {
          DEFAULT: "#5C2C16",
          dark: "#3D1B0B",
          light: "#8A4B29",
          foam: "#F7EFE1",
        },
        ink: {
          DEFAULT: "#1E1610",
          light: "#3F3227",
          faint: "#7A685A",
        },
        terracotta: {
          DEFAULT: "#C85A32",
          dark: "#9E3D1A",
          light: "#DE764E",
        },
        saffron: {
          DEFAULT: "#E89635",
          light: "#F4B362",
          dark: "#BA6B16",
        },
        foam: {
          DEFAULT: "#FBF5EB",
          cream: "#F5EAD4",
          border: "#EBD9BE",
        },
      },
      boxShadow: {
        'sketch': '2px 3px 0px #1E1610',
        'sketch-lg': '4px 6px 0px #1E1610',
        'sketch-hover': '5px 8px 0px #1E1610',
        'sketch-sm': '1px 2px 0px #1E1610',
      },
      borderRadius: {
        'organic': '255px 15px 225px 15px/15px 225px 15px 255px',
        'organic-lg': '255px 25px 225px 25px/25px 225px 25px 255px',
        'organic-sm': '120px 10px 110px 10px/10px 110px 10px 120px',
      },
    },
  },
  plugins: [],
};
