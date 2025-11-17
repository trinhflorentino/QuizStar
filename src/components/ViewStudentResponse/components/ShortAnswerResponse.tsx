import React from 'react';

interface ShortAnswerResponseProps {
  studentAnswer: string | undefined;
  correctAnswer: string | undefined;
}

export const ShortAnswerResponse: React.FC<ShortAnswerResponseProps> = ({
  studentAnswer,
  correctAnswer
}) => {
  return (
    <div className="pl-8">
      <div className="mb-4">
        <p className="font-medium mb-1">Câu trả lời của học sinh:</p>
        <div className="p-3 border rounded-lg bg-gray-50">
          {studentAnswer || "Chưa trả lời"}
        </div>
      </div>
      <div>
        <p className="font-medium mb-1">Đáp án đúng:</p>
        <div className="p-3 border rounded-lg bg-green-50 border-green-200">
          {correctAnswer || "Không có đáp án"}
        </div>
      </div>
    </div>
  );
};

