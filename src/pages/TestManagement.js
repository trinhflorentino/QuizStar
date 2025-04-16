import React from 'react';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,  // Add this import
} from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import db from "../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import { v4 as uuid } from "uuid";
import { FaSearch, FaPlus, FaRegFolderOpen } from "react-icons/fa";
import { PiBankBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { IoMdInformationCircle } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

function TestManagement() {
  const [createdExams, setCreatedExams] = useState(() => []);
  const [examPins, setExamPins] = useState(() => []);
  const [status, setStatus] = useState(() => []);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
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
    navigate(`/ExamsCreated/ExamResults/${examPins[index]}`);
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

  async function createFolder() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const folderName = prompt("Nhập tên thư mục:");
      
      if (folderName) {
        try {
          const folderRef = collection(db, "Users", user.uid, "Folders");
          await addDoc(folderRef, {
            name: folderName,
            createdAt: new Date(),
            exams: []
          });
          alert("Folder created successfully!");
        } catch (error) {
          console.error("Error creating folder:", error);
          alert("Failed to create folder");
        }
      }
    } else {
      alert("Please login to create a folder");
    }
  }

  const filteredExams = createdExams.length > 0 && createdExams[0] !== "Empty" 
    ? createdExams.filter(exam => 
        exam.quiz_title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : createdExams;

    async function handleDelete(index) {
      if (window.confirm("Bạn có chắc chắn muốn xóa bài thi này?")) {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          const pin = examPins[index];
          
          if (user) {
            // Delete exam content
            const paperSetterRef = doc(db, "Paper_Setters", pin);
            
            // Delete responses
            const responsesRef = collection(paperSetterRef, "Responses");
            const responsesDocs = await getDocs(responsesRef);
            responsesDocs.forEach(async (responseDoc) => {
              await deleteDoc(responseDoc.ref);
            });
  
            // Delete questions
            const questionsRef = collection(paperSetterRef, "Question_Papers_MCQ");
            const questionsDocs = await getDocs(questionsRef);
            questionsDocs.forEach(async (questionDoc) => {
              await deleteDoc(questionDoc.ref);
            });
  
            // Delete exam from user's created exams
            await deleteDoc(doc(db, "Users", user.uid, "Exams_Created", pin));
            
            // Delete main exam document
            await deleteDoc(paperSetterRef);
  
            // Update local state
            const newCreatedExams = createdExams.filter((_, i) => i !== index);
            const newExamPins = examPins.filter((_, i) => i !== index);
            const newStatus = status.filter((_, i) => i !== index);
            
            setCreatedExams(newCreatedExams);
            setExamPins(newExamPins);
            setStatus(newStatus);
  
            alert("Đã xóa bài thi thành công!");
          }
        } catch (error) {
          console.error("Error deleting exam:", error);
          alert("Có lỗi xảy ra khi xóa bài thi!");
        }
      }
    }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 m-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate("/Dashboard")}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300"
          >
            Quay lại
          </button>
          <button
            onClick={() => navigate("/FormMaker")}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            <FaPlus className='inline mr-2'/>Tạo đề thi
          </button>
          <button
            onClick={() => navigate("/QuestionBank")}
            className="bg-amber-400 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors duration-300"
          >
            <PiBankBold className='inline mr-2'/> Tạo ngân hàng câu hỏi
          </button>
          {/* <button
            onClick={() => createFolder()}
            className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-950 transition-colors duration-300"
          >
            <FaRegFolderOpen className='inline mr-2'/>Tạo thư mục
          </button> */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                    onClick={() => checkResponses(index)} //    window.location = `ExamsCreated/DisplayResponses/${examPins[index]}`;
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    <IoMdInformationCircle className='inline mr-1'/> Xem chi tiết
                  </button> 
                  {/* <button
                    onClick={() => handleResponseStatus(status[index], index)}
                    className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                      status[index] === "active"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {status[index] === "active" ? "Khóa đề thi" : "Mở đề thi"}
                  </button> */}
                  <button
                    onClick={() => handleDelete(index)}
                    className={`px-4 py-2 rounded-md transition-colors duration-300 bg-red-600 hover:bg-red-700 text-white`}
                  >
                    <MdDeleteForever className='inline mr-1'/>Xóa đề thi
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
