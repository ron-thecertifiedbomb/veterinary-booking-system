/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/utils/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // 🌤️ BASE (DOCKER-LIKE LIGHT)
        background: "#f9fafb", // very soft gray page background
        surface: "#ffffff", // cards / panels
        surfaceSoft: "#f3f4f6", // subtle sections
        border: "#e5e7eb", // dividers

        // 🧠 TEXT SYSTEM
        text: {
          primary: "#111827", // strong but not pure black
          secondary: "#6b7280", // description text
          muted: "#9ca3af", // low priority text
        },

        // ⚡ SUBTLE ACCENT (DOCKER STYLE — NOT LOUD)
        accent: "#2563eb", // soft professional blue
        accentSoft: "#eff6ff", // background tint
        accentBorder: "#dbeafe", // border tint

        // ✅ STATUS COLORS (OPTIONAL)
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },

      // ✅ SOFT MODERN RADIUS
      borderRadius: {
        lg: "10px",
        xl: "14px",
        "2xl": "18px",
      },

      // ✅ TYPOGRAPHY SCALE (CLEAN SaaS)
      fontSize: {
        hero: ["30px", { lineHeight: "36px" }],
        h1: ["24px", { lineHeight: "30px" }],
        h2: ["20px", { lineHeight: "26px" }],
        base: ["16px", { lineHeight: "22px" }],
        sm: ["14px", { lineHeight: "20px" }],
      },

      // ✅ SUBTLE BRAND CHARACTER
      letterSpacing: {
        widePlus: "0.05em",
      },
    },
  },
  plugins: [],
};
