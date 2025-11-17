import { ai, model20flash, model15pro, model25flashlite } from './config/aiConfig';
import { prepareFilePayload, restoreBlobFromSnapshot, FileSnapshot } from './utils/fileOperations';
import { generateContentFromBlob } from './utils/aiContentGeneration';
import { parseJsonFromText, parseJsonArrayFromText } from './utils/jsonParsing';
import { buildPlacementPrompt, buildBatchPlacementPrompt, extractQuestionForPrompt, Question, NormalizedQuestion } from './utils/questionProcessing';

export interface PlacementResult {
  chapterIndex: number | null;
  subContentIndex: number | null;
  requirement: string | null;
  confidence: number;
  reason: string;
  raw?: string;
}

export interface MatrixOptions {
  returnMeta?: boolean;
}

export interface PlacementOptions {
  promptVersion?: string;
}

/**
 * Extracts questions from file using AI
 */
export async function extractQuestionsJSON(file: File | null, prompt: string): Promise<string | undefined> {
  console.time("Thời gian thực hiện");
  if (!file) {
    console.error("Please select a file first.");
    return;
  }
  try {
    const { blob, mimeType } = await prepareFilePayload(file);

    // Upload the file using the new API
    const uploadedFile = await ai.files.upload({
      file: blob
    } as any);

    // Generate content using the uploaded file
    const response = await ai.models.generateContent({
      model: model20flash.model,
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
      config: model20flash.config
    });

    console.timeEnd("Thời gian thực hiện");
    
    let responseText = response.text || "";
    if (responseText.endsWith("]}]}]")) {
      responseText = responseText.slice(0, -2);
    }
    return responseText;
  } catch (error) {
    console.error("Error uploading or summarizing:", error);
  }
}

/**
 * Generates matrix questions from file
 */
export async function matrixQuestionsJSON(
  file: File | null,
  prompt: string,
  options: MatrixOptions = {}
): Promise<string | { text: string; snapshot: FileSnapshot } | undefined> {
  console.time("Thời gian thực hiện");
  if (!file) {
    console.error("Please select a file first.");
    return;
  }
  try {
    const { blob, mimeType, snapshot } = await prepareFilePayload(file);

    const responseText = await generateContentFromBlob(blob, mimeType, prompt, model20flash);

    if (options.returnMeta) {
      return {
        text: responseText,
        snapshot
      };
    }

    return responseText;
  } catch (error) {
    console.error("Error uploading or summarizing:", error);
  }
}

/**
 * Generates matrix questions from snapshot
 */
export async function matrixQuestionsJSONFromSnapshot(
  snapshot: FileSnapshot,
  prompt: string,
  options: MatrixOptions = {}
): Promise<string | { text: string; snapshot: FileSnapshot }> {
  if (!snapshot || !snapshot.data) {
    throw new Error("Snapshot dữ liệu không hợp lệ");
  }

  const { blob, mimeType } = await restoreBlobFromSnapshot(snapshot);
  console.time("Thời gian thực hiện");
  const responseText = await generateContentFromBlob(blob, mimeType, prompt, model20flash);

  if (options.returnMeta) {
    return {
      text: responseText,
      snapshot
    };
  }

  return responseText;
}

/**
 * Creates questions from prompt only (no file)
 */
export async function createQuestionsJSON(prompt: string | any[]): Promise<string | undefined> {
  console.time("Thời gian thực hiện");
  try {
    const response = await ai.models.generateContent({
      model: model15pro.model,
      contents: prompt,
      config: model15pro.config
    });

    console.timeEnd("Thời gian thực hiện");
    return response.text;
  } catch (error) {
    console.error("Error uploading or summarizing:", error);
  }
}

/**
 * Suggests placement for a single question
 */
export async function suggestQuestionPlacement(
  question: Question,
  bankStructure: any,
  options: PlacementOptions = {}
): Promise<PlacementResult> {
  if (!question) {
    throw new Error("Thiếu dữ liệu câu hỏi để gợi ý");
  }

  const prompt = buildPlacementPrompt(question, bankStructure, options.promptVersion || "v1");

  const response = await ai.models.generateContent({
    model: model15pro.model,
    contents: [{ text: prompt }],
    config: model15pro.config
  });

  const text = response?.text || "";
  const parsed = parseJsonFromText(text);

  return {
    chapterIndex: typeof parsed.chapterIndex === "number" ? parsed.chapterIndex : null,
    subContentIndex: typeof parsed.subContentIndex === "number" ? parsed.subContentIndex : null,
    requirement: parsed.requirement || null,
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
    reason: parsed.reason || "",
    raw: text
  };
}

/**
 * Suggests placement for multiple questions (batch)
 */
export async function suggestQuestionPlacementBatch(
  questions: Question[],
  bankStructure: any,
  options: PlacementOptions = {}
): Promise<PlacementResult[]> {
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    throw new Error("Thiếu dữ liệu câu hỏi để gợi ý");
  }

  // Create normalized questions with index for fallback mapping
  const normalizedQuestions: NormalizedQuestion[] = questions.map((q, index) => {
    const normalized = extractQuestionForPrompt(q);
    
    // Ensure id is present and add index for fallback
    if (!normalized.id) {
      normalized.id = q.id || q.questionId || `question_${index}`;
    }
    normalized._index = index; // Internal index for fallback mapping
    return normalized;
  });
  const promptVersion = options.promptVersion || "v1-batch";

  const prompt = buildBatchPlacementPrompt(questions, bankStructure, promptVersion);

  const response = await ai.models.generateContent({
    model: model25flashlite.model,
    contents: [{ text: prompt }],
    config: model25flashlite.config
  });

  const text = response?.text || "";
  const parsed = parseJsonArrayFromText(text);

  // Map results back to questions by ID, with index fallback
  const resultsMap = new Map<string, PlacementResult>();
  if (Array.isArray(parsed)) {
    parsed.forEach((item: any) => {
      if (item.questionId) {
        resultsMap.set(item.questionId, {
          chapterIndex: typeof item.chapterIndex === "number" ? item.chapterIndex : null,
          subContentIndex: typeof item.subContentIndex === "number" ? item.subContentIndex : null,
          requirement: item.requirement || null,
          confidence: typeof item.confidence === "number" ? item.confidence : 0,
          reason: item.reason || ""
        });
      }
    });
  }

  // Return results in the same order as input questions
  // Try to match by ID first, then by index as fallback
  return questions.map((q, index) => {
    const id = q.id || q.questionId || normalizedQuestions[index]?.id;
    const result = id ? resultsMap.get(id) : undefined;
    
    // Fallback: if ID doesn't match, try to match by array index
    if (!result && Array.isArray(parsed) && parsed[index]) {
      const item = parsed[index];
      return {
        chapterIndex: typeof item.chapterIndex === "number" ? item.chapterIndex : null,
        subContentIndex: typeof item.subContentIndex === "number" ? item.subContentIndex : null,
        requirement: item.requirement || null,
        confidence: typeof item.confidence === "number" ? item.confidence : 0,
        reason: item.reason || ""
      };
    }
    
    return result || {
      chapterIndex: null,
      subContentIndex: null,
      requirement: null,
      confidence: 0,
      reason: "Không có gợi ý từ AI"
    };
  });
}

// Re-export types and utilities for convenience
export type { Question, NormalizedQuestion } from './utils/questionProcessing';
export type { FileSnapshot } from './utils/fileOperations';

