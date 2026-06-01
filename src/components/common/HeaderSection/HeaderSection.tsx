import { Text, View } from "react-native";
import { formatDate } from "@/utils/dateandtime/date";

type Props = {
    title: string;
    description?: string;
    date?: string;
    time?: string;
};

export default function HeaderSection({
    title,
    description,
    date,
    time,
}: Props) {
    return (
        <>

            <View className="w-full max-w-3xl m-auto mb-4">

                {/* ✅ TEXT HEADER */}
                <View className="mb-6 px-2">
                    <Text className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary">
                        {title}
                    </Text>

                    {description && (
                        <Text className="text-sm text-text-secondary mt-1 leading-relaxed">
                            {description}
                        </Text>
                    )}
                </View>

                {/* ✅ DATE CARD */}
                <View
                    className="bg-white border border-border rounded-2xl px-6 py-5"
                    style={{
                        boxShadow: "0px 10px 30px rgba(2,6,23,0.06)",
                    }}
                >
                    <Text className="text-[14px] uppercase tracking-wide text-text-muted">
                        Today is
                    </Text>
                    {date && (
                    <Text className="text-lg font-medium text-text-primary">
                        {formatDate(date)}
                    </Text>
                    )}
                    {time && (
                        <Text className="text-xs text-text-secondary mt-1">
                            {time}
                        </Text>
                    )}
                </View>

            </View>
        </>
    );
}