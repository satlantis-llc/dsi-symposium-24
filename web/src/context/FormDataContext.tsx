import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FormDataState {
  imageUrl: string;
  predictionWords: string[];
}

interface FormDataContextProps {
  formData: FormDataState;
  setFormData: (formData: FormDataState) => void;
}

const FormDataContext = createContext<FormDataContextProps | undefined>(undefined);

export const FormDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormDataState>({ imageUrl: '', predictionWords: [] });

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (context === undefined) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
};
