import mammoth from 'mammoth';
import { arrayBufferToBase64, limitSnapshot } from './encoding';

export interface FileSnapshot {
  mimeType: string;
  encoding: 'text' | 'base64';
  data: string;
}

export interface PreparedFilePayload {
  blob: Blob;
  mimeType: string;
  snapshot: FileSnapshot;
}

/**
 * Reads file as ArrayBuffer
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        resolve(e.target.result);
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Reads file as ArrayBuffer (alias for readFileAsArrayBuffer)
 */
export function readFile(file: File): Promise<ArrayBuffer> {
  return readFileAsArrayBuffer(file);
}

/**
 * Prepares file payload for AI processing
 * Handles Word documents by converting to HTML
 */
export async function prepareFilePayload(file: File): Promise<PreparedFilePayload> {
  let fileType = file.type || "application/octet-stream";
  let snapshot: FileSnapshot;

  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const htmlContent = result.value || "";
    fileType = "text/html";
    snapshot = {
      mimeType: fileType,
      encoding: "text",
      data: limitSnapshot(htmlContent)
    };
    return {
      blob: new Blob([htmlContent], { type: fileType }),
      mimeType: fileType,
      snapshot
    };
  }

  const arrayBuffer = await readFile(file);
  const base64 = arrayBufferToBase64(arrayBuffer);
  snapshot = {
    mimeType: fileType,
    encoding: "base64",
    data: limitSnapshot(base64)
  };

  return {
    blob: new Blob([arrayBuffer], { type: fileType }),
    mimeType: fileType,
    snapshot
  };
}

/**
 * Restores Blob from snapshot
 */
export async function restoreBlobFromSnapshot(snapshot: FileSnapshot): Promise<{ blob: Blob; mimeType: string }> {
  const mimeType = snapshot.mimeType || "application/octet-stream";
  
  if (snapshot.encoding === "text") {
    return {
      blob: new Blob([snapshot.data || ""], { type: mimeType }),
      mimeType
    };
  }

  if (snapshot.encoding === "base64") {
    const { base64ToArrayBuffer } = await import('./encoding');
    const arrayBuffer = base64ToArrayBuffer(snapshot.data || "");
    return {
      blob: new Blob([arrayBuffer], { type: mimeType }),
      mimeType
    };
  }

  throw new Error("Không nhận dạng được định dạng snapshot");
}

