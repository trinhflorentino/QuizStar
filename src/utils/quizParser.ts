import { v4 as uuid } from "uuid";

interface ParsedQuestion {
  number: number;
  originalNumber: number;
  type: 'mcq' | 'truefalse' | 'shortanswer' | 'textblock';
  question?: string;
  options?: Array<{ letter: string; text: string; isMarked: boolean }>;
  answer?: number | boolean[] | string[] | null;
  order: number;
  text?: string;
}

interface AnswerKeyData {
  sequentialAnswers: Array<{
    originalNumber: number;
    type: 'mcq' | 'truefalse' | 'shortanswer';
    answer: number | boolean[] | string[];
  }>;
}

interface ParseResult {
  list: Array<{
    id: string;
    type: 'mcq' | 'truefalse' | 'shortanswer' | 'textblock';
    question?: string;
    answer?: number | boolean[] | string[] | null;
    score?: number;
    text?: string;
  }>;
  optionList: Array<Array<{
    id: string;
    option: string;
    optionNo: number;
    answer: boolean;
  }>>;
}

/**
 * Parses raw quiz text and converts it to the application's question format
 */
export function parseQuizText(rawText: string): ParseResult {
  console.log('🚀 [DEBUG] parseQuizText called');
  console.log('🚀 [DEBUG] rawText length:', rawText ? rawText.length : 0);
  console.log('🚀 [DEBUG] rawText (first 500 chars):', rawText ? rawText.substring(0, 500) : 'null');
  
  if (!rawText || !rawText.trim()) {
    console.log('🚀 [DEBUG] Empty rawText, returning empty arrays');
    return { list: [], optionList: [] };
  }

  // Split text into content and answer key sections
  const answerKeySection = extractAnswerKey(rawText);
  const contentSection = extractContent(rawText);
  console.log('🚀 [DEBUG] answerKeySection length:', answerKeySection.length);
  console.log('🚀 [DEBUG] contentSection length:', contentSection.length);
  
  // Parse answer key first to create a lookup map
  const answerKeyData = parseAnswerKey(answerKeySection);
  console.log('🚀 [DEBUG] answerKeyData:', answerKeyData);
  
  // Parse questions from content
  const questions = parseQuestions(contentSection, answerKeyData);
  console.log('🚀 [DEBUG] Parsed questions count:', questions.length);
  console.log('🚀 [DEBUG] Questions:', questions.map(q => ({ number: q.number, originalNumber: q.originalNumber, type: q.type, optionsCount: q.options ? q.options.length : 0 })));
  
  // Convert to application state format
  const result = convertToStateFormat(questions);
  console.log('🚀 [DEBUG] Final result - list count:', result.list.length, 'optionList count:', result.optionList.length);
  return result;
}

/**
 * Extracts the answer key section from raw text
 */
function extractAnswerKey(text: string): string {
  const answerKeyPattern = /(?:Bảng\s+đáp\s+án|BẢNG\s+ĐÁP\s+ÁN)[\s\S]*$/i;
  const match = text.match(answerKeyPattern);
  return match ? match[0] : '';
}

/**
 * Extracts the main content section (everything before answer key)
 */
function extractContent(text: string): string {
  const answerKeyPattern = /(?:Bảng\s+đáp\s+án|BẢNG\s+ĐÁP\s+ÁN)[\s\S]*$/i;
  const content = text.replace(answerKeyPattern, '').trim();
  return content;
}

/**
 * Parses the answer key section and creates a lookup map
 */
