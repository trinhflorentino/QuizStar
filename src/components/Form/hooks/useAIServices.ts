import { useState } from 'react';
import { extractQuestionsJSON, matrixQuestionsJSON, createQuestionsJSON } from '../../AI/AIService';
import { useNotification } from '../../../contexts/NotificationContext';

interface Question {
  id: string;
  type: string;
  question?: string;
  answer?: number | string | string[] | boolean;
}

interface Option {
  id: string;
  option: string;
  answer?: boolean | null;
}

export function useAIServices() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { success, error, warning, info } = useNotification();

  const extractQuestionsPrompt = `Nhiệm vụ quan trọng nhất của bạn là **TUYỆT ĐỐI KHÔNG** được tự tạo ra đáp án nếu nó không được cung cấp một cách rõ ràng trong văn bản. Nếu không có đáp án, đừng xuất đáp án.

Phân tích nội dung file và trích xuất tất cả các câu hỏi thuộc loại trắc nghiệm (MCQ), đúng/sai (True/False), và trả lời ngắn (Short Answer).

---

**QUY TẮC TRÍCH XUẤT ĐÁP ÁN (RẤT QUAN TRỌNG):**

CHỈ trích xuất đáp án khi có một trong các DẤU HIỆU RÕ RÀNG sau đây:
1.  **Bảng đáp án**: Có phần "Bảng đáp án", "BẢNG ĐÁP ÁN", "ANSWER KEY" với đáp án được liệt kê.
2.  **Ghi chú đáp án**: Có văn bản rõ ràng chỉ định đáp án (ví dụ: "Đáp án: A", "Câu trả lời: B", "Answer: C").
3.  **Định dạng đặc biệt**: Phương án đúng được **gạch chân**, **tô màu**, hoặc **in đậm** khác biệt so với các phương án khác.
4.  **Đánh dấu sao (*)**: Có dấu \`*\` ngay trước phương án đúng (ví dụ: \`*A.\` hoặc \`*a)\`).

**NẾU KHÔNG CÓ CÁC DẤU HIỆU TRÊN:**
- **TUYỆT ĐỐI KHÔNG** được đoán đáp án, suy luận, hay dùng kiến thức bên ngoài để tạo đáp án.
- Coi như câu hỏi đó **KHÔNG CÓ ĐÁP ÁN** trong file.

---

**YÊU CẦU VỀ ĐỊNH DẠNG VÀ THỨ TỰ OUTPUT (TEXT FORMAT):**

**Thứ tự câu hỏi:**
1.  TẤT CẢ câu MCQ trước.
2.  Tiếp theo là TẤT CẢ câu True/False.
3.  Cuối cùng là TẤT CẢ câu Short Answer.
*Số thứ tự phải liên tục từ đầu đến cuối.*

**Định dạng câu hỏi trắc nghiệm (MCQ):**
\`Câu [số]. [Nội dung câu hỏi]\`
\`[Nếu có đáp án thì thêm *, không thì thôi]A. [Nội dung lựa chọn] B. [Nội dung lựa chọn] C. [Nội dung lựa chọn] D. [Nội dung lựa chọn]\`

**Định dạng câu hỏi đúng/sai (True/False):**
\`Câu [số]. [Câu dẫn chung (nếu có)]\`
\`[Nếu có đáp án thì thêm *, không thì thôi]a) [Mệnh đề 1] b) [Mệnh đề 2] c) [Mệnh đề 3] d) [Mệnh đề 4]\`

**Định dạng câu hỏi trả lời ngắn (Short Answer):**
\`Câu [số]. [Nội dung câu hỏi]\`

**Phần cuối file:**
Sau tất cả các câu hỏi, thêm các dòng sau:
\`---------------------------HẾT------------------------\`

\`Bảng đáp án\`

**QUY TẮC BẢNG ĐÁP ÁN:**
- **CHỈ** thêm đáp án cho những câu hỏi có dấu hiệu rõ ràng trong file.
- Nếu một câu hỏi **KHÔNG** có đáp án trong file, **KHÔNG** được thêm vào bảng đáp án.
- Định dạng: MCQ dùng \`1A 2B\`, True/False dùng \`Câu 4: a)Đ b)S\`, Short Answer dùng \`Câu 6: đáp án\`.

---

**CÁC QUY TẮC KHÁC:**
- Giữ nguyên ngôn ngữ gốc.
- Chuyển công thức toán học sang LaTeX: \`\\( ... \\)\` (inline) và \`\\[ ... \\]\` (display).
- Loại bỏ thẻ HTML.

**NHẮC LẠI LẦN CUỐI (QUAN TRỌNG NHẤT):**
**KHÔNG BAO GIỜ ĐƯỢC TỰ TẠO RA ĐÁP ÁN.** NẾU KHÔNG CHẮC CHẮN 100% CÓ DẤU HIỆU ĐÁP ÁN RÕ RÀNG TRONG FILE, HÃY XEM NHƯ CÂU HỎI ĐÓ KHÔNG CÓ ĐÁP ÁN.

Chỉ trả về text theo đúng định dạng trên, không giải thích gì thêm.`;

  async function extractQuestions(
    file: File, 
    setRawText: (text: string | ((prev: string) => string)) => void, 
    setQuizTitle: (title: string) => void, 
    quizTitle: string
  ) {
    if (!file) {
      warning("Vui lòng chọn file trước.", 4000);
      return;
    }
    
    setIsLoading(true);
    info("Đang trích xuất câu hỏi từ file...", 0);
    
    try {
      const ketQua = await extractQuestionsJSON(file, extractQuestionsPrompt);
      if (ketQua) {
        const textResult = typeof ketQua === 'string' ? ketQua : (ketQua as any).text || '';
        setRawText((prev: string) => {
          if (prev.trim()) {
            return prev + '\n\n' + textResult.trim();
          }
          return textResult.trim();
        });
        if (!quizTitle.trim()) {
          setQuizTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
        success(`Đã trích xuất câu hỏi từ file "${file.name}" thành công!`, 5000);
      } else {
        warning("Không thể trích xuất câu hỏi từ file. Vui lòng thử lại.", 5000);
      }
    } catch (err: any) {
      console.error("Error extracting questions:", err);
      error(`Lỗi khi trích xuất câu hỏi: ${err.message}`, 6000);
    } finally {
      setIsLoading(false);
    }
  }

  async function matrixQuestion(file: File, setRawText: (text: string | ((prev: string) => string)) => void) {
    if (!file) {
      warning("Vui lòng chọn file trước.", 4000);
      return;
    }
    
    setIsLoading(true);
    info("Đang tạo câu hỏi từ ma trận/đặc tả...", 0);
    
    try {
      const prompt = `Nhiệm vụ: Phân tích kỹ lưỡng nội dung file ma trận/đặc tả/đề cương được cung cấp và TẠO RA các câu hỏi thuộc dạng trắc nghiệm (MCQ), đúng/sai (True/False), và trả lời ngắn (Short Answer) cùng với đáp án chính xác dựa trên nội dung đó.

**YÊU CẦU OUTPUT TEXT FORMAT:**

Bạn phải trả về kết quả theo định dạng text sau đây (KHÔNG phải JSON):

**QUAN TRỌNG:** Việc đánh số cho các câu hỏi được tạo ra phải bắt đầu từ 1.

**QUAN TRỌNG: Thứ tự tạo câu hỏi:**
1. Tạo TẤT CẢ các câu MCQ trước (Câu 1, Câu 2, ...)
2. Sau đó tạo TẤT CẢ các câu True/False (tiếp tục số thứ tự)
3. Cuối cùng tạo TẤT CẢ các câu Short Answer (tiếp tục số thứ tự)

**Định dạng cho câu hỏi trắc nghiệm (MCQ):**
Câu [số]. [Nội dung câu hỏi]
*[Đáp án đúng]. [Nội dung lựa chọn đúng] [Lựa chọn khác]. [Nội dung lựa chọn] [Lựa chọn khác]. [Nội dung lựa chọn] [Lựa chọn khác]. [Nội dung lựa chọn]

**Định dạng cho câu hỏi đúng/sai (True/False):**
Câu [số]. [Câu dẫn chung (nếu có)]
*[Đáp án đúng]) [Mệnh đề 1] [Đáp án sai]) [Mệnh đề 2] [Đáp án sai]) [Mệnh đề 3] [Đáp án sai]) [Mệnh đề 4]

**Định dạng cho câu hỏi trả lời ngắn (Short Answer):**
Câu [số]. [Nội dung câu hỏi]

**Bảng đáp án:**
Sau tất cả các câu hỏi, thêm:
---------------------------HẾT------------------------

Bảng đáp án
[Định dạng đáp án - theo thứ tự: MCQ trước, True/False sau, Short Answer cuối]
**QUAN TRỌNG:** Tất cả các câu hỏi được tạo ra PHẢI có đáp án. Mỗi câu hỏi phải có đáp án tương ứng trong bảng đáp án.

**QUY TẮC:**
- Nội dung, số lượng, và độ khó của các câu hỏi phải bám sát chặt chẽ các chủ đề, mục tiêu học tập, và phân bố được nêu trong file
- MCQ: Tạo đúng 4 lựa chọn, một đúng ba sai (nhiễu)
- True/False: Tạo đúng 4 mệnh đề cần đánh giá Đúng/Sai
- Short Answer: Đáp án ngắn gọn, có thể là giá trị số hoặc thuật ngữ
- Chuyển đổi công thức toán học sang LaTeX với MathJax: \\( ... \\) (inline) và \\[ ... \\] (display)
- Loại bỏ mọi thẻ HTML
- Đánh dấu đáp án đúng bằng dấu * trước chữ cái (ví dụ: *A. hoặc *a))
- Trong bảng đáp án: MCQ dùng "số câu + chữ cái" (ví dụ: 1A 2B), True/False dùng "Câu [số]: a)Đ b)S c)S d)Đ", Short Answer dùng "Câu [số]: [đáp án]" hoặc "Câu [số]: [đáp án1] | [đáp án2]" nếu có nhiều đáp án hợp lệ
- **THỨ TỰ BẮT BUỘC:** MCQ → True/False → Short Answer (theo số thứ tự liên tục)
- **TẤT CẢ CÂU HỎI PHẢI CÓ ĐÁP ÁN:** Mỗi câu hỏi được tạo ra phải có đáp án tương ứng trong bảng đáp án

Chỉ trả về text theo đúng định dạng trên, không có giải thích hay văn bản thừa nào khác.`;

      const ketQua = await matrixQuestionsJSON(file, prompt);
      if (ketQua) {
        const textResult = typeof ketQua === 'string' ? ketQua : (ketQua as any).text || '';
        setRawText((prev: string) => {
          if (prev.trim()) {
            return prev + '\n\n' + textResult.trim();
          }
          return textResult.trim();
        });
        success(`Đã tạo câu hỏi từ file "${file.name}" thành công!`, 5000);
      } else {
        warning("Không thể tạo câu hỏi từ file. Vui lòng thử lại.", 5000);
      }
    } catch (err: any) {
      console.error("Error extracting questions:", err);
      error(`Lỗi khi tạo câu hỏi: ${err.message}`, 6000);
    } finally {
      setIsLoading(false);
    }
  }

  async function createQuestions(
    mcqRef: React.RefObject<HTMLInputElement | HTMLDivElement | null>,
    trueFalseRef: React.RefObject<HTMLInputElement | HTMLDivElement | null>,
    shortAnswerRef: React.RefObject<HTMLInputElement | HTMLDivElement | null>,
    list: Question[],
    optionList: Option[][],
    setRawText: (text: string | ((prev: string) => string)) => void
  ) {
    const mcqValue = mcqRef.current && 'value' in mcqRef.current ? mcqRef.current.value : '0';
    const trueFalseValue = trueFalseRef.current && 'value' in trueFalseRef.current ? trueFalseRef.current.value : '0';
    const shortAnswerValue = shortAnswerRef.current && 'value' in shortAnswerRef.current ? shortAnswerRef.current.value : '0';
    const mcqCount = parseInt(mcqValue);
    const trueFalseCount = parseInt(trueFalseValue);
    const shortAnswerCount = parseInt(shortAnswerValue);
    
    if (mcqCount === 0 && trueFalseCount === 0 && shortAnswerCount === 0) {
      warning("Vui lòng nhập số lượng câu hỏi cần tạo.", 4000);
      return;
    }
    
    setIsLoading(true);
    info("Đang tạo câu hỏi mới bằng AI...", 0);
    
    try {
      const currentQuestions = serializeCurrentQuestions(list, optionList);

      const prompt = `Nhiệm vụ: Phân tích kỹ lưỡng bộ câu hỏi hiện tại được cung cấp. Dựa trên chủ đề, phong cách, độ khó và cấu trúc của các câu hỏi đó, TẠO RA các câu hỏi MỚI và TƯƠNG TỰ thuộc các dạng trắc nghiệm (MCQ), đúng/sai (True/False), và trả lời ngắn (Short Answer) cùng với đáp án chính xác.

**Đầu vào (các câu hỏi hiện tại để tham khảo):**
${currentQuestions}

**Yêu cầu Số lượng Đầu ra:**
- Số câu MCQ mới cần tạo: ${mcqCount}
- Số câu True/False mới cần tạo: ${trueFalseCount}
- Số câu Short Answer mới cần tạo: ${shortAnswerCount}

**YÊU CẦU OUTPUT TEXT FORMAT:**

Bạn phải trả về kết quả theo định dạng text sau đây (KHÔNG phải JSON):

**QUAN TRỌNG: Thứ tự tạo câu hỏi:**
1. Tạo TẤT CẢ các câu MCQ trước (Câu 1, Câu 2, ...)
2. Sau đó tạo TẤT CẢ các câu True/False (tiếp tục số thứ tự)
3. Cuối cùng tạo TẤT CẢ các câu Short Answer (tiếp tục số thứ tự)

**Định dạng cho câu hỏi trắc nghiệm (MCQ):**
Câu [số]. [Nội dung câu hỏi]
*[Đáp án đúng]. [Nội dung lựa chọn đúng] [Lựa chọn khác]. [Nội dung lựa chọn] [Lựa chọn khác]. [Nội dung lựa chọn] [Lựa chọn khác]. [Nội dung lựa chọn]

**Định dạng cho câu hỏi đúng/sai (True/False):**
Câu [số]. [Câu dẫn chung (nếu có)]
*[Đáp án đúng]) [Mệnh đề 1] [Đáp án sai]) [Mệnh đề 2] [Đáp án sai]) [Mệnh đề 3] [Đáp án sai]) [Mệnh đề 4]

**Định dạng cho câu hỏi trả lời ngắn (Short Answer):**
Câu [số]. [Nội dung câu hỏi]

**Bảng đáp án:**
Sau tất cả các câu hỏi, thêm:
---------------------------HẾT------------------------

Bảng đáp án
[Định dạng đáp án - theo thứ tự: MCQ trước, True/False sau, Short Answer cuối]
**QUAN TRỌNG:** Tất cả các câu hỏi được tạo ra PHẢI có đáp án. Mỗi câu hỏi phải có đáp án tương ứng trong bảng đáp án.

**QUY TẮC:**
- Các câu hỏi tạo ra KHÔNG ĐƯỢC TRÙNG LẶP với bất kỳ câu hỏi nào trong đầu vào
- Phải tương tự về chủ đề, lĩnh vực kiến thức, kiểu câu hỏi, và mức độ phức tạp so với các câu hỏi đầu vào
- MCQ: Tạo đúng 4 lựa chọn, một đúng ba sai (nhiễu)
- True/False: Tạo đúng 4 mệnh đề cần đánh giá Đúng/Sai
- Tạo các câu hỏi bằng Tiếng Việt, rõ ràng, dễ hiểu
- Chuyển đổi công thức toán học sang LaTeX với MathJax: \\( ... \\) (inline) và \\[ ... \\] (display)
- Loại bỏ mọi thẻ HTML
- Đánh dấu đáp án đúng bằng dấu * trước chữ cái (ví dụ: *A. hoặc *a))
- Trong bảng đáp án: MCQ dùng "số câu + chữ cái" (ví dụ: 1A 2B), True/False dùng "Câu [số]: a)Đ b)S c)S d)Đ", Short Answer dùng "Câu [số]: [đáp án]"
- **THỨ TỰ BẮT BUỘC:** MCQ → True/False → Short Answer (theo số thứ tự liên tục)
- **TẤT CẢ CÂU HỎI PHẢI CÓ ĐÁP ÁN:** Mỗi câu hỏi được tạo ra phải có đáp án tương ứng trong bảng đáp án

Chỉ trả về text theo đúng định dạng trên, không có giải thích hay văn bản thừa nào khác.`;

      const ketQua = await createQuestionsJSON(prompt);
      if (ketQua) {
        const textResult = typeof ketQua === 'string' ? ketQua : (ketQua as any).text || '';
        setRawText((prev: string) => {
          if (prev.trim()) {
            return prev + '\n\n' + textResult.trim();
          }
          return textResult.trim();
        });
        const totalCount = mcqCount + trueFalseCount + shortAnswerCount;
        success(`Đã tạo ${totalCount} câu hỏi mới thành công!`, 5000);
      } else {
        warning("Không thể tạo câu hỏi. Vui lòng thử lại.", 5000);
      }
    } catch (err: any) {
      console.error("Error extracting questions:", err);
      error(`Lỗi khi tạo câu hỏi: ${err.message}`, 6000);
    } finally {
      setIsLoading(false);
    }
  }

  function serializeCurrentQuestions(list: Question[], optionList: Option[][]): string {
    const questions = list.filter(q => q.type !== 'textblock');
    
    return JSON.stringify(questions.map((question, index) => {
      const qIndex = list.findIndex(q => q.id === question.id);
      const options = optionList[qIndex] || [];
      
      const serialized: any = {
        question: question.question || "",
        type: question.type || "mcq"
      };
      
      if (question.type === "mcq" && options.length > 0) {
        serialized.options = options.map(opt => opt.option || "");
        serialized.answer = String.fromCharCode(65 + ((question.answer as number) || 0));
      } else if (question.type === "truefalse" && options.length > 0) {
        serialized.options = options.map(opt => opt.option || "");
        serialized.answer = options.map(opt => opt.answer === true);
      } else if (question.type === "shortanswer") {
        const answer = question.answer;
        if (Array.isArray(answer) && answer.length > 0) {
          serialized.answer = answer[0];
        } else if (typeof answer === 'string') {
          serialized.answer = answer;
        }
      }
      
      return serialized;
    }), null, 2);
  }

  return {
    isLoading,
    extractQuestions,
    matrixQuestion,
    createQuestions
  };
}

