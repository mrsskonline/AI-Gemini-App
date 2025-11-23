import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';

export const SmartChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: "Hello! I'm Gemini 2.5. I can help you with writing, analysis, coding, and more. How can I help you today?",
      timestamp: Date.now()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Convert internal messages format to API format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await GeminiService.chat(history, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an error processing your request.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto border-x border-slate-800 bg-slate-900/50">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="p-2 rounded-lg bg-indigo-500/10">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">Smart Assistant</h3>
          <p className="text-xs text-slate-500">Gemini 2.5 Flash</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === 'model' ? 'bg-indigo-600' : 'bg-slate-700'}
            `}>
              {msg.role === 'model' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
            </div>
            
            <div className={`
              max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
               <Bot className="w-5 h-5 text-white" />
             </div>
             <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 border border-slate-700 flex items-center gap-2">
               <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
               <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100" />
               <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200" />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Gemini anything..."
            className="w-full bg-slate-800 border-none rounded-xl pl-4 pr-12 py-4 text-slate-200 focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