function parseAnswerKey(answerKeyText: string): AnswerKeyData {
  if (!answerKeyText) return { sequentialAnswers: [] };
  
  const lines = answerKeyText.split('\n').map(line => line.trim()).filter(line => line);
  
  // Store answers in sequential order (as they appear in answer key)
  // This handles cases where multiple questions have the same number
  const sequentialAnswers: AnswerKeyData['sequentialAnswers'] = [];
  
  for (const line of lines) {
    // Skip header lines
    if (line.match(/^(?:Bảng\s+đáp\s+án|BẢNG\s+ĐÁP\s+ÁN)/i)) continue;
    
    // Pattern for MCQ: "1A 2B 3C" or "Câu 1: A" or "1. A"
    // Handle multiple answers on same line like "1A 2B 3C"
    const mcqPattern = /(?:Câu\s*)?(\d+)[:\s]*([A-Z])/gi;
    let match: RegExpExecArray | null;
    while ((match = mcqPattern.exec(line)) !== null) {
      const questionNum = parseInt(match[1]);
      const answer = match[2].toUpperCase();
      sequentialAnswers.push({
        originalNumber: questionNum,
        type: 'mcq',
        answer: answer.charCodeAt(0) - 65 // Convert A->0, B->1, etc.
      });
    }
    
    // Pattern for True/False: "Câu 4: a)Đ b)S c)S d)Đ" or "4: a)Đ b)S c)S d)Đ"
    const tfPattern = /(?:Câu\s*)?(\d+)[:\s]*((?:[a-z]\)\s*[ĐS])+(?:\s+[a-z]\)\s*[ĐS])*)/i;
    const tfMatch = line.match(tfPattern);
    if (tfMatch) {
      const questionNum = parseInt(tfMatch[1]);
      const answersStr = tfMatch[2];
      const answers: boolean[] = [];
      const answerPattern = /([a-z])\)\s*([ĐS])/gi;
      let ansMatch: RegExpExecArray | null;
      while ((ansMatch = answerPattern.exec(answersStr)) !== null) {
        const answerChar = ansMatch[2].toUpperCase();
        const isCorrect = answerChar === 'Đ';
        answers.push(isCorrect);
      }
      if (answers.length > 0) {
        sequentialAnswers.push({
          originalNumber: questionNum,
          type: 'truefalse',
          answer: answers
        });
      }
    }
    
    // Pattern for Short Answer: "Câu 6: on | On | ON" or "6: on | On | ON"
    const shortAnswerPattern = /(?:Câu\s*)?(\d+)[:\s]+([^|]+(?:\s*\|\s*[^|]+)*)/;
    const shortMatch = line.match(shortAnswerPattern);
    if (shortMatch && !line.match(/[a-z]\)\s*[ĐS]/i)) { // Make sure it's not a True/False line
      const questionNum = parseInt(shortMatch[1]);
      const answersStr = shortMatch[2].trim();
      const answers = answersStr.split('|').map(a => a.trim()).filter(a => a);
      sequentialAnswers.push({
        originalNumber: questionNum,
        type: 'shortanswer',
        answer: answers
      });
    }
  }
  
  console.log('🔍 [DEBUG] Sequential answers from answer key:', sequentialAnswers);
  return { sequentialAnswers };
}

/**
 * Parses questions and text blocks from the content section
 */
function parseQuestions(contentText: string, answerKeyData: AnswerKeyData): ParsedQuestion[] {
  console.log('🔍 [DEBUG] parseQuestions called');
  console.log('🔍 [DEBUG] contentText length:', contentText ? contentText.length : 0);
  console.log('🔍 [DEBUG] contentText (first 300 chars):', contentText ? contentText.substring(0, 300) : 'null');
  
  const items: ParsedQuestion[] = [];
  
  if (!contentText) {
    console.log('🔍 [DEBUG] Empty contentText, returning empty items');
    return items;
  }
  
  // Split by question markers (Câu 1., Câu 2., etc.)
  // Improved pattern: stop before next question OR section header
  const questionPattern = /Câu\s+(\d+)[\.:]\s*([\s\S]*?)(?=Câu\s+\d+[\.:]|PHẦN\s+[IVX]+|$)/gi;
  
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let matchCount = 0;
  let sequentialQuestionNum = 1; // Sequential question number (1, 2, 3, 4...)
  
  while ((match = questionPattern.exec(contentText)) !== null) {
    matchCount++;
    const originalQuestionNum = parseInt(match[1]);
    
    console.log(`🔍 [DEBUG] Found question match ${matchCount}: original number=${originalQuestionNum}, sequential number=${sequentialQuestionNum}`);
    
    // Check if there's text before this question
    const textBefore = contentText.substring(lastIndex, match.index).trim();
    if (textBefore) {
      // This is a text block (not a question)
      items.push({
        type: 'textblock',
        text: textBefore,
        number: 0,
        originalNumber: 0,
        order: items.length
      });
      // Don't increment answerKeyIndex for text blocks
    }
    
    // Parse the question
    const questionContent = match[2].trim();
    
    console.log(`🔍 [DEBUG] Parsing question ${sequentialQuestionNum} (original: ${originalQuestionNum})`);
    console.log(`🔍 [DEBUG] Question content (first 200 chars):`, questionContent.substring(0, 200));
    
    // Determine question type based on content
    const questionType = determineQuestionType(questionContent);
    console.log(`🔍 [DEBUG] Determined question type:`, questionType);
    
    // Extract question text and options
    // Use original question number to find answer in answer key
    const { questionText, options, correctAnswer } = extractQuestionData(
      questionContent, 
      questionType, 
      sequentialQuestionNum, // Use sequential number
      answerKeyData,
      originalQuestionNum // Use original number to find answer in answer key
    );
    console.log(`🔍 [DEBUG] Extracted - questionText length:`, questionText ? questionText.length : 0, 'options count:', options ? options.length : 0);
    console.log(`🔍 [DEBUG] Extracted options:`, options);
    console.log(`🔍 [DEBUG] Extracted correctAnswer:`, correctAnswer);
    
    // Ensure options is always an array
    const safeOptions = Array.isArray(options) ? options : [];
    if (safeOptions.length === 0) {
      console.warn(`⚠️ [DEBUG] Question ${sequentialQuestionNum} has no options extracted!`);
    }
    
    items.push({
      number: sequentialQuestionNum, // Use sequential number instead of original
      originalNumber: originalQuestionNum, // Keep original for reference
      type: questionType,
      question: questionText,
      options: safeOptions, // Ensure options is always an array
      answer: correctAnswer,
      order: items.length
    });
    
    sequentialQuestionNum++; // Increment for next question
    lastIndex = match.index + match[0].length;
  }
  
  // Check if there's text after the last question
  const textAfter = contentText.substring(lastIndex).trim();
  if (textAfter) {
    items.push({
      type: 'textblock',
      text: textAfter,
      number: 0,
      originalNumber: 0,
      order: items.length
    });
  }
  
  // Keep original order of items (text blocks and questions in the order they appear)
  // Questions are sorted by number, but text blocks maintain their relative positions
  return items.sort((a, b) => {
    // If both are text blocks, keep original order
    if (a.type === 'textblock' && b.type === 'textblock') {
      return a.order - b.order;
    }
    // If both are questions, sort by number
    if (a.type !== 'textblock' && b.type !== 'textblock') {
      return a.number - b.number;
    }
    // Mixed: keep original order (text blocks and questions maintain relative positions)
    return a.order - b.order;
  });
}

