import { summarizeQuestionBankForPrompt } from "../../../utils/questionBankUtils";

export interface Question {
  id?: string;
  questionId?: string;
  type?: string;
  questionType?: string;
  question_text?: string;
  question?: string;
  options?: Array<{ text?: string; option?: string; is_correct?: boolean } | string>;
  correctAnswers?: string[];
  correctAnswer?: number | string;
}

export interface NormalizedQuestion {
  id?: string;
  type: string;
  content?: string;
  options?: Array<{ text: string; is_correct: boolean }>;
  correctAnswers?: string[];
  correctAnswer?: number | string;
  _index?: number; // Internal use only
}

/**
 * Extracts and normalizes question data for AI prompt
 */
export function extractQuestionForPrompt(question: Question | null | undefined): NormalizedQuestion {
  if (!question) return { type: 'mcq' };
  
  const base: NormalizedQuestion = {
    id: question.id,
    type: question.type || question.questionType || 'mcq'
  };

  if (question.question_text) {
    base.content = question.question_text;
  } else if (question.question) {
    base.content = question.question;
  }

  if (Array.isArray(question.options)) {
    base.options = question.options.map((opt) => {
      if (typeof opt === 'string') {
        return { text: opt, is_correct: false };
      }
      return {
        text: opt.text || opt.option || '',
        is_correct: !!opt.is_correct
      };
    });
  }

  if (Array.isArray(question.correctAnswers)) {
    base.correctAnswers = question.correctAnswers;
  }

  if (typeof question.correctAnswer !== 'undefined') {
    base.correctAnswer = question.correctAnswer;
  }

  return base;
}

/**
 * Builds placement prompt for single question
 */
export function buildPlacementPrompt(
  question: Question,
  bankStructure: any,
  promptVersion: string = "v1"
): string {
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

/**
 * Builds batch placement prompt for multiple questions
 */
export function buildBatchPlacementPrompt(
  questions: Question[],
  bankStructure: any,
  promptVersion: string = "v1-batch"
): string {
  const normalizedQuestions = questions.map((q, index) => {
    const normalized = extractQuestionForPrompt(q);
    if (!normalized.id) {
      normalized.id = q.id || q.questionId || `question_${index}`;
    }
    normalized._index = index;
    return normalized;
  });
  
  const bankSummary = summarizeQuestionBankForPrompt(bankStructure);

  return `Bạn là trợ lý phân loại câu hỏi ở phiên bản ${promptVersion}.\n\n` +
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
}

