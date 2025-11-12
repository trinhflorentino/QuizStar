import { useState, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { parseQuizText } from '../../../utils/quizParser';

export function useFormMaker(isEditing = false, initialData = null) {
  const [quizTitle, setQuizTitle] = useState("");
  const [duration, setDuration] = useState(45);
  const [list, setList] = useState([]);
  const [optionList, setOptionList] = useState([]);
  const [scoreDistribution, setScoreDistribution] = useState({
    mcq: { count: 0, totalScore: 1.0 },
    truefalse: { count: 0, totalScore: 1.0 },
    shortanswer: { count: 0, totalScore: 1.0 }
  });
  const [rawText, setRawText] = useState('');
  const [imagePreview, setImagePreview] = useState([]);
  const [fileInputKeys, setFileInputKeys] = useState([]);
  
  const textareaRef = useRef(null);
  const mcqRef = useRef(null);
  const trueFalseRef = useRef(null);
  const shortAnswerRef = useRef(null);

  // Initialize from initialData if editing
  useEffect(() => {
    if (isEditing && initialData) {
      setQuizTitle(initialData.title || "");
      setDuration(initialData.duration || 45);

      const convertedQuestions = initialData.questions.map((q, index) => {
        let answer = null;
        
        if (q.type === "mcq") {
          answer = initialData.answers[index]?.answer ? initialData.answers[index].answer : 0;
        } else if (q.type === "truefalse") {
          answer = initialData.answers[index]?.answer || [];
        } else if (q.type === "shortanswer") {
          answer = initialData.answers[index]?.answer || "";
        }

        return {
          id: uuid(),
          question: q.question || "",
          answer: answer,
          type: q.type || "mcq",
          score: q.score || 0.25
        };
      });

      const convertedOptions = initialData.questions.map((q, index) => {
        if (q.type === "mcq") {
          return (q.options || []).map((opt, i) => ({
            id: uuid(),
            option: opt.option || "",
            optionNo: i + 1,
            answer: false
          }));
        } else if (q.type === "truefalse") {
          return (q.options || []).map((opt, i) => ({
            id: uuid(),
            option: opt.option || "",
            optionNo: i + 1,
            answer: initialData.answers[index]?.answer?.[i] || false
          }));
        }
        return [];
      });

      if (initialData.questions) {
        const initialPreviews = initialData.questions.map(q => q.imageUrl || null);
        setImagePreview(initialPreviews);
        setFileInputKeys(Array(initialPreviews.length).fill(0));
      }
      
      setList(convertedQuestions);
      setOptionList(convertedOptions);
    }
  }, [isEditing, initialData]);

  // Parse raw text with debounce
  useEffect(() => {
    if (rawText.trim()) {
      const timeoutId = setTimeout(() => {
        try {
          let normalized = rawText.replace(/\r\n/g, '\n').replace(/\u00A0/g, ' ');
          if (!normalized.endsWith('\n')) {
            normalized += '\n';
          }
          const { list: parsedList, optionList: parsedOptionList } = parseQuizText(normalized);
          const safeList = Array.isArray(parsedList) ? parsedList : [];
          const safeOptionList = Array.isArray(parsedOptionList) ? parsedOptionList : [];
          setList(safeList);
          setOptionList(safeOptionList);
          
          // Update image preview array size
          if (safeList.length !== imagePreview.length) {
            setImagePreview(Array(safeList.length).fill(null));
            setFileInputKeys(Array(safeList.length).fill(0));
          }
        } catch (error) {
          console.error('Error parsing quiz text:', error);
        }
      }, 150);

      return () => clearTimeout(timeoutId);
    } else {
      setList([]);
      setOptionList([]);
      setImagePreview([]);
      setFileInputKeys([]);
    }
  }, [rawText]);

  // Calculate score distribution
  useEffect(() => {
    if (list.length > 0) {
      const distribution = {
        mcq: { count: 0, totalScore: 0 },
        truefalse: { count: 0, totalScore: 0 },
        shortanswer: { count: 0, totalScore: 0 }
      };

      list.forEach(question => {
        if (question.type !== 'textblock' && distribution[question.type]) {
          distribution[question.type].count++;
          distribution[question.type].totalScore += question.score || 0;
        }
      });

      setScoreDistribution(distribution);
    }
  }, [list]);

  // Update rawText when answer changes
  function updateRawTextWithAnswer(questionIndex, optionIndex, currentList = null, currentOptionList = null) {
    if (!rawText) return;
    
    const questionList = currentList || list;
    const optionsList = currentOptionList || optionList;
    const question = questionList[questionIndex];
    if (!question || question.type === 'textblock') return;
    
    let actualQuestionNum = 1;
    for (let i = 0; i < questionIndex; i++) {
      if (questionList[i].type !== 'textblock') {
        actualQuestionNum++;
      }
    }
    
    const answerKeyPattern = /(?:Bảng\s+đáp\s+án|BẢNG\s+ĐÁP\s+ÁN)[\s\S]*$/i;
    const answerKeyMatch = rawText.match(answerKeyPattern);
    const contentSection = answerKeyMatch ? rawText.substring(0, answerKeyMatch.index).trim() : rawText;
    const answerKeySection = answerKeyMatch ? answerKeyMatch[0] : '';
    
    const questionPattern = new RegExp(`Câu\\s+${actualQuestionNum}[.:]\\s*([\\s\\S]*?)(?=Câu\\s+\\d+[.:]|PHẦN\\s+[IVX]+|${answerKeyPattern.source}|$)`, 'i');
    const questionMatch = contentSection.match(questionPattern);
    
    if (!questionMatch) return;
    
    let updatedContent = contentSection;
    let questionContent = questionMatch[1];
    
    if (question.type === 'mcq') {
      const optionPattern = /(\*?)([A-Z])[)\.][\s\u00A0\u200B\u200C\uFEFF]*/g;
      const options = [];
      let match;
      
      while ((match = optionPattern.exec(questionContent)) !== null) {
        const letter = match[2];
        const letterIndex = letter.charCodeAt(0) - 65;
        const hasStar = match[1] === '*';
        options.push({ letter, letterIndex, hasStar, match });
      }
      
      const selectedOption = options.find(opt => opt.letterIndex === optionIndex);
      if (selectedOption) {
        questionContent = questionContent.replace(/\*([A-Z])[)\.]/g, '$1.');
        const letter = String.fromCharCode(65 + optionIndex);
        questionContent = questionContent.replace(
          new RegExp(`([^\\*])(${letter}[)\.])`, 'g'),
          `$1*$2`
        );
        questionContent = questionContent.replace(
          new RegExp(`^(${letter}[)\.])`, 'g'),
          `*$1`
        );
      }
      
      updatedContent = contentSection.replace(questionPattern, (match, content) => {
        return match.replace(content, questionContent);
      });
      
    } else if (question.type === 'truefalse') {
      const optionPattern = /(\*?)([a-h])[\)\.]/g;
      const options = [];
      let match;
      
      while ((match = optionPattern.exec(questionContent)) !== null) {
        const letter = match[2];
        const letterIndex = letter.charCodeAt(0) - 97;
        const hasStar = match[1] === '*';
        options.push({ letter, letterIndex, hasStar, match });
      }
      
      const selectedOption = options.find(opt => opt.letterIndex === optionIndex);
      if (selectedOption) {
        const letter = String.fromCharCode(97 + optionIndex);
        const currentAnswer = optionsList[questionIndex][optionIndex].answer;
        
        if (currentAnswer) {
          questionContent = questionContent.replace(
            new RegExp(`([^\\*])(${letter}[)\.])`, 'g'),
            `$1*$2`
          );
          questionContent = questionContent.replace(
            new RegExp(`^(${letter}[)\.])`, 'g'),
            `*$1`
          );
        } else {
          questionContent = questionContent.replace(
            new RegExp(`\\*(${letter}[)\.])`, 'g'),
            '$1'
          );
        }
      }
      
      updatedContent = contentSection.replace(questionPattern, (match, content) => {
        return match.replace(content, questionContent);
      });
    }
    
    const newRawText = updatedContent + (answerKeySection ? '\n\n' + answerKeySection : '');
    setRawText(newRawText);
  }

  // Handle preview answer change
  function handlePreviewAnswerChange(questionIndex, optionIndex) {
    if (list[questionIndex].type === "truefalse") {
      let options = [...optionList];
      options[questionIndex][optionIndex].answer = !options[questionIndex][optionIndex].answer;
      setOptionList(options);
      setTimeout(() => {
        setList(currentList => {
          setOptionList(currentOptions => {
            updateRawTextWithAnswer(questionIndex, optionIndex, currentList, currentOptions);
            return currentOptions;
          });
          return currentList;
        });
      }, 0);
    } else if (list[questionIndex].type === "mcq") {
      setList(prevList => {
        const newList = [...prevList];
        newList[questionIndex].answer = optionIndex;
        setTimeout(() => {
          updateRawTextWithAnswer(questionIndex, optionIndex, newList, optionList);
        }, 0);
        return newList;
      });
    }
  }

  // Handle score change
  function handleTypeScoreChange(type, event) {
    const newTotalScore = parseFloat(event.target.value) || 0;
    const count = scoreDistribution[type].count;
    
    setScoreDistribution(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        totalScore: newTotalScore
      }
    }));
    
    const scorePerQuestion = count > 0 ? (newTotalScore / count) : 0;
    
    const updatedQuestions = list.map(question => {
      if (question.type === type) {
        return {
          ...question,
          score: parseFloat(scorePerQuestion.toFixed(2))
        };
      }
      return question;
    });
    
    setList(updatedQuestions);
  }

  // Handle image change
  function handleImageChange(event, index) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => {
          const newImagePreview = [...prev];
          newImagePreview[index] = reader.result;
          return newImagePreview;
        });
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  // Handle remove image
  function handleRemoveImage(index) {
    setImagePreview(prev => {
      const newImagePreview = [...prev];
      newImagePreview[index] = null;
      return newImagePreview;
    });
    setFileInputKeys(prev => {
      const newKeys = [...prev];
      newKeys[index] = prev[index] + 1;
      return newKeys;
    });
  }

  return {
    // State
    quizTitle,
    setQuizTitle,
    duration,
    setDuration,
    list,
    setList,
    optionList,
    setOptionList,
    scoreDistribution,
    setScoreDistribution,
    rawText,
    setRawText,
    imagePreview,
    setImagePreview,
    fileInputKeys,
    
    // Refs
    textareaRef,
    mcqRef,
    trueFalseRef,
    shortAnswerRef,
    
    // Handlers
    handlePreviewAnswerChange,
    handleTypeScoreChange,
    handleImageChange,
    handleRemoveImage,
  };
}

