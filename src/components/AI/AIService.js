import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from 'mammoth';

const apiKey = "AIzaSyAeMN1c914F4WzgwKKbr4C29KbYx76h5a4";
const genAI = new GoogleGenerativeAI(apiKey);

const model20flash = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-04-17",
  generationConfig: {
    temperature: 0.6,
    responseMimeType: 'application/json',
    thinkingConfig: {
      thinkingBudget: 0,
    },
  },
});

const model1206 = genAI.getGenerativeModel({
  model: "gemini-exp-1206",
  generationConfig: {
    "responseMimeType": "application/json",
    temperature: 0.6,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  },
});

const model15pro = genAI.getGenerativeModel({
  model: "learnlm-1.5-pro-experimental",
  generationConfig: {
    "responseMimeType": "application/json",
  },
});

export async function extractQuestionsJSON(file, prompt) {
  console.time("Thời gian thực hiện");
  if (!file) {
    console.error("Please select a file first.");
    return;
  }
  try {
    let fileContent = await readFile(file);
    let fileType = file.type;
    
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      fileContent = result.value;
      fileType = "text/html";
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/upload/v1beta/files",
      {
        method: "POST",
        headers: {
          "Content-Type": fileType,
          "x-goog-api-key": apiKey,
        },
        body: fileContent,
      }
    );

    const uploadResponse = await response.json();
    const fileUri = uploadResponse.file.uri;
    
    const result = await model20flash.generateContent([
      {
        fileData: {
          mimeType: fileType,
          fileUri: fileUri,
        },
      },
      { text: prompt },
    ]);

    console.timeEnd("Thời gian thực hiện");
    
    let responseText = result.response.text();
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
    let fileContent = await readFile(file);
    let fileType = file.type;
    
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      fileContent = result.value;
      fileType = "text/html";
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/upload/v1beta/files",
      {
        method: "POST",
        headers: {
          "Content-Type": fileType,
          "x-goog-api-key": apiKey,
        },
        body: fileContent,
      }
    );

    const uploadResponse = await response.json();
    const fileUri = uploadResponse.file.uri;
    
    const result = await model20flash.generateContent([
      {
        fileData: {
          mimeType: fileType,
          fileUri: fileUri,
        },
      },
      { text: prompt },
    ]);

    console.timeEnd("Thời gian thực hiện");
    
    let responseText = result.response.text();
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
    const result = await model15pro.generateContent(prompt);
    console.timeEnd("Thời gian thực hiện");
    return result.response.text();
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