import React from 'react';
import { Platform, Pressable, PressableProps, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons'; 

interface BackButtonProps extends PressableProps {
  webRoute?: string;
  appRoute?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  webRoute = "/(web)/pets", 
  appRoute = "/(tabs)/pets",
  ...props 
}) => {
  const { width } = useWindowDimensions();
  const isMobileViewport = Platform.OS !== 'web' || width < 768;

  const handlePress = () => {
    const targetRoute = Platform.OS === 'web' ? webRoute : appRoute;
    router.replace(targetRoute as any);
  };

  // Minimal spacing layout optimized for pure icon taps
  const containerMargin = isMobileViewport ? "mb-6 mt-2 ml-1" : "mb-4 mt-0 ml-0";
  const activeScale = isMobileViewport ? 0.90 : 0.95; // More expressive click scale for the icon

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1, // High contrast opacity dip on press
        transform: [{ scale: pressed ? activeScale : 1 }],
      })}
      className={`self-start p-2 rounded-full justify-center items-center ${containerMargin}`}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }} // Expands tap target size for easier use
      {...props}
    >
      <Feather 
        name="arrow-left" 
        size={22} // Bumped size up slightly to maintain presence without label text
        className="text-zinc-900 dark:text-zinc-50" 
      />
    </Pressable>
  );
};
