const REQUIREMENT_KEYS = ["nhanBiet", "thongHieu", "vanDung", "vanDungCao"] as const;
type RequirementKey = typeof REQUIREMENT_KEYS[number];

interface Chapter {
  name?: string;
  subContents?: SubContent[];
}

interface SubContent {
  name?: string;
  requirements?: {
    [key in RequirementKey]?: RequirementItem[];
  };
}

interface RequirementItem {
  description?: string;
  question?: string;
  question_text?: string;
  _template?: boolean;
  formattedQuestion?: any;
  questionData?: any;
  questionType?: string;
  type?: string;
  options?: any[];
  correctAnswer?: number | string;
  correctAnswers?: string[];
  answers?: string[];
  answer?: string;
}

interface CleanMatrixResult {
  title: string;
  chapters: Array<{
    name: string;
    subContents: Array<{
      name: string;
      requirements: {
        [key in RequirementKey]: Array<{
          description: string;
          _template: boolean;
        }>;
      };
    }>;
  }>;
}

interface CoverageItem {
  chapterIndex: number;
  subContentIndex: number;
  requirement: RequirementKey;
  chapterName: string;
  subContentName: string;
  existing: number;
  incoming: number;
}

interface CoverageResult {
  totals: { [path: string]: CoverageItem };
  summary: CoverageItem[];
}

interface QuestionRequest {
  chapterIndex: number;
  subContentIndex: number;
  requirement: RequirementKey;
  count: number;
}

interface NormalizedQuestion {
  type: "mcq" | "truefalse" | "shortanswer";
  prompt: string;
  options?: string[];
  correctOptionIndex?: number;
  statements?: Array<{ text: string; isTrue: boolean }>;
  shortAnswers?: string[];
  source?: any;
}

interface AssemblyResult {
  questions: NormalizedQuestion[];
  coverage: Array<{
    chapterIndex: number;
    subContentIndex: number;
    requirement: RequirementKey;
    requested: number;
    selected: number;
    available: number;
    chapterName: string;
    subContentName: string;
  }>;
}

function cloneDeep<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return value ? JSON.parse(JSON.stringify(value)) : value;
}

