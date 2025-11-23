import React, { useEffect, useState } from 'react';
import { useLiveSession } from '../hooks/useLiveSession';
import { Mic, MicOff, Activity, AlertCircle } from 'lucide-react';

export const LiveConversation: React.FC = () => {
  const { connect, disconnect, isConnected, isConnecting, volume, error } = useLiveSession();
  const [dots, setDots] = useState('');

  // Simple animation for connecting state
  useEffect(() => {
    if (isConnecting) {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isConnecting]);

  // Visualizer bars
  const renderVisualizer = () => {
    // Generate 5 bars based on current volume
    return (
      <div className="flex items-center justify-center gap-2 h-16">
        {[0, 1, 2, 3, 4].map((i) => {
          const height = Math.max(4, Math.min(64, volume * (1 + i % 2) * 2 + Math.random() * 10));
          return (
            <div
              key={i}
              className="w-3 bg-blue-500 rounded-full transition-all duration-75"
              style={{ 
                height: isConnected ? `${height}px` : '4px',
                opacity: isConnected ? 1 : 0.3 
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-8 animate-in zoom-in-95 duration-500">
      
      <div className="mb-12 text-center space-y-4">
         <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center mx-auto shadow-2xl shadow-blue-900/40">
            <Activity className="w-10 h-10 text-white" />
         </div>
         <h2 className="text-3xl font-bold text-white">Gemini Live</h2>
         <p className="text-slate-400">
           Experience real-time, low-latency voice conversations with <br/> Gemini 2.5 Native Audio.
         </p>
      </div>

      <div className="relative mb-12 w-64 h-32 flex items-center justify-center bg-slate-800/50 rounded-3xl border border-slate-700/50">
        {isConnecting ? (
          <span className="text-blue-400 font-medium">Connecting{dots}</span>
        ) : renderVisualizer()}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200">
           <AlertCircle className="w-5 h-5" />
           <p className="text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={isConnected ? disconnect : connect}
        disabled={isConnecting}
        className={`
          group relative flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300
          ${isConnected 
            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-2 border-red-500/50' 
            : 'bg-white text-slate-900 hover:bg-blue-50 hover:scale-105 shadow-xl shadow-blue-900/20'}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isConnected ? (
          <>
            <MicOff className="w-6 h-6" />
            <span>End Conversation</span>
          </>
        ) : (
          <>
            <Mic className={`w-6 h-6 ${isConnecting ? 'animate-pulse' : ''}`} />
            <span>{isConnecting ? 'Starting...' : 'Start Conversation'}</span>
          </>
        )}
      </button>

      <p className="mt-8 text-sm text-slate-500">
        Ensure your microphone permission is granted.
      </p>
    </div>
  );
};
