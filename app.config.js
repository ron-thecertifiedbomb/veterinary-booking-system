import "dotenv/config";

export default ({ config }) => {
  const env = process.env.EXPO_PUBLIC_APP_ENV || "production";
  const isStaging = env === "staging";

  return {
    expo: {
      ...config.expo,

      name: isStaging ? "Rondev Vet System (Staging)" : "Rondev Vet System",

      android: {
        ...config.expo.android,
        package: isStaging
          ? "com.rondev.vet.system.staging"
          : "com.rondev.vet.system",
      },

      ios: {
        ...config.expo.ios,
        bundleIdentifier: isStaging
          ? "com.rondev.vet.system.staging"
          : "com.rondev.vet.system",
      },

      extra: {
        ...config.expo.extra,
        appEnv: env,
        apiWeb: process.env.EXPO_PUBLIC_API_WEB,
        apiMobile: process.env.EXPO_PUBLIC_API_MOBILE,
      },
    },
  };
};
