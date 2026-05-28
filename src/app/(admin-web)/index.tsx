// src/app/(admin-web)/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
    return <Redirect href="/(admin-web)/dashboard" />;
}
