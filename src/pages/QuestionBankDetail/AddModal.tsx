import React, { ChangeEvent } from 'react';

interface AddModalProps {
  isOpen: boolean;
  addType: 'chapter' | 'subContent' | 'requirement' | null;
  addName: string;
  addDescription: string;
  onClose: () => void;
  onAdd: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const AddModal: React.FC<AddModalProps> = ({
  isOpen,
  addType,
  addName,
  addDescription,
  onClose,
  onAdd,
  onNameChange,
  onDescriptionChange
}) => {
  if (!isOpen) return null;

  const getTitle = (): string => {
    switch (addType) {
      case 'chapter':
        return 'Thêm chương mới';
      case 'subContent':
        return 'Thêm nội dung con';
      case 'requirement':
        return 'Thêm yêu cầu';
      default:
        return '';
    }
  };

  const isDisabled = (): boolean => {
    if (addType === 'chapter' || addType === 'subContent') {
      return !addName.trim();
    }
    if (addType === 'requirement') {
      return !addDescription.trim();
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{getTitle()}</h2>
        
        {/* Add Form */}
        {(addType === 'chapter' || addType === 'subContent') && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="add-name">
              Tên {addType === 'chapter' ? 'chương' : 'nội dung con'}
            </label>
            <input
              id="add-name"
              type="text"
              value={addName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={`Nhập tên ${addType === 'chapter' ? 'chương' : 'nội dung con'}`}
            />
          </div>
        )}
        
        {addType === 'requirement' && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="add-description">
              Nội dung yêu cầu
            </label>
            <textarea
              id="add-description"
              value={addDescription}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onDescriptionChange(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
              placeholder="Nhập nội dung yêu cầu"
            />
          </div>
        )}
        
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onAdd}
            disabled={isDisabled()}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;




