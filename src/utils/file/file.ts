import * as FileSystem from 'expo-file-system';
import { EncodingType } from 'node_modules/expo-file-system/build/ExpoFileSystem.types';


/**
 * Reads a file from a given path (Network URL or Local Device Storage) 
 * and returns its raw text contents as a string.
 */
export async function jsBigFileStringFromPath(pathOrUrl: string): Promise<string> {
  try {
    // 1. If it's a wireless network IP address URL, download the string directly
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      const response = await fetch(pathOrUrl);
      
      if (!response.ok) {
        throw new Error(`Network response error: ${response.status} ${response.statusText}`);
      }
      
      return await response.text(); // Converts the network stream into a raw string
    }

    // 2. Otherwise, treat it as a local device file path
    const fileInfo = await FileSystem.getInfoAsync(pathOrUrl);
    if (!fileInfo.exists) {
      throw new Error(`Local file does not exist at path: ${pathOrUrl}`);
    }

    return await FileSystem.readAsStringAsync(pathOrUrl, {
      encoding: EncodingType.UTF8,
    });
    
  } catch (error) {
    console.error(`[File System/Network Error] Failed to read string: ${pathOrUrl}`, error);
    throw error;
  }
}
