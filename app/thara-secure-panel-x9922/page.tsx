'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function AdminDashboard() {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard data states
  const [leads, setLeads] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [uploads, setUploads] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'questions' | 'uploads'>('leads');

  const t = {
    en: {
      brand: "A.K COMPANY",
      loginTitle: "A.K ADMIN PANEL",
      loginSubtitle: "Secure administration portal. Authorized personnel only.",
      emailLabel: "Admin Email",
      passwordLabel: "Password",
      loginBtn: "Access Dashboard",
      loginLoading: "Verifying...",
      loginErrorText: "Login failed: Check your email or password.",
      loggedInAs: "Logged in as:",
      logout: "Logout",
      tabLeads: "Onboarding Leads",
      tabQuestions: "Custom Questions",
      tabUploads: "Client Uploads",
      leadsTitle: "New Subscriber Leads",
      questionsTitle: "Visitor Questions & Inquiries",
      uploadsTitle: "Client Raw Footage & Files",
      noLeads: "No subscriptions recorded yet.",
      noQuestions: "No questions sent yet.",
      noUploads: "No files uploaded by clients yet.",
      thFullName: "Full Name",
      thBusiness: "Business Name",
      thServiceNeeded: "Service / Problem",
      thSocial: "Social / Website",
      thPhone: "Phone",
      thEmail: "Email",
      thDate: "Date",
      thVisitorName: "Visitor Name",
      thQuestion: "Question Text",
      thFileName: "File Name",
      thActions: "Actions",
      viewBtn: "View / Open",
      downloadBtn: "Download",
      loadingAuth: "Checking permissions..."
    },
    ar: {
      brand: "A.K COMPANY",
      loginTitle: "لوحة تحكم A.K COMPANY",
      loginSubtitle: "بوابة الإدارة الآمنة. مخصصة للمصرح لهم فقط.",
      emailLabel: "البريد الإلكتروني للإدارة",
      passwordLabel: "كلمة المرور",
      loginBtn: "دخول اللوحة",
      loginLoading: "جاري التحقق...",
      loginErrorText: "فشل تسجيل الدخول: تأكد من البريد أو كلمة المرور.",
      loggedInAs: "مسجل دخول كـ:",
      logout: "تسجيل الخروج",
      tabLeads: "الاشتراكات والعملاء",
      tabQuestions: "الاستفسارات المختلفة",
      tabUploads: "ملفات العملاء المرفوعة",
      leadsTitle: "بيانات المشتركين الجدد والخدمات المطلوبة",
      questionsTitle: "استفسارات الزوار المختلفة",
      uploadsTitle: "ملفات وفيديوهات العملاء الخام (Raw Footage)",
      noLeads: "لا توجد اشتراكات مسجلة حتى الآن.",
      noQuestions: "لا توجد أسئلة مرسلة حتى الآن.",
      noUploads: "لم يقم أي عميل برفع ملفات بعد.",
      thFullName: "الاسم الكامل",
      thBusiness: "النشاط التجاري",
      thServiceNeeded: "الخدمة أو المشكلة المطلوبة",
      thSocial: "السوشيال / الموقع",
      thPhone: "الهاتف",
      thEmail: "البريد الإلكتروني",
      thDate: "التاريخ",
      thVisitorName: "اسم الزائر",
      thQuestion: "نص الاستفسار",
      thFileName: "اسم الملف",
      thActions: "الإجراءات",
      viewBtn: "مشاهدة / فتح",
      downloadBtn: "تحميل",
      loadingAuth: "جاري التحقق من الصلاحيات..."
    }
  };

  const currentT = t[lang];

  // Check if admin is already logged in
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAdminData();
      }
      setLoadingAuth(false);
    }
    checkUser();
  }, []);

  const fetchAdminData = async () => {
    const { data: leadsData } = await supabase
      .from('onboarding_leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (leadsData) setLeads(leadsData);

    const { data: qData } = await supabase
      .from('site_questions')
      .select('*')
      .order('created_at', { ascending: false });
    if (qData) setQuestions(qData);

    const { data: upData } = await supabase
      .from('client_uploads')
      .select('*')
      .order('created_at', { ascending: false });
    if (upData) setUploads(upData);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoginLoading(false);

    if (error) {
      setLoginError(currentT.loginErrorText);
    } else {
      setUser(data.user);
      fetchAdminData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-amber-400 animate-pulse">{currentT.loadingAuth}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 font-sans selection:bg-amber-500 selection:text-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl relative">
          {/* Language Switcher Button */}
          <div className="absolute top-6 left-6 rtl:left-auto rtl:right-6">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-slate-700 transition text-white"
            >
              {lang === 'en' ? 'العربية 🇸🇩' : 'English 🇬🇧'}
            </button>
          </div>

          <div className="text-center mb-8 mt-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-amber-500/50 bg-black flex items-center justify-center shadow-lg mb-3">
              <img src="/logo.jpg" alt="A.K Company Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-widest text-white mb-1">A.K <span className="text-amber-400">COMPANY</span></h1>
            <p className="text-slate-400 text-xs">{currentT.loginSubtitle}</p>
          </div>

          {loginError && (
            <div className="bg-rose-950/60 border border-rose-500/50 text-rose-300 p-3 rounded-xl text-xs mb-4 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-300">{currentT.emailLabel}</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white" 
                placeholder="admin@akcompany.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-300">{currentT.passwordLabel}</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white" 
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full bg-amber-600 hover:bg-amber-500 py-3 rounded-xl font-medium transition text-sm text-white disabled:opacity-50 mt-2"
            >
              {loginLoading ? currentT.loginLoading : currentT.loginBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 md:p-12 selection:bg-amber-500 selection:text-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-500/50 bg-black flex items-center justify-center shadow-lg">
              <img src="/logo.jpg" alt="A.K Company Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wider text-white">A.K <span className="text-amber-400">COMPANY</span></h1>
              <p className="text-xs text-slate-400 mt-1">{currentT.loggedInAs} <strong className="text-slate-200">{user.email}</strong></p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-800 transition text-white"
            >
              {lang === 'en' ? 'العربية 🇸🇩' : 'English 🇬🇧'}
            </button>
            <button 
              onClick={handleLogout}
              className="bg-rose-600/20 border border-rose-500/40 text-rose-300 px-4 py-2 rounded-xl text-xs font-medium hover:bg-rose-600/30 transition"
            >
              {currentT.logout}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-800 pb-4 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${activeTab === 'leads' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            {currentT.tabLeads} ({leads.length})
          </button>
          <button 
            onClick={() => setActiveTab('questions')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${activeTab === 'questions' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            {currentT.tabQuestions} ({questions.length})
          </button>
          <button 
            onClick={() => setActiveTab('uploads')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${activeTab === 'uploads' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            {currentT.tabUploads} ({uploads.length})
          </button>
        </div>

        {/* Tab 1: Onboarding Leads */}
        {activeTab === 'leads' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-bold">{currentT.leadsTitle}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-4">{currentT.thFullName}</th>
                    <th className="p-4">{currentT.thBusiness}</th>
                    <th className="p-4">{currentT.thServiceNeeded}</th>
                    <th className="p-4">{currentT.thSocial}</th>
                    <th className="p-4">{currentT.thPhone}</th>
                    <th className="p-4">{currentT.thEmail}</th>
                    <th className="p-4">{currentT.thDate}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leads.length === 0 ? (
                    <tr><td colSpan={7} className="p-6 text-center text-slate-500">{currentT.noLeads}</td></tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-4 font-semibold">{lead.full_name}</td>
                        <td className="p-4 text-slate-300">{lead.business_name}</td>
                        <td className="p-4 text-amber-300 max-w-xs">{lead.service_needed || '—'}</td>
                        <td className="p-4 text-amber-400 underline truncate max-w-xs"><a href={lead.social_link} target="_blank" rel="noreferrer">{lead.social_link}</a></td>
                        <td className="p-4 text-slate-300">{lead.phone}</td>
                        <td className="p-4 text-slate-300">{lead.email}</td>
                        <td className="p-4 text-slate-500 text-xs">{new Date(lead.created_at).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Site Questions */}
        {activeTab === 'questions' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-bold">{currentT.questionsTitle}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-4">{currentT.thVisitorName}</th>
                    <th className="p-4">{currentT.thEmail}</th>
                    <th className="p-4">{currentT.thQuestion}</th>
                    <th className="p-4">{currentT.thDate}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {questions.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-slate-500">{currentT.noQuestions}</td></tr>
                  ) : (
                    questions.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-4 font-semibold">{q.visitor_name}</td>
                        <td className="p-4 text-slate-300">{q.visitor_email}</td>
                        <td className="p-4 text-slate-200 max-w-md leading-relaxed">{q.question_text}</td>
                        <td className="p-4 text-slate-500 text-xs">{new Date(q.created_at).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Client Uploads */}
        {activeTab === 'uploads' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-bold">{currentT.uploadsTitle}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-4">{currentT.thEmail}</th>
                    <th className="p-4">{currentT.thFileName}</th>
                    <th className="p-4">{currentT.thDate}</th>
                    <th className="p-4 text-center">{currentT.thActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {uploads.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-slate-500">{currentT.noUploads}</td></tr>
                  ) : (
                    uploads.map((up) => (
                      <tr key={up.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-4 font-semibold text-amber-400">{up.client_email}</td>
                        <td className="p-4 text-slate-300">{up.file_name || 'Attached File'}</td>
                        <td className="p-4 text-slate-500 text-xs">{new Date(up.created_at).toLocaleString()}</td>
                        <td className="p-4 text-center space-x-2 rtl:space-x-reverse">
                          <a 
                            href={up.file_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition inline-block"
                          >
                            {currentT.viewBtn}
                          </a>
                          <a 
                            href={up.file_url} 
                            download 
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition inline-block border border-slate-700"
                          >
                            {currentT.downloadBtn}
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
