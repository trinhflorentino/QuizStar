const REQUIREMENT_KEYS = ["nhanBiet", "thongHieu", "vanDung", "vanDungCao"];

function cloneDeep(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return value ? JSON.parse(JSON.stringify(value)) : value;
}

export function cleanMatrixResult(parsedResult, fallbackTitle = "Ngân hàng câu hỏi mới") {
  const cleanResult = {
    title: parsedResult?.title || fallbackTitle,
    chapters: []
  };

  if (!Array.isArray(parsedResult?.chapters)) {
    return cleanResult;
  }

  cleanResult.chapters = parsedResult.chapters
    .filter(Boolean)
    .map((chapter) => {
      const cleanChapter = {
        name: chapter?.name || "Chương không tên",
        subContents: []
      };

      if (!Array.isArray(chapter?.subContents)) {
        return cleanChapter;
      }

      cleanChapter.subContents = chapter.subContents
        .filter(Boolean)
        .map((subContent) => {
          const cleanSub = {
            name: subContent?.name || "Nội dung không tên",
            requirements: {
              nhanBiet: [],
              thongHieu: [],
              vanDung: [],
              vanDungCao: []
            }
          };

          REQUIREMENT_KEYS.forEach((key) => {
            if (!Array.isArray(subContent?.requirements?.[key])) {
              cleanSub.requirements[key] = [];
              return;
            }

            cleanSub.requirements[key] = subContent.requirements[key]
              .filter(Boolean)
              .map((item) => ({
                description: item?.description || "Yêu cầu không có mô tả",
                _template: true
              }));
          });

          return cleanSub;
        });

      return cleanChapter;
    });

  return cleanResult;
}

export function summarizeQuestionBankForPrompt(bank) {
  if (!bank || !Array.isArray(bank.chapters)) {
    return "[]";
  }

  const summary = bank.chapters.map((chapter, chapterIndex) => ({
    index: chapterIndex,
    name: chapter?.name || `Chương ${chapterIndex + 1}`,
    subContents: (chapter?.subContents || []).map((sub, subIndex) => ({
      index: subIndex,
      name: sub?.name || `Mục ${subIndex + 1}`,
      requirements: REQUIREMENT_KEYS.reduce((acc, key) => {
        const items = Array.isArray(sub?.requirements?.[key]) ? sub.requirements[key] : [];
        acc[key] = items.slice(0, 3).map((item) => item?.description || item?.question || item?.question_text || "");
        return acc;
      }, {})
    }))
  }));

  return JSON.stringify(summary, null, 2);
}

export function mergeTemplateWithExisting(existingChapters = [], templateChapters = []) {
  if (!Array.isArray(templateChapters)) {
    return cloneDeep(existingChapters) || [];
  }

  const merged = templateChapters.map((templateChapter, chapterIndex) => {
    const existingChapter = existingChapters?.[chapterIndex];
    const chapterResult = {
      name: templateChapter?.name || existingChapter?.name || `Chương ${chapterIndex + 1}`,
      subContents: []
    };

    const templateSubs = Array.isArray(templateChapter?.subContents) ? templateChapter.subContents : [];

    chapterResult.subContents = templateSubs.map((templateSub, subIndex) => {
      const existingSub = existingChapter?.subContents?.[subIndex];
      const subResult = {
        name: templateSub?.name || existingSub?.name || `Nội dung ${subIndex + 1}`,
        requirements: {
          nhanBiet: [],
          thongHieu: [],
          vanDung: [],
          vanDungCao: []
        }
      };

      REQUIREMENT_KEYS.forEach((key) => {
        const templateItems = Array.isArray(templateSub?.requirements?.[key]) ? templateSub.requirements[key] : [];
        const existingItems = Array.isArray(existingSub?.requirements?.[key]) ? existingSub.requirements[key] : [];

        const descriptors = templateItems.map((item) => ({
          description: item?.description || "Yêu cầu không có mô tả",
          _template: true
        }));

        const existingQuestions = existingItems.filter((item) => item && !item._template);
        subResult.requirements[key] = [...descriptors, ...existingQuestions];
      });

      return subResult;
    });

    return chapterResult;
  });

  const extraExisting = Array.isArray(existingChapters)
    ? existingChapters.slice(templateChapters.length)
    : [];

  return [...merged, ...cloneDeep(extraExisting)];
}