export function cleanMatrixResult(parsedResult: any, fallbackTitle: string = "Ngân hàng câu hỏi mới"): CleanMatrixResult {
  const cleanResult: CleanMatrixResult = {
    title: parsedResult?.title || fallbackTitle,
    chapters: []
  };

  if (!Array.isArray(parsedResult?.chapters)) {
    return cleanResult;
  }

  cleanResult.chapters = parsedResult.chapters
    .filter(Boolean)
    .map((chapter: Chapter) => {
      const cleanChapter = {
        name: chapter?.name || "Chương không tên",
        subContents: [] as CleanMatrixResult['chapters'][0]['subContents']
      };

      if (!Array.isArray(chapter?.subContents)) {
        return cleanChapter;
      }

      cleanChapter.subContents = chapter.subContents
        .filter(Boolean)
        .map((subContent: SubContent) => {
          const cleanSub = {
            name: subContent?.name || "Nội dung không tên",
            requirements: {
              nhanBiet: [] as CleanMatrixResult['chapters'][0]['subContents'][0]['requirements']['nhanBiet'],
              thongHieu: [] as CleanMatrixResult['chapters'][0]['subContents'][0]['requirements']['thongHieu'],
              vanDung: [] as CleanMatrixResult['chapters'][0]['subContents'][0]['requirements']['vanDung'],
              vanDungCao: [] as CleanMatrixResult['chapters'][0]['subContents'][0]['requirements']['vanDungCao']
            }
          };

          REQUIREMENT_KEYS.forEach((key) => {
            if (!Array.isArray(subContent?.requirements?.[key])) {
              cleanSub.requirements[key] = [];
              return;
            }

            cleanSub.requirements[key] = subContent.requirements![key]!
              .filter(Boolean)
              .map((item: RequirementItem) => ({
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

export function summarizeQuestionBankForPrompt(bank: any): string {
  if (!bank || !Array.isArray(bank.chapters)) {
    return "[]";
  }

  const summary = bank.chapters.map((chapter: Chapter, chapterIndex: number) => ({
    index: chapterIndex,
    name: chapter?.name || `Chương ${chapterIndex + 1}`,
    subContents: (chapter?.subContents || []).map((sub: SubContent, subIndex: number) => ({
      index: subIndex,
      name: sub?.name || `Mục ${subIndex + 1}`,
      requirements: REQUIREMENT_KEYS.reduce((acc: any, key: RequirementKey) => {
        const items = Array.isArray(sub?.requirements?.[key]) ? sub.requirements![key]! : [];
        acc[key] = items.slice(0, 3).map((item: RequirementItem) => item?.description || item?.question || item?.question_text || "");
        return acc;
      }, {})
    }))
  }));

  return JSON.stringify(summary, null, 2);
}

export function mergeTemplateWithExisting(existingChapters: Chapter[] = [], templateChapters: Chapter[] = []): Chapter[] {
  if (!Array.isArray(templateChapters)) {
    return cloneDeep(existingChapters) || [];
  }

  const merged = templateChapters.map((templateChapter: Chapter, chapterIndex: number) => {
    const existingChapter = existingChapters?.[chapterIndex];
    const chapterResult: Chapter = {
      name: templateChapter?.name || existingChapter?.name || `Chương ${chapterIndex + 1}`,
      subContents: []
    };

    const templateSubs = Array.isArray(templateChapter?.subContents) ? templateChapter.subContents : [];

    chapterResult.subContents = templateSubs.map((templateSub: SubContent, subIndex: number) => {
      const existingSub = existingChapter?.subContents?.[subIndex];
      const subResult: SubContent = {
        name: templateSub?.name || existingSub?.name || `Nội dung ${subIndex + 1}`,
        requirements: {
          nhanBiet: [],
          thongHieu: [],
          vanDung: [],
          vanDungCao: []
        }
      };

      REQUIREMENT_KEYS.forEach((key: RequirementKey) => {
        const templateItems = Array.isArray(templateSub?.requirements?.[key]) ? templateSub.requirements![key]! : [];
        const existingItems = Array.isArray(existingSub?.requirements?.[key]) ? existingSub.requirements![key]! : [];

        const descriptors = templateItems.map((item: RequirementItem) => ({
          description: item?.description || "Yêu cầu không có mô tả",
          _template: true
        }));

        const existingQuestions = existingItems.filter((item: RequirementItem) => item && !item._template);
        subResult.requirements![key] = [...descriptors, ...existingQuestions];
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

export function calculateRequirementCoverage(questionBank: any, questionsToImport: any[] = []): CoverageResult {
  const coverage: { [path: string]: CoverageItem } = {};

  if (!questionBank?.chapters) {
    return { totals: coverage, summary: [] };
  }

  questionBank.chapters.forEach((chapter: Chapter, chapterIndex: number) => {
    const subContents = chapter?.subContents || [];
    subContents.forEach((sub: SubContent, subIndex: number) => {
      REQUIREMENT_KEYS.forEach((key: RequirementKey) => {
        const path = `${chapterIndex}-${subIndex}-${key}`;
        const existingCount = Array.isArray(sub?.requirements?.[key])
          ? sub.requirements![key]!.filter((item: RequirementItem) => item && !item._template).length
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

  questionsToImport.forEach((mapping: any) => {
    if (!mapping?.selected) return;
    const key = `${mapping.chapterIndex}-${mapping.subContentIndex}-${mapping.requirement}`;
    if (coverage[key]) {
      coverage[key].incoming += 1;
    }
  });

  const summary = Object.values(coverage).sort((a: CoverageItem, b: CoverageItem) => {
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

export function assembleQuestionsFromBank(bank: any, requests: QuestionRequest[] = [], options: any = {}): AssemblyResult {
  const selectedQuestions: NormalizedQuestion[] = [];
  const coverage: AssemblyResult['coverage'] = [];

  requests.forEach((request: QuestionRequest) => {
    if (!request || !request.count || request.count <= 0) return;

    const chapter = bank?.chapters?.[request.chapterIndex];
    const subContent = chapter?.subContents?.[request.subContentIndex];
    const pool = Array.isArray(subContent?.requirements?.[request.requirement])
      ? subContent.requirements![request.requirement]!
      : [];

    const normalizedPool = pool
      .map((item: RequirementItem, index: number) => normalizeRequirementEntry(item, {
        chapterIndex: request.chapterIndex,
        subContentIndex: request.subContentIndex,
        requirement: request.requirement,
        chapterName: chapter?.name,
        subContentName: subContent?.name,
        requirementIndex: index
      }))
      .filter(Boolean) as NormalizedQuestion[];

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

export function serializeQuestionsToText(questions: NormalizedQuestion[] = []): string {
  if (!Array.isArray(questions) || questions.length === 0) {
    return "";
  }

  const lines: string[] = [];
  const answerLines: string[] = ["Bảng đáp án"];

  questions.forEach((question: NormalizedQuestion, index: number) => {
    const questionNumber = index + 1;
    lines.push(`Câu ${questionNumber}. ${question.prompt}`);

    if (question.type === "mcq") {
      question.options?.forEach((option: string, optionIndex: number) => {
        const prefix = `${String.fromCharCode(65 + optionIndex)}. `;
        const marker = optionIndex === question.correctOptionIndex ? "*" : "";
        lines.push(`${marker}${prefix}${option}`);
      });
      answerLines.push(`${questionNumber}${String.fromCharCode(65 + (question.correctOptionIndex || 0))}`);
    } else if (question.type === "truefalse") {
      const statements = question.statements || [];
      statements.forEach((statement: { text: string; isTrue: boolean }, statementIndex: number) => {
        const prefix = `${String.fromCharCode(97 + statementIndex)}. ${statement.text}`;
        const marker = statement.isTrue ? "*" : "";
        lines.push(`${marker}${prefix}`);
      });
      const tfAnswers = statements
        .map((statement: { text: string; isTrue: boolean }, statementIndex: number) => `${String.fromCharCode(97 + statementIndex)})${statement.isTrue ? "Đ" : "S"}`)
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

function normalizeRequirementEntry(entry: RequirementItem, meta: any): NormalizedQuestion | null {
  if (!entry) return null;

  const formatted = entry.formattedQuestion || entry.questionData || entry;
  const type = formatted?.type || entry.questionType || entry.type;
  const prompt = formatted?.question || formatted?.question_text || entry.description;

  if (!prompt || !type) {
    return null;
  }

  if (type === "mcq") {
    const options = (formatted?.options || entry.options || []).map((opt: any) => opt?.option || opt?.text || opt).filter(Boolean);
    if (options.length === 0) return null;

    let correctOptionIndex = -1;
    if (typeof entry.correctAnswer === "number") {
      correctOptionIndex = entry.correctAnswer;
    } else if (Array.isArray(formatted?.options)) {
      correctOptionIndex = formatted.options.findIndex((opt: any) => opt?.is_correct === true);
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
    const statements = (formatted?.options || entry.options || []).map((opt: any) => ({
      text: opt?.option || opt?.text || "",
      isTrue: opt?.is_correct === true
    })).filter((opt: { text: string; isTrue: boolean }) => opt.text);

    if (statements.length === 0) return null;

    return {
      type: "truefalse",
      prompt,
      statements,
      source: meta
    };
  }

  if (type === "shortanswer") {
    let answers: string[] = [];
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

function pickN<T>(array: T[], count: number, seed?: number): T[] {
  const items = [...array];
  shuffle(items, seed);
  return items.slice(0, count);
}

function shuffle<T>(array: T[], seed: number = Date.now()): void {
  let currentIndex = array.length;
  let randomIndex: number;
  let internalSeed = seed;

  while (currentIndex !== 0) {
    internalSeed = (internalSeed * 9301 + 49297) % 233280;
    const random = internalSeed / 233280;
    randomIndex = Math.floor(random * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}


