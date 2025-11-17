import React from 'react';
import { MemoizedMathJax } from './MemoizedMathJax';
import { Question, Answer, StudentAnswer, QuestionResult, OrderMapping } from '../types';

interface ResultDisplayProps {
  resultData: { score: number; totalScore: number } | null;
  questionResults: QuestionResult[];
  originalQuestions: Question[];
  answers: Answer[];
  selectedList: StudentAnswer[];
  originalOrder: OrderMapping;
  questions: Question[];
  viewMode: 'answers' | 'mywork';
  onViewModeChange: (mode: 'answers' | 'mywork') => void;
  onViewFullResult: () => void;
  onGoHome: () => void;
  QuestionComponents: React.ReactNode;
  studInfo: { email: string };
  pin: string | undefined;
  currentAttemptId: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  resultData,
  questionResults,
  originalQuestions,
  answers,
  selectedList,
  originalOrder,
  questions,
  viewMode,
  onViewModeChange,
  onViewFullResult,
  onGoHome,
  QuestionComponents
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Kết quả bài thi</h1>
        
        {/* Score display */}
        <div className="bg-blue-50 p-6 rounded-lg text-center mb-6">
          <p className="text-xl mb-2">Điểm số của bạn:</p>
          <p className="text-5xl font-bold text-blue-600">
            {resultData?.score.toFixed(2) || '0'} / {resultData?.totalScore.toFixed(2) || '0'}
          </p>
          <p className="text-lg text-gray-600 mt-2">
            Tỷ lệ: {resultData ? ((resultData.score / resultData.totalScore) * 100).toFixed(1) : 0}%
          </p>
        </div>
        
