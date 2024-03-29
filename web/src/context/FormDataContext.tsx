import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface FormDataState {
  imageUrl: string;
  predictionWords: string[];
}

interface FormDataContextProps {
  formData: FormDataState;
  setFormData: (formData: FormDataState) => void;
  resetFormData: () => void;
}

const FormDataContext = createContext<FormDataContextProps | undefined>(undefined);

export const FormDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialState = { imageUrl: '', predictionWords: [] };
  const [formData, setFormData] = useState<FormDataState>(initialState);

  const resetFormData = useCallback(() => {
    setFormData(initialState);
  }, []);

  return (
    <FormDataContext.Provider value={{ formData, setFormData, resetFormData }}>
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
