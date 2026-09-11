/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#fff8ed",
          100: "#ffefd3",
          200: "#ffdaa5",
          300: "#ffbe6d",
          400: "#ff9632",
          500: "#ff760a",
          600: "#f05a00",
          700: "#c74102",
          800: "#9e3408",
          900: "#7f2d0b",
          950: "#451403",
        },
        surface: {
          DEFAULT: "#0f0a06",
          50:  "#1e140c",
          100: "#271a10",
          200: "#3a2518",
          300: "#4d3021",
          400: "#6b4530",
        },
      },
      backgroundImage: {
        "foam-gradient": "radial-gradient(ellipse at top, #3a2518 0%, #0f0a06 70%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.35s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
