import React, { ChangeEvent } from 'react';
import type { EditTarget } from './types';

interface EditModalProps {
  isOpen: boolean;
  editType: 'chapter' | 'subContent' | 'requirement' | null;
  editTarget: EditTarget | null;
  editName: string;
  editDescription: string;
  onClose: () => void;
  onSave: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  editType,
  editTarget,
  editName,
  editDescription,
  onClose,
  onSave,
  onNameChange,
  onDescriptionChange
}) => {
  if (!isOpen) return null;

  const getTitle = (): string => {
    switch (editType) {
      case 'chapter':
        return 'Chỉnh sửa chương';
      case 'subContent':
        return 'Chỉnh sửa nội dung con';
      case 'requirement':
        return 'Chỉnh sửa yêu cầu';
      default:
        return '';
    }
  };

  const isDisabled = (): boolean => {
    if (editType === 'chapter' || editType === 'subContent') {
      return !editName.trim();
    }
    if (editType === 'requirement') {
      return !editDescription.trim();
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{getTitle()}</h2>
        
        {/* Edit Form */}
        <div className="mb-4">
          {(editType === 'chapter' || editType === 'subContent') && (
            <>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
                Tên {editType === 'chapter' ? 'chương' : 'nội dung con'}
              </label>
              <input
                id="edit-name"
                type="text"
                value={editName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </>
          )}
        </div>
        
        {editType === 'requirement' && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">
              Nội dung yêu cầu
            </label>
            <textarea
              id="edit-description"
              value={editDescription}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onDescriptionChange(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
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
            onClick={onSave}
            disabled={isDisabled()}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;




