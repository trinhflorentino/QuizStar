import { GoogleGenAI, Type } from "@google/genai";
import mammoth from 'mammoth';
import { summarizeQuestionBankForPrompt } from "../../utils/questionBankUtils";

const apiKey = "AIzaSyAALD14Mjabz9zKhV7y7ToaleIEieoEtmA";
const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
  type: Type.ARRAY,
  description: "Một mảng các đối tượng câu hỏi được trích xuất từ file.",
  items: {
    type: Type.OBJECT,
    description: "Đại diện cho một câu hỏi duy nhất được trích xuất. Các trường không có giá trị, có giá trị null, hoặc không tìm thấy sẽ bị bỏ qua hoàn toàn khỏi đối tượng JSON.",
    required: ["question", "type"],
    properties: {
      answer: {
        nullable: "True", 
      },
      question: {
        type: Type.STRING,
        description: "Nội dung câu hỏi. Công thức ở dạng LaTeX. Không chứa HTML.",
      },
      type: {
        type: Type.STRING,
        description: "Loại câu hỏi.",
        enum: ["mcq", "truefalse", "shortanswer"],
      },
      options: {
        type: Type.ARRAY,
        description: "Mảng các lựa chọn (mcq) hoặc mệnh đề (truefalse). Trường này sẽ bị bỏ qua đối với 'shortanswer' hoặc nếu không có lựa chọn/mệnh đề.",
        nullable: "True",
        items: {
          type: Type.STRING,
          description: "Một lựa chọn hoặc một mệnh đề.",
        },
      },
    },
  },
};// {
//   "type": "ARRAY",
//   "description": "Một mảng các đối tượng câu hỏi được trích xuất từ file.",
//   "items": {
//     "type": "OBJECT",
//     "description": "Đại diện cho một câu hỏi duy nhất được trích xuất. Các trường có giá trị null sẽ bị bỏ qua.",
//     "properties": {
//       "answer": {
//         "type": "STRING",
//         "nullable": true, 
//         "description": "Đáp án được trích xuất từ file nếu có (ký tự MCQ, chuỗi JSON mảng boolean T/F, chuỗi text SA). Trường này sẽ bị bỏ qua nếu không tìm thấy đáp án."
//       },
//       "question": {
//         "type": "STRING",
//         "description": "Nội dung câu hỏi. Công thức ở dạng LaTeX. Không chứa HTML."
//       },
//       "type": {
//         "type": "STRING",
//         "description": "Loại câu hỏi.",
//         "enum": ["mcq", "truefalse", "shortanswer"]
//       },
//       "options": {
//         "type": "ARRAY",
//         "nullable": true,
//         "description": "Mảng các lựa chọn (mcq) hoặc mệnh đề (truefalse). Trường này sẽ bị bỏ qua đối với 'shortanswer' hoặc nếu không có lựa chọn/mệnh đề.",
//         "items": {
//           "type": "STRING",
//           "description": "Một lựa chọn hoặc một mệnh đề."
//         }
//       }
//     },
//     "required": ["question", "type"],
//     "propertyOrdering": ["answer", "type", "question", "options", "answer"] 
//   }
// }
const tools = [
  { codeExecution: {} },
];
const config = {
  temperature: 0.3,
  topP: 1,
  thinkingConfig: {
    thinkingBudget: -1,
  },
  imageConfig: {
    imageSize: '1K',
  },
  tools,
};

const SNAPSHOT_LIMIT = 900000;

const model20flash = {
  model: "gemini-flash-latest",
  config: {
    temperature: 0.3,
    thinkingConfig: {
      thinkingBudget: 0,
    }
  }
};

const model25flashlite = {
  model: "gemini-flash-lite-latest",
  config: {
    temperature: 0.3,
    thinkingConfig: {
      thinkingBudget: 0,
    }
  }
} 
const model15pro = {
  model: "gemini-2.5-pro",
  config: {
    temperature: 0.3,
    topP: 1,
    thinkingConfig: {
      thinkingBudget: -1,
    },
    imageConfig: {
      imageSize: '1K',
    },
}
};

export async function extractQuestionsJSON(file, prompt) {
  console.time("Thời gian thực hiện");
  if (!file) {
    console.error("Please select a file first.");
    return;
  }
  try {
    const { blob, mimeType } = await prepareFilePayload(file);

    // Upload the file using the new API
    const uploadedFile = await ai.files.upload({
      file: blob,
      mimeType
    });

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
    
    let responseText = response.text;
    if (responseText.endsWith("]}]}]")) {
      responseText = responseText.slice(0, -2);
    }
    return responseText;
  } catch (error) {
    console.error("Error uploading or summarizing:", error);
  }
}

