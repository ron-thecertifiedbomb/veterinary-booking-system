import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";
import { useAllGetStaff } from "@/features/staff/hook/useGetAllStaff";
import { useEffect } from "react";
import {
    Text,
    View,
    FlatList,
    ActivityIndicator,
} from "react-native";

export default function Staff() {
    const { fetchAllStaff, allStaff, loading } = useAllGetStaff();

    useEffect(() => {
        fetchAllStaff();
    }, []);

    const renderItem = ({ item }: { item: AuthenticatedUser }) => {
        const initials = item.name
            ?.split(" ")
            .map((n) => n[0])
            .join("");

        return (
            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-slate-100 max-w-3xl mx-auto w-full">

                {/* Header */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">

                        {/* Avatar */}
                        <View className="w-11 h-11 rounded-full bg-black items-center justify-center">
                            <Text className="text-white font-semibold text-sm">
                                {initials}
                            </Text>
                        </View>

                        {/* Name + Role */}
                        <View>
                            <Text className="font-semibold text-slate-800 text-base">
                                {item.name}
                            </Text>
                            <Text className="text-xs text-slate-500">
                                {item.staffProfile?.position}
                            </Text>
                        </View>
                    </View>

                    {/* Status */}
                    <View
                        className={`px-3 py-1 rounded-full ${item.isActive ? "bg-green-100" : "bg-gray-200"
                            }`}
                    >
                        <Text
                            className={`text-xs font-medium ${item.isActive ? "text-green-600" : "text-gray-600"
                                }`}
                        >
                            {item.isActive ? "Active" : "Inactive"}
                        </Text>
                    </View>
                </View>

                {/* Divider */}
                <View className="h-px bg-slate-100 my-3" />

                {/* Details */}
                <View className="gap-1">
                    <Text className="text-xs text-slate-500">
                        Specialization:
                        <Text className="text-slate-700 font-medium">
                            {" "}{item.staffProfile?.specialization}
                        </Text>
                    </Text>

                    <Text className="text-xs text-slate-500">
                        License:
                        <Text className="text-slate-700 font-medium">
                            {" "}{item.staffProfile?.licenseNumber}
                        </Text>
                    </Text>

                    <Text className="text-xs text-slate-500 mt-1">
                        📧 {item.email}
                    </Text>

                    <Text className="text-xs text-slate-500">
                        📞 {item.phone}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <Container className="flex-1  bg-background px-4 justify-center">
<View className="max-w-4xl m-auto justify-center items-center py-8">
                <HeaderSection
                    title="Staff Management"
         
                />
            </View>
            {/* Loading */}
            {loading ? (
                <Loader fullScreen />
            ) : (
                <FlatList
                    data={allStaff || []}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </Container>
    );
}