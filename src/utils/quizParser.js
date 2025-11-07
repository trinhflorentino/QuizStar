import { v4 as uuid } from "uuid";

/**
 * Parses raw quiz text and converts it to the application's question format
 * @param {string} rawText - The raw text input from the user
 * @returns {Object} - { list: Array, optionList: Array }
 */
export function parseQuizText(rawText) {
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
function extractAnswerKey(text) {
  const answerKeyPattern = /(?:Bảng\s+đáp\s+án|BẢNG\s+ĐÁP\s+ÁN)[\s\S]*$/i;
  const match = text.match(answerKeyPattern);
  return match ? match[0] : '';
}

/**
 * Extracts the main content section (everything before answer key)
 */
function extractContent(text) {
  const answerKeyPattern = /(?:Bảng\s+đáp\s+án|BẢNG\s+ĐÁP\s+ÁN)[\s\S]*$/i;
  const content = text.replace(answerKeyPattern, '').trim();
  return content;
}

/**
 * Parses the answer key section and creates a lookup map
 */
function parseAnswerKey(answerKeyText) {
  if (!answerKeyText) return { sequentialAnswers: [] };
  
  const lines = answerKeyText.split('\n').map(line => line.trim()).filter(line => line);
  
  // Store answers in sequential order (as they appear in answer key)
  // This handles cases where multiple questions have the same number
  const sequentialAnswers = [];
  
  for (const line of lines) {
    // Skip header lines
    if (line.match(/^(?:Bảng\s+đáp\s+án|BẢNG\s+ĐÁP\s+ÁN)/i)) continue;
    
    // Pattern for MCQ: "1A 2B 3C" or "Câu 1: A" or "1. A"
    // Handle multiple answers on same line like "1A 2B 3C"
    const mcqPattern = /(?:Câu\s*)?(\d+)[:\s]*([A-Z])/gi;
    let match;
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
      const answers = [];
      const answerPattern = /([a-z])\)\s*([ĐS])/gi;
      let ansMatch;
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
function parseQuestions(contentText, answerKeyData) {
  console.log('🔍 [DEBUG] parseQuestions called');
  console.log('🔍 [DEBUG] contentText length:', contentText ? contentText.length : 0);
  console.log('🔍 [DEBUG] contentText (first 300 chars):', contentText ? contentText.substring(0, 300) : 'null');
  
  const items = [];
  
  if (!contentText) {
    console.log('🔍 [DEBUG] Empty contentText, returning empty items');
    return items;
  }
  
  // Split by question markers (Câu 1., Câu 2., etc.)
  // Improved pattern: stop before next question OR section header
  const questionPattern = /Câu\s+(\d+)[\.:]\s*([\s\S]*?)(?=Câu\s+\d+[\.:]|PHẦN\s+[IVX]+|$)/gi;
  
  let lastIndex = 0;
  let match;
  let matchCount = 0;
  let sequentialQuestionNum = 1; // Sequential question number (1, 2, 3, 4...)
  let answerKeyIndex = 0; // Index into sequentialAnswers array (only increment for actual questions, not text blocks)
  
  while ((match = questionPattern.exec(contentText)) !== null) {
    matchCount++;
    const originalQuestionNum = parseInt(match[1]);
    
    console.log(`🔍 [DEBUG] Found question match ${matchCount}: original number=${originalQuestionNum}, sequential number=${sequentialQuestionNum}, answerKeyIndex=${answerKeyIndex}`);
    
    // Check if there's text before this question
    const textBefore = contentText.substring(lastIndex, match.index).trim();
    if (textBefore) {
      // This is a text block (not a question)
      items.push({
        type: 'textblock',
        text: textBefore,
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
    // Use sequential question number for answer key lookup (by index in sequentialAnswers)
    const { questionText, options, correctAnswer } = extractQuestionData(
      questionContent, 
      questionType, 
      sequentialQuestionNum, // Use sequential number
      answerKeyData,
      answerKeyIndex // Use index into sequentialAnswers array
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
    answerKeyIndex++; // Increment answer key index only for actual questions
    lastIndex = match.index + match[0].length;
  }
  
  // Check if there's text after the last question
  const textAfter = contentText.substring(lastIndex).trim();
  if (textAfter) {
    items.push({
      type: 'textblock',
      text: textAfter,
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
function determineQuestionType(content) {
  console.log('🔍 [DEBUG] determineQuestionType - content length:', content.length);
  
  // PRIORITY 1: Check for MCQ indicators FIRST (A., B., C., D. patterns)
  // Must be uppercase letter at word boundary followed by . and space (or end of line)
  // Can have optional * before the letter (for correct answer marker)
  // Options can be on the same line: *A. text B. text C. text D. text
  // Pattern should match: *A. (anywhere) or A. (after space/newline/start)
  const mcqPattern = /\*([A-Z])\.\s*|(?:^|\s)([A-Z])\.\s*/g;
  const mcqMatches = [];
  let mcqMatch;
  while ((mcqMatch = mcqPattern.exec(content)) !== null) {
    const letter = mcqMatch[1] || mcqMatch[2]; // Group 1 for starred, Group 2 for unstarred
    const isStarred = !!mcqMatch[1];
    const matchIndex = mcqMatch.index;
    const fullMatch = mcqMatch[0];
    
    // Check character before the match
    const beforeChar = matchIndex > 0 ? content[matchIndex - 1] : ' ';
    
    // Check character after the period
    const periodIndex = content.indexOf('.', matchIndex);
    const afterPeriodIndex = periodIndex !== -1 ? periodIndex + 1 : matchIndex + fullMatch.length;
    const afterChar = afterPeriodIndex < content.length ? content[afterPeriodIndex] : '';
    
    // Valid if:
    // - Letter is A-Z
    // - For starred: can be anywhere (beforeChar can be anything except letter)
    // - For unstarred: before must be space/newline/tab/start
    // - After period must be space/newline/tab/letter/end
    let validBefore;
    if (isStarred) {
      // Starred marker: *A. can appear after any non-letter character or at start
      validBefore = matchIndex === 0 || !/[A-Za-z]/.test(beforeChar);
    } else {
      // Unstarred marker: must be after space/newline/tab/start
      validBefore = beforeChar === ' ' || beforeChar === '\n' || beforeChar === '\t' || matchIndex === 0;
    }
    
    const validAfter = afterChar === ' ' || afterChar === '\n' || afterChar === '\t' || afterChar === '' || /[A-Za-z]/.test(afterChar);
    
    if (letter >= 'A' && letter <= 'Z' && validBefore && validAfter) {
      // Calculate the actual index of the letter
      let letterIndex;
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
  const tfMatches = [];
  let tfMatch;
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
    const validAfter = afterChar === ' ' || afterChar === '\n' || afterChar === '\t' || afterChar === '[' || afterChar === '' || afterChar === '.';
    
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
function extractQuestionData(content, type, questionNum, answerKeyData, answerKeyIndex = -1) {
  console.log(`🔍 [DEBUG] extractQuestionData - questionNum:`, questionNum, 'type:', type, 'answerKeyIndex:', answerKeyIndex);
  console.log(`🔍 [DEBUG] extractQuestionData - content (first 200 chars):`, content.substring(0, 200));
  
  // Get answer key for this question by index in sequentialAnswers array
  let answerKeyMap = {};
  if (answerKeyData && answerKeyData.sequentialAnswers && answerKeyIndex >= 0 && answerKeyIndex < answerKeyData.sequentialAnswers.length) {
    const answerData = answerKeyData.sequentialAnswers[answerKeyIndex];
    // Only use if type matches
    if (answerData.type === type) {
      answerKeyMap[questionNum] = answerData;
      console.log(`🔍 [DEBUG] Found answer key for question ${questionNum} at index ${answerKeyIndex}:`, answerData);
    } else {
      console.log(`🔍 [DEBUG] Answer key type mismatch: expected ${type}, got ${answerData.type}`);
    }
  } else {
    console.log(`🔍 [DEBUG] No answer key found for question ${questionNum} at index ${answerKeyIndex}`);
  }
  
  let questionText = '';
  let options = [];
  let correctAnswer = null;
  
  if (type === 'mcq') {
    console.log('🔍 [DEBUG] Processing MCQ...');
    
    // First, find ALL potential option markers in the entire content
    const allMatches = [];
    
    // Find all *A. patterns
    const starredPatternGlobal = /\*([A-Z])\.\s*/g;
    let starredMatchGlobal;
    while ((starredMatchGlobal = starredPatternGlobal.exec(content)) !== null) {
      allMatches.push({
        index: starredMatchGlobal.index, // Index at '*'
        letter: starredMatchGlobal[1],
        fullMatch: starredMatchGlobal[0], // e.g., "*A. " or "*A."
        hasStar: true
      });
    }
    
    // Find all A. patterns (but skip if already found as *A.)
    // Options can be on the same line: *A. text B. text C. text D. text
    // Pattern should match: space + A. + optional space
    // Note: index will be at the space (if present) or at the letter
    const unstarredPattern = /(?:^|\s)([A-Z])\.\s*/g;
    let unstarredMatch;
    while ((unstarredMatch = unstarredPattern.exec(content)) !== null) {
      let matchIndex = unstarredMatch.index;
      let fullMatch = unstarredMatch[0];
      
      // fullMatch could be " A. " or "A. " or " A." or "A."
      // We want index to point to the letter position
      let letterIndex = matchIndex;
      if (fullMatch.startsWith(' ')) {
        letterIndex = matchIndex + 1; // Point to the letter after space
      }
      
      // Check if this is already captured as a starred match
      // A starred match at index X means the letter is at X+1
      const alreadyCaptured = allMatches.some(m => {
        if (m.hasStar && m.letter === unstarredMatch[1]) {
          // Starred match index is at '*', so letter is at index+1
          return m.index + 1 === letterIndex;
        }
        return false;
      });
      
      if (!alreadyCaptured) {
        allMatches.push({
          index: letterIndex, // Store index at the letter
          letter: unstarredMatch[1],
          fullMatch: fullMatch,
          hasStar: false
        });
      }
    }
    
    // Sort by index
    allMatches.sort((a, b) => a.index - b.index);
    
    console.log('🔍 [DEBUG] All potential markers found:', allMatches.map(m => `${m.letter}@${m.index}`));
    
    // Now identify the actual option group (consecutive A, B, C, D...)
    // Options are typically in sequence: A, B, C, D (or starting from any letter)
    // We need to find the longest sequence of consecutive letters
    const optionMarkers = [];
    let bestSequence = [];
    let bestSequenceStart = -1;
    
    // Try to find sequences starting from each marker
    for (let startIdx = 0; startIdx < allMatches.length; startIdx++) {
      const sequence = [allMatches[startIdx]];
      let expectedLetter = String.fromCharCode(allMatches[startIdx].letter.charCodeAt(0) + 1);
      
      // Look for consecutive letters
      for (let i = startIdx + 1; i < allMatches.length; i++) {
        if (allMatches[i].letter === expectedLetter) {
          sequence.push(allMatches[i]);
          expectedLetter = String.fromCharCode(expectedLetter.charCodeAt(0) + 1);
        } else if (allMatches[i].letter < expectedLetter) {
          // Skip if we've already passed this letter
          continue;
        } else {
          // No longer consecutive
          break;
        }
      }
      
      // If this sequence is longer and has at least 2 options, use it
      if (sequence.length >= 2 && sequence.length > bestSequence.length) {
        bestSequence = sequence;
        bestSequenceStart = startIdx;
      }
    }
    
    // If we found a good sequence, use it; otherwise use all markers (fallback)
    if (bestSequence.length >= 2) {
      optionMarkers.push(...bestSequence);
      console.log('🔍 [DEBUG] Using option sequence:', bestSequence.map(m => `${m.letter}@${m.index}`));
    } else if (allMatches.length > 0) {
      // Fallback: use all markers if no clear sequence found
      optionMarkers.push(...allMatches);
      console.log('🔍 [DEBUG] No clear sequence, using all markers');
    }
    
    // Extract question text - everything before the first option marker
    if (optionMarkers.length > 0) {
      const firstMarker = optionMarkers[0];
      // For starred markers, index is at '*'; for unstarred, it's at the letter
      const questionEndIndex = firstMarker.hasStar ? firstMarker.index : 
        (firstMarker.index > 0 && content[firstMarker.index - 1] === ' ' ? firstMarker.index - 1 : firstMarker.index);
      questionText = content.substring(0, questionEndIndex).trim();
      // Remove any trailing asterisk
      questionText = questionText.replace(/\*+$/, '').trim();
    } else {
      questionText = content.trim();
    }
    
    // Extract text for each option
    for (let i = 0; i < optionMarkers.length; i++) {
      const currentMarker = optionMarkers[i];
      const nextMarker = optionMarkers[i + 1];
      
      // Get text from current marker to next marker (or end of content)
      // Start position is after the full marker (e.g., after "*A. " or "A. ")
      let optionText;
      
      // Calculate marker end position - where the option text actually starts
      let markerEnd;
      if (currentMarker.hasStar) {
        // Starred: index is at '*', fullMatch is like "*A. " or "*A."
        // markerEnd should be after the period and any spaces
        markerEnd = currentMarker.index + currentMarker.fullMatch.length;
      } else {
        // Unstarred: index points to the letter
        // We need to find where the period and spaces end
        const letterIndex = currentMarker.index;
        // Find the period after the letter
        const periodIndex = content.indexOf('.', letterIndex);
        if (periodIndex !== -1) {
          // Skip the period and any spaces after it
          let pos = periodIndex + 1;
          while (pos < content.length && (content[pos] === ' ' || content[pos] === '\t')) {
            pos++;
          }
          markerEnd = pos;
        } else {
          // Fallback: use fullMatch length
          const hasLeadingSpace = letterIndex > 0 && content[letterIndex - 1] === ' ';
          if (hasLeadingSpace) {
            markerEnd = letterIndex - 1 + currentMarker.fullMatch.length;
          } else {
            markerEnd = letterIndex + currentMarker.fullMatch.length;
          }
        }
      }
      
      // Debug: Log the marker details
      console.log(`🔍 [DEBUG MCQ Extract] Processing marker ${currentMarker.letter}:`, {
        index: currentMarker.index,
        fullMatch: currentMarker.fullMatch,
        fullMatchLength: currentMarker.fullMatch.length,
        hasStar: currentMarker.hasStar,
        markerEnd: markerEnd,
        contentAroundMarker: content.substring(Math.max(0, currentMarker.index - 5), Math.min(content.length, markerEnd + 30)),
        contentAtMarkerEnd: content.substring(markerEnd, markerEnd + 20)
      });
      
      if (nextMarker) {
        // Extract text between current marker and next marker
        // Find where the next marker starts (the position where we should stop extracting)
        let nextMarkerStart;
        
        if (nextMarker.hasStar) {
          // Starred marker: index is at '*', so the marker starts at index
          // We want to extract up to (but not including) the '*'
          nextMarkerStart = nextMarker.index;
        } else {
          // Unstarred marker: index is at the letter
          // Check if there's a space before the letter (common in same-line options like " B.")
          if (nextMarker.index > 0 && content[nextMarker.index - 1] === ' ') {
            // The space before the marker is the separator
            // We want to extract up to (but not including) the space
            nextMarkerStart = nextMarker.index - 1;
          } else {
            // No space before, marker starts at the letter
            // We want to extract up to (but not including) the letter
            nextMarkerStart = nextMarker.index;
          }
        }
        
        // Extract text between markers
        optionText = content.substring(markerEnd, nextMarkerStart);
        
        // Debug: Log the raw extracted text
        console.log(`🔍 [DEBUG MCQ Extract] Option ${currentMarker.letter}:`, {
          markerEnd: markerEnd,
          nextMarkerStart: nextMarkerStart,
          nextMarker: `${nextMarker.letter}@${nextMarker.index} (hasStar: ${nextMarker.hasStar})`,
          rawText: JSON.stringify(optionText),
          contentBeforeNext: JSON.stringify(content.substring(Math.max(0, nextMarkerStart - 5), nextMarkerStart + 5))
        });
        
        // Trim whitespace from both ends
        optionText = optionText.trim();
        
        // Debug log
        console.log(`🔍 [DEBUG MCQ Extract] Option ${currentMarker.letter} final text: "${optionText}"`);
      } else {
        // Last option - extract until end, but stop before "PHẦN" or other section headers
        const startPos = markerEnd;
        let endPos = content.length;
        // Check for section headers that might be on the next line
        const sectionPattern = /(?:^|\n)\s*PHẦN\s+[IVX]+/i;
        const sectionMatch = content.substring(startPos).match(sectionPattern);
        if (sectionMatch) {
          endPos = startPos + sectionMatch.index;
        }
        
        // Extract raw text
        optionText = content.substring(startPos, endPos);
        console.log(`🔍 [DEBUG MCQ Extract] Last option ${currentMarker.letter} raw text (${startPos} to ${endPos}):`, JSON.stringify(optionText));
        
        // Trim whitespace
        optionText = optionText.trim();
        
        console.log(`🔍 [DEBUG MCQ Extract] Last option ${currentMarker.letter} final: startPos=${startPos}, endPos=${endPos}, text="${optionText}"`);
      }
      
      // Check if this option is marked with * - look at the hasStar property
      const isMarked = currentMarker.hasStar;
      
      options.push({
        letter: currentMarker.letter,
        text: optionText,
        isMarked: isMarked
      });
    }
    
    // Get correct answer from answer key map or marked option
    if (answerKeyMap[questionNum] && answerKeyMap[questionNum].type === 'mcq') {
      correctAnswer = answerKeyMap[questionNum].answer;
    } else {
      // Fallback to marked option
      const markedOption = options.findIndex(opt => opt.isMarked);
      if (markedOption !== -1) {
        correctAnswer = markedOption;
      }
    }
    
  } else if (type === 'truefalse') {
    console.log('🔍 [DEBUG] Parsing True/False question:', questionNum);
    console.log('🔍 [DEBUG] Content:', content.substring(0, 200) + '...');
    
    // Extract question text (everything before the first statement)
    // Find the FIRST valid statement marker (*a), a), *a., a.)
    // Then find all subsequent markers from that point
    
    // Step 1: Find the FIRST valid marker (*a), a), *a., a.) to determine where statements start
    // Look for pattern: *a), a), *a., a. where a is a-h
    // Must be at start of line or after whitespace, followed by [ or space
    const firstMarkerPattern = /(?:^|\s)(\*?)([a-h])[\)\.](?:\s|\[)/i;
    const firstMatch = content.match(firstMarkerPattern);
    
    if (!firstMatch) {
      console.warn('⚠️ [DEBUG] No first marker found');
      questionText = content.trim();
    } else {
      // Find the actual index of the first marker
      let firstMarkerIndex = content.indexOf(firstMatch[0]);
      if (firstMatch[0].startsWith(' ')) {
        firstMarkerIndex += 1; // Adjust for leading space
      }
      if (firstMatch[1] === '*' && firstMarkerIndex > 0) {
        firstMarkerIndex -= 1; // Adjust for *
      }
      
      console.log('🔍 [DEBUG] First marker found at index:', firstMarkerIndex, 'match:', firstMatch[0]);
      
      // Extract question text (everything before first marker)
      questionText = content.substring(0, firstMarkerIndex).trim();
      questionText = questionText.replace(/\*+$/, '').trim();
      console.log('🔍 [DEBUG] Question text:', questionText.substring(0, 100) + '...');
      
      // Step 2: Find ALL markers from firstMarkerIndex onwards
      // Only search in the statement section (after question text)
      const markers = [];
      const statementContent = content.substring(firstMarkerIndex);
      
      // Use a more strict pattern: must be at word boundary
      // Match: *a), a), *a., a. where a is a-h, followed by space/[ or end
      const markerRegex = /(\*?)([a-h])[\)\.](?=\s|\[|$)/gi;
      let match;
      let lastLetterIndex = -1; // Track last valid letter to ensure sequential order
      
      while ((match = markerRegex.exec(statementContent)) !== null) {
        const relativeIndex = match.index;
        const absoluteIndex = firstMarkerIndex + relativeIndex;
        const letter = match[2].toLowerCase();
        const letterIndex = letter.charCodeAt(0) - 'a'.charCodeAt(0); // 0 for 'a', 1 for 'b', etc.
        
        // Check character before the match
        const beforeChar = absoluteIndex > 0 ? content[absoluteIndex - 1] : ' ';
        const afterIndex = absoluteIndex + match[0].length;
        const afterChar = afterIndex < content.length ? content[afterIndex] : '';
        
        // Only accept if:
        // - Before is space/newline/tab/* or start
        // - After is space/newline/tab/[ or end
        // - Letter is sequential (a, b, c, d...) starting from the first marker
        const validBefore = beforeChar === ' ' || beforeChar === '\n' || beforeChar === '\t' || beforeChar === '*' || absoluteIndex === 0;
        const validAfter = afterChar === ' ' || afterChar === '\n' || afterChar === '\t' || afterChar === '[' || afterChar === '';
        
        // Only accept if it's a valid marker and follows sequential order
        // First marker should be 'a', next should be 'b', etc.
        if (validBefore && validAfter) {
          if (markers.length === 0) {
            // First marker must be 'a'
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
            // Subsequent markers must be sequential (a->b->c->d)
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
        // Extract text for each marker
        for (let i = 0; i < markers.length; i++) {
          const marker = markers[i];
          const nextMarker = markers[i + 1];
          
          console.log(`🔍 [DEBUG] Processing marker ${i + 1}:`, marker);
          
          // Position right after the marker (after "a)" or "*a)")
          let textStart = marker.index + marker.fullMatch.length;
          console.log(`🔍 [DEBUG] Initial textStart:`, textStart, `content[textStart]:`, content.substring(textStart, textStart + 20));
          
          // Skip brackets if present (like [0,NB] or [)
          const afterMarker = content.substring(textStart);
          // Match complete brackets: [content] followed by space, end, or period
          // Also handle brackets with commas like [0,NB]
          const bracketRegex = /^\s*\[[^\]]*\](?=\s|$|\.)/;
          let bracketMatch = afterMarker.match(bracketRegex);
          
          if (!bracketMatch) {
            // Try a simpler pattern: just [ followed by anything until ]
            bracketMatch = afterMarker.match(/^\s*\[[^\]]*\]/);
          }
          
          if (bracketMatch) {
            console.log(`🔍 [DEBUG] Found bracket:`, bracketMatch[0]);
            // Skip the bracket entirely
            textStart += bracketMatch[0].length;
          } else {
            // Check for incomplete bracket (just [ without closing ])
            // Only skip the bracket itself and whitespace immediately after
            // The text extraction logic will stop at the next marker anyway
            const incompleteBracket = /^\s*\[/;
            const incompleteMatch = afterMarker.match(incompleteBracket);
            if (incompleteMatch) {
              console.log(`🔍 [DEBUG] Found incomplete bracket:`, incompleteMatch[0]);
              // Skip just the bracket and any whitespace immediately after it
              // Don't try to find the end - let the next marker logic handle it
              textStart += incompleteMatch[0].length;
              // Skip any whitespace immediately after the bracket
              while (textStart < content.length && /\s/.test(content[textStart])) {
                textStart++;
              }
            }
          }
          
          // Skip whitespace
          while (textStart < content.length && /\s/.test(content[textStart])) {
            textStart++;
          }
          console.log(`🔍 [DEBUG] After bracket/whitespace, textStart:`, textStart);
          
          // Find where this statement ends
          let textEnd;
          if (nextMarker) {
            // End at next marker
            textEnd = nextMarker.index;
            console.log(`🔍 [DEBUG] Next marker at:`, textEnd);
          } else {
            // Last statement - go to end, but stop before section headers or separators
            textEnd = content.length;
            
            // Check for section headers like "PHẦN I", "PHẦN II", etc.
            const sectionMatch = content.substring(textStart).match(/(?:^|\n)\s*(PHẦN\s+[IVX]+|Câu\s+\d+[\.:])/i);
            if (sectionMatch) {
              textEnd = Math.min(textEnd, textStart + sectionMatch.index);
              console.log(`🔍 [DEBUG] Found section header, textEnd:`, textEnd);
            }
            
            // Check for separator lines like "HẾT", "---------------------------HẾT------------------------"
            const hetPattern = /(?:^|\n)\s*-*\s*HẾT\s*-*/i;
            const hetMatch = content.substring(textStart).match(hetPattern);
            if (hetMatch) {
              textEnd = Math.min(textEnd, textStart + hetMatch.index);
              console.log(`🔍 [DEBUG] Found HẾT separator, textEnd:`, textEnd);
            }
            
            // Check for answer key section markers
            const answerKeyPattern = /(?:^|\n)\s*(?:Bảng\s+đáp\s+án|BẢNG\s+ĐÁP\s+ÁN)/i;
            const answerKeyMatch = content.substring(textStart).match(answerKeyPattern);
            if (answerKeyMatch) {
              textEnd = Math.min(textEnd, textStart + answerKeyMatch.index);
              console.log(`🔍 [DEBUG] Found answer key section, textEnd:`, textEnd);
            }
          }
          
          // Extract the statement text
          const statementText = content.substring(textStart, textEnd).trim().replace(/\s+/g, ' ');
          console.log(`🔍 [DEBUG] Extracted statement text:`, statementText.substring(0, 50) + '...');
          
          // Add to options
          const option = {
            letter: marker.letter,
            text: statementText,
            isMarked: marker.hasStar
          };
          options.push(option);
          console.log(`🔍 [DEBUG] Added option:`, option);
        }
        
        console.log('🔍 [DEBUG] Total options:', options.length, options);
      } else {
        console.warn('⚠️ [DEBUG] No markers found after first marker');
      }
    }
    
    // Get correct answers from answer key map or marked statements
    if (answerKeyMap[questionNum] && answerKeyMap[questionNum].type === 'truefalse') {
      correctAnswer = answerKeyMap[questionNum].answer;
    } else {
      // Fallback to marked statements
      correctAnswer = options.map(opt => opt.isMarked);
    }
    
  } else {
    // Short answer type
    // Remove any trailing separators or section headers
    questionText = content.trim();
    // Remove trailing "---------------------------HẾT------------------------" or similar
    questionText = questionText.replace(/-+\s*HẾT\s*-+.*$/i, '').trim();
    
    // Get answer from answer key map (should be array of valid answers)
    if (answerKeyMap[questionNum] && answerKeyMap[questionNum].type === 'shortanswer') {
      const answerFromKey = answerKeyMap[questionNum].answer;
      // Ensure it's always an array
      correctAnswer = Array.isArray(answerFromKey) ? answerFromKey : [answerFromKey].filter(a => a);
    }
  }
  
  return { questionText, options, correctAnswer };
}

/**
 * Converts parsed questions and text blocks to application state format
 */
function convertToStateFormat(items) {
  const list = [];
  const optionList = [];
  
  items.forEach((item, index) => {
    if (item.type === 'textblock') {
      // This is a text block, not a question
      const textBlockObj = {
        id: uuid(),
        type: 'textblock',
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
          ? (item.type === 'shortanswer' && !Array.isArray(item.answer) ? [item.answer] : item.answer)
          : (item.type === 'shortanswer' ? [] : (item.type === 'truefalse' ? [] : 0)),
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
            option: opt.text || opt.option || '',
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
        console.log('🔍 [DEBUG] item.options type:', typeof item.options);
        console.log('🔍 [DEBUG] item.options isArray:', Array.isArray(item.options));
        console.log('🔍 [DEBUG] item.options length:', item.options ? item.options.length : 'null');
        
        // Ensure options array exists and has items
        if (item.options && Array.isArray(item.options) && item.options.length > 0) {
          console.log('🔍 [DEBUG] Processing', item.options.length, 'options');
          const options = item.options.map((opt, idx) => {
            const optionObj = {
              id: uuid(),
              option: (opt.text || opt.option || '').trim(),
              optionNo: idx + 1,
              answer: Array.isArray(questionObj.answer) ? questionObj.answer[idx] || false : false
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

