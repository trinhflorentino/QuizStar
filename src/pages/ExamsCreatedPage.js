import React from 'react';
import {
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import db from "../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

function ExamsCreatedPage() {
  const [createdExams, setCreatedExams] = useState(() => []);
  const [examPins, setExamPins] = useState(() => []);
  const [status, setStatus] = useState(() => []);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    examSetter();
  }, []);

  function examSetter() {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        const some = await getDocs(
          collection(db, "Users", user.uid, "Exams_Created")
        );
        if (some.docs.length !== 0) {
          some.docs.map((doc) => {
            let somo = doc.data();
            setCreatedExams((prevCreatedExams) => [
              ...prevCreatedExams,
              somo,
            ]);
            setExamPins((prevExamPins) => [...prevExamPins, doc.id]);
            setStatus((prevStatus) => [...prevStatus, somo["status"]]);
          });
        } else {
          setCreatedExams(["Empty"]);
        }
        setLoading(false);
      } else {
        console.log("Có lỗi xảy ra!");
        setLoading(false);
      }
    });
  }

  async function checkResponses(index) {
    navigate(`/ExamsCreated/DisplayResponses/${examPins[index]}`);
  }

  async function handleResponseStatus(soloStatus, index) {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        if (soloStatus === "active") {
          if (
            window.confirm("Bạn có chắc muốn khóa đề thi này?") === true
          ) {
            await setDoc(
              doc(
                db,
                "Paper_Setters",
                examPins[index],
                "Question_Papers_MCQ",
                createdExams[index]["quiz_title"]
              ),
              {
                status: "inactive",
              },
              { merge: true }
            );

            await setDoc(
              doc(db, "Users", user.uid, "Exams_Created", examPins[index]),
              { status: "inactive" },
              { merge: true }
            );

            let stat = [...status];
            stat[index] = "inactive";
            setStatus(stat);
          }
        } else if (soloStatus === "inactive") {
          if (
            window.confirm("Bạn có chắc muốn mở lại đề thi này?") === true
          ) {
            await setDoc(
              doc(
                db,
                "Paper_Setters",
                examPins[index],
                "Question_Papers_MCQ",
                createdExams[index]["quiz_title"]
              ),
              {
                status: "active",
              },
              { merge: true }
            );

            await setDoc(
              doc(db, "Users", user.uid, "Exams_Created", examPins[index]),
              { status: "active" },
              { merge: true }
            );

            let stat = [...status];
            stat[index] = "active";
            setStatus(stat);
          }
        }
      } else {
        console.log("Có lỗi xảy ra!");
      }
    });
  }

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Danh sách đề thi đã tạo
          </h1>

          {createdExams.length !== 0 ? (
            createdExams[0] !== "Empty" ? (
              <div className="space-y-6">
                {createdExams.map((exam, index) => (
                  <div key={uuid()} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Tên đề thi: {exam["quiz_title"]}
                      </h2>
                      <p className="text-gray-600">Mã đề thi: {examPins[index]}</p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => checkResponses(index)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Xem các câu trả lời
                      </button>
                      <button
                        onClick={() => handleResponseStatus(status[index], index)}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          status[index] === "active"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        } text-white`}
                      >
                        {status[index] === "active" ? "Khóa đề thi" : "Mở đề thi"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-gray-600">Chưa có đề thi nào được tạo!</p>
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
}

export default ExamsCreatedPage; 