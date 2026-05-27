/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
    "./src/utils/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#ffffff", // ✅ pure white
        surface: "#ffffff",
        surfaceSoft: "#f3f4f6",
        border: "#e5e7eb",

        text: {
          primary: "#111827",
          secondary: "#6b7280",
          muted: "#9ca3af",
        },

        accent: "#2563eb",
        accentSoft: "#eff6ff",
        accentBorder: "#dbeafe",

        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      borderRadius: {
        lg: "10px",
        xl: "14px",
        "2xl": "18px",
      },

      fontSize: {
        hero: ["30px", { lineHeight: "36px" }],
        h1: ["24px", { lineHeight: "30px" }],
        h2: ["20px", { lineHeight: "26px" }],
        base: ["16px", { lineHeight: "22px" }],
        sm: ["14px", { lineHeight: "20px" }],
      },

      letterSpacing: {
        widePlus: "0.05em",
      },
    },
  },
  plugins: [],
};
