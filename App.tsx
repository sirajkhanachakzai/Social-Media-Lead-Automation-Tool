
import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, Platform } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadIngestion from './components/LeadIngestion';
import LeadTable from './components/LeadTable';

const App: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'capture'>('dashboard');

  // Load leads from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('social_leads');
    if (stored) {
      setLeads(JSON.parse(stored));
    } else {
      // Mock initial data
      const mock: Lead[] = [
        {
          id: '1',
          name: 'Sarah Jenkins',
          email: 'sarah.j@example.com',
          handle: '@sarahj_designs',
          platform: Platform.INSTAGRAM,
          interestLevel: 8,
          summary: 'Interested in bulk order of premium filters.',
          status: LeadStatus.NEW,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Mark Thompson',
          email: '',
          handle: 'MarkT_Official',
          platform: Platform.FACEBOOK,
          interestLevel: 5,
          summary: 'Asked about pricing for seasonal subscription.',
          status: LeadStatus.CONTACTED,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        }
      ];
      setLeads(mock);
      localStorage.setItem('social_leads', JSON.stringify(mock));
    }
  }, []);

  const handleAddLead = (newLead: Lead) => {
    const updated = [newLead, ...leads];
    setLeads(updated);
    localStorage.setItem('social_leads', JSON.stringify(updated));
    setActiveTab('leads');
  };

  const handleUpdateStatus = (id: string, status: LeadStatus) => {
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(updated);
    localStorage.setItem('social_leads', JSON.stringify(updated));
  };

  const handleDeleteLead = (id: string) => {
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    localStorage.setItem('social_leads', JSON.stringify(updated));
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {activeTab === 'dashboard' && 'Operations Dashboard'}
              {activeTab === 'leads' && 'Lead Management'}
              {activeTab === 'capture' && 'AI Lead Capture'}
            </h1>
            <p className="text-slate-500 text-sm">Welcome back to your command center.</p>
          </div>
          {activeTab !== 'capture' && (
            <button 
              onClick={() => setActiveTab('capture')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              Capture New Lead
            </button>
          )}
        </header>

        <div className="animate-in fade-in duration-500">
          {activeTab === 'dashboard' && <Dashboard leads={leads} />}
          {activeTab === 'leads' && (
            <LeadTable 
              leads={leads} 
              onUpdateStatus={handleUpdateStatus} 
              onDelete={handleDeleteLead}
            />
          )}
          {activeTab === 'capture' && <LeadIngestion onLeadCaptured={handleAddLead} />}
        </div>
      </main>
    </div>
  );
};

export default App;
