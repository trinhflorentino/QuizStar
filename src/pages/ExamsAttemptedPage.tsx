import { collection, getDocs } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import db from "../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import { v4 as uuid } from "uuid";
import React from 'react';
import { useNavigate } from "react-router-dom";

interface ExamAttempt {
  quiz_title?: string;
  name?: string;
  class?: string;
  roll_no?: string;
  email_id?: string;
  score?: number;
  [key: string]: any;
}

const ExamsAttemptedPage: React.FC = () => {
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[] | string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        const some = await getDocs(
          collection(db, "Users", user.uid, "Exams_Attempted")
        );
        if (some.docs.length !== 0) {
          const attempts: ExamAttempt[] = [];
          some.docs.forEach((doc) => {
            attempts.push(doc.data() as ExamAttempt);
          });
          setExamAttempts(attempts);
        } else {
          setExamAttempts(["Empty"]);
        }
        setLoading(false);
      } else {
        console.log("Có lỗi xảy ra!");
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Danh sách bài thi đã làm
          </h1>

          {examAttempts.length !== 0 ? (
            examAttempts[0] !== "Empty" ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên bài thi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Họ tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lớp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã số
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Điểm
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(examAttempts as ExamAttempt[]).map((attempt) => (
                        <tr key={uuid()} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attempt["quiz_title"] || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attempt["name"] || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attempt["class"] || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attempt["roll_no"] || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attempt["email_id"] || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attempt["score"] !== undefined ? attempt["score"] : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-gray-600">Chưa có bài thi nào được làm!</p>
              </div>
            )
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-gray-600">Đang tải...</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsAttemptedPage;




