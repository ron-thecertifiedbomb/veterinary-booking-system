import React from 'react';
import { Platform, Pressable, Text, PressableProps } from 'react-native';
import { router } from 'expo-router';

// Define the customizable routing props
interface BackButtonProps extends PressableProps {
  webRoute?: string;
  appRoute?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  webRoute = "/(web)/web-pets", 
  appRoute = "/(tabs)/pets", // Providing your original route as default
  ...props 
}) => {
  
  const handlePress = () => {
    // Selects route based on platform, falling back to string paths
    const targetRoute = Platform.OS === 'web' ? webRoute : appRoute;
    router.replace(targetRoute as any);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mb-4 self-start px-3 py-2 rounded-xl bg-gray-100"
      {...props}
    >
      <Text className="text-gray-700 font-medium">← Back</Text>
    </Pressable>
  );
};
