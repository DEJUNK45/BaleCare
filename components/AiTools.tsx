import React, { useState } from 'react';
import { Sparkles, Bot, ArrowRight, X, Loader2, Copy, Calendar } from 'lucide-react';
import { TranslationData, Language } from '../types';
import { generateGeminiContent } from '../services/geminiService';

interface AiToolsProps {
  t: TranslationData;
  lang: Language;
  onBookRecommended: (text: string) => void;
}

type AiMode = 'diagnose' | 'villa' | null;

const AiTools: React.FC<AiToolsProps> = ({ t, lang, onBookRecommended }) => {
  const [aiMode, setAiMode] = useState<AiMode>(null);
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleOpenAiTool = (mode: AiMode) => {
    setAiMode(mode);
    setAiInput('');
    setAiResult('');
  };

  const handleAiSubmit = async () => {
    if (!aiInput.trim()) return;

    setIsAiLoading(true);
    let prompt = "";
    const languageName = lang === 'id' ? "Indonesian" : "English";

    if (aiMode === 'diagnose') {
      prompt = `Act as an expert building contractor and handyman in Bali. 
      Analyze this property problem described by a user: "${aiInput}".
      Provide the answer in ${languageName}.
      Format the answer nicely with bold text for headers.
      Please provide:
      1. Possible Cause (Penyebab Kemungkinan)
      2. Urgency Level (Low/Medium/High)
      3. Recommended Service Category (choose from: AC Service, Pool Maintenance, Plumbing, Renovation, Cleaning, Garden)
      4. A brief DIY tip for temporary handling before the handyman arrives.`;
    } else {
      prompt = `Act as an expert Airbnb copywriter and real estate marketer in Bali.
      Write a catchy, attractive villa listing description based on these features: "${aiInput}".
      Write the response in ${languageName}.
      Include relevant emojis (🌴, ☀️, 🌊, etc).
      Include 3-5 relevant hashtags for Instagram at the end.`;
    }

    const result = await generateGeminiContent(prompt);
    setAiResult(result);
    setIsAiLoading(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(aiResult);
  };

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white py-12 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
          <Sparkles className="text-amber-500 fill-amber-500" />
          <h2 className="text-2xl font-bold text-gray-900">{t.aiSectionTitle}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Card 1: Diagnoser */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-teal-100 hover:shadow-lg transition flex items-start gap-4 cursor-pointer" onClick={() => handleOpenAiTool('diagnose')}>
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {t.aiDiagnoseTitle} <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">New</span>
              </h3>
              <p className="text-gray-500 text-sm mt-1">{t.aiDiagnoseDesc}</p>
            </div>
            <ArrowRight className="ml-auto text-gray-300 self-center" />
          </div>

          {/* AI Card 2: Villa Description */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-teal-100 hover:shadow-lg transition flex items-start gap-4 cursor-pointer" onClick={() => handleOpenAiTool('villa')}>
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {t.aiVillaTitle} <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">Beta</span>
              </h3>
              <p className="text-gray-500 text-sm mt-1">{t.aiVillaDesc}</p>
            </div>
            <ArrowRight className="ml-auto text-gray-300 self-center" />
          </div>
        </div>
      </div>

      {/* --- AI Tool Modal --- */}
      {aiMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up flex flex-col">

            {/* AI Modal Header */}
            <div className={`p-6 border-b flex justify-between items-center ${aiMode === 'diagnose' ? 'bg-blue-50' : 'bg-purple-50'} rounded-t-2xl`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg text-white ${aiMode === 'diagnose' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                  {aiMode === 'diagnose' ? <Bot size={24} /> : <Sparkles size={24} />}
                </div>
                <h3 className="font-bold text-xl text-gray-900">
                  {aiMode === 'diagnose' ? t.aiModalDiagnoseTitle : t.aiModalVillaTitle}
                </h3>
              </div>
              <button onClick={() => setAiMode(null)} className="p-2 hover:bg-black/5 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {!aiResult ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {aiMode === 'diagnose'
                      ? "Ceritakan masalah rumah Anda:"
                      : "Sebutkan fitur-fitur Villa Anda:"}
                  </label>
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none min-h-[150px] text-gray-700"
                    placeholder={aiMode === 'diagnose' ? t.aiInputPlaceholder : t.aiVillaPlaceholder}
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleAiSubmit}
                      disabled={isAiLoading || !aiInput.trim()}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition shadow-lg 
                        ${aiMode === 'diagnose' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}
                        ${(isAiLoading || !aiInput.trim()) ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {isAiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                      {isAiLoading ? t.loading : (aiMode === 'diagnose' ? t.analyzeButton : t.generateButton)}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-500" /> {t.aiResultLabel}
                    </h4>
                    <div className="flex gap-2">
                      <button onClick={() => setAiResult('')} className="text-sm text-gray-500 hover:text-gray-900 underline">
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {aiResult}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleCopyText}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <Copy size={18} /> {t.copyText}
                    </button>
                    {aiMode === 'diagnose' && (
                      <button
                        onClick={() => {
                          onBookRecommended(`[AI Diagnosed]: ${aiInput}`);
                          setAiMode(null);
                        }}
                        className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
                      >
                        <Calendar size={18} /> {t.bookRecommended}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer Footer */}
            <div className="p-4 bg-gray-50 border-t text-center text-xs text-gray-400 rounded-b-2xl">
              Powered by Google Gemini AI. Hasil mungkin bervariasi. Selalu konsultasikan dengan ahli fisik.
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AiTools;