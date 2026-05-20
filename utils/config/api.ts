import { Platform } from "react-native";

const platform = Platform.OS;

console.log("Running on platform:", platform);

export const API =
  platform === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

console.log("Using API base URL:", API);
