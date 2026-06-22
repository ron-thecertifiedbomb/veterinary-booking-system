// src/app/(admin-app)/_index.tsx
import { Redirect } from "expo-router";

export default function Index() {
    return <Redirect href="(staff--app)/(tabs)/dashboard" />;
}