        {/* Summary */}
        {questionResults.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {questionResults.filter(q => q.isCorrect === true).length}
              </p>
              <p className="text-sm text-gray-600">Câu đúng</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">
                {questionResults.filter(q => q.isCorrect === false).length}
              </p>
              <p className="text-sm text-gray-600">Câu sai</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-600">
                {questionResults.filter(q => q.isCorrect === null).length}
              </p>
              <p className="text-sm text-gray-600">Chưa làm</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{originalQuestions.length}</p>
              <p className="text-sm text-gray-600">Tổng câu</p>
            </div>
          </div>
        )}
        
        {/* View mode toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => onViewModeChange('mywork')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              viewMode === 'mywork'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Xem bài làm của tôi
          </button>
          <button
            onClick={() => onViewModeChange('answers')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              viewMode === 'answers'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Xem đáp án chi tiết
          </button>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onViewFullResult}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors"
          >
            Xem kết quả đầy đủ
          </button>
          <button
            onClick={onGoHome}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition-colors"
          >
            Về trang chính
          </button>
        </div>
      </div>
      
      {/* Questions display based on view mode */}
      {viewMode === 'mywork' ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Bài làm của bạn</h2>
          {QuestionComponents}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Đáp án chi tiết</h2>
          {originalQuestions.map((originalQ, origIdx) => {
            if (!originalQ || originalQ.type === 'textblock') return null;
            
            const shuffledIndex = originalOrder[origIdx]?.newIndex;
            const result = shuffledIndex !== undefined ? questionResults[shuffledIndex] : null;
            const correctAnswer = answers[origIdx];
            const studentAnswer = selectedList[origIdx];
            
            return (
              <div 
                key={origIdx}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  result?.isCorrect === true 
                    ? 'border-green-500' 
                    : result?.isCorrect === false 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start flex-1">
                    <span className={`px-2 py-1 rounded mr-2 text-sm font-medium ${
                      result?.isCorrect === true 
                        ? 'bg-green-100 text-green-800' 
                        : result?.isCorrect === false 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      Câu {origIdx + 1}
                    </span>
                    <div className="text-lg font-medium flex-1">
                      <MemoizedMathJax inline dynamic>{originalQ.question || ''}</MemoizedMathJax>
                    </div>
                  </div>
                  {result && result.maxScore > 0 && (
                    <div className={`px-3 py-1 rounded-lg text-sm font-semibold ml-2 ${
                      result.isCorrect === true
                        ? 'bg-green-100 text-green-800'
                        : result.isCorrect === false
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {result.score.toFixed(2)} / {result.maxScore.toFixed(2)} điểm
                    </div>
                  )}
                </div>
                
                {/* Answer comparison - simplified for now, can be extracted further */}
                {originalQ.type === "mcq" && originalQ.options && (
                  <div className="space-y-4 pl-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-medium text-green-800 mb-1">Đáp án đúng:</p>
                        <p className="text-xl font-bold text-green-700">
                          {(() => {
                            const correctAnsIdx = parseInt(String(correctAnswer?.answer || 0));
                            return String.fromCharCode(65 + correctAnsIdx);
                          })()}
                        </p>
                      </div>
                      <div className={`p-3 border rounded-lg ${
                        result?.isCorrect === true
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <p className={`font-medium mb-1 ${
                          result?.isCorrect === true ? 'text-green-800' : 'text-red-800'
                        }`}>
                          Đáp án của bạn:
                        </p>
                        <p className={`text-xl font-bold ${
                          result?.isCorrect === true ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {(() => {
                            if (studentAnswer?.selectedAnswer === undefined || studentAnswer?.selectedAnswer === null) {
                              return 'Chưa trả lời';
                            }
                            const selectedAnsIdx = parseInt(String(studentAnswer.selectedAnswer || 0));
                            const originalOptIdx = originalOrder[origIdx]?.optionMapping?.[selectedAnsIdx] ?? selectedAnsIdx;
                            return String.fromCharCode(65 + originalOptIdx);
                          })()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Options display */}
                    {originalQ.options.map((option, optIndex) => {
                      const isCorrect = parseInt(String(correctAnswer?.answer || -1)) === optIndex;
                      let isSelected = false;
                      if (studentAnswer?.selectedAnswer !== undefined && studentAnswer?.selectedAnswer !== null) {
                        const selectedShuffledIdx = parseInt(String(studentAnswer.selectedAnswer || -1));
                        if (originalOrder[origIdx]?.optionMapping) {
                          const originalSelectedIdx = originalOrder[origIdx].optionMapping?.[selectedShuffledIdx];
                          isSelected = originalSelectedIdx === optIndex;
                        } else {
                          isSelected = selectedShuffledIdx === optIndex;
                        }
                      }
                      
                      return (
                        <div 
                          key={optIndex}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrect && isSelected 
                              ? 'bg-green-100 border-green-500' 
                              : isSelected && !isCorrect 
                                ? 'bg-red-100 border-red-500' 
                                : isCorrect 
                                  ? 'bg-green-50 border-green-300' 
                                  : 'border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-medium text-lg mr-3 ${
                              isCorrect 
                                ? 'border-green-600 bg-green-100 text-green-800'
                                : isSelected
                                  ? 'border-red-600 bg-red-100 text-red-800'
                                  : 'border-gray-400'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <div className="flex-grow">
                              <MemoizedMathJax inline dynamic>{option.option}</MemoizedMathJax>
                            </div>
                            {isCorrect && (
                              <span className="text-green-600 ml-2 text-xl font-bold">✓ Đúng</span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="text-red-600 ml-2 text-xl font-bold">✗ Bạn chọn</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* True/False and Short Answer displays can be extracted similarly */}
                {originalQ.type === "truefalse" && originalQ.options && (
                  <div className="space-y-4 pl-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-medium text-green-800 mb-2">Đáp án đúng:</p>
                        <div className="flex flex-wrap gap-2">
                          {originalQ.options.map((_, optIndex) => {
                            const correctAns = (correctAnswer?.answer as boolean[])?.[optIndex];
                            return (
                              <span key={optIndex} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                                {String.fromCharCode(97 + optIndex)}: {correctAns === true ? 'Đúng' : 'Sai'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className={`p-3 border rounded-lg ${
                        result?.isCorrect === true
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <p className={`font-medium mb-2 ${
                          result?.isCorrect === true ? 'text-green-800' : 'text-red-800'
                        }`}>
                          Đáp án của bạn:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {originalQ.options.map((_, optIndex) => {
                            const studentAns = (studentAnswer?.selectedAnswer as boolean[])?.[optIndex];
                            const correctAns = (correctAnswer?.answer as boolean[])?.[optIndex];
                            const isCorrect = studentAns === correctAns;
                            
                            if (studentAns === undefined || studentAns === null) {
                              return (
                                <span key={optIndex} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                                  {String.fromCharCode(97 + optIndex)}: Chưa trả lời
                                </span>
                              );
                            }
                            
                            return (
                              <span 
                                key={optIndex} 
                                className={`px-2 py-1 rounded text-sm ${
                                  isCorrect 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {String.fromCharCode(97 + optIndex)}: {studentAns === true ? 'Đúng' : 'Sai'} 
                                {isCorrect ? ' ✓' : ' ✗'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {originalQ.type === "shortanswer" && (
                  <div className="pl-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-medium text-green-800 mb-2">Đáp án đúng:</p>
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            const validAnswers = Array.isArray(correctAnswer?.answer) 
                              ? correctAnswer.answer 
                              : [correctAnswer?.answer].filter(a => a);
                            return validAnswers.map((ans, ansIndex) => (
                              <span 
                                key={ansIndex}
                                className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md border border-green-300 text-sm font-medium"
                              >
                                {String(ans).trim()}
                              </span>
                            ));
                          })()}
                        </div>
                      </div>
                      <div className={`p-3 border-2 rounded-lg ${
                        result?.isCorrect === true
                          ? 'bg-green-50 border-green-300' 
                          : studentAnswer?.selectedAnswer
                            ? 'bg-red-50 border-red-300' 
                            : 'bg-gray-50 border-gray-300'
                      }`}>
                        <p className={`font-medium mb-2 ${
                          result?.isCorrect === true ? 'text-green-800' : 'text-red-800'
                        }`}>
                          Đáp án của bạn:
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={studentAnswer?.selectedAnswer ? '' : 'text-gray-500 italic'}>
                            {String(studentAnswer?.selectedAnswer || "Chưa trả lời")}
                          </span>
                          {result?.isCorrect === true ? (
                            <span className="text-green-600 ml-2 text-xl font-bold">✓ Đúng</span>
                          ) : studentAnswer?.selectedAnswer ? (
                            <span className="text-red-600 ml-2 text-xl font-bold">✗ Sai</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


