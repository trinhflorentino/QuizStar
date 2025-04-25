import { GoogleGenAI, Type } from "@google/genai";
import mammoth from 'mammoth';

const apiKey = "AIzaSyAeMN1c914F4WzgwKKbr4C29KbYx76h5a4";
const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
  type: Type.ARRAY,
  description: "Một mảng các đối tượng câu hỏi được trích xuất từ file.",
  items: {
    type: Type.OBJECT,
    description: "Đại diện cho một câu hỏi duy nhất được trích xuất. Các trường có giá trị null sẽ bị bỏ qua.",
    required: ["question", "type"],
    properties: {
      answer: {
        type: Type.STRING,
        description: "Đáp án được trích xuất từ file nếu có (ký tự MCQ, chuỗi JSON mảng boolean T/F, chuỗi text SA). Trường này sẽ bị bỏ qua nếu không tìm thấy đáp án.",
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

// {
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

const model20flash = {
  model: "gemini-2.5-flash-preview-04-17",
  config: {
    temperature: 0.2,
    responseMimeType: 'application/json',
    thinkingConfig: {
      thinkingBudget: 0,
    },
    responseSchema: responseSchema
  }
};

const model1206 = {
  model: "gemini-exp-1206",
  config: {
    responseMimeType: "application/json",
    temperature: 0.6,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192
  }
};

const model15pro = {
  model: "learnlm-1.5-pro-experimental",
  config: {
    responseMimeType: "application/json"
  }
};

export async function extractQuestionsJSON(file, prompt) {
  console.time("Thời gian thực hiện");
  if (!file) {
    console.error("Please select a file first.");
    return;
  }
  try {
    let fileContent;
    let fileType = file.type;
    
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      fileContent = result.value;
      fileType = "text/html";
    } else {
      fileContent = await readFile(file);
    }

    // Upload the file using the new API
    const uploadedFile = await ai.files.upload({
      file: new Blob([fileContent], { type: fileType }),
      mimeType: fileType
    });

    // Generate content using the uploaded file
    const response = await ai.models.generateContent({
      model: model20flash.model,
      contents: [
        {
          parts: [
            {
              fileData: {
                mimeType: fileType,
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
    let fileContent;
    let fileType = file.type;
    
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      fileContent = result.value;
      fileType = "text/html";
    } else {
      fileContent = await readFile(file);
    }

    // Upload the file using the new API
    const uploadedFile = await ai.files.upload({
      file: new Blob([fileContent], { type: fileType }),
      mimeType: fileType
    });

    // Generate content using the uploaded file
    const response = await ai.models.generateContent({
      model: model20flash.model,
      contents: [
        {
          parts: [
            {
              fileData: {
                mimeType: fileType,
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