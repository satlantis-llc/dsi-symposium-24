import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from './ui/button';
import { Cross1Icon } from '@radix-ui/react-icons';

interface ImageFormProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

const ImageForm: React.FC<ImageFormProps> = ({ imageUrl, onImageChange }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const processFile = async (file: File) => {
    setIsLoading(true);
    const url = URL.createObjectURL(file);
    onImageChange(url);
    setIsLoading(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      processFile(event.target.files[0]);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      processFile(event.dataTransfer.files[0]);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onImageChange(event.target.value);
  };

  const handleClearImage = () => {
    onImageChange(''); // clear img state in parent
    URL.revokeObjectURL(imageUrl); // clean up the object url
  };

  const renderImageInput = () => (
    <>
      <div
        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); }}
        onDrop={handleFileDrop}
        className={`p-6 ${isDragOver ? 'bg-satblue-100 dark:bg-satblue-900' : 'bg-gray-50 dark:bg-gray-700'} rounded-lg
        border-dashed border-2 border-gray-300 dark:border-gray-600`}
      >
        Drag and drop an image here or click to select a file
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 
          rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer focus:outline-none focus:border-blue-500
          focus:ring-2 focus:ring-blue-500 opacity-0 absolute"
          aria-label="Upload image file"
        />
      </div>
      <div className="flex mt-2">
        <Input
          type="text"
          placeholder="Or enter an image URL from the internet"
          onChange={handleUrlChange}
          className="flex-1 p-2.5 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 
          dark:bg-gray-700 rounded-l-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Image URL"
        />
      </div>
    </>
  );

  const renderImagePreview = () => (
    <>
      <div className="relative">
        <img src={imageUrl} alt="Preview" className="mt-4 max-w-full rounded-lg shadow-sm" />
        <Button
          onClick={handleClearImage}
          className="absolute top-0 right-0 bg-red-500 rounded-full m-1"
          aria-label="Clear image"
        >
          <Cross1Icon />
        </Button>
      </div>
    </>
  );

  return (
    <div className="m-4 p-6 bg-card shadow rounded-lg">
      {imageUrl ? renderImagePreview() : renderImageInput()}
      {isLoading && <div className="mt-2 text-center">Loading image...</div>}
    </div>
  );
};

export default ImageForm;
