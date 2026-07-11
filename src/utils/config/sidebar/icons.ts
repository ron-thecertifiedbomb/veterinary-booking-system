import { Ionicons } from "@expo/vector-icons";

export const NAV_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Dashboard: "grid-outline",
  "Staff Management": "people-outline",
  "Customer Management": "person-outline",
  Appointments: "calendar-outline",
  Patients: "medkit-outline",
  Reports: "document-text-outline",
  Analytics: "bar-chart-outline",
  Settings: "settings-outline",
  Home: "home-outline",
  Pets: "paw-outline",
  Profile: "person-circle-outline",
};

export function getNavIcon(label: string): keyof typeof Ionicons.glyphMap {
  return NAV_ICONS[label] ?? "ellipse-outline";
}
