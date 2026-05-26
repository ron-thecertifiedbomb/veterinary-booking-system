import ScreenContainer from "@/components/common/layout/ScreenContainer";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, loading } = useLogin();

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleLogin = async () => {
        setEmailError(null);
        setPasswordError(null);

        let hasError = false;

        if (!email) {
            setEmailError("Email is required");
            hasError = true;
        }

        if (!password) {
            setPasswordError("Password is required");
            hasError = true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email && !emailRegex.test(email)) {
            setEmailError("Invalid email format");
            hasError = true;
        }

        if (hasError) return;

        const response = await login({ email, password });

        if (!response) return;

        const isWeb = Platform.OS === "web";

        if (response.user.role === "ADMIN") {
            router.replace(
                isWeb
                    ? "/(admin-web)/dashboard"
                    : "/(admin-app)/dashboard"
            );
            return;
        }

        router.replace(
            isWeb
                ? "/(web)/home"
                : "/(app)/home"
        );
    };

    // ✅ ✅ RETURN MUST BE HERE
    return (
        <ScreenContainer>
            <View className="flex-1 justify-center items-center">
                <View className="w-full max-w-md px-6">
                    <View className="mb-8 flex justify-center items-center">
                        <Text className="text-3xl font-semibold text-text-primary">
                            Welcome
                        </Text>
                        <Text className="text-sm leading-5 text-text-secondary mt-1.5">
                            Login to continue managing your pet appointments.
                        </Text>
                    </View>

                    <View className="gap-4">
                        {/* EMAIL */}
                        <View>
                            <Text className="text-sm font-medium text-text-primary mb-2">
                                Email
                            </Text>

                            <TextInput
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setEmailError(null);
                                }}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                className={`bg-surface rounded-2xl px-4 py-4 text-text-primary border-[0.5px] ${emailError ? "border-red-500" : "border-border"
                                    }`}
                            />

                            {emailError && (
                                <Text className="text-red-500 text-xs mt-2">
                                    {emailError}
                                </Text>
                            )}
                        </View>

                        {/* PASSWORD */}
                        <View>
                            <Text className="text-sm font-medium text-text-primary mb-2">
                                Password
                            </Text>

                            <TextInput
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setPasswordError(null);
                                }}
                                placeholder="Enter your password"
                                secureTextEntry
                                className={`bg-surface rounded-2xl px-4 py-4 border-[0.5px] text-text-primary ${passwordError ? "border-red-500" : "border-border"
                                    }`}
                            />

                            {passwordError && (
                                <Text className="text-red-500 text-xs mt-2">
                                    {passwordError}
                                </Text>
                            )}
                        </View>

                        {/* LOGIN BUTTON */}
                        <Pressable
                            onPress={handleLogin}
                            disabled={loading}
                            className="bg-black rounded-2xl py-4 items-center mt-2 active:opacity-80"
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text className="text-white font-semibold text-base">
                                    Login
                                </Text>
                            )}
                        </Pressable>

                        {/* REGISTER */}
                        <View className="mt-6 items-center">
                            <Text className="text-sm text-text-secondary">
                                Don’t have an account?
                            </Text>

                            <Pressable
                                onPress={() => router.push("/(auth)/register")}
                            >
                                <Text className="text-sm font-semibold text-secondary mt-1">
                                    Register here
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </ScreenContainer>
    );
}
