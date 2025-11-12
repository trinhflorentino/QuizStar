import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { IoMdInformationCircle } from "react-icons/io";

function DisplayPin() {
  let { pin } = useParams();
  const [copied, setCopied] = useState(false);
  const quizUrl = `https://quizstar-txqt.web.app/pinverify/Form/${pin}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(quizUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const navigate = useNavigate();
  return (
    <div id="mainForm" className="m-4 md:m-10 lg:m-14">
      <p className="centeredP text-[#5CB85C] text-2xl font-bold mb-6">Bài thi đã được tạo thành công!</p>
      
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-4">
        <div className="p-8">
          <div className="text-lg font-semibold text-gray-500">Link bài thi của bạn:</div>
          <div className="mt-2 flex items-center gap-4">
            <span className="text-xs sm:text-sm lg:text-lg text-gray-700 break-all">{quizUrl}</span>
            <button 
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg transition-colors shrink-0 ${
                copied ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {copied ? 'Đã sao chép!' : 'Sao chép'}
            </button>
          </div>
          
          <div className="mt-6 flex justify-center">
            <QRCodeSVG value={quizUrl} size={256} />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/TestManagement')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-300 mr-2"
        >
          Quay lại
        </button>
        <button
          onClick={() => navigate('/ExamsCreated/ExamResults/' + pin)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
        >
          <IoMdInformationCircle className='inline mr-2'/>
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}

export default DisplayPin;