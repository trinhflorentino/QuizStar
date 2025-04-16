import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocs, collection, doc, setDoc, deleteDoc } from "firebase/firestore/lite";
import db from "../../services/firebaseConfig";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import React from 'react';
import { FaEdit, FaLock, FaFilePdf } from "react-icons/fa";
import { MdDeleteForever, MdPieChart } from "react-icons/md";
import { IoDocumentTextSharp } from "react-icons/io5";

// import AnalyzeKnowledge from "./analyze-knowledge/AnalyzeKnowledge";

function DisplayResponses() {
  const navigate = useNavigate();
  let { pin } = useParams();
  const [studInfo, setStudInfo] = useState(() => []);
  const [score, setScore] = useState(() => []);
  const [status, setStatus] = useState("active"); // Add this state
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState([]); // Add original questions state

  useEffect(() => {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        const questionDocs = await getDocs(
          collection(db, "Paper_Setters", pin, "Question_Papers_MCQ")
        );
        
        // questionDocs.forEach(doc => {
        //   if (!doc.id.includes('_answerSheet')) {
        //     setQuestions(doc.data().question_question || []);
        //     setOriginalQuestions(doc.data().question_question || []);
        //     // console.log(doc.data().creator);
        //     if(doc.data().creator !== user.email) {
        //       navigate('/TestManagement');
        //     }
        //     // console.log(user);
        //   } else {
        //     setAnswers(doc.data().answer_answer || []);
        //   }
        // });
        const some = await getDocs(
          collection(db, "Paper_Setters", pin, "Responses")
        );

        const somesome = some.docs.map((doc) => doc.data());
        somesome.length !== 0
          ? somesome.map((some) => {
              // setScore((prevScore) => [...prevScore, some["score"]]);
              setStudInfo((prevStudInfo) => [
                ...prevStudInfo,
                some["stud_info"],
              ]);
              return some;
            })
          : setStudInfo(["Empty"]);
        setScore(somesome.map((some) => some["scoreQ"]));
        // Fetch current status
        const examDoc = await getDocs(
          collection(db, "Paper_Setters", pin, "Question_Papers_MCQ")
        );
        if (!examDoc.empty) {
          setStatus(examDoc.docs[0].data().status || "active");
        }

        // Fetch questions and answers
      } else {
        console.log("Something Went Wrong!");
      }
    });
  }, [pin]);

  async function handleResponseStatus(currentStatus) {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        if (currentStatus === "active") {
          if (window.confirm("Bạn chắc chắn muốn khóa bài thi?") === true) {
            const examDocs = await getDocs(
              collection(db, "Paper_Setters", pin, "Question_Papers_MCQ")
            );
            
            if (!examDocs.empty) {
              const examDoc = examDocs.docs[0];
              await setDoc(
                doc(db, "Paper_Setters", pin, "Question_Papers_MCQ", examDoc.id),
                { status: "inactive" },
                { merge: true }
              );

              await setDoc(
                doc(db, "Users", user.uid, "Exams_Created", pin),
                { status: "inactive" },
                { merge: true }
              );

              setStatus("inactive");
            }
          }
        } else {
          if (window.confirm("Are you sure you want to resume responses ?") === true) {
            const examDocs = await getDocs(
              collection(db, "Paper_Setters", pin, "Question_Papers_MCQ")
            );
            
            if (!examDocs.empty) {
              const examDoc = examDocs.docs[0];
              await setDoc(
                doc(db, "Paper_Setters", pin, "Question_Papers_MCQ", examDoc.id),
                { status: "active" },
                { merge: true }
              );

              await setDoc(
                doc(db, "Users", user.uid, "Exams_Created", pin),
                { status: "active" },
                { merge: true }
              );

              setStatus("active");
            }
          }
        }
      }
    });
  }

  async function handleDelete() {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài thi này?")) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
          // Delete all responses
          const responsesDocs = await getDocs(
            collection(db, "Paper_Setters", pin, "Responses")
          );
          
          for (const doc of responsesDocs.docs) {
            await deleteDoc(doc.ref);
          }

          // Delete all questions
          const questionDocs = await getDocs(
            collection(db, "Paper_Setters", pin, "Question_Papers_MCQ")
          );
          
          for (const doc of questionDocs.docs) {
            await deleteDoc(doc.ref);
          }

          // Delete exam reference from user's created exams
          await deleteDoc(doc(db, "Users", user.uid, "Exams_Created", pin));

          // Delete main exam document
          await deleteDoc(doc(db, "Paper_Setters", pin));

          navigate('/TestManagement');
        }
      } catch (error) {
        console.error("Error deleting exam:", error);
        alert("Có lỗi xảy ra khi xóa bài thi!");
      }
    }
  }


  useEffect(() => {
    // console.log(score);
    // console.log(studInfo);
  }, [studInfo, score]);

  return (
    <div>
      <div className="flex flex-row flex-wrap gap-2 mb-3 mx-4 md:mx-10 lg:mx-14 mt-4 md:mt-10 lg:mt-14">
        <button
          onClick={() => navigate('/TestManagement')}
          className="sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Quay lại
        </button>   
        <button
          onClick={() => navigate('QuestionsDetail')}
          className="sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300"
        >
          <IoDocumentTextSharp  className="inline-block mr-2" />
          Xem nội dung đề thi
        </button>
        <button
          onClick={() => navigate('/FormEdit/' + pin)}
          className="sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition duration-300"
        >
          <FaEdit className="inline-block mr-2" />
          Chỉnh sửa đề thi
        </button>   
        <button
          onClick={() => window.open(`${pin}/ExportExam`, '_blank')}
          className="sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
        >
          <FaFilePdf className="inline-block mr-2" />
          Xuất PDF
        </button>
        <button
          onClick={() => navigate('AnalyzeKnowledge')}
          className="sm:w-auto px-4 py-2 rounded-md transition-colors duration-300 bg-green-600 hover:bg-green-700 text-white"
        >
          <MdPieChart className="inline mr-2" />
          Phân tích cấu trúc đề thi
        </button>
        <button
          onClick={() => handleResponseStatus(status)}
          className={`sm:w-auto px-4 py-2 rounded-md transition-colors duration-300 ${
            status === "active"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          } text-white`}
        >
          <FaLock className='inline mr-2'/>
          {status === "active" ? "Khóa câu trả lời" : "Mở câu trả lời"}
        </button>
        <button
          onClick={handleDelete}
          className="sm:w-auto px-4 py-2 rounded-md transition-colors duration-300 bg-red-800 hover:bg-red-900 text-white"
        >
          <MdDeleteForever className="inline mr-2" />
          Xóa đề thi
        </button>
      </div>
      {studInfo.length !== 0 ? (
        studInfo[0] !== "Empty" ? (
          studInfo.map((stu, index) => {
            // console.log(studInfo[0]);
            return (
              <div className="mainForm mx-4 md:mx-10 lg:mx-14" key={uuid()} >
                <p className="leftMargin">Danh sách học sinh đã thi ({studInfo.length}):</p>
                <div className="centeredP">
                  <table className="responsesTable">
                    <tbody>
                      <tr className="thRow">
                        <th>Họ và tên</th>
                        <th>Lớp</th>
                        <th>Trường</th>
                        <th>Email</th>
                        <th>Điểm</th>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr className="tdRow">
                        <td>{stu["name"]}</td>
                        <td>{stu["class"]}</td>
                        <td>{stu["roll_no"]}</td>
                        <td>{stu["email"]}</td>
                        <td>{score[index]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <>
            <div className="mainForm mx-4 md:mx-10 lg:mx-14">
              <p className="centeredP">Chưa có dữ liệu nộp bài thi!</p>
            </div>
          </>
        )
      ) : (
        <div className="mainForm mx-4 md:mx-10 lg:mx-14">
          <p className="centeredP">Đang tải...</p>
        </div>
      )}
      <div className="flex justify-center mb-8">
      </div>   
    </div>
  );
}

// export default DisplayResponses;

//           <p className="centeredP">Đang tải...</p>
//         </div>
//       )}
//       <div className="flex justify-center mb-8">
//       </div>   
//     </div>
//   );
// }

export default DisplayResponses;
