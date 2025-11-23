import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "relative overflow-hidden font-display uppercase tracking-widest text-sm py-3 px-8 transition-all duration-300 clip-path-polygon";
  
  const styles = variant === 'primary' 
    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
    : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white";

  return (
    <button 
      className={`${baseStyle} ${styles} ${className}`}
      {...props}
    >
      <span className="relative z-10 font-bold">{children}</span>
      {variant === 'primary' && <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-cyan-500 transition-transform duration-300 -z-0" />}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`glass-panel p-6 rounded-none relative overflow-hidden group ${className}`}>
    {/* Decorative corners */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500 transition-all duration-300 group-hover:w-4 group-hover:h-4"></div>
    
    {title && (
      <h3 className="font-display text-lg text-cyan-400 mb-4 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
        <span className="w-2 h-2 bg-cyan-500 inline-block animate-pulse"></span>
        {title}
      </h3>
    )}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center gap-6 p-12">
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 border-4 border-cyan-900 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-4 border-4 border-t-transparent border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
    </div>
    <div className="text-cyan-400 font-mono animate-pulse text-lg tracking-widest text-center">
      {message}...
    </div>
  </div>
);
