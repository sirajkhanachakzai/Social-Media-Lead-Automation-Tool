
import React, { useMemo } from 'react';
import { Lead, LeadStatus, Platform } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  leads: Lead[];
}

const Dashboard: React.FC<DashboardProps> = ({ leads }) => {
  const stats = useMemo(() => {
    const total = leads.length;
    const isNew = leads.filter(l => l.status === LeadStatus.NEW).length;
    const qualified = leads.filter(l => l.status === LeadStatus.QUALIFIED || l.status === LeadStatus.CLOSED).length;
    
    const platformData = [
      { name: 'Instagram', value: leads.filter(l => l.platform === Platform.INSTAGRAM).length },
      { name: 'Facebook', value: leads.filter(l => l.platform === Platform.FACEBOOK).length },
      { name: 'Other', value: leads.filter(l => l.platform === Platform.UNKNOWN).length },
    ];

    const weeklyData = [
      { day: 'Mon', leads: 4 },
      { day: 'Tue', leads: 7 },
      { day: 'Wed', leads: 5 },
      { day: 'Thu', leads: 8 },
      { day: 'Fri', leads: 12 },
      { day: 'Sat', leads: 9 },
      { day: 'Sun', leads: 6 },
    ];

    return { total, isNew, conversion: total > 0 ? (qualified / total) * 100 : 0, platformData, weeklyData };
  }, [leads]);

  const COLORS = ['#6366f1', '#3b82f6', '#94a3b8'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1">Total Leads</p>
          <h3 className="text-3xl font-bold text-slate-800">{stats.total}</h3>
          <p className="text-emerald-600 text-xs font-semibold mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            +12% from last month
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1">New Inquiries</p>
          <h3 className="text-3xl font-bold text-indigo-600">{stats.isNew}</h3>
          <p className="text-slate-400 text-xs font-semibold mt-2">Awaiting follow-up</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1">Conversion Rate</p>
          <h3 className="text-3xl font-bold text-slate-800">{stats.conversion.toFixed(1)}%</h3>
          <p className="text-indigo-600 text-xs font-semibold mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Optimal range
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-6">Lead Acquisition Trend</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-6">Platform Distribution</h4>
          <div className="h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-800">{stats.total}</span>
              <span className="text-xs text-slate-400">Total</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {stats.platformData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs font-medium text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
