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
  const [resetTrigger, setResetTrigger] = useState(false);

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
      const response = await fetch('/predict/image_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      const data = await response.json();
      setPredictionResults(data);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRestart = () => {
    resetFormData();
    setPredictionResults(null);
    setResetTrigger(prev => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 md:p-6 lg:p-8">
        <div className="flex items-center">
          {theme === 'dark' ? (
            <img
              className="w-24 md:w-40 lg:w-72 rounded-lg m-4"
              src="/satlantis-logo-white.png"
              alt="Satlantis Logo"
            />
          ) : (
            <img
              className="w-24 md:w-40 lg:w-72 rounded-lg m-4"
              src="/satlantis-logo-black.png"
              alt="Satlantis Logo"
            />
          )}
        </div>
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

      <main className="flex flex-col md:flex-row w-full flex-1">
        <div className="w-full md:w-1/2 items-center justify-center">
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-4">Upload Image</h2>
              <ImageForm
                imageUrl={formData.imageUrl}
                onImageChange={url =>
                  setFormData({ ...formData, imageUrl: url })
                }
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-4">Labels to Predict</h2>
              <WordForm
                resetTrigger={resetTrigger}
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
