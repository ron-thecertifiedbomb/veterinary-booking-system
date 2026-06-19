import * as Device from 'expo-device';

// Static checks (evaluated once at app startup)
export const isTablet = Device.deviceType === Device.DeviceType.TABLET;
export const isMobile = Device.deviceType === Device.DeviceType.PHONE;


export const getDeviceTypeName = (): string => {
  switch (Device.deviceType) {
    case Device.DeviceType.PHONE:
      return 'PHONE';
    case Device.DeviceType.TABLET:
      return 'TABLET';
    case Device.DeviceType.DESKTOP:
      return 'DESKTOP';
    case Device.DeviceType.TV:
      return 'TV';
    default:
      return 'UNKNOWN';
  }
};
