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
import { FaSearch, FaPlus, FaRegFolderOpen } from "react-icons/fa";
import { PiBankBold } from "react-icons/pi";

function TestManagement() {
  const [createdExams, setCreatedExams] = useState(() => []);
  const [examPins, setExamPins] = useState(() => []);
  const [status, setStatus] = useState(() => []);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    examSetter();
  }, []);

  useEffect(() => {
  }, [status]);

  function examSetter() {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        const some = await getDocs(
          collection(db, "Users", user.uid, "Exams_Created")
        );
        some.docs.length !==0
          ? some.docs.map((doc) => {
              let somo = doc.data();
              setCreatedExams((prevCreatedExams) => [
                ...prevCreatedExams,
                somo,
              ]);
              setExamPins((prevExamPins) => [...prevExamPins, doc.id]);
              setStatus((prevStatus) => [...prevStatus, somo["status"]]);
            })
          : setCreatedExams(["Empty"]);
      } else {
        console.log("Something Went Wrong!");
      }
    });
  }

  async function checkResponses(index) {
    window.location = `ExamsCreated/DisplayResponses/${examPins[index]}`;
  }

  async function handleResponseStatus(soloStatus, index) {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        if (soloStatus === "active") {
          if (
            window.confirm("Are you sure you want to stop responses ?") === true
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
            window.confirm("Are you sure you want to resume responses ?") ===
            true
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
        console.log("Something Went Wrong!");
      }
    });
  }

  const filteredExams = createdExams.length > 0 && createdExams[0] !== "Empty" 
    ? createdExams.filter(exam => 
        exam.quiz_title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : createdExams;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 m-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300"
          >
            Quay lại
          </button>
          <button
            onClick={() => window.location.href = '/FormMaker'}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            <FaPlus className='inline mr-2'/>Tạo đề thi
          </button>
          <button
            onClick={() => window.location.href = '/statistics'}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            <PiBankBold className='inline mr-2'/> Tạo ngân hàng câu hỏi
          </button>
          <button
            onClick={() => window.location.href = '/settings'}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors duration-300"
          >
            <FaRegFolderOpen className='inline mr-2'/>Tạo thư mục
          </button>
        </div>
        <div className="relative w-full md:w-64 group">
          <input
            type="search"
            placeholder="Tìm kiếm đề thi..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 
            bg-gray-50 text-gray-700
            transition-all duration-300 ease-in-out
            placeholder:text-gray-400 placeholder:transition-all
            hover:border-blue-400 hover:bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            focus:border-transparent focus:bg-white
            peer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 
            text-gray-400 transition-colors duration-300
            group-hover:text-blue-500 peer-focus:text-blue-500">
            <FaSearch className="w-4 h-4" />
          </span>
        </div>      
      </div>

      {createdExams.length != 0 ? (
        createdExams[0] != "Empty" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.map((exam, index) => (
              <div
                key={uuid()}
                className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Tên đề thi: {exam["quiz_title"]}
                  </h3>
                  <p className="text-gray-600">
                    Mã đề thi: {examPins[index]}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => checkResponses(index)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Xem các câu trả lời
                  </button>
                  <button
                    onClick={() => handleResponseStatus(status[index], index)}
                    className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                      status[index] === "active"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {status[index] === "active" ? "Khóa đề thi" : "Mở đề thi"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-600">Bạn chưa tạo đề thi nào.</p>
          </div>
        )
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600">Đang tải...</p>
        </div>
      )}
    </div>
  );
}

export default TestManagement;
