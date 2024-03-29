import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WordFormProps {
  onPredictionWordsChange: (words: string[]) => void;
}

const WordForm: React.FC<WordFormProps> = ({ onPredictionWordsChange }) => {
  const [inputFields, setInputFields] = useState<string[]>(['']);

  const handleInputChange = (index: number, value: string) => {
    const updatedInputFields = [...inputFields];
    updatedInputFields[index] = value.split(' ')[0];
    setInputFields(updatedInputFields);
    onPredictionWordsChange(updatedInputFields);
  };

  const addInputField = () => {
    setInputFields([...inputFields, '']);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full bg-card shadow-md rounded-lg p-6">
        {inputFields.map((value, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <Input
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="my-1 border-gray-300 focus:border-satyellow focus:ring-sat-yellow rounded-md shadow-sm"
            />
          </div>
        ))}
        <Button
          onClick={addInputField}
          className='p-4 my-2 rounded-md dark:text-white bg-satyellow focus:ring-2 focus:ring-offset-2'
        >
          Add Word
        </Button>
      </div>
    </div>
  );
};

export default WordForm;