export function calculateRequirementCoverage(questionBank, questionsToImport = []) {
  const coverage = {};

  if (!questionBank?.chapters) {
    return { totals: coverage, summary: [] };
  }

  questionBank.chapters.forEach((chapter, chapterIndex) => {
    const subContents = chapter?.subContents || [];
    subContents.forEach((sub, subIndex) => {
      REQUIREMENT_KEYS.forEach((key) => {
        const path = `${chapterIndex}-${subIndex}-${key}`;
        const existingCount = Array.isArray(sub?.requirements?.[key])
          ? sub.requirements[key].filter((item) => item && !item._template).length
          : 0;

        if (!coverage[path]) {
          coverage[path] = {
            chapterIndex,
            subContentIndex: subIndex,
            requirement: key,
            chapterName: chapter?.name || `Chương ${chapterIndex + 1}`,
            subContentName: sub?.name || `Nội dung ${subIndex + 1}`,
            existing: existingCount,
            incoming: 0
          };
        }
      });
    });
  });

  questionsToImport.forEach((mapping) => {
    if (!mapping?.selected) return;
    const key = `${mapping.chapterIndex}-${mapping.subContentIndex}-${mapping.requirement}`;
    if (coverage[key]) {
      coverage[key].incoming += 1;
    }
  });

  const summary = Object.values(coverage).sort((a, b) => {
    if (a.chapterIndex === b.chapterIndex) {
      if (a.subContentIndex === b.subContentIndex) {
        return REQUIREMENT_KEYS.indexOf(a.requirement) - REQUIREMENT_KEYS.indexOf(b.requirement);
      }
      return a.subContentIndex - b.subContentIndex;
    }
    return a.chapterIndex - b.chapterIndex;
  });

  return { totals: coverage, summary };
}

export function assembleQuestionsFromBank(bank, requests = [], options = {}) {
  const selectedQuestions = [];
  const coverage = [];

  requests.forEach((request) => {
    if (!request || !request.count || request.count <= 0) return;

    const chapter = bank?.chapters?.[request.chapterIndex];
    const subContent = chapter?.subContents?.[request.subContentIndex];
    const pool = Array.isArray(subContent?.requirements?.[request.requirement])
      ? subContent.requirements[request.requirement]
      : [];

    const normalizedPool = pool
      .map((item, index) => normalizeRequirementEntry(item, {
        chapterIndex: request.chapterIndex,
        subContentIndex: request.subContentIndex,
        requirement: request.requirement,
        chapterName: chapter?.name,
        subContentName: subContent?.name,
        requirementIndex: index
      }))
      .filter(Boolean);

    const available = normalizedPool.length;
    const count = Math.min(request.count, available);
    const chosen = pickN(normalizedPool, count, options.randomSeed);

    selectedQuestions.push(...chosen);
    coverage.push({
      chapterIndex: request.chapterIndex,
      subContentIndex: request.subContentIndex,
      requirement: request.requirement,
      requested: request.count,
      selected: count,
      available,
      chapterName: chapter?.name || `Chương ${request.chapterIndex + 1}`,
      subContentName: subContent?.name || `Nội dung ${request.subContentIndex + 1}`
    });
  });

  return {
    questions: selectedQuestions,
    coverage
  };
}

