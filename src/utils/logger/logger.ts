

const isDev = __DEV__;

export const logger = {
  info: (message: string, data?: unknown) => {
    if (isDev) {

      if (data !== undefined) {
        console.log(`ℹ️ ${message}`, data);
      } else {
        console.log(`ℹ️ ${message}`);
      }
    }
  },

  warn: (message: string, data?: unknown) => {
    if (isDev) {
      if (data !== undefined) {
        console.warn(`⚠️ ${message}`, data);
      } else {
        console.warn(`⚠️ ${message}`);
      }
    }
  },

  error: (message: string, data?: unknown) => {
    if (isDev) {
      if (data !== undefined) {
        console.error(`❌ ${message}`, data);
      } else {
        console.error(`❌ ${message}`);
      }
    }
  },
};
