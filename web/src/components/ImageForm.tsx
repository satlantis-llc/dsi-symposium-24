import React, { useState } from 'react';
import { Input } from "@/components/ui/input";

const ImageForm: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const processFile = (file: File) => {
    setIsLoading(true);
    setImageUrl(URL.createObjectURL(file));
    setIsLoading(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      processFile(event.target.files[0]);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') === 0) {
        const blob = items[i].getAsFile();
        if (blob) {
          processFile(blob);
        }
      }
    }
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      processFile(event.dataTransfer.files[0]);
    }
  };

  return (
    <div className="m-4 p-6 bg-card  shadow rounded-lg" onPaste={handlePaste}>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
          value={imageUrl}
          className="flex-1 p-2.5 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 
          dark:bg-gray-700 rounded-l-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Image URL"
        />
      </div>
      {isLoading ? (
        <div className="mt-2 text-center">Loading image...</div>
      ) : (
        imageUrl && <img src={imageUrl} alt="Preview" className="mt-4 max-w-full rounded-lg shadow-sm" />
      )}
    </div>
  );
};

export default ImageForm;
