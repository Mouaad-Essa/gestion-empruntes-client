/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        secondary: "#FACC15",
        light: {
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
        },
        dark: {
          100: "#1E293B",
          200: "#334155",
          300: "#475569",
        },
      },
    },
  },
  plugins: [],
};
