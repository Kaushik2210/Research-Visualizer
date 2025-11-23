import React, { useCallback, useRef, useState } from 'react';
import { Upload, FileText, AlertCircle, FileType } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface UploadScreenProps {
  onFileSelect: (file: File) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(contentRef.current, 
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );
  }, { scope: containerRef });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file: File) => {
    const validTypes = [
      'application/pdf', 
      'text/plain', 
      'text/markdown',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
    ];
    
    // Fallback check for extensions in case mime type is missing or generic
    const validExtensions = ['.pdf', '.txt', '.md', '.docx'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (validTypes.includes(file.type) || hasValidExtension) {
      setError(null);
      onFileSelect(file);
    } else {
      setError("Unsupported format. System accepts PDF, DOCX, TXT, or MD protocols.");
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center min-h-[80vh] w-full p-4">
      <div ref={contentRef} className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 mb-4 tracking-tighter">
            NEXUS
          </h1>
          <p className="text-cyan-400/60 font-mono text-lg tracking-[0.2em] uppercase">
            Knowledge Ingestion Interface v2.1
          </p>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative group cursor-pointer
            border-2 border-dashed transition-all duration-500 rounded-lg p-16
            ${isDragging 
              ? 'border-cyan-400 bg-cyan-900/20 shadow-[0_0_50px_rgba(34,211,238,0.2)]' 
              : 'border-slate-700 bg-slate-900/40 hover:border-cyan-500/50'
            }
          `}
        >
            <input 
                type="file" 
                onChange={handleInput} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.txt,.md,.docx"
            />
            
            <div className="flex flex-col items-center gap-6 relative z-10 pointer-events-none">
                <div className={`
                    w-24 h-24 rounded-full flex items-center justify-center
                    bg-gradient-to-br from-slate-800 to-slate-900
                    border border-slate-700 shadow-2xl
                    group-hover:scale-110 transition-transform duration-500
                `}>
                    <Upload className="w-10 h-10 text-cyan-400 group-hover:animate-bounce" />
                </div>
                
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-display text-white">
                        Initialize Data Stream
                    </h3>
                    <p className="text-slate-400 font-mono">
                        Drag & Drop PDF, DOCX, or Text Document
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-900/20 px-4 py-2 rounded border border-red-500/30">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-mono">{error}</span>
                    </div>
                )}
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors"></div>
        </div>
        
        <div className="mt-8 flex justify-center gap-8 text-slate-500 font-mono text-xs uppercase tracking-widest flex-wrap">
            <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> PDF
            </span>
            <span className="flex items-center gap-2">
                <FileType className="w-4 h-4" /> DOCX
            </span>
            <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Markdown
            </span>
            <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Secure Parse
            </span>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;