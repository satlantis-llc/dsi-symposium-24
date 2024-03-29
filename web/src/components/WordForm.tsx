import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InputField {
  id: number;
  value: string;
}

const WordForm: React.FC = () => {
  const [inputFields, setInputFields] = useState<InputField[]>([
    { id: Math.random(), value: '' },
  ]);

  const handleInputChange = (id: number, value: string) => {
    const updatedInputFields = inputFields.map(input => {
      if (input.id === id) {
        return { ...input, value: value.split(' ')[0] }; // ensures only the first word is taken
      }
      return input;
    });
    setInputFields(updatedInputFields);
  };

  const addInputField = () => {
    const uniqueId = Date.now() + Math.random();
    setInputFields([...inputFields, { id: uniqueId, value: '' }]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 bg-white shadow-md rounded-lg p-6">
        {inputFields.map((inputField) => (
          <div key={inputField.id} className="flex flex-col space-y-2">
            <Input
              value={inputField.value}
              onChange={(e) => handleInputChange(inputField.id, e.target.value)}
              className="border-gray-300 focus:border-satyellow focus:ring-sat-yellow rounded-md shadow-sm"
            />
          </div>
        ))}
        <Button
          onClick={addInputField}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-satyellow hover:bg-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sat-yellow"
        >
          Add Word
        </Button>
      </div>
    </div>
  );
};

export default WordForm;
