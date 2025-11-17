import React, { useState } from 'react';
import { MathJax } from 'better-react-mathjax';
import { useNotification } from '../../../contexts/NotificationContext';

interface EquationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert?: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  rawText: string;
  setRawText: (text: string | ((prev: string) => string)) => void;
}

interface ExampleFormula {
  label: string;
  formula: string;
}

const EquationModal: React.FC<EquationModalProps> = ({ 
  isOpen, 
  onClose, 
  onInsert, 
  textareaRef, 
  rawText, 
  setRawText 
}) => {
  const { warning } = useNotification();
  const [equationText, setEquationText] = useState<string>('');
  const [equationType, setEquationType] = useState<'inline' | 'block'>('inline');

  const handleInsert = () => {
    if (!equationText.trim()) {
      warning('Vui lòng nhập công thức', 3000);
      return;
    }

    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const textBefore = rawText.substring(0, start);
      const textAfter = rawText.substring(end);
      
      const equation = equationType === 'inline' 
        ? `\\(${equationText}\\)` 
        : `\\[${equationText}\\]`;
      
      const newText = textBefore + equation + textAfter;
      setRawText(newText);
      
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + equation.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      const equation = equationType === 'inline' 
        ? `\\(${equationText}\\)` 
        : `\\[${equationText}\\]`;
      setRawText((prev: string) => prev + equation);
    }

    onClose();
    setEquationText('');
    if (onInsert) {
      onInsert();
    }
  };

  const exampleFormulas: ExampleFormula[] = [
    { label: 'x² + y² = r²', formula: 'x^2 + y^2 = r^2' },
    { label: 'Phân số', formula: '\\frac{a}{b}' },
    { label: 'Căn bậc hai', formula: '\\sqrt{x}' },
    { label: 'Tổng', formula: '\\sum_{i=1}^{n} x_i' },
    { label: 'Tích phân', formula: '\\int_{0}^{\\infty} f(x) dx' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">Chèn phương trình toán học</h2>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Loại phương trình:</label>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-md transition-colors ${
                equationType === 'inline' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setEquationType('inline')}
            >
              Nội dòng (inline)
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-colors ${
                equationType === 'block' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setEquationType('block')}
            >
              Khối (block)
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Nhập công thức LaTeX:</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={equationText}
            onChange={(e) => setEquationText(e.target.value)}
            placeholder={equationType === 'inline' 
              ? 'Ví dụ: x^2 + y^2 = r^2 hoặc \\frac{a}{b}' 
              : 'Ví dụ: \\int_{0}^{\\infty} e^{-x} dx = 1'}
            autoFocus
          />
        </div>

        {equationText && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <label className="block mb-2 text-sm font-medium">Xem trước:</label>
            <div className="p-2 bg-white rounded border">
              <MathJax dynamic>
                {equationType === 'inline' 
                  ? `\\(${equationText}\\)` 
                  : `\\[${equationText}\\]`}
              </MathJax>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Ví dụ công thức:
          </label>
          <div className="flex flex-wrap gap-2 text-xs">
            {exampleFormulas.map((example, idx) => (
              <button
                key={idx}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                onClick={() => setEquationText(example.formula)}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            onClick={() => {
              onClose();
              setEquationText('');
            }}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={handleInsert}
          >
            Chèn
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquationModal;