export async function matrixQuestionsJSON(file, prompt) {
  console.time("Thời gian thực hiện");
  if (!file) {
    console.error("Please select a file first.");
    return;
  }
  try {
    const options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
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

export async function matrixQuestionsJSONFromSnapshot(snapshot, prompt, options = {}) {
  if (!snapshot || !snapshot.data) {
    throw new Error("Snapshot dữ liệu không hợp lệ");
  }

  const { blob, mimeType } = restoreBlobFromSnapshot(snapshot);
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

export async function createQuestionsJSON(prompt) {
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

export async function suggestQuestionPlacement(question, bankStructure, options = {}) {
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

export async function suggestQuestionPlacementBatch(questions, bankStructure, options = {}) {
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    throw new Error("Thiếu dữ liệu câu hỏi để gợi ý");
  }

  // Create normalized questions with index for fallback mapping
  const normalizedQuestions = questions.map((q, index) => {
    const normalized = extractQuestionForPrompt(q);
    // Ensure id is present and add index for fallback
    if (!normalized.id) {
      normalized.id = q.id || q.questionId || `question_${index}`;
    }
    normalized._index = index; // Internal index for fallback mapping
    return normalized;
  });
  
  const bankSummary = summarizeQuestionBankForPrompt(bankStructure);
  const promptVersion = options.promptVersion || "v1-batch";

  const prompt = `Bạn là trợ lý phân loại câu hỏi ở phiên bản ${promptVersion}.\n\n` +
    `Cấu trúc ngân hàng câu hỏi (theo chỉ số mảng):\n${bankSummary}\n\n` +
    `Danh sách ${questions.length} câu hỏi cần phân loại:\n${JSON.stringify(normalizedQuestions.map(({_index, ...q}) => q), null, 2)}\n\n` +
    `QUAN TRỌNG: Trước khi phân loại, hãy xác định lĩnh vực/môn học của ngân hàng câu hỏi dựa trên tên chương và nội dung.\n` +
    `- Nếu câu hỏi KHÔNG thuộc lĩnh vực/môn học của ngân hàng câu hỏi (ví dụ: câu hỏi Hóa học trong ngân hàng Toán học), hãy trả về:\n` +
    `  {"questionId": "id của câu hỏi (phải khớp chính xác với id trong danh sách trên)", "chapterIndex": null, "subContentIndex": null, "requirement": null, "confidence": 0, "reason": "Câu hỏi không liên quan đến lĩnh vực của ngân hàng câu hỏi này"}\n` +
    `- Chỉ phân loại câu hỏi khi nó THỰC SỰ liên quan đến nội dung trong ngân hàng câu hỏi.\n` +
    `- Không cố gắng ép buộc câu hỏi vào bất kỳ vị trí nào nếu nó không phù hợp.\n\n` +
    `Hãy xác định vị trí phù hợp nhất cho từng câu hỏi.\n` +
    `Luôn trả về JSON array với cấu trúc:\n` +
    `[{"questionId": "id của câu hỏi (PHẢI khớp chính xác với trường 'id' trong danh sách câu hỏi trên)", "chapterIndex": number | null, "subContentIndex": number | null, "requirement": "nhanBiet|thongHieu|vanDung|vanDungCao|null", "confidence": number từ 0 đến 1, "reason": "Giải thích ngắn gọn"}]\n` +
    `LƯU Ý: Trường "questionId" PHẢI khớp chính xác với trường "id" trong danh sách câu hỏi ở trên. Nếu câu hỏi không liên quan hoặc không đủ dữ liệu, hãy để các trường index là null, requirement là null, confidence = 0 và giải thích rõ lý do trong trường "reason".`;

  const response = await ai.models.generateContent({
    model: model25flashlite.model,
    contents: [{ text: prompt }],
    config: model25flashlite.config
  });

  const text = response?.text || "";
  const parsed = parseJsonArrayFromText(text);

  // Map results back to questions by ID, with index fallback
  const resultsMap = new Map();
  if (Array.isArray(parsed)) {
    parsed.forEach((item, index) => {
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
    const result = resultsMap.get(id);
    
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

// Helper functions
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

async function prepareFilePayload(file) {
  let fileType = file.type || "application/octet-stream";
  let snapshot;

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

function limitSnapshot(content) {
  if (!content) return content;
  if (content.length <= SNAPSHOT_LIMIT) return content;
  return content.slice(0, SNAPSHOT_LIMIT);
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function generateContentFromBlob(blob, mimeType, prompt, model = model20flash) {
  const uploadedFile = await ai.files.upload({
    file: blob,
    mimeType
  });

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

function restoreBlobFromSnapshot(snapshot) {
  const mimeType = snapshot.mimeType || "application/octet-stream";
  if (snapshot.encoding === "text") {
    return {
      blob: new Blob([snapshot.data || ""], { type: mimeType }),
      mimeType
    };
  }

  if (snapshot.encoding === "base64") {
    const arrayBuffer = base64ToArrayBuffer(snapshot.data || "");
    return {
      blob: new Blob([arrayBuffer], { type: mimeType }),
      mimeType
    };
  }

  throw new Error("Không nhận dạng được định dạng snapshot");
}

function buildPlacementPrompt(question, bankStructure, promptVersion) {
  const normalizedQuestion = extractQuestionForPrompt(question);
  const bankSummary = summarizeQuestionBankForPrompt(bankStructure);

  return `Bạn là trợ lý phân loại câu hỏi ở phiên bản ${promptVersion}.\n\n` +
    `Cấu trúc ngân hàng câu hỏi (theo chỉ số mảng):\n${bankSummary}\n\n` +
    `Câu hỏi cần phân loại:\n${JSON.stringify(normalizedQuestion, null, 2)}\n\n` +
    `QUAN TRỌNG: Trước khi phân loại, hãy xác định lĩnh vực/môn học của ngân hàng câu hỏi dựa trên tên chương và nội dung.\n` +
    `- Nếu câu hỏi KHÔNG thuộc lĩnh vực/môn học của ngân hàng câu hỏi (ví dụ: câu hỏi Hóa học trong ngân hàng Toán học), hãy trả về:\n` +
    `  {"chapterIndex": null, "subContentIndex": null, "requirement": null, "confidence": 0, "reason": "Câu hỏi không liên quan đến lĩnh vực của ngân hàng câu hỏi này"}\n` +
    `- Chỉ phân loại câu hỏi khi nó THỰC SỰ liên quan đến nội dung trong ngân hàng câu hỏi.\n` +
    `- Không cố gắng ép buộc câu hỏi vào bất kỳ vị trí nào nếu nó không phù hợp.\n\n` +
    `Hãy xác định vị trí phù hợp nhất cho câu hỏi này.\n` +
    `Luôn trả về JSON với cấu trúc:\n` +
    `{"chapterIndex": number | null, "subContentIndex": number | null, "requirement": "nhanBiet|thongHieu|vanDung|vanDungCao|null", "confidence": number từ 0 đến 1, "reason": "Giải thích ngắn gọn"}.\n` +
    `Nếu câu hỏi không liên quan hoặc không đủ dữ liệu, hãy để các trường index là null, requirement là null, confidence = 0 và giải thích rõ lý do trong trường "reason".`;
}

function extractQuestionForPrompt(question) {
  if (!question) return {};
  const base = {
    id: question.id,
    type: question.type || question.questionType || 'mcq'
  };

  if (question.question_text) {
    base.content = question.question_text;
  } else if (question.question) {
    base.content = question.question;
  }

  if (Array.isArray(question.options)) {
    base.options = question.options.map((opt) => ({
      text: opt.text || opt.option || opt,
      is_correct: !!opt.is_correct
    }));
  }

  if (Array.isArray(question.correctAnswers)) {
    base.correctAnswers = question.correctAnswers;
  }

  if (typeof question.correctAnswer !== 'undefined') {
    base.correctAnswer = question.correctAnswer;
  }

  return base;
}

function parseJsonFromText(text) {
  if (!text) return {};
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {};
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.warn("Không thể parse JSON từ phản hồi AI:", text);
    return {};
  }
}

function parseJsonArrayFromText(text) {
  if (!text) return [];
  const trimmed = text.trim();

  // Try to find JSON array in the text
  const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
  if (!arrayMatch) {
    return [];
  }

  try {
    return JSON.parse(arrayMatch[0]);
  } catch (err) {
    console.warn("Không thể parse JSON array từ phản hồi AI:", text);
    return [];
  }
}