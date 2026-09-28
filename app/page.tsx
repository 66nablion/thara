'use client';

import { useState } from 'react';
import { supabase } from './supabase';

export default function Home() {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  
  // Multiple services selection state
  const [selectedServices, setSelectedServices] = useState<string[]>(['Online Ordering System']);
  
  const [socialLink, setSocialLink] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Question form states
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [qLoading, setQLoading] = useState(false);
  const [qMessage, setQMessage] = useState('');

  const toggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter(s => s !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  const t = {
    en: {
      brand: "THARA",
      tagline: "THARA × TECH SERVICES",
      subTagline: "Small Business Digital Growth, Systems & Content Agency",
      heroTitle: "We scale businesses through digital systems and high-end media.",
      heroDesc: "From custom websites and direct online ordering to professional video editing, content subscriptions, and data automation.",
      showcaseTitle: "Featured Showcase & Systems",
      showcaseSubtitle: "Matching visual examples of our high-impact systems and media production.",
      servicesTitle: "Our Comprehensive Services & Packages",
      servicesSubtitle: "Select one or multiple services tailored to your business needs.",
      packagesTitle: "Content & Video Editing Packages",
      packagesSubtitle: "Our classic subscription tiers for social media growth and raw footage editing.",
      p1Name: "Content Starter",
      p1Desc: "Basic video editing, hooks, and captions for weekly posting.",
      p2Name: "Content Growth",
      p2Desc: "Advanced editing, dynamic captions, and structured social media content.",
      p3Name: "Full Month Scale",
      p3Desc: "Complete monthly content production, strategy, and continuous editing.",
      formTitle: "Get Started / Request Solutions",
      formSubtitle: "Select your desired services below and fill in your details.",
      nameLabel: "Full Name",
      businessLabel: "Business Name",
      servicesLabel: "Select Services Needed (Multiple choice)",
      socialLabel: "Social Media / Website Link",
      phoneLabel: "Phone Number",
      emailLabel: "Email Address",
      submitBtn: "Submit Request",
      submitting: "Submitting...",
      successMsg: "Request submitted successfully! We will contact you shortly.",
      errorMsg: "Please select at least one service and fill in required fields.",
      qTitle: "Have a Question?",
      qSubtitle: "Send us a direct inquiry and our team will get back to you.",
      qName: "Your Name",
      qEmail: "Your Email",
      qText: "Your Question or Inquiry",
      qBtn: "Send Question",
      qSuccess: "Question sent successfully!"
    },
    ar: {
      brand: "THARA",
      tagline: "THARA × TECH SERVICES",
      subTagline: "وكالة النمو الرقمي، الأنظمة التقنية، وصناعة المحتوى للأنشطة التجارية",
      heroTitle: "نطور أعمالك عبر الأنظمة الرقمية الذكية والمحتوى الاحترافي.",
      heroDesc: "من المواقع الإلكترونية وطلب الطعام المباشر إلى مونتاج الفيديوهات، باقات المحتوى، وأتمتة بيانات العملاء.",
      showcaseTitle: "معرض الأعمال المرئية والأنظمة المطابقة",
      showcaseSubtitle: "نماذج حية ومرئية تمثل بدقة أنظمتنا التقنية وإنتاجنا الإعلامي.",
      servicesTitle: "خدماتنا وباقاتنا الشاملة",
      servicesSubtitle: "اختر خدمة واحدة أو عدة خدمات تناسب احتياجات نشاطك التجاري.",
      packagesTitle: "باقات المحتوى ومونتاج الفيديوهات",
      packagesSubtitle: "باقاتنا الكلاسيكية المعتمدة لنمو السوشيال ميديا وتعديل الفيديوهات الخام.",
      p1Name: "بداية المحتوى (Starter)",
      p1Desc: "مونتاج أساسي للفيديوهات، إضافة الـ Hooks والنصوص للنشر الأسبوعي.",
      p2Name: "نمو المحتوى (Growth)",
      p2Desc: "مونتاج متقدم، نصوص حركية ديناميكية، ومحتوى منظم لمنصات السوشيال ميديا.",
      p3Name: "الشهر الكامل (Full Month)",
      p3Desc: "إنتاج محتوى شهري متكامل، استراتيجية، ومونتاج مستمر طوال الشهر.",
      formTitle: "ابدأ معنا / اطلب خدماتك",
      formSubtitle: "اختر الخدمات المطلوبة أدناه واكتب بياناتك لنتواصل معك فوراً.",
      nameLabel: "الاسم الكامل",
      businessLabel: "اسم النشاط التجاري",
      servicesLabel: "اختر الخدمات المطلوبة (يمكن اختيار أكثر من خدمة)",
      socialLabel: "رابط السوشيال ميديا / الموقع",
      phoneLabel: "رقم الهاتف",
      emailLabel: "البريد الإلكتروني",
      submitBtn: "إرسال الطلب",
      submitting: "جاري الإرسال...",
      successMsg: "تم إرسال طلبك بنجاح! سنتواصل معك في أقرب وقت.",
      errorMsg: "الرجاء اختيار خدمة واحدة على الأقل وتعبئة الحقول المطلوبة.",
      qTitle: "لديك استفسار خاص؟",
      qSubtitle: "أرسل لنا استفسارك وسيقوم فريقنا بالرد عليك مباشرة.",
      qName: "اسمك الكريم",
      qEmail: "بريدك الإلكتروني",
      qText: "نص الاستفسار أو السؤال",
      qBtn: "إرسال الاستفسار",
      qSuccess: "تم إرسال استفسارك بنجاح!"
    }
  };

  const currentT = t[lang];

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !businessName || !email || !phone || selectedServices.length === 0) {
      setError(currentT.errorMsg);
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: dbError } = await supabase
        .from('onboarding_leads')
        .insert([
          {
            full_name: fullName,
            business_name: businessName,
            service_needed: selectedServices.join(', '),
            social_link: socialLink,
            phone: phone,
            email: email
          }
        ]);

      if (dbError) throw dbError;

      setMessage(currentT.successMsg);
      setFullName('');
      setBusinessName('');
      setSocialLink('');
      setPhone('');
      setEmail('');
      setSelectedServices(['Online Ordering System']);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorEmail || !questionText) return;

    setQLoading(true);
    setQMessage('');

    try {
      const { error: dbError } = await supabase
        .from('site_questions')
        .insert([
          {
            visitor_name: visitorName,
            visitor_email: visitorEmail,
            question_text: questionText
          }
        ]);

      if (dbError) throw dbError;

      setQMessage(currentT.qSuccess);
      setVisitorName('');
      setVisitorEmail('');
      setQuestionText('');
    } catch (err) {
      console.error(err);
    } finally {
      setQLoading(false);
    }
  };

  const servicesList = [
    { id: "Online Ordering System", nameAR: "نظام الطلب المباشر أونلاين (مطاعم)", nameEN: "Online Ordering System", icon: "🍔" },
    { id: "Customer Data & Feedback", nameAR: "نظام بيانات وآراء العملاء (ملابس وتجميل)", nameEN: "Customer Data & Feedback", icon: "📊" },
    { id: "Business Website", nameAR: "موقع أعمال احترافي متكامل", nameEN: "Professional Business Website", icon: "🌐" },
    { id: "Automation System", nameAR: "أتمتة العمليات وسير العمل", nameEN: "Automation & Workflows", icon: "⚡" },
    { id: "Content & Video Editing", nameAR: "مونتاج وإنتاج المحتوى والفيديوهات", nameEN: "Content & Video Editing", icon: "🎬" },
    { id: "Ongoing Maintenance", nameAR: "الصيانة والدعم الفني الشهري", nameEN: "Monthly Maintenance & Support", icon: "🛡️" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans selection:bg-fuchsia-500 selection:text-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Navigation Header (Admin link hidden for maximum security) */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-fuchsia-500/50 bg-black flex items-center justify-center shadow-lg shadow-fuchsia-900/20">
              <img src="/logo.jpg" alt="Thara Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-widest text-white">THARA</h1>
              <p className="text-[10px] text-fuchsia-400 font-semibold tracking-wider">TECH SERVICES</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-800 transition text-fuchsia-300"
            >
              {lang === 'en' ? 'العربية 🇸🇩' : 'English 🇬🇧'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-slate-950 to-fuchsia-950/30 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block bg-purple-900/40 border border-purple-500/30 text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-wide shadow-inner">
            {currentT.tagline} — {currentT.subTagline}
          </span>
          <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            {currentT.heroTitle}
          </h2>
          <p className="text-slate-400 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            {currentT.heroDesc}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact-form" className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-8 py-4 rounded-2xl font-bold transition shadow-lg shadow-fuchsia-600/30">
              {lang === 'ar' ? 'اطلب نظاماً أو خدمة' : 'Get Started Now'}
            </a>
            <a href="#showcase" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-8 py-4 rounded-2xl font-bold transition">
              {lang === 'ar' ? 'معرض الأعمال' : 'View Showcase'}
            </a>
          </div>
        </div>
      </section>

      {/* Media & Portfolio Showcase Section (Matching Exact Services) */}
      <section id="showcase" className="px-6 py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black tracking-tight mb-3 text-white">{currentT.showcaseTitle}</h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">{currentT.showcaseSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Direct Online Ordering", category: "Restaurants & Cafes", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80", tag: "System Demo" },
              { title: "Customer Data Dashboard", category: "Fashion & Retail", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80", tag: "Analytics" },
              { title: "Automated Booking Portal", category: "Beauty Salons & Spas", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80", tag: "Automation" },
              { title: "High-End Video Production", category: "Content & Media", image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80", tag: "Media House" },
              { title: "Custom E-Commerce Web App", category: "Web Architecture", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", tag: "Full-Stack" },
              { title: "Workflow Automations", category: "Operations & CRM", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", tag: "API & Backend" },
            ].map((item, idx) => (
              <div key={idx} className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl hover:border-fuchsia-500/50 transition duration-500">
                <div className="h-64 w-full overflow-hidden relative bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <span className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 bg-fuchsia-600/90 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                    {item.tag}
                  </span>
                </div>
                <div className="p-6 relative z-20 -mt-12">
                  <p className="text-fuchsia-400 text-xs font-semibold mb-1">{item.category}</p>
                  <h4 className="text-xl font-bold text-white group-hover:text-fuchsia-300 transition">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content & Video Editing Packages Section */}
      <section className="px-6 py-20 bg-slate-900/40 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black tracking-tight mb-3 text-white">{currentT.packagesTitle}</h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">{currentT.packagesSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: currentT.p1Name, desc: currentT.p1Desc, price: "£250 /mo", icon: "🎬" },
              { name: currentT.p2Name, desc: currentT.p2Desc, price: "£500 /mo", icon: "⚡" },
              { name: currentT.p3Name, desc: currentT.p3Desc, price: "£900 /mo", icon: "👑" },
            ].map((pkg, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-purple-500 p-8 rounded-3xl transition duration-300 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="text-3xl mb-4 bg-slate-950 w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-800">
                    {pkg.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-white">{pkg.name}</h4>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">{pkg.desc}</p>
                </div>
                <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                  <span className="text-2xl font-black text-fuchsia-400">{pkg.price}</span>
                  <a href="#contact-form" className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition">
                    {lang === 'ar' ? 'اختر الباقة' : 'Select'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Select Onboarding & Request Form Section */}
      <section id="contact-form" className="px-6 py-20">
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-black mb-2">{currentT.formTitle}</h3>
            <p className="text-slate-400 text-xs md:text-sm">{currentT.formSubtitle}</p>
          </div>

          {error && (
            <div className="bg-rose-950/60 border border-rose-500/50 text-rose-300 p-4 rounded-2xl text-xs mb-6 text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 p-4 rounded-2xl text-xs mb-6 text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleLeadSubmit} className="space-y-6 text-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-300">{currentT.nameLabel}</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-fuchsia-500 text-white"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-300">{currentT.businessLabel}</label>
                <input 
                  type="text" 
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-fuchsia-500 text-white"
                  placeholder="Café / Boutique Name"
                />
              </div>
            </div>

            {/* Multiple Services Selection Checkboxes */}
            <div>
              <label className="block text-xs font-semibold mb-3 text-slate-300">{currentT.servicesLabel}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map((srv) => {
                  const isSelected = selectedServices.includes(srv.id);
                  return (
                    <div 
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center space-x-3 rtl:space-x-reverse ${isSelected ? 'bg-fuchsia-950/40 border-fuchsia-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      <span className="text-xl">{srv.icon}</span>
                      <div className="text-xs font-semibold">
                        {lang === 'ar' ? srv.nameAR : srv.nameEN}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-300">{currentT.phoneLabel}</label>
                <input 
                  type="text" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-fuchsia-500 text-white"
                  placeholder="+44 20 1234 5678"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-300">{currentT.socialLabel}</label>
                <input 
                  type="text" 
                  value={socialLink}
                  onChange={(e) => setSocialLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-fuchsia-500 text-white"
                  placeholder="instagram.com/yourbusiness"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 text-slate-300">{currentT.emailLabel}</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-fuchsia-500 text-white"
                placeholder="owner@business.com"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 py-4 rounded-2xl font-bold transition text-sm text-white disabled:opacity-50 shadow-lg shadow-fuchsia-600/30"
            >
              {loading ? currentT.submitting : currentT.submitBtn}
            </button>
          </form>
        </div>
      </section>

      {/* Footer / Question Form (No admin link exposed) */}
      <footer className="border-t border-slate-800 bg-slate-950 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mb-12">
            <h4 className="text-xl font-bold mb-2">{currentT.qTitle}</h4>
            <p className="text-slate-400 text-xs mb-6">{currentT.qSubtitle}</p>
            
            {qMessage && (
              <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 p-3 rounded-xl text-xs mb-4">
                {qMessage}
              </div>
            )}

            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  required
                  placeholder={currentT.qName}
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-fuchsia-500 text-white"
                />
                <input 
                  type="email" 
                  required
                  placeholder={currentT.qEmail}
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-fuchsia-500 text-white"
                />
              </div>
              <textarea 
                required
                rows={3}
                placeholder={currentT.qText}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-fuchsia-500 text-white"
              />
              <button 
                type="submit"
                disabled={qLoading}
                className="bg-slate-800 hover:bg-slate-700 text-fuchsia-400 px-6 py-3 rounded-xl font-bold text-xs transition border border-slate-700"
              >
                {currentT.qBtn}
              </button>
            </form>
          </div>

          <div className="text-center text-slate-500 text-xs flex justify-center items-center">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="font-bold text-white tracking-widest">THARA</span>
              <span>× TECH SERVICES © 2026</span>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
