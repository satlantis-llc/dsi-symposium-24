import React, { useEffect } from 'react';
import ImageForm from '@/components/ImageForm';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from '@/context/ThemeContext'; 

const App = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
    return () => {
      // cleanup by removing the class if the component unmounts
      document.body.classList.remove(theme);
    };
  }, [theme]);

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Switch id="theme-mode" onClick={toggleTheme} />
        <Label htmlFor="theme-mode">{theme === 'dark' ? 'Dark' : 'Light'}</Label>
      </div>
      <h1>HELLO</h1>
      <ImageForm />
    </div>
  );
};

export default App;
