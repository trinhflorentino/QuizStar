import { ai } from '../config/aiConfig';
import { AIModel, model20flash } from '../config/aiConfig';

/**
 * Generates content from blob using AI model
 */
export async function generateContentFromBlob(
  blob: Blob,
  mimeType: string,
  prompt: string,
  model: AIModel = model20flash
): Promise<string> {
  const uploadedFile = await ai.files.upload({
    file: blob
  } as any);

  const response = await ai.models.generateContent({
    model: model.model,
    contents: [
      {
        parts: [
          {
            fileData: {
              mimeType,
              fileUri: uploadedFile.uri
            }
          },
          { text: prompt }
        ]
      }
    ],
    config: model.config
  });

  console.timeEnd("Thời gian thực hiện");

  let responseText = response.text || "";
  if (responseText.endsWith("]}]}]")) {
    responseText = responseText.slice(0, -2);
  }
  return responseText;
}

