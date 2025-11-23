import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { fileToBase64, base64ToDataUrl } from '../utils/audioUtils';
import { Upload, Wand2, Image as ImageIcon, Download, RefreshCw, XCircle, AlertCircle } from 'lucide-react';

export const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setOriginalImage(base64);
        setEditedImage(null);
        setError(null);
      } catch (err) {
        setError("Failed to read file.");
      }
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const resultBase64 = await GeminiService.editImage(originalImage, prompt);
      setEditedImage(resultBase64);
    } catch (err: any) {
      setError(err.message || "Failed to edit image. Try a different prompt.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setPrompt('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 md:p-8 gap-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Gemini Image Editor
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Upload an image and use natural language to transform it. <br/>
          <span className="text-xs text-slate-500">Powered by Gemini 2.5 Flash Image</span>
        </p>
      </div>

      {!originalImage ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/50 hover:bg-slate-800/80 hover:border-blue-500/50 transition-all cursor-pointer group min-h-[400px]"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="p-6 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors mb-4">
            <Upload className="w-10 h-10 text-blue-400" />
          </div>
          <p className="text-xl font-medium text-slate-200">Click to upload an image</p>
          <p className="text-sm text-slate-500 mt-2">Supports JPG, PNG</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-6">
          {/* Controls */}
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., 'Add a cyberpunk neon filter', 'Make it a sketch'"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              />
              <Wand2 className="absolute right-3 top-3.5 w-5 h-5 text-slate-500" />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleEdit}
                disabled={loading || !prompt.trim()}
                className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-white shadow-lg shadow-blue-900/20"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                <span>Generate</span>
              </button>
              
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 transition-colors"
                title="Start Over"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Preview Area */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
            {/* Original */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
                <ImageIcon className="w-4 h-4" /> Original
              </div>
              <div className="relative flex-1 bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-700/50 flex items-center justify-center p-2">
                <img 
                  src={base64ToDataUrl(originalImage, 'image/jpeg')} 
                  alt="Original" 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                />
              </div>
            </div>

            {/* Edited */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-slate-400 text-sm font-medium uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4" /> Result
                </div>
                {editedImage && (
                  <a 
                    href={base64ToDataUrl(editedImage, 'image/jpeg')} 
                    download="gemini-edit.jpg"
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Save
                  </a>
                )}
              </div>
              <div className={`relative flex-1 bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-700/50 flex items-center justify-center p-2 ${loading ? 'animate-pulse' : ''}`}>
                {editedImage ? (
                  <img 
                    src={base64ToDataUrl(editedImage, 'image/jpeg')} 
                    alt="Edited" 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                  />
                ) : (
                  <div className="text-slate-600 flex flex-col items-center gap-2">
                    {loading ? (
                      <>
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-sm">Gemini is creating...</p>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-8 h-8 opacity-20" />
                        <p className="text-sm">Result will appear here</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
