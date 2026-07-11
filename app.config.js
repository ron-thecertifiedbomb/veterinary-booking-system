export default ({ config }) => {
  // Use a reliable, un-prefixed variable for build-time configuration
  // Falls back to checking NODE_ENV or defaults to production
  const currentEnv = process.env.APP_ENV || process.env.NODE_ENV || "production";
  
  // Safely catches "staging" or "test"
  const isStaging = currentEnv === "staging" || currentEnv === "test";

  // Demo prod web uses staging API until api.rondev.com.ph has TLS on origin.
  const apiWeb =
    currentEnv === "production"
      ? "https://staging-api.rondev.com.ph"
      : process.env.EXPO_PUBLIC_API_WEB || "";
  const apiMobile =
    currentEnv === "production"
      ? "https://staging-api.rondev.com.ph"
      : process.env.EXPO_PUBLIC_API_MOBILE || "";

  return {
    ...config,

    name: isStaging ? "Rondev Vet System (Staging)" : "Rondev Vet System",
    slug: "rondev-vet-system-app",
    version: "1.0.0",
    orientation: "portrait",

    icon: "./assets/images/icon.png",
    scheme: "rondevmobileapp",
    userInterfaceStyle: "automatic", 

    ios: {
      icon: "./assets/images/icon.png",
      bundleIdentifier: isStaging
        ? "com.rondev.vet.system.staging"
        : "com.rondev.vet.system",
    },
    android: {
      jsEngine: "hermes", 
      package: isStaging
        ? "com.rondev.vet.system.staging"
        : "com.rondev.vet.system",
      
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ],
      usesCleartextTraffic: true, 

      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          image: "./assets/images/splash-icon.png",
          imageWidth: 100,
        },
      ],
      "expo-image",
    ],

    experiments: {
      typedRoutes: false,
      // Forces Expo Router to always know your custom application directory layout
      srcDir: "./src"
    },

    extra: {
      eas: {
        projectId: "8a8dbca3-6e42-4bb8-a9d5-8ec3357a835c",
      },
      appNode: currentEnv,
      appEnv: currentEnv,
      apiWeb,
      apiMobile,
    },
  };
};
