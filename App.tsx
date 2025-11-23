import React, { useState } from 'react';
import { AppTab } from './types';
import { ImageEditor } from './components/ImageEditor';
import { LiveConversation } from './components/LiveConversation';
import { SmartChat } from './components/SmartChat';
import { Wand2, Mic, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LIVE_AUDIO);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.IMAGE_EDITOR:
        return <ImageEditor />;
      case AppTab.LIVE_AUDIO:
        return <LiveConversation />;
      case AppTab.SMART_CHAT:
        return <SmartChat />;
      default:
        return <LiveConversation />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="font-bold text-white">G</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Gemini Suite</h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab(AppTab.LIVE_AUDIO)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
                ${activeTab === AppTab.LIVE_AUDIO 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
              `}
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Live</span>
            </button>
            <button
              onClick={() => setActiveTab(AppTab.IMAGE_EDITOR)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
                ${activeTab === AppTab.IMAGE_EDITOR 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
              `}
            >
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">Image</span>
            </button>
            <button
              onClick={() => setActiveTab(AppTab.SMART_CHAT)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
                ${activeTab === AppTab.SMART_CHAT 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
              `}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
