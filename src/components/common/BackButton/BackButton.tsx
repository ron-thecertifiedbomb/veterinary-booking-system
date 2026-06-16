import React from 'react';
import { Platform, Pressable, Text, PressableProps, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
// Import Feather for a hyper-clean, ultra-thin line weight icon profile
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

  const containerPadding = isMobileViewport ? "px-5 py-3" : "px-4 py-2";
  const containerMargin = isMobileViewport ? "mb-8 mt-2" : "mb-5 mt-0";
  const activeScale = isMobileViewport ? 0.96 : 0.99;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? activeScale : 1 }],
      })}
      className={`self-start flex-row items-center bg-white dark:bg-black border border-black dark:border-white rounded-full ${containerPadding} ${containerMargin}`}
      {...props}
    >
      {/* ─── COOL VECTOR LINE ICON ─── */}
      <Feather 
        name="arrow-left" 
        size={14} 
        // Directly references your strict high-contrast dark/light layout context parameters
        className="text-black dark:text-white mr-1.5" 
      />

      {/* ─── PREMIUM MICRO-LABEL ─── */}
      <Text className="text-black dark:text-white text-[9px] font-black tracking-[0.2em] uppercase">
        Back
      </Text>
    </Pressable>
  );
};
