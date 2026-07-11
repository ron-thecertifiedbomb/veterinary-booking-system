process.env.EXPO_PUBLIC_APP_ENV = "test";
process.env.EXPO_PUBLIC_API_WEB = "http://localhost:3000";
process.env.EXPO_PUBLIC_API_MOBILE = "http://localhost:3000";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
