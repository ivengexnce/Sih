"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "en" | "hi" | "bn" | "or";

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  native: string;
  flag: string;
  desc: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧", desc: "National Statutory Scope" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳", desc: "Coal Belt (SECL, BCCL, CCL, NCL, WCL)" },
  { code: "bn", label: "Bengali", native: "বাংলা", flag: "🇮🇳", desc: "Eastern Coalfields (ECL, Raniganj)" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", flag: "🇮🇳", desc: "Mahanadi Coalfields (MCL, Talcher)" }
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav
    "nav.dashboard": "Dashboard",
    "nav.mines": "Collieries & Mines",
    "nav.inspections": "Inspections",
    "nav.violations": "Violations",
    "nav.actions": "Action Items",
    "nav.compliance": "Compliance & CMR",
    "nav.reports": "Reports",
    "nav.gis": "GIS Mine Map",
    "nav.ai": "AI Risk Analytics",
    "nav.ocr": "OCR Digitizer",
    "nav.documents": "Documents",
    "nav.equipment": "Equipment Fleet",
    "nav.team": "Personnel & Crew",
    "nav.assignment": "Manager Assignment",
    "nav.settings": "Settings",
    "nav.logout": "Sign Out",

    // Common Buttons
    "btn.log_violation": "Log Violation",
    "btn.add_action": "Add Action",
    "btn.generate_report": "Generate Report",
    "btn.upload_document": "Upload Document",
    "btn.add_equipment": "Add Equipment",
    "btn.save_changes": "Save Changes",
    "btn.conduct_inspection": "Conduct Inspection",
    "btn.download": "Download",
    "btn.cancel": "Cancel",
    "btn.submit": "Submit",
    "btn.search": "Search...",
    "btn.filter": "Filter",

    // Headers & Titles
    "title.command_desk": "Colliery Command Desk",
    "title.scada_active": "SCADA Tele-Monitoring Active",
    "title.open_violations": "Open Violations",
    "title.corrective_actions": "Corrective Actions",
    "title.completed_audits": "Completed Audits",
    "title.compliance_score": "Compliance Score",
    "title.telemetry_trip": "Continuous Tele-Monitoring Trip Limits",
    "title.settings": "Portal Settings & Colliery Profile",

    // Statuses
    "status.high": "High",
    "status.medium": "Medium",
    "status.low": "Low",
    "status.open": "Open",
    "status.in_progress": "In Progress",
    "status.resolved": "Resolved",
    "status.operational": "Operational",
    "status.maintenance": "Maintenance",
    "status.compliant": "Compliant",
    "status.non_compliant": "Non-Compliant",
  },
  hi: {
    // Nav
    "nav.dashboard": "डैशबोर्ड (मुख्य पृष्ठ)",
    "nav.mines": "खदान एवं कोलियरी",
    "nav.inspections": "सुरक्षा निरीक्षण",
    "nav.violations": "उल्लंघन एवं खतरे",
    "nav.actions": "सुधारात्मक कार्य",
    "nav.compliance": "अनुपालन एवं सीएमआर",
    "nav.reports": "सांविधिक रिपोर्ट",
    "nav.gis": "जीआईएस खदान मानचित्र",
    "nav.ai": "एआई जोखिम विश्लेषण",
    "nav.ocr": "ओसीआर डिजिटाइज़र",
    "nav.documents": "दस्तावेज़ भंडार",
    "nav.equipment": "उपकरण एवं भारी मशीनरी",
    "nav.team": "अधिकारी एवं खनन दल",
    "nav.assignment": "प्रबंधक आवंटन",
    "nav.settings": "सेटिंग्स एवं प्रोफाइल",
    "nav.logout": "लॉग आउट",

    // Common Buttons
    "btn.log_violation": "+ उल्लंघन दर्ज करें",
    "btn.add_action": "+ कार्य जोड़ें",
    "btn.generate_report": "+ रिपोर्ट तैयार करें",
    "btn.upload_document": "+ दस्तावेज़ अपलोड करें",
    "btn.add_equipment": "+ मशीनरी पंजीकृत करें",
    "btn.save_changes": "परिवर्तन सहेजें",
    "btn.conduct_inspection": "नया निरीक्षण करें",
    "btn.download": "डाउनलोड करें",
    "btn.cancel": "रद्द करें",
    "btn.submit": "जमा करें",
    "btn.search": "खोजें...",
    "btn.filter": "फ़िल्टर",

    // Headers & Titles
    "title.command_desk": "कोलियरी सुरक्षा नियंत्रण केंद्र",
    "title.scada_active": "स्काडा गैस टेली-मॉनिटरिंग सक्रिय",
    "title.open_violations": "सक्रिय उल्लंघन",
    "title.corrective_actions": "सुधारात्मक कार्य",
    "title.completed_audits": "पूर्ण किए गए ऑडिट",
    "title.compliance_score": "अनुपालन दर",
    "title.telemetry_trip": "गैस टेली-मॉनिटरिंग ट्रिप सीमाएँ (सीएमआर 153)",
    "title.settings": "पोर्टल सेटिंग्स एवं कोलियरी विन्यास",

    // Statuses
    "status.high": "अत्यधिक गंभीर",
    "status.medium": "मध्यम",
    "status.low": "कम जोखिम",
    "status.open": "खुला है",
    "status.in_progress": "प्रगति पर है",
    "status.resolved": "हल हो चुका है",
    "status.operational": "चालू हालत में",
    "status.maintenance": "रखरखाव में",
    "status.compliant": "अनुपालित",
    "status.non_compliant": "गैर-अनुपालित",
  },
  bn: {
    // Nav
    "nav.dashboard": "ড্যাশবোর্ড (প্রধান পাতা)",
    "nav.mines": "খনি ও কোলিয়ারি",
    "nav.inspections": "নিরাপত্তা পরিদর্শন",
    "nav.violations": "আইন লঙ্ঘন ও বিপদ",
    "nav.actions": "প্রতিকারমূলক পদক্ষেপ",
    "nav.compliance": "বিধিমালা ও সিএমআর",
    "nav.reports": "রিপোর্ট ও নথি",
    "nav.gis": "জিআইএস খনি মানচিত্র",
    "nav.ai": "এআই ঝুঁকি বিশ্লেষণ",
    "nav.ocr": "ওসিআর ডিজিটাইজার",
    "nav.documents": "নথিপত্র সংরক্ষণাগার",
    "nav.equipment": "ভারী যন্ত্রপাতি বহর",
    "nav.team": "কর্মী ও কারিগরি দল",
    "nav.assignment": "ম্যানেজার নিয়োগ",
    "nav.settings": "সেটিংস ও তথ্য",
    "nav.logout": "লগ আউট",

    // Common Buttons
    "btn.log_violation": "+ লঙ্ঘন নথিভুক্ত করুন",
    "btn.add_action": "+ পদক্ষেপ যোগ করুন",
    "btn.generate_report": "+ রিপোর্ট তৈরি করুন",
    "btn.upload_document": "+ নথি আপলোড করুন",
    "btn.add_equipment": "+ যন্ত্রপাতি নিবন্ধন করুন",
    "btn.save_changes": "পরিবর্তন সংরক্ষণ করুন",
    "btn.conduct_inspection": "নতুন পরিদর্শন শুরু করুন",
    "btn.download": "ডাউনলোড",
    "btn.cancel": "বাতিল",
    "btn.submit": "জমা দিন",
    "btn.search": "অনুসন্ধান...",
    "btn.filter": "ফিল্টার",

    // Headers & Titles
    "title.command_desk": "কোলিয়ারি সুরক্ষা নিয়ন্ত্রণ কেন্দ্র",
    "title.scada_active": "স্ক্যাডা গ্যাস টেলি-মনিটরিং সক্রিয়",
    "title.open_violations": "খোলা লঙ্ঘনসমূহ",
    "title.corrective_actions": "প্রতিকারমূলক পদক্ষেপ",
    "title.completed_audits": "সম্পন্ন অডিট",
    "title.compliance_score": "সুরক্ষা সম্মতি স্কোর",
    "title.telemetry_trip": "গ্যাস টেলি-মনিটরিং অ্যালার্ম সীমা",
    "title.settings": "পোর্টাল সেটিংস ও কোলিয়ারি প্রোফাইল",

    // Statuses
    "status.high": "উচ্চ ঝুঁকি",
    "status.medium": "মাঝারি",
    "status.low": "স্বল্প",
    "status.open": "চলমান",
    "status.in_progress": "প্রক্রিয়াধীন",
    "status.resolved": "সমাধান হয়েছে",
    "status.operational": "সক্রিয়",
    "status.maintenance": "রক্ষণাবেক্ষণ",
    "status.compliant": "সম্মত",
    "status.non_compliant": "অসম্মত",
  },
  or: {
    // Nav
    "nav.dashboard": "ଡ୍ୟାସବୋର୍ଡ (ମୁଖ୍ୟ ପୃଷ୍ଠା)",
    "nav.mines": "ଖଣି ଏବଂ କୋଇଲା ଖାଦାନ",
    "nav.inspections": "ସୁରକ୍ଷା ଯାଞ୍ଚ",
    "nav.violations": "ନିୟମ ଉଲ୍ଲଂଘନ",
    "nav.actions": "ସଂଶୋଧନ ପଦକ୍ଷେପ",
    "nav.compliance": "ଅନୁପାଳନ ଓ ସିଏମଆର",
    "nav.reports": "ସୁରକ୍ଷା ରିପୋର୍ଟ",
    "nav.gis": "ଜିଆଇଏସ ଖଣି ମାନଚିତ୍ର",
    "nav.ai": "ଏଆଇ ବିପଦ ବିଶ୍ଳେଷଣ",
    "nav.ocr": "ଓସିଆର ଡିଜିଟାଇଜର",
    "nav.documents": "ଦସ୍ତାବିଜ ଭଣ୍ଡାର",
    "nav.equipment": "ଭାରୀ ଯନ୍ତ୍ରପାତି",
    "nav.team": "ଖଣି କର୍ମଚାରୀ ଦଳ",
    "nav.assignment": "ପରିଚାଳକ ନିଯୁକ୍ତି",
    "nav.settings": "ସେଟିଙ୍ଗ୍ସ ଓ ପ୍ରୋଫାଇଲ",
    "nav.logout": "ଲଗ ଆଉଟ",

    // Common Buttons
    "btn.log_violation": "+ ଉଲ୍ଲଂଘନ ଲଗ୍ କରନ୍ତୁ",
    "btn.add_action": "+ କାର୍ଯ୍ୟ ଯୋଡନ୍ତୁ",
    "btn.generate_report": "+ ରିପୋର୍ଟ ପ୍ରସ୍ତୁତ କରନ୍ତୁ",
    "btn.upload_document": "+ ଦଲିଲ ଅପଲୋଡ କରନ୍ତୁ",
    "btn.add_equipment": "+ ଯନ୍ତ୍ରପାତି ପଞ୍ଜିକରଣ",
    "btn.save_changes": "ପରିବର୍ତ୍ତନ ସଂରକ୍ଷଣ କରନ୍ତୁ",
    "btn.conduct_inspection": "ନୂଆ ଯାଞ୍ଚ କରନ୍ତୁ",
    "btn.download": "ଡାଉନଲୋଡ",
    "btn.cancel": "ବାତିଲ",
    "btn.submit": "ଦାଖଲ କରନ୍ତୁ",
    "btn.search": "ଖୋଜନ୍ତୁ...",
    "btn.filter": "ଫିଲ୍ଟର",

    // Headers & Titles
    "title.command_desk": "କୋଲିୟରୀ ସୁରକ୍ଷା ନିୟନ୍ତ୍ରଣ କେନ୍ଦ୍ର",
    "title.scada_active": "ସ୍କାଡା ଗ୍ୟାସ ଟେଲି-ନିରୀକ୍ଷଣ ସକ୍ରିୟ",
    "title.open_violations": "ସକ୍ରିୟ ଉଲ୍ଲଂଘନ",
    "title.corrective_actions": "ସଂଶୋଧନ କାର୍ଯ୍ୟ",
    "title.completed_audits": "ସମ୍ପୂର୍ଣ୍ଣ ଅଡିଟ",
    "title.compliance_score": "ସୁରକ୍ଷା ଅନୁପାଳନ ହାର",
    "title.telemetry_trip": "ଟେଲିମେଟ୍ରି ଆଲାର୍ମ ସୀମା (ସିଏମଆର ୧୫୩)",
    "title.settings": "ପୋର୍ଟାଲ ସେଟିଙ୍ଗ୍ସ",

    // Statuses
    "status.high": "ଅତ୍ୟଧିକ ବିପଦ",
    "status.medium": "ମଧ୍ୟମ",
    "status.low": "କମ ବିପଦ",
    "status.open": "ମୁକ୍ତ ଅଛି",
    "status.in_progress": "ଚାଲୁଅଛି",
    "status.resolved": "ସମାଧାନ ହୋଇଛି",
    "status.operational": "ଚାଲୁ ଅବସ୍ଥା",
    "status.maintenance": "ମରାମତି ଚାଲିଛି",
    "status.compliant": "ଅନୁମୋଦିତ",
    "status.non_compliant": "ଅନନୁମୋଦିତ",
  }
};

interface LanguageContextType {
  currentLang: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, defaultText?: string) => string;
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLangState] = useState<LanguageCode>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mineguard_language") as LanguageCode;
      if (saved && TRANSLATIONS[saved]) {
        setCurrentLangState(saved);
      }
    } catch (e) {}

    const handleLangEvent = (e: any) => {
      const code = e.detail?.lang as LanguageCode;
      if (code && TRANSLATIONS[code]) {
        setCurrentLangState(code);
      }
    };

    window.addEventListener("mineguard_lang_changed", handleLangEvent);
    return () => window.removeEventListener("mineguard_lang_changed", handleLangEvent);
  }, []);

  const setLanguage = (code: LanguageCode) => {
    setCurrentLangState(code);
    try {
      localStorage.setItem("mineguard_language", code);
      window.dispatchEvent(new CustomEvent("mineguard_lang_changed", { detail: { lang: code } }));
    } catch (e) {}
  };

  const t = (key: string, defaultText?: string): string => {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if outside provider
    return {
      currentLang: "en" as LanguageCode,
      setLanguage: () => {},
      t: (k: string, d?: string) => d || k,
      languages: LANGUAGES
    };
  }
  return context;
}
