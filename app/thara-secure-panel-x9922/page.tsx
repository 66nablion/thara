'use client';

import { useState } from 'react';
import { supabase } from '../supabase';

export default function SecureAdminPanel() {
  const [leads, setLeads] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'thara2026secure') {
      setAuthorized(true);
      fetchLeads();
    } else {
      alert('رمز المرور غير صحيح');
    }
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase.from('onboarding_leads').select('*').order('created_at', { ascending: false });
    if (!error && data) setLeads(data);
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full space-y-4">
          <h2 className="text-xl font-black text-fuchsia-400">Restricted Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter secure admin key..." 
            value={passcode} 
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-fuchsia-500"
          />
          <button type="submit" className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 py-3 rounded-xl font-bold text-sm">Access Panel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-black mb-6 text-fuchsia-400">لوحة تحكم ثارا السرية (Leads Dashboard)</h1>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-6">
          <div className="space-y-4">
            {leads.map((lead, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-white">{lead.full_name} - <span className="text-fuchsia-400">{lead.business_name}</span></h3>
                  <p className="text-xs text-slate-400 mt-1">الخدمات: {lead.service_needed}</p>
                  <p className="text-xs text-slate-500 mt-1">هاتف: {lead.phone} | إيميل: {lead.email}</p>
                </div>
                <div className="text-xs text-slate-400">{new Date(lead.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
