import { useEffect } from 'react';
import ImageForm from '@/components/ImageForm';
import WordForm from '@/components/WordForm';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from '@/context/ThemeContext'; 
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

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
    <div className="flex flex-col items-center justify-center">
      <h1>insert satlantis art later</h1>

      <div className="flex items-center p-4">
        <Switch id="theme-mode" onClick={toggleTheme} />
        <Label htmlFor="theme-mode">{theme === 'dark' ? 'Dark' : 'Light'}</Label>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen max-w-screen-xl rounded-lg border p-16"
      >
        <ResizablePanel defaultSize={66.66}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6">
                <ImageForm/>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6">
                <WordForm/>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={66.67}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">
              TODO: Results bar
            </span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default App;
