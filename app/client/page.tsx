'use client';

import { useState } from 'react';
import { supabase } from '../supabase';

export default function ClientPortal() {
  const [email, setEmail] = useState('');
  const [clientData, setClientData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase
        .from('onboarding_leads')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setClientData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans p-6 md:p-12" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-8">
          <div className="w-10 h-10 rounded-full bg-black border border-fuchsia-500/50 flex items-center justify-center">
            <span className="text-fuchsia-400 font-black text-sm">T</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-widest text-white">THARA</h1>
            <p className="text-[9px] text-fuchsia-400 font-semibold tracking-wider">CLIENT PORTAL</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl mb-8">
          <h2 className="text-2xl font-black mb-2 text-white">بوابة متابعة طلبات العملاء</h2>
          <p className="text-slate-400 text-xs md:text-sm mb-6">أدخل بريدك الإلكتروني المسجل معنا لمتابعة حالة مشروعك والخدمات المطلوبة.</p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="أدخل بريدك الإلكتروني..." 
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-fuchsia-500"
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg shadow-fuchsia-600/30 hover:opacity-90 transition"
            >
              {loading ? 'جاري البحث...' : 'استعلام عن الطلب'}
            </button>
          </form>
        </div>

        {searched && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-fuchsia-400">نتائج البحث والطلبات:</h3>
            {clientData.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center text-slate-400 text-sm">
                لم يتم العثور على طلبات مرتبطة بهذا البريد الإلكتروني.
              </div>
            ) : (
              clientData.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-base text-white">{item.business_name}</h4>
                    <p className="text-xs text-slate-400 mt-1">الخدمات المختارة: <span className="text-fuchsia-300 font-semibold">{item.service_needed}</span></p>
                    <p className="text-xs text-slate-500 mt-1">تاريخ الطلب: {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-fuchsia-950/60 border border-fuchsia-500/40 text-fuchsia-300 px-4 py-2 rounded-xl text-xs font-bold">
                    قيد المعالجة والتنفيذ 🚀
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
