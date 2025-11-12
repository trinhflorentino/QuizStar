import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import db from '../../services/firebaseConfig';
import { assembleQuestionsFromBank, serializeQuestionsToText } from '../../utils/questionBankUtils';

const REQUIREMENT_KEYS = ['nhanBiet', 'thongHieu', 'vanDung', 'vanDungCao'];
const REQUIREMENT_LABELS = {
  nhanBiet: 'Nhận biết',
  thongHieu: 'Thông hiểu',
  vanDung: 'Vận dụng',
  vanDungCao: 'Vận dụng cao'
};

function MatrixAssemblyModal({ isOpen, onClose, onApply }) {
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [requests, setRequests] = useState([]);
  const [assembling, setAssembling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchBanks();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedBankId('');
      setSelectedBank(null);
      setRequests([]);
      setError(null);
    }
  }, [isOpen]);

  const fetchBanks = async () => {
    setLoadingBanks(true);
    setError(null);
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        setQuestionBanks([]);
        return;
      }
      const banksRef = collection(db, 'users', auth.currentUser.uid, 'questionBanks');
      const snapshot = await getDocs(banksRef);
      const banks = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      setQuestionBanks(banks);
    } catch (err) {
      console.error('Không thể tải danh sách ngân hàng câu hỏi:', err);
      setError('Không thể tải danh sách ngân hàng câu hỏi.');
    } finally {
      setLoadingBanks(false);
    }
  };

  const loadBankDetail = async (bankId) => {
    setError(null);
    try {
      const auth = getAuth();
      if (!auth.currentUser) return;
      const bankDocRef = doc(db, 'users', auth.currentUser.uid, 'questionBanks', bankId);
      const bankDoc = await getDoc(bankDocRef);
      if (bankDoc.exists()) {
        const data = { id: bankDoc.id, ...bankDoc.data() };
        setSelectedBank(data);
        buildRequests(data);
      }
    } catch (err) {
      console.error('Không thể tải chi tiết ngân hàng:', err);
      setError('Không thể tải chi tiết ngân hàng đã chọn.');
    }
  };

  const buildRequests = (bank) => {
    const requestList = [];
    bank.chapters?.forEach((chapter, chapterIndex) => {
      chapter?.subContents?.forEach((sub, subIndex) => {
        REQUIREMENT_KEYS.forEach((key) => {
          const items = Array.isArray(sub?.requirements?.[key]) ? sub.requirements[key] : [];
          const available = items.filter((item) => item && (item.formattedQuestion || item.questionData || item.question || item.description) && !item._template).length;
          if (available > 0) {
            requestList.push({
              id: `${chapterIndex}-${subIndex}-${key}`,
              chapterIndex,
              subContentIndex,
              requirement: key,
              chapterName: chapter?.name || `Chương ${chapterIndex + 1}`,
              subContentName: sub?.name || `Nội dung ${subIndex + 1}`,
              available,
              count: Math.min(available, 1)
            });
          }
        });
      });
    });
    setRequests(requestList);
  };

  const handleBankChange = async (event) => {
    const bankId = event.target.value;
    setSelectedBankId(bankId);
    setSelectedBank(null);
    setRequests([]);
    if (bankId) {
      const cached = questionBanks.find((bank) => bank.id === bankId);
      if (cached && cached.chapters) {
        setSelectedBank(cached);
        buildRequests(cached);
      } else {
        await loadBankDetail(bankId);
      }
    }
  };

  const handleCountChange = (requestId, value) => {
    const count = Math.max(0, Number(value));
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, count: Math.min(req.available, Number.isNaN(count) ? 0 : count) }
          : req
      )
    );
  };

  const handleAutoFill = () => {
    setRequests((prev) => prev.map((req) => ({ ...req, count: req.available })));
  };

  const handleAssemble = async () => {
    if (!selectedBank) {
      setError('Vui lòng chọn ngân hàng câu hỏi.');
      return;
    }

    const activeRequests = requests.filter((req) => req.count > 0);
    if (activeRequests.length === 0) {
      setError('Vui lòng nhập số lượng câu hỏi cần lấy ở ít nhất một yêu cầu.');
      return;
    }

    setAssembling(true);
    setError(null);
    try {
      const result = assembleQuestionsFromBank(selectedBank, activeRequests, { randomSeed: Date.now() });
      if (!result.questions || result.questions.length === 0) {
        setError('Không đủ câu hỏi phù hợp để sinh đề theo yêu cầu.');
        return;
      }
      const text = serializeQuestionsToText(result.questions);
      onApply({
        bank: selectedBank,
        questions: result.questions,
        coverage: result.coverage,
        text
      });
    } catch (err) {
      console.error('Không thể sinh đề từ ngân hàng:', err);
      setError('Không thể sinh đề thi từ ngân hàng. Vui lòng thử lại.');
    } finally {
      setAssembling(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">Sinh đề từ ngân hàng câu hỏi</h2>
            <p className="text-sm text-gray-500 mt-1">Chọn ngân hàng và nhập số câu hỏi cần lấy theo từng yêu cầu.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {loadingBanks ? (
          <div className="py-20 text-center text-gray-500">Đang tải danh sách ngân hàng...</div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngân hàng câu hỏi</label>
              <select
                value={selectedBankId}
                onChange={handleBankChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">-- Chọn ngân hàng --</option>
                {questionBanks.map((bank) => (
                  <option key={bank.id} value={bank.id}>{bank.title}</option>
                ))}
              </select>
            </div>

            {selectedBank && (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng chương: {selectedBank.chapters?.length || 0}</p>
                    <p className="text-sm text-gray-600">Tổng yêu cầu khả dụng: {requests.reduce((sum, req) => sum + (req.available > 0 ? 1 : 0), 0)}</p>
                  </div>
                  <button
                    onClick={handleAutoFill}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Lấp đầy theo số câu khả dụng
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                      <tr>
                        <th className="px-3 py-2 text-left">Chương</th>
                        <th className="px-3 py-2 text-left">Nội dung</th>
                        <th className="px-3 py-2 text-left">Yêu cầu</th>
                        <th className="px-3 py-2 text-center">Số câu khả dụng</th>
                        <th className="px-3 py-2 text-center">Số câu lấy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr key={request.id} className="border-t">
                          <td className="px-3 py-2 text-gray-800">{request.chapterName}</td>
                          <td className="px-3 py-2 text-gray-600">{request.subContentName}</td>
                          <td className="px-3 py-2 text-gray-600">{REQUIREMENT_LABELS[request.requirement]}</td>
                          <td className="px-3 py-2 text-center">{request.available}</td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max={request.available}
                              value={request.count}
                              onChange={(e) => handleCountChange(request.id, e.target.value)}
                              className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded p-3">{error}</div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            disabled={assembling}
          >
            Hủy
          </button>
          <button
            onClick={handleAssemble}
            disabled={assembling || !selectedBank}
            className={`px-4 py-2 rounded text-white ${assembling || !selectedBank ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {assembling ? 'Đang sinh đề...' : 'Sinh đề tự động'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatrixAssemblyModal;