/**
 * Determines the type of question based on content
 */
function determineQuestionType(content: string): 'mcq' | 'truefalse' | 'shortanswer' {
  console.log('🔍 [DEBUG] determineQuestionType - content length:', content.length);
  
  // PRIORITY 1: Check for MCQ indicators FIRST (A., B., C., D. patterns)
  // Must be uppercase letter at word boundary followed by . and space (or end of line)
  // Can have optional * before the letter (for correct answer marker)
  // Options can be on the same line: *A. text B. text C. text D. text
  // Pattern should match: *A. (anywhere) or A. (after space/newline/start)
  // Also accept A) markers and invisible/zero-width separators
  const mcqPattern = /\*([A-Z])[)\.][\s\u00A0\u200B\u200C\uFEFF]*|(?:^|[\s\u00A0\u200B\u200C\uFEFF])([A-Z])[)\.][\s\u00A0\u200B\u200C\uFEFF]*/g;
  const mcqMatches: Array<{ match: RegExpExecArray; letter: string; index: number; isStarred: boolean }> = [];
  let mcqMatch: RegExpExecArray | null;
  while ((mcqMatch = mcqPattern.exec(content)) !== null) {
    const letter = mcqMatch[1] || mcqMatch[2]; // Group 1 for starred, Group 2 for unstarred
    const isStarred = !!mcqMatch[1];
    const matchIndex = mcqMatch.index;
    const fullMatch = mcqMatch[0];
    
    // Check character before the match
    const beforeChar = matchIndex > 0 ? content[matchIndex - 1] : ' ';
    
    // Check character after the marker (either '.' or ')')
    const dotIndex = content.indexOf('.', matchIndex);
    const parenIndex = content.indexOf(')', matchIndex);
    let markerCharIndex = -1;
    if (dotIndex !== -1 && parenIndex !== -1) {
      markerCharIndex = Math.min(dotIndex, parenIndex);
    } else {
      markerCharIndex = dotIndex !== -1 ? dotIndex : parenIndex;
    }
    const afterMarkerIndex = markerCharIndex !== -1 ? markerCharIndex + 1 : matchIndex + fullMatch.length;
    const afterChar = afterMarkerIndex < content.length ? content[afterMarkerIndex] : '';
    
    // Valid if:
    // - Letter is A-Z
    // - For starred: can be anywhere (beforeChar can be anything except letter)
    // - For unstarred: before must be space/newline/tab/start
    // - After period must be space/newline/tab/letter/end
    let validBefore: boolean;
    if (isStarred) {
      // Starred marker: *A. can appear after any non-letter character or at start
      validBefore = matchIndex === 0 || !/[A-Za-z]/.test(beforeChar);
    } else {
      // Unstarred marker: allow common punctuation or any whitespace before, or start
      const isWs = beforeChar === ' ' || beforeChar === '\n' || beforeChar === '\t' || beforeChar === '\r' || /\u00A0|\u200B|\u200C|\uFEFF/.test(beforeChar);
      const isPunct = /[.,;:!?()\[\]{}"“”''»-]/.test(beforeChar);
      validBefore = isWs || isPunct || matchIndex === 0;
    }
    
    const validAfter = afterChar === ' ' || afterChar === '\n' || afterChar === '\r' || afterChar === '\t' || afterChar === '' || /\u00A0|\u200B|\u200C|\uFEFF/.test(afterChar) || /[A-Za-z]/.test(afterChar);
    
    if (letter >= 'A' && letter <= 'Z' && validBefore && validAfter) {
      // Calculate the actual index of the letter
      let letterIndex: number;
      if (isStarred) {
        letterIndex = matchIndex + 1; // * is at matchIndex, letter is at matchIndex+1
      } else {
        letterIndex = fullMatch.startsWith(' ') ? matchIndex + 1 : matchIndex;
      }
      
      mcqMatches.push({
        match: mcqMatch,
        letter: letter,
        index: letterIndex,
        isStarred: isStarred
      });
    }
  }
  const mcqCount = mcqMatches.length;
  console.log('🔍 [DEBUG] MCQ matches found:', mcqCount, mcqMatches.map(m => `${m.isStarred ? '*' : ''}${m.letter}@${m.index}`));
  
  // PRIORITY 2: Check for True/False indicators (a), b), c), d) patterns)
  // Pattern: match *a), a), *a., a. - but only if it's a valid option marker (a, b, c, d, e, f, g, h)
  // More strict: must be at word boundary or after whitespace, and followed by space/[ or at end
  const tfPattern = /(\*?)([a-z])[\)\.]/g;
  const tfMatches: RegExpExecArray[] = [];
  let tfMatch: RegExpExecArray | null;
  while ((tfMatch = tfPattern.exec(content)) !== null) {
    const letter = tfMatch[2];
    const hasStar = tfMatch[1] === '*';
    const matchIndex = tfMatch.index;
    
    // Only accept letters a-h (typical for True/False options)
    if (letter < 'a' || letter > 'h') {
      continue;
    }
    
    // Check character before the match
    const beforeChar = matchIndex > 0 ? content[matchIndex - 1] : ' ';
    
    // Check character after the match (after ) or .)
    const afterMatchIndex = matchIndex + tfMatch[0].length;
    const afterChar = afterMatchIndex < content.length ? content[afterMatchIndex] : '';
    
    // Accept if:
    // - Letter is a-h (valid option letters)
    // - Before is space/newline/tab/* or start of string
    // - After is space/newline/tab/[ or end of string or period
    const validBefore = beforeChar === ' ' || beforeChar === '\n' || beforeChar === '\t' || beforeChar === '*' || matchIndex === 0;
    const validAfter = afterChar === ' ' || afterChar === '\n' || afterChar === '\r' || afterChar === '\t' || afterChar === '[' || afterChar === '' || afterChar === '.';
    
    if (validBefore && validAfter) {
      tfMatches.push(tfMatch);
    }
  }
  const tfCount = tfMatches.length;
  console.log('🔍 [DEBUG] True/False matches found:', tfCount, tfMatches.map(m => m[0]));
  
  // If both exist, prioritize MCQ if there are uppercase markers
  // This handles cases where MCQ text might contain lowercase letters
  if (mcqCount > 0 && tfCount > 0) {
    // If MCQ has more markers, it's MCQ; otherwise True/False
    // But if MCQ has at least 2 markers, it's definitely MCQ
    if (mcqCount >= 2) {
      console.log('🔍 [DEBUG] Returning MCQ (has >= 2 markers)');
      return 'mcq';
    }
    const result = mcqCount >= tfCount ? 'mcq' : 'truefalse';
    console.log('🔍 [DEBUG] Returning', result, '(mcqCount:', mcqCount, 'vs tfCount:', tfCount, ')');
    return result;
  }
  
  if (mcqCount >= 2) {
    // Check if they form a sequence (A, B, C, D or similar)
    const letters = mcqMatches.map(m => m.letter.charCodeAt(0));
    const isSequential = letters.every((letter, idx) => {
      if (idx === 0) return true;
      return letter === letters[idx - 1] + 1;
    });
    
    if (isSequential) {
      console.log('🔍 [DEBUG] Returning MCQ (sequential letters)');
      return 'mcq';
    } else if (mcqCount >= 2) {
      // Even if not perfectly sequential, if we have 2+ markers, it's likely MCQ
      console.log('🔍 [DEBUG] Returning MCQ (2+ markers found)');
      return 'mcq';
    }
  }
  
  if (mcqCount > 0) {
    console.log('🔍 [DEBUG] Returning MCQ');
    return 'mcq';
  }
  
  if (tfCount > 0) {
    console.log('🔍 [DEBUG] Returning True/False');
    return 'truefalse';
  }
  
  // Default to short answer if no clear indicators
  console.log('🔍 [DEBUG] Returning Short Answer (no clear indicators)');
  return 'shortanswer';
}

