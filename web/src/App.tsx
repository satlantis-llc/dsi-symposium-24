import { useEffect } from 'react';
import ImageForm from '@/components/ImageForm';
import WordForm from '@/components/WordForm';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from '@/context/ThemeContext'; 

const App = () => {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
    return () => {
      document.body.classList.remove(theme);
    };
  }, [theme]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4">
        <h1>insert art later</h1>
        <div className="flex items-center">
          <Switch id="theme-mode" onClick={toggleTheme} />
          <Label htmlFor="theme-mode" className="ml-2">{theme === 'dark' ? 'Dark' : 'Light'} Mode</Label>
        </div>
      </header>

      <main className="flex w-full flex-1">
        <div className="flex w-1/2">
          <div className="w-full flex flex-col">
            <div className="flex-1">
              <ImageForm />
            </div>
            <div className="flex-1">
              <WordForm />
            </div>
          </div>
        </div>
      
        <div className="w-1/2 flex-1">
          TODO
        </div>
      </main>
    </div>
  );
};

export default App;
