import React, { useState } from 'react';
import UploadScreen from './components/UploadScreen';
import VisualizerScreen from './components/VisualizerScreen';
import { AppState, PaperAnalysis } from './types';
import { extractTextFromPdf } from './services/pdfService';
import { extractTextFromDocx } from './services/docxService';
import { analyzePaperContent } from './services/geminiService';
import { LoadingSpinner } from './components/FuturisticUI';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [paperData, setPaperData] = useState<PaperAnalysis | null>(null);
  const [loadingMsg, setLoadingMsg] = useState<string>("Initializing...");

  const handleFileSelect = async (file: File) => {
    setAppState(AppState.PROCESSING);
    
    try {
      setLoadingMsg("EXTRACTING_DATA_STREAM...");
      let text = "";
      
      if (file.type === "application/pdf") {
        text = await extractTextFromPdf(file);
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
        file.name.toLowerCase().endsWith('.docx')
      ) {
        text = await extractTextFromDocx(file);
      } else {
        // Text/Markdown fallback
        text = await file.text();
      }

      setLoadingMsg("NEURAL_ANALYSIS_IN_PROGRESS...");
      const analysis = await analyzePaperContent(text);
      
      setPaperData(analysis);
      setAppState(AppState.VISUALIZE);
      
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
      // In a real app, show error UI. For now, reset.
      setTimeout(() => setAppState(AppState.UPLOAD), 3000);
    }
  };

  const handleBack = () => {
    setPaperData(null);
    setAppState(AppState.UPLOAD);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-cyan-500 selection:text-black">
      {appState === AppState.UPLOAD && (
        <UploadScreen onFileSelect={handleFileSelect} />
      )}
      
      {appState === AppState.PROCESSING && (
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner message={loadingMsg} />
        </div>
      )}

      {appState === AppState.VISUALIZE && paperData && (
        <VisualizerScreen data={paperData} onBack={handleBack} />
      )}

      {appState === AppState.ERROR && (
        <div className="flex h-screen flex-col items-center justify-center space-y-4">
           <div className="text-red-500 font-display text-4xl">SYSTEM ERROR</div>
           <div className="text-slate-400 font-mono">Analysis Failed. Resetting...</div>
        </div>
      )}
    </div>
  );
};

export default App;