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
        <View className="w-full items-center mt-6">

            {/* ✅ CENTERED CONTENT */}
            <View className="flex-row items-center justify-between w-full max-w-md px-4">

                {/* ✅ BRAND */}
                <Text className="text-text-primary font-semibold text-base">
                    🐾 VetBook
                </Text>

                {/* ✅ NAV LINKS */}
                <View className="flex-row items-center gap-6">
                    {items.map((item) => {
                        const active = path === item.path;

                        return (
                            <TouchableOpacity
                                key={item.path}
                                onPress={() => router.push(item.path)}
                            >
                                <View className="items-center">

                                    <Text
                                        className={`text-sm font-medium ${active
                                                ? "text-black"        
                                    : "text-text-secondary"
                    }`}
                  >
                                    {item.label}
                                </Text>

                                {/* ✅ subtle indicator */}
                                {active && (
                                    <View className="mt-1 h-[2px] w-4 bg-black rounded-full" />
                                )}
                            </View>

              </TouchableOpacity>
                );
          })}
            </View>

        </View>
    </View >
  );
}