/**
 * Extracts question text, options, and correct answer from question content
 */
function extractQuestionData(
  content: string, 
  type: 'mcq' | 'truefalse' | 'shortanswer', 
  questionNum: number, 
  answerKeyData: AnswerKeyData, 
  originalQuestionNum: number = -1
): { questionText: string; options: Array<{ letter: string; text: string; isMarked: boolean }>; correctAnswer: number | boolean[] | string[] | null } {
  console.log(`🔍 [DEBUG] extractQuestionData - questionNum:`, questionNum, 'type:', type, 'originalQuestionNum:', originalQuestionNum);
  console.log(`🔍 [DEBUG] extractQuestionData - content (first 200 chars):`, content.substring(0, 200));
  
  // Get answer key for this question by original number (not by index)
  let answerKeyMap: { [key: number]: AnswerKeyData['sequentialAnswers'][0] } = {};
  if (answerKeyData && answerKeyData.sequentialAnswers && originalQuestionNum >= 0) {
    // Find answer by matching originalNumber
    const answerData = answerKeyData.sequentialAnswers.find(
      ans => ans.originalNumber === originalQuestionNum && ans.type === type
    );
    if (answerData) {
      answerKeyMap[questionNum] = answerData;
      console.log(`🔍 [DEBUG] Found answer key for question ${questionNum} (original: ${originalQuestionNum}):`, answerData);
    } else {
      console.log(`🔍 [DEBUG] No answer key found for question ${questionNum} (original: ${originalQuestionNum}, type: ${type})`);
    }
  } else {
    console.log(`🔍 [DEBUG] No answer key data or invalid originalQuestionNum for question ${questionNum}`);
  }
  
  let questionText = '';
  let options: Array<{ letter: string; text: string; isMarked: boolean }> = [];
  let correctAnswer: number | boolean[] | string[] | null = null;
  
  if (type === 'mcq') {
    console.log('🔍 [DEBUG] Processing MCQ...');
    
    // First, find ALL potential option markers in the entire content
    interface Marker {
      index: number;
      letter: string;
      fullMatch: string;
      hasStar: boolean;
    }
    const allMatches: Marker[] = [];
    
    // Find all *A. patterns
    const starredPatternGlobal = /\*([A-Z])[)\.][\s\u00A0\u200B\u200C\uFEFF]*/g;
    let starredMatchGlobal: RegExpExecArray | null;
    while ((starredMatchGlobal = starredPatternGlobal.exec(content)) !== null) {
      allMatches.push({
        index: starredMatchGlobal.index, // Index at '*'
        letter: starredMatchGlobal[1],
        fullMatch: starredMatchGlobal[0], // e.g., "*A. " or "*A."
        hasStar: true
      });
    }
    
    // Find all A. patterns (but skip if already found as *A.)
    const unstarredPattern = /(?:^|[\s\u00A0\u200B\u200C\uFEFF])([A-Z])[)\.][\s\u00A0\u200B\u200C\uFEFF]*/g;
    let unstarredMatch: RegExpExecArray | null;
    while ((unstarredMatch = unstarredPattern.exec(content)) !== null) {
      let matchIndex = unstarredMatch.index;
      let fullMatch = unstarredMatch[0];
      
      let letterIndex = matchIndex;
      if (/^\s/.test(fullMatch)) {
        const matchResult = fullMatch.match(/^\s*/);
        letterIndex = matchIndex + (matchResult ? matchResult[0].length : 0);
      }
      
      const alreadyCaptured = allMatches.some(m => {
        if (m.hasStar && m.letter === unstarredMatch![1]) {
          return m.index + 1 === letterIndex;
        }
        return false;
      });
      
      if (!alreadyCaptured) {
        allMatches.push({
          index: letterIndex,
          letter: unstarredMatch[1],
          fullMatch: fullMatch,
          hasStar: false
        });
      }
    }
    
    allMatches.sort((a, b) => a.index - b.index);
    console.log('🔍 [DEBUG] All potential markers found:', allMatches.map(m => `${m.letter}@${m.index}`));
    
    const optionMarkers: Marker[] = [];
    let bestSequence: Marker[] = [];
    
    for (let startIdx = 0; startIdx < allMatches.length; startIdx++) {
      const sequence = [allMatches[startIdx]];
      let expectedLetter = String.fromCharCode(allMatches[startIdx].letter.charCodeAt(0) + 1);
      
      for (let i = startIdx + 1; i < allMatches.length; i++) {
        if (allMatches[i].letter === expectedLetter) {
          sequence.push(allMatches[i]);
          expectedLetter = String.fromCharCode(expectedLetter.charCodeAt(0) + 1);
        } else if (allMatches[i].letter < expectedLetter) {
          continue;
        } else {
          break;
        }
      }
      
      if (sequence.length >= 2 && sequence.length > bestSequence.length) {
        bestSequence = sequence;
      }
    }
    
    if (bestSequence.length >= 2) {
      optionMarkers.push(...bestSequence);
      console.log('🔍 [DEBUG] Using option sequence:', bestSequence.map(m => `${m.letter}@${m.index}`));
    } else if (allMatches.length > 0) {
      optionMarkers.push(...allMatches);
      console.log('🔍 [DEBUG] No clear sequence, using all markers');
    }
    
    if (optionMarkers.length > 0) {
      const firstMarker = optionMarkers[0];
      const questionEndIndex = firstMarker.hasStar ? firstMarker.index : 
        (firstMarker.index > 0 && content[firstMarker.index - 1] === ' ' ? firstMarker.index - 1 : firstMarker.index);
      questionText = content.substring(0, questionEndIndex).trim();
      questionText = questionText.replace(/\*+$/, '').trim();
    } else {
      questionText = content.trim();
    }
    
    for (let i = 0; i < optionMarkers.length; i++) {
      const currentMarker = optionMarkers[i];
      const nextMarker = optionMarkers[i + 1];
      let optionText: string;
      let markerEnd: number;
      
      if (currentMarker.hasStar) {
        markerEnd = currentMarker.index + currentMarker.fullMatch.length;
      } else {
        const letterIndex = currentMarker.index;
        const dotIndex = content.indexOf('.', letterIndex);
        const parenIndex = content.indexOf(')', letterIndex);
        let markerIdx = -1;
        if (dotIndex !== -1 && parenIndex !== -1) {
          markerIdx = Math.min(dotIndex, parenIndex);
        } else {
          markerIdx = dotIndex !== -1 ? dotIndex : parenIndex;
        }
        if (markerIdx !== -1) {
          let pos = markerIdx + 1;
          while (pos < content.length && (content[pos] === ' ' || content[pos] === '\t')) {
            pos++;
          }
          markerEnd = pos;
        } else {
          const hasLeadingSpace = letterIndex > 0 && content[letterIndex - 1] === ' ';
          if (hasLeadingSpace) {
            markerEnd = letterIndex - 1 + currentMarker.fullMatch.length;
          } else {
            markerEnd = letterIndex + currentMarker.fullMatch.length;
          }
        }
      }
      
      if (nextMarker) {
        let nextMarkerStart: number;
        if (nextMarker.hasStar) {
          nextMarkerStart = nextMarker.index;
        } else {
          if (nextMarker.index > 0 && content[nextMarker.index - 1] === ' ') {
            nextMarkerStart = nextMarker.index - 1;
          } else {
            nextMarkerStart = nextMarker.index;
          }
        }
        optionText = content.substring(markerEnd, nextMarkerStart).trim();
      } else {
        const startPos = markerEnd;
        let endPos = content.length;
        const sectionPattern = /(?:^|\n)\s*PHẦN\s+[IVX]+/i;
        const sectionMatch = content.substring(startPos).match(sectionPattern);
        if (sectionMatch && sectionMatch.index !== undefined) {
          endPos = startPos + sectionMatch.index;
        }
        optionText = content.substring(startPos, endPos).trim();
      }
      
      const isMarked = currentMarker.hasStar;
      options.push({
        letter: currentMarker.letter,
        text: optionText,
        isMarked: isMarked
      });
    }
    
    const markedOption = options.findIndex(opt => opt.isMarked);
    if (markedOption !== -1) {
      correctAnswer = markedOption;
    } else if (answerKeyMap[questionNum] && answerKeyMap[questionNum].type === 'mcq') {
      correctAnswer = answerKeyMap[questionNum].answer as number;
    }
    
  } else if (type === 'truefalse') {
    console.log('🔍 [DEBUG] Parsing True/False question:', questionNum);
    console.log('🔍 [DEBUG] Content:', content.substring(0, 200) + '...');
    
    interface TFMarker {
      index: number;
      hasStar: boolean;
      letter: string;
      delimiter: string;
      fullMatch: string;
    }
    
    const firstMarkerPattern = /(?:^|\s)(\*?)([a-h])[\)\.](?:\s|\[)/i;
    const firstMatch = content.match(firstMarkerPattern);
    
    if (!firstMatch) {
      console.warn('⚠️ [DEBUG] No first marker found');
      questionText = content.trim();
    } else {
      let firstMarkerIndex = content.indexOf(firstMatch[0]);
      if (firstMatch[0].startsWith(' ')) {
        firstMarkerIndex += 1;
      }
      if (firstMatch[1] === '*' && firstMarkerIndex > 0) {
        firstMarkerIndex -= 1;
      }
      
      console.log('🔍 [DEBUG] First marker found at index:', firstMarkerIndex, 'match:', firstMatch[0]);
      
      questionText = content.substring(0, firstMarkerIndex).trim();
      questionText = questionText.replace(/\*+$/, '').trim();
      console.log('🔍 [DEBUG] Question text:', questionText.substring(0, 100) + '...');
      
      const markers: TFMarker[] = [];
      const statementContent = content.substring(firstMarkerIndex);
      const markerRegex = /(\*?)([a-h])[\)\.](?=\s|\[|$)/gi;
      let match: RegExpExecArray | null;
      let lastLetterIndex = -1;
      
      while ((match = markerRegex.exec(statementContent)) !== null) {
        const relativeIndex = match.index;
        const absoluteIndex = firstMarkerIndex + relativeIndex;
        const letter = match[2].toLowerCase();
        const letterIndex = letter.charCodeAt(0) - 'a'.charCodeAt(0);
        
        const beforeChar = absoluteIndex > 0 ? content[absoluteIndex - 1] : ' ';
        const afterIndex = absoluteIndex + match[0].length;
        const afterChar = afterIndex < content.length ? content[afterIndex] : '';
        
        const validBefore = beforeChar === ' ' || beforeChar === '\n' || beforeChar === '\t' || beforeChar === '*' || absoluteIndex === 0;
        const validAfter = afterChar === ' ' || afterChar === '\n' || afterChar === '\t' || afterChar === '[' || afterChar === '';
        
        if (validBefore && validAfter) {
          if (markers.length === 0) {
            if (letter === 'a') {
              markers.push({
                index: absoluteIndex,
                hasStar: match[1] === '*',
                letter: letter,
                delimiter: match[0].includes(')') ? ')' : '.',
                fullMatch: match[0]
              });
              lastLetterIndex = 0;
            }
          } else {
            if (letterIndex === lastLetterIndex + 1) {
              markers.push({
                index: absoluteIndex,
                hasStar: match[1] === '*',
                letter: letter,
                delimiter: match[0].includes(')') ? ')' : '.',
                fullMatch: match[0]
              });
              lastLetterIndex = letterIndex;
            }
          }
        }
      }
      
      console.log('🔍 [DEBUG] Found markers:', markers.length, markers);
      
      if (markers.length > 0) {
        for (let i = 0; i < markers.length; i++) {
          const marker = markers[i];
          const nextMarker = markers[i + 1];
          
          let textStart = marker.index + marker.fullMatch.length;
          
          const afterMarker = content.substring(textStart);
          const bracketRegex = /^\s*\[[^\]]*\](?=\s|$|\.)/;
          let bracketMatch = afterMarker.match(bracketRegex);
          
          if (!bracketMatch) {
            bracketMatch = afterMarker.match(/^\s*\[[^\]]*\]/);
          }
          
          if (bracketMatch) {
            textStart += bracketMatch[0].length;
          } else {
            const incompleteBracket = /^\s*\[/;
            const incompleteMatch = afterMarker.match(incompleteBracket);
            if (incompleteMatch) {
              textStart += incompleteMatch[0].length;
              while (textStart < content.length && /\s/.test(content[textStart])) {
                textStart++;
              }
            }
          }
          
          while (textStart < content.length && /\s/.test(content[textStart])) {
            textStart++;
          }
          
          let textEnd: number;
          if (nextMarker) {
            textEnd = nextMarker.index;
          } else {
            textEnd = content.length;
            const sectionMatch = content.substring(textStart).match(/(?:^|\n)\s*(PHẦN\s+[IVX]+|Câu\s+\d+[\.:])/i);
            if (sectionMatch && sectionMatch.index !== undefined) {
              textEnd = Math.min(textEnd, textStart + sectionMatch.index);
            }
            const hetPattern = /(?:^|\n)\s*-*\s*HẾT\s*-*/i;
            const hetMatch = content.substring(textStart).match(hetPattern);
            if (hetMatch && hetMatch.index !== undefined) {
              textEnd = Math.min(textEnd, textStart + hetMatch.index);
            }
            const answerKeyPattern = /(?:^|\n)\s*(?:Bảng\s+đáp\s+án|BẢNG\s+ĐÁP\s+ÁN)/i;
            const answerKeyMatch = content.substring(textStart).match(answerKeyPattern);
            if (answerKeyMatch && answerKeyMatch.index !== undefined) {
              textEnd = Math.min(textEnd, textStart + answerKeyMatch.index);
            }
          }
          
          const statementText = content.substring(textStart, textEnd).trim().replace(/\s+/g, ' ');
          
          options.push({
            letter: marker.letter,
            text: statementText,
            isMarked: marker.hasStar
          });
        }
      }
    }
    
    const markedAnswers = options.map(opt => opt.isMarked);
    const hasMarked = markedAnswers.some(m => m);
    if (hasMarked) {
      correctAnswer = markedAnswers;
    } else if (answerKeyMap[questionNum] && answerKeyMap[questionNum].type === 'truefalse') {
      correctAnswer = answerKeyMap[questionNum].answer as boolean[];
    } else {
      correctAnswer = markedAnswers;
    }
    
  } else {
    // Short answer type
    questionText = content.trim();
    questionText = questionText.replace(/-+\s*HẾT\s*-+.*$/i, '').trim();
    
    // Get answer from answer key map (should be array of valid answers)
    if (answerKeyMap[questionNum] && answerKeyMap[questionNum].type === 'shortanswer') {
      const answerFromKey = answerKeyMap[questionNum].answer;
      // Ensure it's always an array
      correctAnswer = Array.isArray(answerFromKey) ? answerFromKey : (typeof answerFromKey === 'string' ? [answerFromKey].filter(a => a) : []);
    }
  }
  
  return { questionText, options, correctAnswer };
}

