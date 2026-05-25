import ScreenContainer from "@/components/common/layout/ScreenContainer";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, loading } = useLogin();

    const handleLogin = async () => {
        const response = await login({
            email,
            password,
        });

        if (!response) {
            Toast.show({
                type: "error",
                text1: "Login Failed",
                text2: "Invalid email or password",
            });

            return;
        }

        Toast.show({
            type: "success",
            text1: "Success",
            text2: response.message,
        });

        console.log(response.data.access_token);
        console.log(response.data.user);
    };

    return (
        <ScreenContainer>
            <>
                <View className="mb-8">
                    <Text className="text-3xl font-semibold text-text-primary">
                        Welcome Back
                    </Text>

                    <Text className="text-sm leading-5 text-text-secondary mt-1.5">
                        Login to continue managing your pet
                        appointments and schedules.
                    </Text>
                </View>

                <View className="bg-surface border border-border rounded-2xl px-5 py-5 mb-5">
                    <Text className="text-[11px] text-text-muted uppercase tracking-wide mb-1.5">
                        Account Access
                    </Text>

                    <Text className="text-base font-semibold text-text-primary">
                        Secure Login Portal
                    </Text>
                </View>

                <View className="gap-4">
                    <View>
                        <Text className="text-sm font-medium text-text-primary mb-2">
                            Email
                        </Text>

                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor="#94A3B8"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-text-primary mb-2">
                            Password
                        </Text>

                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            placeholderTextColor="#94A3B8"
                            secureTextEntry
                            className="bg-surface border border-border rounded-2xl px-4 py-4 text-text-primary"
                        />
                    </View>

                    <Pressable
                        onPress={handleLogin}
                        disabled={loading}
                        className="bg-cyan-500 rounded-2xl py-4 items-center mt-2 active:opacity-80"
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className="text-white font-semibold text-base">
                                Login
                            </Text>
                        )}
                    </Pressable>
                </View>
            </>
        </ScreenContainer>
    );
}