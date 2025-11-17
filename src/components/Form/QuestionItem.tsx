import React, { useState, useRef } from 'react';
import { FiTrash2, FiX } from "react-icons/fi";
import { CiCirclePlus } from "react-icons/ci";
import { FaSquareRootAlt, FaPlus } from "react-icons/fa";
import ImageUploader from './ImageUploader';
import { MathJax } from 'better-react-mathjax';

interface Option {
  id: string;
  option: string;
  answer?: boolean | null;
}

interface Question {
  id?: string;
  question?: string;
  answer?: number | string | string[] | boolean;
  type: string;
  score?: number;
}

interface QuestionItemProps {
  index: number;
  question: Question;
  options: Option[];
  onQuestionChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number, field: string) => void;
  onOptionChange: (event: React.ChangeEvent<HTMLInputElement>, questionIndex: number, optionIndex: number) => void;
  onCorrectOptionChange: (event: React.MouseEvent | React.ChangeEvent<HTMLSelectElement>, questionIndex: number, optionIndex: number) => void;
  onRemoveQuestion: (index: number) => void;
  onAddOption: (index: number, optionNo: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  onRemoveImage: (index: number) => void;
  imagePreview?: string | null;
  fileInputKey?: string | number;
  onScoreChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  onTypeChange: (event: React.ChangeEvent<HTMLSelectElement>, index: number) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  index,
  question,
  options,
  onQuestionChange,
  onOptionChange,
  onCorrectOptionChange,
  onRemoveQuestion,
  onAddOption,
  onRemoveOption,
  onImageChange,
  onRemoveImage,
  imagePreview,
  fileInputKey,
  onScoreChange,
  onTypeChange
}) => {
  const [showMathModal, setShowMathModal] = useState<boolean>(false);
  const [mathInput, setMathInput] = useState<string>('');
  const [mathPreview, setMathPreview] = useState<string>('');
  const [targetField, setTargetField] = useState<string | null>(null);
  const [targetOptionIndex, setTargetOptionIndex] = useState<number | null>(null);
  const [showCommonFormulas, setShowCommonFormulas] = useState<boolean>(false);
  const mathInputRef = useRef<HTMLTextAreaElement>(null);

  const commonFormulas = [
    { name: 'Phân số', formula: '\\frac{a}{b}' },
    { name: 'Căn bậc', formula: '\\sqrt{x}' },
    { name: 'Căn bậc n', formula: '\\sqrt[n]{x}' },
    { name: 'Tích phân', formula: '\\int_{a}^{b} f(x) dx' },
    { name: 'Tổng', formula: '\\sum_{i=1}^{n} i' },
    { name: 'Tích', formula: '\\prod_{i=1}^{n} i' },
    { name: 'Giới hạn', formula: '\\lim_{x \\to \\infty} f(x)' },
    { name: 'Đạo hàm', formula: '\\frac{d}{dx} f(x)' },
    { name: 'Ma trận 2x2', formula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { name: 'Hệ phương trình', formula: '\\begin{cases} x + y = 1 \\\\ x - y = 2 \\end{cases}' },
    { name: 'Tích vô hướng', formula: '\\vec{a} \\cdot \\vec{b}' },
    { name: 'Tích có hướng', formula: '\\vec{a} \\times \\vec{b}' },
    { name: 'Độ dài vectơ', formula: '\\|\\vec{a}\\|' },
    { name: 'Góc', formula: '\\angle ABC' },
    { name: 'Tam giác', formula: '\\triangle ABC' },
    { name: 'Song song', formula: 'AB \\parallel CD' },
    { name: 'Vuông góc', formula: 'AB \\perp CD' },
    { name: 'Tương đương', formula: 'A \\iff B' },
    { name: 'Suy ra', formula: 'A \\implies B' },
    { name: 'Thuộc', formula: 'x \\in A' },
    { name: 'Không thuộc', formula: 'x \\notin A' },
    { name: 'Tập con', formula: 'A \\subset B' },
    { name: 'Tập hợp rỗng', formula: '\\emptyset' },
    { name: 'Vô cùng', formula: '\\infty' },
    { name: 'Pi', formula: '\\pi' },
    { name: 'Alpha', formula: '\\alpha' },
    { name: 'Beta', formula: '\\beta' },
    { name: 'Gamma', formula: '\\gamma' },
    { name: 'Delta', formula: '\\Delta' },
    { name: 'Omega', formula: '\\Omega' },
    { name: 'Sigma', formula: '\\Sigma' },
    { name: 'Theta', formula: '\\theta' },
    { name: 'Phi', formula: '\\phi' },
    { name: 'Psi', formula: '\\psi' },
    { name: 'Xi', formula: '\\xi' },
    { name: 'Epsilon', formula: '\\epsilon' },
    { name: 'Lambda', formula: '\\lambda' },
    { name: 'Mu', formula: '\\mu' },
  ];

  const handleInsertMath = () => {
    const formula = `\\(${mathInput}\\)`;
    if (targetField === 'question') {
      const newQuestion = (question.question || '') + formula;
      onQuestionChange({ target: { value: newQuestion } } as React.ChangeEvent<HTMLTextAreaElement>, index, "question");
    } else if (targetField === 'option' && targetOptionIndex !== null) {
      const newOption = (options[targetOptionIndex]?.option || '') + formula;
      onOptionChange({ target: { value: newOption } } as React.ChangeEvent<HTMLInputElement>, index, targetOptionIndex);
    } else if (targetField === 'answer' && question.type === 'shortanswer') {
      const newAnswer = (question.answer as string || '') + formula;
      onQuestionChange({ target: { value: newAnswer } } as React.ChangeEvent<HTMLInputElement>, index, "answer");
    }
    setMathInput('');
    setShowMathModal(false);
    setTargetField(null);
    setTargetOptionIndex(null);
  };

  const openMathModal = (field: string, optionIndex: number | null = null) => {
    setTargetField(field);
    setTargetOptionIndex(optionIndex);
    setShowMathModal(true);
  };

  const selectFormula = (formula: string) => {
    const textarea = mathInputRef.current;
    if (textarea) {
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      const textBefore = mathInput.substring(0, startPos);
      const textAfter = mathInput.substring(endPos);
      const newText = textBefore + formula + textAfter;
      
      setMathInput(newText);
      setMathPreview(newText);
      
      // Đặt con trỏ sau công thức đã chèn
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(startPos + formula.length, startPos + formula.length);
      }, 0);
    } else {
      // Fallback nếu không thể truy cập textarea
      setMathInput(mathInput + formula);
      setMathPreview(mathInput + formula);
    }
  };

  return (
    <div id="questionnaire" className="w-full max-w-4xl mx-auto p-3 md:p-6 bg-white rounded-lg shadow-sm mb-4">
      <ul className="space-y-4">
        <li className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 pb-3 border-b">
          <div className="flex flex-1 items-center gap-3">
            <div className="text-sm md:text-base font-medium">
              Câu {index + 1}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Điểm:</label>
              <input
                type="number"
                min="0"
                step="0.5"
                className="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={question.score || 0}
                onChange={(event) => onScoreChange(event, index)}
              />
            </div>
            <select
              value={question.type}
              className="px-3 py-1.5 text-sm md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(event) => onTypeChange(event, index)}
            >
              <option value="mcq">Trắc nghiệm</option>
              <option value="truefalse">Đúng/Sai</option>
              <option value="shortanswer">Trả lời ngắn</option>
            </select>
            <button 
              className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-500"
              onClick={() => onRemoveQuestion(index)}
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </li>            

        <li className="flex flex-row md:flex-row gap-3">
          <div className="flex-1 relative">
            <textarea
              placeholder={`Câu hỏi ${index + 1}`}
              className="w-full px-4 py-3 text-base md:text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y pr-12"
              value={question.question ?? ""}
              onChange={(event) => onQuestionChange(event, index, "question")}
            />
            <button
              onClick={() => openMathModal('question')}
              className="absolute right-2 top-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-500 z-1"
              title="Chèn công thức toán học"
            >
              <FaSquareRootAlt className="w-5 h-5" />
            </button>
          </div>
        </li>

        {question.type === "mcq" && (
          <li className="space-y-3">
            {options.map((option, ind) => (
              <div key={option.id} className="flex flex-row md:flex-row items-start md:items-center gap-2">
                <div className="flex-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(event) => onCorrectOptionChange(event, index, ind)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-colors ${
                      question.answer === ind 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium text-lg">
                      {String.fromCharCode(65 + ind)}
                    </span>
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className="w-full px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                      placeholder={`Phương án ${String.fromCharCode(65 + ind)}`}
                      value={option.option ?? ""}
                      onChange={(event) => onOptionChange(event, index, ind)}
                    />
                    <button
                      onClick={() => openMathModal('option', ind)}
                      className="absolute right-2 top-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-500 z-1"
                      title="Chèn công thức toán học"
                    >
                      <FaSquareRootAlt className="w-4 h-4" />
                    </button>
                  </div>
                  {options.length > 2 && (
                    <button 
                      className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      onClick={() => onRemoveOption(index, ind)}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </li>
        )}

        {question.type === "truefalse" && (
          <>
            {options.map((option, ind) => (
              <li key={option.id} className="flex flex-row md:flex-row items-start md:items-center gap-3 md:gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                    placeholder={`Ý kiến ${String.fromCharCode(97 + ind)}`}
                    value={option.option}
                    onChange={(event) => onOptionChange(event, index, ind)}
                  />
                  <button
                    onClick={() => openMathModal('option', ind)}
                    className="absolute right-2 top-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-500 z-1"
                    title="Chèn công thức toán học"
                  >
                    <FaSquareRootAlt className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    className="px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={option.answer === null ? "" : option.answer ? "true" : "false"}
                    onChange={(event) => onCorrectOptionChange(event, index, ind)}
                  >
                    <option value="true">Đúng</option>
                    <option value="false">Sai</option>
                  </select>
                  {options.length > 2 && (
                    <button 
                      className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      onClick={() => onRemoveOption(index, ind)}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </>
        )}

        {question.type === "shortanswer" && (
          <li className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                placeholder="Nhập đáp án..."
                value={(question.answer as string) ?? ""}
                onChange={(event) => onQuestionChange(event, index, "answer")}
              />
              <button
                onClick={() => openMathModal('answer')}
                className="absolute right-2 top-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-500 z-1"
                title="Chèn công thức toán học"
              >
                <FaSquareRootAlt className="w-4 h-4" />
              </button>
            </div>
          </li>
        )}

        <li className="pt-3">
          <div className="flex flex-wrap gap-3">
            {(options.length < 6 && question.type !== "shortanswer") && (
              <button
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                onClick={() => onAddOption(index, options.length + 1)}
              >
                <CiCirclePlus className="mr-2 text-lg"/>
                Thêm tùy chọn
              </button>
            )}
            <ImageUploader
              index={index}
              onImageChange={onImageChange}
              onRemoveImage={onRemoveImage}
              imagePreview={imagePreview}
              fileInputKey={fileInputKey}
            />
          </div>
        </li>
      </ul>

      {/* Modal chèn công thức toán học */}
      {showMathModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chèn công thức toán học</h2>
              <button
                onClick={() => setShowMathModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nhập công thức LaTeX:
                </label>
                <button
                  onClick={() => setShowCommonFormulas(!showCommonFormulas)}
                  className="px-3 py-1 text-sm bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-green-600 flex items-center"
                >
                  <FaPlus className="w-3 h-3 mr-1" />
                  Công thức phổ biến
                </button>
              </div>
              
              {showCommonFormulas && (
                <div className="mb-4 p-3 border rounded-lg bg-gray-50">
                  <div className="text-sm font-medium mb-2">Công thức phổ biến</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                    {commonFormulas.map((item, idx) => (
                      <button
                        key={idx}
                        className="p-2 border rounded hover:bg-gray-100 text-left"
                        onClick={() => selectFormula(item.formula)}
                      >
                        <div className="text-sm font-medium mb-1">{item.name}</div>
                        <div className="text-xs text-gray-500 overflow-hidden text-ellipsis">
                          {item.formula}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <textarea
                ref={mathInputRef}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={mathInput}
                onChange={(e) => {
                  setMathInput(e.target.value);
                  setMathPreview(e.target.value);
                }}
                placeholder="Ví dụ: \frac{1}{2} hoặc x^2 + y^2 = z^2"
              />
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xem trước:
              </label>
              <div className="min-h-[50px] flex items-center justify-center">
                {mathPreview && <MathJax inline dynamic>{`\\(${mathPreview}\\)`}</MathJax>}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowMathModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleInsertMath}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Chèn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionItem;




