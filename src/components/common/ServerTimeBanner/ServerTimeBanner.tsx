import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';



interface ServerTimeBannerProps {
  serverTime?: string | null;
  loading?: boolean;
}

export const ServerTimeBanner: React.FC<ServerTimeBannerProps> = ({ serverTime, loading }) => {
  // Safe runtime processing fallbacks
  const displayTime = serverTime || "Retrieving network timestamp...";
  
  return (
    <View className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900 rounded-2xl mb-5 flex-row items-center justify-between">
      <View className="flex-row items-center flex-1 mr-3">
        {/* Dynamic Pulse Sync State Circle Anchor */}
        <View className={`h-1.5 w-1.5 rounded-full mr-2.5 ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
        
        <View className="flex-1">
          <Text className="text-[9px] font-black tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500">
            System Synchronization
          </Text>
          <Text className="text-xs font-bold font-mono text-zinc-700 dark:text-zinc-300 mt-0.5" numberOfLines={1}>
            {displayTime}
          </Text>
        </View>
      </View>

      {/* Clean high-contrast clock icon container */}
      <View className="p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs">
        <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-500 dark:text-zinc-400">
          <Path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </Svg>
      </View>
    </View>
  );
};
