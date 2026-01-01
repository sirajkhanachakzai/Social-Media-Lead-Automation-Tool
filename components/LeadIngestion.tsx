
import React, { useState } from 'react';
import { Lead, LeadStatus, Platform } from '../types';
import { extractLeadFromText } from '../services/geminiService';

interface LeadIngestionProps {
  onLeadCaptured: (lead: Lead) => void;
}

const LeadIngestion: React.FC<LeadIngestionProps> = ({ onLeadCaptured }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await extractLeadFromText(inputText);
      const newLead: Lead = {
        id: Math.random().toString(36).substr(2, 9),
        name: result.name,
        email: result.email,
        handle: result.handle,
        platform: result.platform as Platform,
        interestLevel: result.interestLevel,
        summary: result.summary,
        status: LeadStatus.NEW,
        createdAt: new Date().toISOString(),
      };
      
      onLeadCaptured(newLead);
      setInputText('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong while processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const examples = [
    "Instagram Comment: @sarah_designs: Hey I love these! Do you do bulk orders for small businesses? My email is hello@sarah.com",
    "Facebook Message: Mark Thompson: Interested in your monthly plan. Is there a discount for annual billing?",
    "DM: @johndoe_99: Pricing please! Saw your reel about the premium filters."
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Smart Ingestion</h2>
            <p className="text-slate-500 text-sm">Paste a comment or message to extract lead data automatically.</p>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw social media text here..."
            className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-slate-800"
          />
          
          {error && <p className="text-rose-500 text-xs font-medium px-2">{error}</p>}
          
          <button
            onClick={handleProcess}
            disabled={isProcessing || !inputText.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-indigo-200 ${
              isProcessing || !inputText.trim() 
              ? 'bg-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing with Gemini...
              </span>
            ) : 'Extract Structured Lead'}
          </button>
        </div>

        <div className="mt-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Try these examples</p>
          <div className="space-y-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setInputText(ex)}
                className="w-full text-left p-3 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-dashed border-slate-200 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadIngestion;
