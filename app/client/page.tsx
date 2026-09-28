'use client';

import { useState } from 'react';
import { supabase } from '../supabase';

export default function ClientPortal() {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const t = {
    en: {
      brand: "A.K COMPANY",
      title: "Client Footage Portal",
      subtitle: "Secure upload portal exclusively for active subscribers.",
      emailLabel: "Your Registered Email",
      verifyBtn: "Verify Email",
      verifying: "Checking subscription...",
      fileLabel: "Select Raw Video / File",
      uploadBtn: "Upload File",
      uploading: "Uploading to storage...",
      success: "File uploaded successfully! Our team will review it shortly.",
      errorNotSubscribed: "Access denied. This email is not registered as an active subscriber.",
      errorFill: "Please enter your email and select a file.",
      errorUpload: "Upload failed. Please try again."
    },
    ar: {
      brand: "A.K COMPANY",
      title: "بوابة رفع ملفات العملاء",
      subtitle: "بوابة رفع آمنة ومخصصة حصرياً للمشتركين النشطين لدينا.",
      emailLabel: "بريدك الإلكتروني المشترك",
      verifyBtn: "تحقق من الاشتراك",
      verifying: "جاري التحقق من قاعدة البيانات...",
      fileLabel: "اختر الفيديو الخام أو الملف",
      uploadBtn: "رفع الملف الآن",
      uploading: "جاري الرفع إلى التخزين السحابي...",
      success: "تم رفع الملف بنجاح! سيقوم فريقنا بمراجعته قريباً.",
      errorNotSubscribed: "عذراً، هذا البريد الإلكتروني غير مسجل كـ مشترك نشط معنا.",
      errorFill: "الرجاء إدخال البريد الإلكتروني واختيار ملف أولاً.",
      errorUpload: "فشل الرفع، يرجى المحاولة مرة أخرى."
    }
  };

  const currentT = t[lang];

  // 1. Verify if email exists in database (Whitelist check)
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(currentT.errorFill);
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data, error: dbError } = await supabase
        .from('onboarding_leads')
        .select('*')
        .eq('email', email)
        .single();

      if (dbError || !data) {
        setError(currentT.errorNotSubscribed);
        setIsVerified(false);
      } else {
        setIsVerified(true);
        setMessage(lang === 'ar' ? 'تم التحقق بنجاح! يمكنك الآن رفع ملفاتك.' : 'Verified successfully! You can now upload your files.');
      }
    } catch (err) {
      setError(currentT.errorNotSubscribed);
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle File Upload to Supabase Storage & Database
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError(currentT.errorFill);
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const fileExt = file.name.split('.').pop();
      const randomString = Math.random().toString(36).substring(2);
      const fileName = `${randomString}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to bucket 'client-footage'
      const { error: storageError } = await supabase.storage
        .from('client-footage')
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data: publicURLData } = supabase.storage
        .from('client-footage')
        .getPublicUrl(filePath);

      const fileUrl = publicURLData.publicUrl;

      // Save record in 'client_uploads' table
      const { error: dbError } = await supabase
        .from('client_uploads')
        .insert([
          {
            client_email: email,
            file_name: file.name,
            file_url: fileUrl,
          },
        ]);

      if (dbError) throw dbError;

      setMessage(currentT.success);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(currentT.errorUpload);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center p-6 selection:bg-amber-500 selection:text-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-lg w-full shadow-2xl relative">
        
        {/* Language Switcher */}
        <div className="absolute top-6 left-6 rtl:left-auto rtl:right-6">
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-slate-700 transition"
          >
            {lang === 'en' ? 'العربية 🇸🇩' : 'English 🇬🇧'}
          </button>
        </div>

        <div className="text-center mb-8 mt-4 flex flex-col items-center">
          {/* Logo */}
          <div className="w-14 h-14 rounded-full overflow-hidden border border-amber-500/50 bg-black flex items-center justify-center shadow-lg mb-3">
            <img src="/logo.jpg" alt="A.K Company Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-widest text-white mb-1">A.K <span className="text-amber-400">COMPANY</span></h1>
          <h2 className="text-md font-bold text-slate-200 mb-1">{currentT.title}</h2>
          <p className="text-slate-400 text-xs">{currentT.subtitle}</p>
        </div>

        {error && (
          <div className="bg-rose-950/60 border border-rose-500/50 text-rose-300 p-3 rounded-xl text-xs mb-4 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 p-3 rounded-xl text-xs mb-4 text-center">
            {message}
          </div>
        )}

        {!isVerified ? (
          /* Step 1: Email Verification Form */
          <form onSubmit={handleVerifyEmail} className="space-y-5 text-start">
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-300">{currentT.emailLabel}</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white"
                placeholder="subscriber@business.com"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 py-3 rounded-xl font-medium transition text-sm text-white disabled:opacity-50"
            >
              {loading ? currentT.verifying : currentT.verifyBtn}
            </button>
          </form>
        ) : (
          /* Step 2: File Upload Form (Only shown if verified) */
          <form onSubmit={handleUpload} className="space-y-5 text-start">
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-400 flex justify-between items-center">
              <span>Verified: <strong className="text-amber-400">{email}</strong></span>
              <button 
                type="button" 
                onClick={() => { setIsVerified(false); setFile(null); setMessage(''); }}
                className="text-rose-400 hover:underline text-xs"
              >
                Change
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-slate-300">{currentT.fileLabel}</label>
              <input 
                type="file" 
                required
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-500 cursor-pointer"
              />
            </div>

            <button 
              type="submit"
              disabled={uploading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-medium transition text-sm text-white disabled:opacity-50"
            >
              {uploading ? currentT.uploading : currentT.uploadBtn}
            </button>
          </form>
        )}

      </div>
    </main>
  );
}