export function serializeQuestionsToText(questions = []) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return "";
  }

  const lines = [];
  const answerLines = ["Bảng đáp án"];

  questions.forEach((question, index) => {
    const questionNumber = index + 1;
    lines.push(`Câu ${questionNumber}. ${question.prompt}`);

    if (question.type === "mcq") {
      question.options.forEach((option, optionIndex) => {
        const prefix = `${String.fromCharCode(65 + optionIndex)}. `;
        const marker = optionIndex === question.correctOptionIndex ? "*" : "";
        lines.push(`${marker}${prefix}${option}`);
      });
      answerLines.push(`${questionNumber}${String.fromCharCode(65 + (question.correctOptionIndex || 0))}`);
    } else if (question.type === "truefalse") {
      const statements = question.statements || [];
      statements.forEach((statement, statementIndex) => {
        const prefix = `${String.fromCharCode(97 + statementIndex)}. ${statement.text}`;
        const marker = statement.isTrue ? "*" : "";
        lines.push(`${marker}${prefix}`);
      });
      const tfAnswers = statements
        .map((statement, statementIndex) => `${String.fromCharCode(97 + statementIndex)})${statement.isTrue ? "Đ" : "S"}`)
        .join(' ');
      answerLines.push(`Câu ${questionNumber}: ${tfAnswers}`);
    } else if (question.type === "shortanswer") {
      const answers = question.shortAnswers && question.shortAnswers.length > 0
        ? question.shortAnswers.join(' | ')
        : "";
      answerLines.push(`Câu ${questionNumber}: ${answers}`);
    }

    lines.push("");
  });

  lines.push("---------------------------HẾT------------------------");
  lines.push("");
  lines.push(...answerLines);

  return lines.join('\n').trim();
}

function normalizeRequirementEntry(entry, meta) {
  if (!entry) return null;

  const formatted = entry.formattedQuestion || entry.questionData || entry;
  const type = formatted?.type || entry.questionType || entry.type;
  const prompt = formatted?.question || formatted?.question_text || entry.description;

  if (!prompt || !type) {
    return null;
  }

  if (type === "mcq") {
    const options = (formatted?.options || entry.options || []).map((opt) => opt?.option || opt?.text || opt).filter(Boolean);
    if (options.length === 0) return null;

    let correctOptionIndex = -1;
    if (typeof entry.correctAnswer === "number") {
      correctOptionIndex = entry.correctAnswer;
    } else if (Array.isArray(formatted?.options)) {
      correctOptionIndex = formatted.options.findIndex((opt) => opt?.is_correct === true);
    }

    if (correctOptionIndex < 0) {
      correctOptionIndex = 0;
    }

    return {
      type: "mcq",
      prompt,
      options,
      correctOptionIndex,
      source: meta
    };
  }

  if (type === "truefalse") {
    const statements = (formatted?.options || entry.options || []).map((opt) => ({
      text: opt?.option || opt?.text || "",
      isTrue: opt?.is_correct === true
    })).filter((opt) => opt.text);

    if (statements.length === 0) return null;

    return {
      type: "truefalse",
      prompt,
      statements,
      source: meta
    };
  }

  if (type === "shortanswer") {
    let answers = [];
    if (Array.isArray(entry.correctAnswers)) {
      answers = entry.correctAnswers;
    } else if (Array.isArray(formatted?.answers)) {
      answers = formatted.answers;
    } else if (typeof formatted?.answer === "string") {
      answers = [formatted.answer];
    }

    if (answers.length === 0) {
      answers = [entry.description || ""];
    }

    return {
      type: "shortanswer",
      prompt,
      shortAnswers: answers,
      source: meta
    };
  }

  return null;
}

function pickN(array, count, seed) {
  const items = [...array];
  shuffle(items, seed);
  return items.slice(0, count);
}

function shuffle(array, seed = Date.now()) {
  let currentIndex = array.length;
  let randomIndex;
  let internalSeed = seed;

  while (currentIndex !== 0) {
    internalSeed = (internalSeed * 9301 + 49297) % 233280;
    const random = internalSeed / 233280;
    randomIndex = Math.floor(random * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

