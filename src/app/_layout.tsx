// src/app/_layout.tsx

import "@/global.css";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    // By wrapping the entire app in an AuthProvider, we create a single
    // source of truth for authentication state, which is loaded only once.

    <Slot />

  );
}