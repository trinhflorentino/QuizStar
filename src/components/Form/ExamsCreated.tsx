import React from 'react';
import {
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import db from "../../services/firebaseConfig";
import { getAuth } from "firebase/auth";
import { v4 as uuid } from "uuid";

interface Exam {
  quiz_title: string;
  status?: string;
  [key: string]: any;
}

const ExamsCreated: React.FC = () => {
  const [createdExams, setCreatedExams] = useState<Exam[] | string[]>([]);
  const [examPins, setExamPins] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);

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
        if (some.docs.length !== 0) {
          const exams: Exam[] = [];
          const pins: string[] = [];
          const statuses: string[] = [];
          some.docs.forEach((doc) => {
            const examData = doc.data() as Exam;
            exams.push(examData);
            pins.push(doc.id);
            statuses.push(examData["status"] || "");
          });
          setCreatedExams(exams as Exam[] | string[]);
          setExamPins(pins);
          setStatus(statuses);
        } else {
          setCreatedExams(["Empty"]);
        }
      } else {
        console.log("Something Went Wrong!");
      }
    });
  }

  async function checkResponses(index: number) {
    window.location.href = `ExamsCreated/DisplayResponses/${examPins[index]}`;
  }

  async function handleResponseStatus(soloStatus: string, index: number) {
    getAuth().onAuthStateChanged(async function (user) {
      if (user) {
        if (soloStatus === "active") {
          if (
            window.confirm("Are you sure you want to stop responses ?") === true
          ) {
            const exam = createdExams[index] as Exam;
            await setDoc(
              doc(
                db,
                "Paper_Setters",
                examPins[index],
                "Question_Papers_MCQ",
                exam["quiz_title"]
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

            const stat = [...status];
            stat[index] = "inactive";
            setStatus(stat);
          }
        } else if (soloStatus === "inactive") {
          if (
            window.confirm("Are you sure you want to resume responses ?") ===
            true
          ) {
            const exam = createdExams[index] as Exam;
            await setDoc(
              doc(
                db,
                "Paper_Setters",
                examPins[index],
                "Question_Papers_MCQ",
                exam["quiz_title"]
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

            const stat = [...status];
            stat[index] = "active";
            setStatus(stat);
          }
        }
      } else {
        console.log("Something Went Wrong!");
      }
    });
  }

  return (
    <div>
      {createdExams.length !== 0 ? (
        createdExams[0] !== "Empty" ? (
          (createdExams as Exam[]).map((exam, index) => (
            <div className="mainForm" key={uuid()}>
              <p className="leftMargin">Tên đề thi: {exam["quiz_title"]}</p>
              <p className="leftMargin">Mã đề thi: {examPins[index]}</p>
              <input
                type="button"
                value="Xem các câu trả lời"
                className="sub_btn_actual hov"
                onClick={() => checkResponses(index)}
              />
              <input
                type="button"
                value={
                  status[index] === "active"
                    ? "Khóa đề thi"
                    : "Mở đề thi"
                }
                className="sub_btn_actual hov respo"
                onClick={() => handleResponseStatus(status[index], index)}
              />
            </div>
          ))
        ) : (
          <div className="mainForm">
            <p className="centeredP">No Exams Created Yet!</p>
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

export default ExamsCreated;

