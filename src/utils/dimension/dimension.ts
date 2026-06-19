import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const minDimension = Math.min(width, height);


export const isTablet = minDimension >= 600;
export const isMobile = !isTablet;


export function useDeviceType() {
  const { width: w, height: h } = Dimensions.get('window');
  const smallestSide = Math.min(w, h);
  
  const currentIsTablet = smallestSide >= 600;
  
  return {
    isTablet: currentIsTablet,
    isMobile: !currentIsTablet,
  };
}
 