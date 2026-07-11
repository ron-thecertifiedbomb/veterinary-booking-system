/** Hospital / clinical design tokens — black primary, clean white surfaces. */
export const colors = {
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

  text: {
    primary: "#0a0a0a",
    secondary: "#525252",
    muted: "#737373",
    inverse: "#ffffff",
  },

  clinical: "#0a0a0a",

  success: "#166534",
  successBg: "#f0fdf4",
  warning: "#a16207",
  warningBg: "#fffbeb",
  danger: "#b91c1c",
  dangerBg: "#fef2f2",
} as const;

export const layout = {
  sidebarWidth: 260,
  contentMaxWidth: 960,
  panelRadius: 10,
  inputRadius: 8,
  buttonRadius: 8,
  clinicalStripe: 2,
  tabBarHeightIos: 52,
  tabBarHeightAndroid: 60,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
} as const;

export const iconSize = {
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
} as const;

export const fonts = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
} as const;
