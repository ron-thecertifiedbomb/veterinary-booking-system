import { View } from "react-native";
import { ReactNode } from "react";

type ContainerProps = {
    children: ReactNode;
    className?: string;
};

export default function Container({ children, className = "" }: ContainerProps) {
    return (
        <View className={`bg-white flex-1 p-4 ${className}`}>
            {children}
        </View>
    );
}