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
      fontFamily: {
        sans: ["Inter_400Regular", "Inter", "system-ui", "sans-serif"],
        medium: ["Inter_500Medium", "Inter", "system-ui", "sans-serif"],
        semibold: ["Inter_600SemiBold", "Inter", "system-ui", "sans-serif"],
        bold: ["Inter_700Bold", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        sidebar: "#0a0a0a",
        sidebarHover: "#171717",
        sidebarActive: "#1f1f1f",
        sidebarText: "#a3a3a3",
        sidebarTextActive: "#ffffff",
        sidebarSection: "#737373",

        accent: "#0a0a0a",
        accentDark: "#000000",
        accentSoft: "#f5f5f5",
        accentText: "#ffffff",

        canvas: "#fafafa",
        surface: "#ffffff",
        surfaceMuted: "#f7f7f7",
        border: "#ebebeb",
        borderStrong: "#d4d4d4",

        clinical: "#0a0a0a",

        text: {
          primary: "#0a0a0a",
          secondary: "#525252",
          muted: "#737373",
          inverse: "#ffffff",
        },

        success: "#166534",
        successBg: "#f0fdf4",
        warning: "#a16207",
        warningBg: "#fffbeb",
        danger: "#b91c1c",
        dangerBg: "#fef2f2",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
      },
      spacing: {
        4.5: "18px",
        13: "52px",
        15: "60px",
        18: "72px",
      },
      fontSize: {
        pageTitle: ["24px", { lineHeight: "30px", fontWeight: "700", letterSpacing: "-0.025em" }],
        h2: ["16px", { lineHeight: "22px", fontWeight: "600", letterSpacing: "-0.015em" }],
        body: ["15px", { lineHeight: "22px" }],
        sm: ["13px", { lineHeight: "19px" }],
        xs: ["12px", { lineHeight: "17px" }],
        micro: ["11px", { lineHeight: "15px", fontWeight: "600", letterSpacing: "0.06em" }],
      },
      letterSpacing: {
        label: "0.05em",
        clinical: "0.06em",
      },
    },
  },
  plugins: [],
};
