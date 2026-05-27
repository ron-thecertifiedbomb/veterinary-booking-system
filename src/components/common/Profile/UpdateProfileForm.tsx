import ScreenContainer from "@/components/common/layout/ScreenContainer";
import { useUpdateProfile } from "@/features/users/hook/upeUpdateProfile";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";



export default function UpdateProfileForm() {
    const router = useRouter();

    const { updateProfile, loading } = useUpdateProfile();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);

    const noOutline =
        Platform.OS === "web"
            ? ({ outlineStyle: "none" } as any)
            : undefined;

    const handleUpdateProfile = async () => {
        setNameError(null);
        setEmailError(null);

        let hasError = false;

        if (!name) {
            setNameError("Name is required");
            hasError = true;
        }

        if (!email) {
            setEmailError("Email is required");
            hasError = true;
        }

        if (hasError) return;

        const response = await updateProfile({
            name,
            email,
            phone,
        });

        if (!response) return;

        // ✅ go back to profile
        router.back();
    };

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }} // ✅ center fix
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 justify-center items-center">
                        <View className="w-full max-w-md px-6 py-8">

                            {/* ✅ HEADER */}
                            <View className="mb-8 items-center">
                                <Text className="text-3xl font-semibold text-text-primary">
                                    Edit Profile
                                </Text>
                                <Text className="text-sm text-text-secondary mt-1 text-center">
                                    Update your account information.
                                </Text>
                            </View>

                            <View className="gap-4">

                                {/* ✅ NAME */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Full Name
                                    </Text>
                                    <TextInput
                                        value={name}
                                        onChangeText={(text) => {
                                            setName(text);
                                            setNameError(null);
                                        }}
                                        placeholder="e.g. John Doe"
                                        className="bg-surface rounded-2xl px-4 py-4"
                                        style={noOutline}
                                    />
                                    {nameError && (
                                        <Text className="text-red-500 text-xs mt-2">
                                            {nameError}
                                        </Text>
                                    )}
                                </View>

                                {/* ✅ EMAIL */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Email
                                    </Text>
                                    <TextInput
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            setEmailError(null);
                                        }}
                                        placeholder="e.g. john@email.com"
                                        keyboardType="email-address"
                                        className="bg-surface rounded-2xl px-4 py-4"
                                        style={noOutline}
                                    />
                                    {emailError && (
                                        <Text className="text-red-500 text-xs mt-2">
                                            {emailError}
                                        </Text>
                                    )}
                                </View>

                                {/* ✅ PHONE */}
                                <View>
                                    <Text className="text-sm font-medium mb-2">
                                        Phone (optional)
                                    </Text>
                                    <TextInput
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="e.g. 09123456789"
                                        keyboardType="phone-pad"
                                        className="bg-surface rounded-2xl px-4 py-4"
                                        style={noOutline}
                                    />
                                </View>

                                {/* ✅ BUTTON */}
                                <Pressable
                                    onPress={handleUpdateProfile}
                                    disabled={loading}
                                    className="bg-black rounded-2xl py-4 items-center mt-6 active:opacity-80"
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text className="text-white font-semibold text-base">
                                            Save Changes
                                        </Text>
                                    )}
                                </Pressable>

                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}