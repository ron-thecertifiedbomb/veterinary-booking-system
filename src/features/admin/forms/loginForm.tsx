import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import { loginSchema } from "@/features/auth/schemas/login.schema";

type LoginFormProps = {
    loading?: boolean;
    onSubmit: (data: { email: string; password: string }) => void;
    onRegisterPress?: () => void; // ✅ FIX HERE
};

export default function LoginForm({
    loading,
    onSubmit,
    onRegisterPress,
}: LoginFormProps) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSubmit = () => {
        setEmailError(null);
        setPasswordError(null);

        const result = loginSchema.safeParse({
            email,
            password,
        });

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;

            if (errors.email) {
                setEmailError(errors.email[0]);
            }
            if (errors.password) {
                setPasswordError(errors.password[0]);
            }
            return;
        }

        onSubmit(result.data);
    };

    return (
        <View className="w-full max-w-md px-6 py-8">

            <View className="mb-8 items-center">
                <Text className="text-3xl font-semibold text-text-primary">
                    Sign in
                </Text>
                <Text className="text-xs text-text-secondary mt-1">
                    Login to continue managing your pet appointments.
                </Text>
            </View>

            {/* ✅ EMAIL */}
            <AppTextInput
                label="Email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setEmailError(null);
                }}
                placeholder="Enter your email"
                keyboardType="email-address"
                error={emailError}
            />

            {/* ✅ PASSWORD (NOW SAME COMPONENT 🔥) */}
            <AppTextInput
                label="Password"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError(null);
                }}
                placeholder="Enter your password"
                secureTextEntry={!isPasswordVisible}
                error={passwordError}
                rightIcon={
                    <Ionicons
                        name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                        size={22}
                        color="#6b7280"
                    />
                }
                onRightIconPress={() =>
                    setIsPasswordVisible((prev) => !prev)
                }
            />

            {/* LOGIN BUTTON */}
            <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className="bg-black rounded-2xl py-4 items-center mt-6"
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text className="text-white font-semibold">
                        Login
                    </Text>
                )}
            </Pressable>

            {/* REGISTER */}
            <View className="mt-2 items-center">
                <Text className="text-sm text-text-secondary">
                    Don't have an account?
                </Text>
                <Pressable onPress={onRegisterPress}>
                    <Text className="text-sm font-semibold text-secondary mt-1">
                        Register here
                    </Text>
                </Pressable>
            </View>

        </View>
    );
}