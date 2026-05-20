import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";

type NavItem = {
    label: string;
    path: string;
};

type NavbarProps = {
    items: NavItem[];
};

export default function Navbar({ items }: NavbarProps) {
    const router = useRouter();
    const path = usePathname();

    return (
        <View className="w-full bg-white px-6 py-4 flex-row justify-between">
            <Text className="text-xl font-bold">🐾 Vet Booking</Text>

            <View className="flex-row gap-4">
                {items.map((item) => (
                    <TouchableOpacity
                        key={item.path}
                        onPress={() => router.push(item.path)}
                    >
                        <Text
                            style={{
                                color: path === item.path ? "blue" : "black",
                            }}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}