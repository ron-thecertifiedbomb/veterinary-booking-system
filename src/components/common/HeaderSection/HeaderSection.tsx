import { Text, View } from "react-native";
import { formatDate } from "@/utils/dateandtime/date";

type Props = {
    title: string;
    description?: string;
    date: string | null;

};

export default function HeaderSection({
    title,
    description,
    date,

}: Props) {
    return (
        

        <View className="w-full mb-4">
                <View>
                    <Text className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary">
                        {title}
                    </Text>
                    {description && (
                        <Text className="text-sm text-text-secondary mt-1 leading-relaxed">
                            {description}
                        </Text>
                )}
             
                <Text className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary">
                    {date}
                    </Text>
            
                </View>
            </View>  
    );
}