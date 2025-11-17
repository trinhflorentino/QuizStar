import { collection, getDocs } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import { v4 as uuid } from "uuid";
import React from 'react';

interface ExamAttempt {
  exam_title?: string;
  name?: string;
  class?: string;
  roll_no?: string;
  email?: string;
  score?: number;
  [key: string]: any;
}

const ExamsAttempted: React.FC = () => {
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[] | string[]>([]);

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
      } else {
        console.log("Something Went Wrong!");
      }
    });
  }, []);

  useEffect(() => {
  }, [examAttempts]);

  return (
    <div>
      {examAttempts.length !== 0 ? (
        examAttempts[0] !== "Empty" ? (
          (examAttempts as ExamAttempt[]).map((attempt) => {
            return (
              <div className="mainForm" key={uuid()}>
                <div className="centeredP">
                  <table className="responsesTable">
                    <tbody>
                      <tr className="thRow">
                        <th>Exam Title</th>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Roll No</th>
                        <th>Email</th>
                        <th>Score</th>
                      </tr>
                      <tr>
                        <td>{attempt.exam_title || "—"}</td>
                        <td>{attempt.name || "—"}</td>
                        <td>{attempt.class || "—"}</td>
                        <td>{attempt.roll_no || "—"}</td>
                        <td>{attempt.email || "—"}</td>
                        <td>{attempt.score !== undefined ? attempt.score : "—"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="mainForm">
            <p className="centeredP">No Exams Attempted Yet!</p>
          </div>
        )
      ) : (
        <div className="mainForm">
          <p className="centeredP">Loading...</p>
        </div>
      )}
      <div className="sub_btn">
        <input
          className="sub_btn_actual hov"
          type="button"
          value="Back"
          onClick={() => window.history.back()}
        />
      </div>
    </div>
  );
};

export default ExamsAttempted;




