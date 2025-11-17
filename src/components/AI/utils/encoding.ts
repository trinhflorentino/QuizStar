import { SNAPSHOT_LIMIT } from '../config/aiConfig';

/**
 * Converts ArrayBuffer to Base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts Base64 string to ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Limits snapshot content to SNAPSHOT_LIMIT characters
 */
export function limitSnapshot(content: string | null | undefined): string {
  if (!content) return content || '';
  if (content.length <= SNAPSHOT_LIMIT) return content;
  return content.slice(0, SNAPSHOT_LIMIT);
}

