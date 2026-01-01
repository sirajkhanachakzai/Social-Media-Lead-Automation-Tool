
import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { generateFollowUpMessage } from '../services/geminiService';

interface FollowUpModalProps {
  lead: Lead;
  onClose: () => void;
  onSent: () => void;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({ lead, onClose, onSent }) => {
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const generateAIResponse = async () => {
    setIsGenerating(true);
    try {
      const draft = await generateFollowUpMessage(lead.name || lead.handle, lead.summary, lead.platform);
      setMessage(draft);
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateAIResponse();
  }, [lead]);

  const handleSend = () => {
    setIsSending(true);
    // Simulate API call to send message
    setTimeout(() => {
      setIsSending(false);
      onSent();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Draft AI Follow-up</h3>
              <p className="text-xs text-slate-500">Contacting {lead.name || lead.handle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Personalized Message</label>
              <button 
                onClick={generateAIResponse}
                disabled={isGenerating}
                className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Regenerate
              </button>
            </div>
            <div className="relative">
              {isGenerating && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10 rounded-2xl">
                  <div className="flex items-center gap-2 text-indigo-600 font-medium">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Thinking...
                  </div>
                </div>
              )}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-700 leading-relaxed"
              />
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-100">
            <p className="text-[10px] font-bold text-amber-800 uppercase mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Quick Tip
            </p>
            <p className="text-xs text-amber-700">Messages sent via this tool are tracked in your conversion stats. For {lead.platform} leads, we recommend keeping it brief and ending with a question.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || isGenerating || !message.trim()}
              className="flex-[2] py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Send Automation
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
