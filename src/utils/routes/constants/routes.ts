export const routes = {
  admin: {
    web: "/(admin-web)/dashboard",
    app: "/(admin-web)/dashboard",
  },
  staff: {
    web: "/(staff-app)/(tabs)/dashboard",
    app: "/(staff-app)/(tabs)/dashboard",
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
