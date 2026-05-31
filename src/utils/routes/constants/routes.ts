export const routes = {
  admin: {
    web: "/(admin-web)/dashboard",
    app: "/(admin-app)/(tabs)/dashboard",
  },
  staff: {
    web: "/(app)/(tabs)/home",
    app: "/(staff-app)/(tabs)/home",
  },
  user: {
    web: "/(web)/web-home",
    app: "/(app)/(tabs)/home",
  },
  public: {
    web: "/(auth)/login",
    app: "/(auth)/login",
  },
};
