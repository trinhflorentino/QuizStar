import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaLock, FaFilePdf } from "react-icons/fa";
import { MdDeleteForever, MdPieChart } from "react-icons/md";
import { IoDocumentTextSharp } from "react-icons/io5";

interface ActionToolbarProps {
  pin: string;
  status: string;
  onStatusChange: (currentStatus: string) => void;
  onDelete: () => void;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({
  pin,
  status,
  onStatusChange,
  onDelete
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row flex-wrap gap-2 mb-3 mx-4 md:mx-10 lg:mx-14">
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
        <IoDocumentTextSharp className="inline-block mr-2" />
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
        onClick={() => onStatusChange(status)}
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
        onClick={onDelete}
        className="sm:w-auto px-4 py-2 rounded-md transition-colors duration-300 bg-red-800 hover:bg-red-900 text-white"
      >
        <MdDeleteForever className="inline mr-2" />
        Xóa đề thi
      </button>
    </div>
  );
};

export default ActionToolbar;




