import React from 'react';
import { BiImages } from "react-icons/bi";
import { FiX } from "react-icons/fi";

interface ImageUploaderProps {
  index: number;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  onRemoveImage: (index: number) => void;
  imagePreview?: string | null;
  fileInputKey?: string | number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  index,
  onImageChange,
  onRemoveImage,
  imagePreview,
  fileInputKey
}) => {
  return (
    <>
      <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg cursor-pointer transition-colors">
        <BiImages className="mr-2 text-lg"/>
        <span className="whitespace-nowrap">Chọn ảnh</span>
        <input 
          type="file" 
          className="hidden"
          key={fileInputKey}
          data-index={index}
          onChange={(event) => onImageChange(event, index)}
          accept="image/*"
        />
      </label>
      {imagePreview && (
        <div className="mt-4 md:mt-6">
          <div className="relative group">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105" 
            />
            <button
              onClick={() => onRemoveImage(index)}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full transition-opacity duration-200 hover:bg-red-600 z-10"
            >
              <FiX className="w-4 h-4" />
            </button>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-lg" />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploader;




