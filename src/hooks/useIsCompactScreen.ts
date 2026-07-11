import { Platform, useWindowDimensions } from "react-native";

/** Native app or narrow web viewport (mobile web). */
export function useIsCompactScreen() {
  const { width } = useWindowDimensions();
  const isNative = Platform.OS !== "web";
  const isCompact = isNative || width < 768;
  const isNarrow = isNative || width < 480;

  return { isCompact, isNarrow, isNative, width };
}
