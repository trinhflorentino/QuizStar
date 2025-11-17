import { Question, Answer, StudentAnswer, QuestionResult, ScoreResult } from '../types';

export const calculateQuestionResults = (
  studentAnswers: StudentAnswer[],
  correctAnswers: Answer[],
  quizQuestions: Question[]
): QuestionResult[] => {
  if (!studentAnswers || !correctAnswers || !quizQuestions) return [];
  
  return quizQuestions.map((question, index) => {
    if (question.type === 'textblock') {
      return { isCorrect: null, score: 0, maxScore: 0 };
    }
    
    const userAnswer = studentAnswers[index];
    const correctAnswer = correctAnswers[index];
    const questionScore = parseFloat(String(question.score || 1));
    
    if (!userAnswer || !correctAnswer) {
      return { isCorrect: false, score: 0, maxScore: questionScore };
    }
    
    let isCorrect = false;
    let earnedScore = 0;
    
    if (question.type === "mcq") {
      isCorrect = parseInt(String(correctAnswer.answer)) === parseInt(String(userAnswer.selectedAnswer));
      earnedScore = isCorrect ? questionScore : 0;
    } else if (question.type === "shortanswer") {
      const validAnswers = Array.isArray(correctAnswer.answer) 
        ? correctAnswer.answer 
        : [correctAnswer.answer].filter(a => a);
      const userAnswerTrimmed = String(userAnswer.selectedAnswer || '').trim().toLowerCase();
      isCorrect = validAnswers.some(ans => 
        String(ans).trim().toLowerCase() === userAnswerTrimmed
      );
      earnedScore = isCorrect ? questionScore : 0;
    } else if (question.type === "truefalse") {
      const correctOptions = correctAnswer.answer as boolean[];
      const selectedOptions = userAnswer.selectedAnswer as boolean[];
      
      if (Array.isArray(correctOptions) && Array.isArray(selectedOptions)) {
        let matchingCount = 0;
        for (let j = 0; j < correctOptions.length; j++) {
          if (correctOptions[j] === selectedOptions[j]) {
            matchingCount++;
          }
        }
        
        let percentScore = 0;
        if (correctOptions.length > 0) {
          switch(matchingCount) {
            case 0: percentScore = 0; break;
            case 1: percentScore = correctOptions.length <= 2 ? 0.5 : 0.1; break;
            case 2: percentScore = correctOptions.length <= 3 ? 0.75 : 0.25; break;
            case 3: percentScore = 0.5; break;
            case 4: percentScore = 1; break;
            default: percentScore = matchingCount / correctOptions.length;
          }
        }
        
        earnedScore = questionScore * percentScore;
        isCorrect = percentScore === 1;
      }
    }
    
    return { 
      isCorrect: isCorrect, 
      score: earnedScore, 
      maxScore: questionScore 
    };
  });
};

export const calculateScore = (
  studentAnswers: StudentAnswer[],
  correctAnswers: Answer[],
  quizQuestions: Question[]
): ScoreResult => {
  if (!studentAnswers || !correctAnswers || !quizQuestions) {
    return { score: 0, totalScore: 0, scoreQ: 0, scoreAll: 0 };
  }
  
  let totalScore = 0;
  let earnedScore = 0;
  
  for (let i = 0; i < quizQuestions.length; i++) {
    const question = quizQuestions[i];
    const userAnswer = studentAnswers[i];
    const correctAnswer = correctAnswers[i];
    
    if (!question || !userAnswer || !correctAnswer) continue;
    
    totalScore += parseFloat(String(question.score || 1));
    
    if (question.type === "mcq") {
      if (parseInt(String(correctAnswer.answer)) === parseInt(String(userAnswer.selectedAnswer))) {
        earnedScore += parseFloat(String(question.score || 1));
      }
    } else if (question.type === "shortanswer") {
      const validAnswers = Array.isArray(correctAnswer.answer) 
        ? correctAnswer.answer 
        : [correctAnswer.answer].filter(a => a);
      const userAnswerTrimmed = String(userAnswer.selectedAnswer || '').trim().toLowerCase();
      const isCorrect = validAnswers.some(ans => 
        String(ans).trim().toLowerCase() === userAnswerTrimmed
      );
      if (isCorrect) {
        earnedScore += parseFloat(String(question.score || 1));
      }
    } else if (question.type === "truefalse") {
      const correctOptions = correctAnswer.answer as boolean[];
      const selectedOptions = userAnswer.selectedAnswer as boolean[];
      
      if (!Array.isArray(correctOptions) || !Array.isArray(selectedOptions)) continue;
      
      let matchingCount = 0;
      for (let j = 0; j < correctOptions.length; j++) {
        if (correctOptions[j] === selectedOptions[j]) {
          matchingCount++;
        }
      }

      let percentScore = 0;
      if (correctOptions.length > 0) {
        switch(matchingCount) {
          case 0: percentScore = 0; break;
          case 1: percentScore = correctOptions.length <= 2 ? 0.5 : 0.1; break;
          case 2: percentScore = correctOptions.length <= 3 ? 0.75 : 0.25; break;
          case 3: percentScore = 0.5; break;
          case 4: percentScore = 1; break;
          default: percentScore = matchingCount / correctOptions.length;
        }

        earnedScore += (parseFloat(String(question.score || 1)) * percentScore);
      }
    }
  }
  
  return { 
    score: earnedScore, 
    totalScore: totalScore,
    scoreQ: earnedScore,
    scoreAll: totalScore
  };
};


