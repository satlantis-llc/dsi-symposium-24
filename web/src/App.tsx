import { useEffect, useState } from 'react';
import ImageForm from '@/components/ImageForm';
import WordForm from '@/components/WordForm';
import Result from '@/components/Result';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { useFormData } from '@/context/FormDataContext';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const { formData, setFormData, resetFormData } = useFormData();
  const [predictionResults, setPredictionResults] = useState<{
    [key: string]: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
    return () => {
      document.body.classList.remove(theme);
    };
  }, [theme]);

  async function handleClick() {
    setIsLoading(true);
    try {
      console.log('sending data');
      console.log(formData);
      const response = await fetch('http://127.0.0.1:3000/predict/image_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log('sent data');

      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      const data = await response.json();
      setPredictionResults(data);
      console.log('got prediction data');
      console.log(data);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRestart = () => {
    resetFormData();
    setPredictionResults(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 md:p-6 lg:p-8">
        <h1>insert art later</h1>
        <div className="flex items-center">
          <Switch
            id="theme-mode"
            className="data-[state=unchecked]:bg-[#9CA3AF] data-[state=checked]:bg-[#4b5563]"
            onClick={toggleTheme}
          />
          <Label
            htmlFor="theme-mode"
            className="m-2 text-gray-700 dark:text-gray-400"
          >
            {theme === 'dark' ? 'Dark' : 'Light'} Mode
          </Label>
        </div>
      </header>

      <main className="flex flex-col md:flex-row w-full flex-1 items-center">
        <div className="w-full md:w-1/2">
          <div className="flex flex-col justify-center h-full">
            <div className="flex-1 flex flex-col justify-center">
              <ImageForm
                imageUrl={formData.imageUrl}
                onImageChange={url =>
                  setFormData({ ...formData, imageUrl: url })
                }
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <WordForm
                onPredictionWordsChange={words =>
                  setFormData({ ...formData, predictionWords: words })
                }
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex-1 flex flex-col justify-center items-center">
          {predictionResults ? (
            <>
              <Result results={predictionResults} />
              <Button onClick={handleRestart} className="bg-satblue-400 my-4">
                Restart
              </Button>
            </>
          ) : isLoading ? (
            <div className="text-6xl p-8 m-4">Loading...</div>
          ) : (
            <Button
              className="bg-satyellow  dark:text-white text-6xl p-8 m-4 rounded-lg"
              onClick={handleClick}
            >
              Predict
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