/**
 * Converts parsed questions and text blocks to application state format
 */
function convertToStateFormat(items: ParsedQuestion[]): ParseResult {
  const list: ParseResult['list'] = [];
  const optionList: ParseResult['optionList'] = [];
  
  items.forEach((item) => {
    if (item.type === 'textblock') {
      // This is a text block, not a question
      const textBlockObj = {
        id: uuid(),
        type: 'textblock' as const,
        text: item.text
      };
      list.push(textBlockObj);
      optionList.push([]); // Empty options for text blocks
    } else {
      // This is a question
      const questionObj = {
        id: uuid(),
        question: item.question,
        type: item.type,
        answer: item.answer !== null && item.answer !== undefined 
          ? (item.type === 'shortanswer' && !Array.isArray(item.answer) ? [String(item.answer)] : item.answer)
          : (item.type === 'shortanswer' ? [] : (item.type === 'truefalse' ? [] : null)),
        score: item.type === 'truefalse' ? 1.0 : item.type === 'shortanswer' ? 0.5 : 0.25
      };
      
      list.push(questionObj);
      
      // Create options array
      if (item.type === 'mcq') {
        console.log(`🔍 [DEBUG convertToStateFormat] MCQ item.options:`, item.options);
        if (!item.options || !Array.isArray(item.options) || item.options.length === 0) {
          console.warn(`⚠️ [DEBUG convertToStateFormat] MCQ question has no options!`, item);
          optionList.push([]);
        } else {
          const options = item.options.map((opt, idx) => ({
            id: uuid(),
            option: opt.text || '',
            optionNo: idx + 1,
            answer: false
          }));
          console.log(`🔍 [DEBUG convertToStateFormat] Mapped MCQ options:`, options);
          optionList.push(options);
        }
        
        // Set correct answer
        if (questionObj.answer !== null && typeof questionObj.answer === 'number') {
          questionObj.answer = questionObj.answer;
        }
        
      } else if (item.type === 'truefalse') {
        console.log('🔍 [DEBUG] Converting True/False to state format:', item);
        console.log('🔍 [DEBUG] item.options:', item.options);
        
        // Ensure options array exists and has items
        if (item.options && Array.isArray(item.options) && item.options.length > 0) {
          console.log('🔍 [DEBUG] Processing', item.options.length, 'options');
          const options = item.options.map((opt, idx) => {
            const optionObj = {
              id: uuid(),
              option: (opt.text || '').trim(),
              optionNo: idx + 1,
              answer: Array.isArray(questionObj.answer) ? (questionObj.answer as boolean[])[idx] || false : false
            };
            console.log(`🔍 [DEBUG] Mapped option ${idx}:`, optionObj);
            return optionObj;
          });
          optionList.push(options);
          console.log('🔍 [DEBUG] Pushed options to optionList:', options);
        } else {
          // If no options found, push empty array
          console.warn('⚠️ [DEBUG] True/False question has no options:', item);
          console.warn('⚠️ [DEBUG] item structure:', JSON.stringify(item, null, 2));
          optionList.push([]);
        }
        
      } else {
        // Short answer - no options
        optionList.push([]);
      }
    }
  });
  
  return { list, optionList };
}

// Note: Các hàm extractQuestionData cho MCQ và True/False có logic rất dài và phức tạp
// Để giữ cho file không quá dài, tôi sẽ tạo một file riêng cho phần logic này
// Hoặc có thể giữ nguyên logic và chỉ thêm type annotations
