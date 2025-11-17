import { GoogleGenAI, Type } from "@google/genai";

export const API_KEY = "AIzaSyAALD14Mjabz9zKhV7y7ToaleIEieoEtmA";
export const ai = new GoogleGenAI({ apiKey: API_KEY });

export const SNAPSHOT_LIMIT = 900000;

export const responseSchema = {
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
};

export const tools = [
  { codeExecution: {} },
];

export const config = {
  temperature: 0.3,
  topP: 1,
  thinkingConfig: {
    thinkingBudget: -1,
  },
  imageConfig: {
    imageSize: '1K' as const,
  },
  tools,
};

export interface AIModel {
  model: string;
  config: {
    temperature?: number;
    topP?: number;
    thinkingConfig?: {
      thinkingBudget: number;
    };
    imageConfig?: {
      imageSize: string;
    };
  };
}

export const model20flash: AIModel = {
  model: "gemini-flash-latest",
  config: {
    temperature: 0.3,
    thinkingConfig: {
      thinkingBudget: 0,
    }
  }
};

export const model25flashlite: AIModel = {
  model: "gemini-flash-lite-latest",
  config: {
    temperature: 0.3,
    thinkingConfig: {
      thinkingBudget: 0,
    }
  }
};

export const model15pro: AIModel = {
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

