
import React, { useState } from 'react';
import { Lead, LeadStatus, Platform } from '../types';
import FollowUpModal from './FollowUpModal';

interface LeadTableProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onUpdateStatus, onDelete }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-indigo-100 text-indigo-700';
      case LeadStatus.CONTACTED: return 'bg-amber-100 text-amber-700';
      case LeadStatus.QUALIFIED: return 'bg-emerald-100 text-emerald-700';
      case LeadStatus.CLOSED: return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case Platform.INSTAGRAM: return (
        <span className="w-5 h-5 flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded text-white text-[10px] font-bold">IG</span>
      );
      case Platform.FACEBOOK: return (
        <span className="w-5 h-5 flex items-center justify-center bg-blue-600 rounded text-white text-[10px] font-bold">FB</span>
      );
      default: return (
        <span className="w-5 h-5 flex items-center justify-center bg-slate-400 rounded text-white text-[10px] font-bold">?</span>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Info</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Interest Level</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No leads found yet. Try capturing some!</td>
              </tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">{getPlatformIcon(lead.platform)}</div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{lead.name || lead.handle}</p>
                      <p className="text-xs text-slate-500">{lead.handle}</p>
                      {lead.email && <p className="text-xs text-indigo-600 mt-1">{lead.email}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${lead.interestLevel > 7 ? 'bg-emerald-500' : lead.interestLevel > 4 ? 'bg-amber-400' : 'bg-rose-400'}`}
                        style={{ width: `${lead.interestLevel * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{lead.interestLevel}/10</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">"{lead.summary}"</p>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={lead.status}
                    onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border-none outline-none appearance-none cursor-pointer ${getStatusColor(lead.status)}`}
                  >
                    {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => setSelectedLead(lead)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    AI Follow-up
                  </button>
                  <button 
                    onClick={() => onDelete(lead.id)}
                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLead && (
        <FollowUpModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
          onSent={() => {
            onUpdateStatus(selectedLead.id, LeadStatus.CONTACTED);
            setSelectedLead(null);
          }}
        />
      )}
    </div>
  );
};

export default LeadTable;
