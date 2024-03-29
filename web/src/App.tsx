import { useEffect } from 'react';
import ImageForm from '@/components/ImageForm';
import WordForm from '@/components/WordForm';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext'; 
import { useFormData } from '@/context/FormDataContext';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const { formData, setFormData } = useFormData();

  useEffect(() => {
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
    return () => {
      document.body.classList.remove(theme);
    };
  }, [theme]);

  async function handleClick() {
    try {
      const response = await fetch('http://127.0.0.1:3000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      // TODO: update UI/State
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  }

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
          <div className="w-full flex flex-col justify-center h-full">
            <div className="flex-1 flex flex-col justify-center">
              <ImageForm
                imageUrl={formData.imageUrl}
                onImageChange={(url) => setFormData({ ...formData, imageUrl: url })}
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <WordForm onPredictionWordsChange={(words) => setFormData({ ...formData, predictionWords: words })} />
            </div>
          </div>
        </div>

        <div className="w-1/2 flex-1 flex justify-center items-center">
          <Button onClick={handleClick}>
            Predict
          </Button>
        </div>
      </main>
    </div>
  );
};

export default App;
