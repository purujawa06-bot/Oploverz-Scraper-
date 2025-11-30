import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Zap } from 'lucide-react';

export const PromoPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup shortly after mounting to allow initial render
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden transform transition-all scale-100">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-900/50 rounded-full flex items-center justify-center mb-6 border border-indigo-500/30">
            <Zap className="text-indigo-400" size={32} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Powered by NextA API</h2>
          <p className="text-slate-400 mb-6 text-sm leading-relaxed">
            Experience the fastest anime data streaming. NimeStream is proudly powered by the robust NextA ecosystem.
          </p>

          <div className="flex flex-col gap-3">
             <a 
              href="https://nexta-api.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105"
            >
              Explore API Docs <ExternalLink size={18} />
            </a>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-slate-500 hover:text-slate-300 text-sm py-2"
            >
              Continue to NimeStream
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};