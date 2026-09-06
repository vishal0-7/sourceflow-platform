import React, { useState, useEffect } from 'react';
import { getCurrentISTTimeString } from '../../utils/date';
import { Shield, CheckCircle } from 'lucide-react';

export const SecurityStrip: React.FC = () => {
  const [timeString, setTimeString] = useState<string>(getCurrentISTTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeString(getCurrentISTTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-6 w-full bg-primary text-on-primary px-console-margin flex items-center justify-between font-code-sm text-code-sm tracking-wider select-none border-b border-slate-800/80">
      <div className="flex items-center gap-space-sm">
        <span className="inline-block w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
        <span className="font-semibold text-slate-200">
          RESTRICTED DEMO INSTANCE // INSTITUTIONAL WORKSPACE
        </span>
        <span className="text-slate-400 hidden md:inline">
          (Tamper-Evident Content System)
        </span>
      </div>

      <div className="flex items-center gap-space-xl text-slate-300">
        <span className="hidden sm:inline">{timeString}</span>
        <div className="flex items-center gap-space-xs">
          <CheckCircle className="w-3.5 h-3.5 text-tertiary-fixed inline" />
          <span className="text-tertiary-fixed font-semibold">INTEGRITY ENGINE: ONLINE</span>
          <span className="text-slate-400 font-mono text-[10px]">[SHA-256 ATTESTED]</span>
        </div>
      </div>
    </div>
  );
};
