"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

/**
 * MineGuard i18n Context
 * -----------------------------------------------------------------------
 * - 18 languages: English + 17 Indian languages
 * - Whole-app language switching via React context + a window event
 * - Static dictionary covers all fixed UI copy (nav, buttons, dashboard
 *   labels, notification chrome, etc.)
 * - AI fallback (Claude API) covers:
 *     1. Any static key requested via t() that isn't in the dictionary yet
 *        for the current language (auto-translated + cached).
 *     2. Fully dynamic strings (mine names, incident descriptions,
 *        notification text pulled from data) via translateText() / <AiText/>
 * -----------------------------------------------------------------------
 */

export type LanguageCode =
  | "en" | "hi" | "bn" | "or" | "ta" | "te" | "kn" | "ml" | "mr"
  | "gu" | "pa" | "ur" | "as" | "kok" | "ne" | "sa" | "ks" | "sat";

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
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", flag: "🇮🇳", desc: "Mahanadi Coalfields (MCL, Talcher)" },
  { code: "mr", label: "Marathi", native: "मराठी", flag: "🇮🇳", desc: "Western Coalfields (WCL)" },
  { code: "ta", label: "Tamil", native: "தமிழ்", flag: "🇮🇳", desc: "Neyveli Lignite Corporation" },
  { code: "te", label: "Telugu", native: "తెలుగు", flag: "🇮🇳", desc: "Singareni Collieries (SCCL)" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳", desc: "Karnataka Mining Belt" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", flag: "🇮🇳", desc: "Kerala Minerals" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳", desc: "Gujarat Mineral Development" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳", desc: "Northern Coalfields" },
  { code: "ur", label: "Urdu", native: "اردو", flag: "🇮🇳", desc: "National Statutory Scope" },
  { code: "as", label: "Assamese", native: "অসমীয়া", flag: "🇮🇳", desc: "Northeast Coalfields" },
  { code: "kok", label: "Konkani", native: "कोंकणी", flag: "🇮🇳", desc: "Goa Mining Belt" },
  { code: "ne", label: "Nepali", native: "नेपाली", flag: "🇮🇳", desc: "Darjeeling & Sikkim Belt" },
  { code: "sa", label: "Sanskrit", native: "संस्कृतम्", flag: "🇮🇳", desc: "National Statutory Scope" },
  { code: "ks", label: "Kashmiri", native: "کٲشُر", flag: "🇮🇳", desc: "National Statutory Scope" },
  { code: "sat", label: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ", flag: "🇮🇳", desc: "Jharkhand Tribal Belt" },
];

/* -------------------------------------------------------------------- */
/* Static dictionary                                                    */
/* -------------------------------------------------------------------- */

type Dict = Record<string, string>;

const en: Dict = {
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
  "btn.view_all": "View All",
  "btn.ai_audit": "AI Audit",

  // Layout chrome
  "title.corporate_overview": "Corporate Overview",
  "subtitle.corporate_overview": "Portfolio-wide safety and compliance across all mines.",
  "filter.all_mines": "All Mines",
  "profile.corp_admin": "Corp. Admin",
  "profile.administrator": "Administrator",

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
  "status.risk_suffix": "Risk",

  // Dashboard banner
  "dash.banner_title": "National Coalfield AI Risk Surveillance",
  "dash.banner_badge": "Ensemble 97.67%",
  "dash.banner_desc": "Active AI monitoring across Coal India Limited (ECL, BCCL, CCL, WCL, SECL, MCL, NCL) · 2 Mines flagged with high spontaneous combustion risk",
  "dash.audit_jharia": "Audit Jharia Deep (BCCL)",
  "dash.national_gis": "National GIS Map",

  // Stat cards
  "dash.total_mines": "Total Active Mines",
  "dash.total_mines_change": "+1 this month",
  "dash.portfolio_compliance": "Portfolio Compliance",
  "dash.portfolio_compliance_change": "+3.2% vs last qtr",
  "dash.critical_alerts": "Critical Hazard Alerts",
  "dash.critical_alerts_change": "-12% vs last wk",
  "dash.dgms_audits": "DGMS Audits Conducted",
  "dash.dgms_audits_change": "+8 this week",

  // Charts
  "dash.subsidiary_index": "Subsidiary Compliance Index",
  "dash.trend_2026": "(2026 Trend)",
  "dash.portfolio_avg": "Portfolio Avg",
  "dash.risk_breakdown": "AI Risk Cluster Breakdown",
  "dash.mines_label": "Mines",

  // Tables
  "dash.flagship_telemetry": "Flagship Mine Safety Telemetry",
  "dash.depth": "Depth",
  "dash.workers": "Workers",
  "dash.priority_incidents": "Priority Safety Incidents",
  "dash.live_feed": "Live CIL Feed",

  // Notification panel
  "notif.tooltip": "Notifications & Statutory Alerts",
  "notif.panel_title": "Statutory Alerts & Broadcasts",
  "notif.test": "+ Test",
  "notif.mark_read": "Mark read",
  "notif.all": "All",
  "notif.unread": "Unread",
  "notif.all_clear": "All clear! No pending alerts.",
  "notif.footer": "Connected to DGMS Statutory Incident Exchange",
  "notif.marked_all_read": "All notifications marked as read!",
  "notif.acknowledged": "Acknowledged",
  "notif.test_fired": "New critical notification dispatched to console!",
  "notif.dismiss": "Dismiss",

  // Language menu
  "lang.tooltip": "Switch Language / भाषा बदलें",
  "lang.select_portal": "Select Portal Language",
  "lang.switched_to": "Language switched to",
};

const hi: Dict = {
  "nav.dashboard": "डैशबोर्ड (मुख्य पृष्ठ)", "nav.mines": "खदान एवं कोलियरी", "nav.inspections": "सुरक्षा निरीक्षण",
  "nav.violations": "उल्लंघन एवं खतरे", "nav.actions": "सुधारात्मक कार्य", "nav.compliance": "अनुपालन एवं सीएमआर",
  "nav.reports": "सांविधिक रिपोर्ट", "nav.gis": "जीआईएस खदान मानचित्र", "nav.ai": "एआई जोखिम विश्लेषण",
  "nav.ocr": "ओसीआर डिजिटाइज़र", "nav.documents": "दस्तावेज़ भंडार", "nav.equipment": "उपकरण एवं भारी मशीनरी",
  "nav.team": "अधिकारी एवं खनन दल", "nav.assignment": "प्रबंधक आवंटन", "nav.settings": "सेटिंग्स एवं प्रोफाइल", "nav.logout": "लॉग आउट",

  "btn.log_violation": "+ उल्लंघन दर्ज करें", "btn.add_action": "+ कार्य जोड़ें", "btn.generate_report": "+ रिपोर्ट तैयार करें",
  "btn.upload_document": "+ दस्तावेज़ अपलोड करें", "btn.add_equipment": "+ मशीनरी पंजीकृत करें", "btn.save_changes": "परिवर्तन सहेजें",
  "btn.conduct_inspection": "नया निरीक्षण करें", "btn.download": "डाउनलोड करें", "btn.cancel": "रद्द करें",
  "btn.submit": "जमा करें", "btn.search": "खोजें...", "btn.filter": "फ़िल्टर", "btn.view_all": "सभी देखें", "btn.ai_audit": "एआई ऑडिट",

  "title.corporate_overview": "कॉर्पोरेट अवलोकन",
  "subtitle.corporate_overview": "सभी खदानों में पोर्टफोलियो-व्यापी सुरक्षा एवं अनुपालन।",
  "filter.all_mines": "सभी खदानें", "profile.corp_admin": "कॉर्प. एडमिन", "profile.administrator": "प्रशासक",

  "status.high": "अत्यधिक गंभीर", "status.medium": "मध्यम", "status.low": "कम जोखिम", "status.open": "खुला है",
  "status.in_progress": "प्रगति पर है", "status.resolved": "हल हो चुका है", "status.operational": "चालू हालत में",
  "status.maintenance": "रखरखाव में", "status.compliant": "अनुपालित", "status.non_compliant": "गैर-अनुपालित", "status.risk_suffix": "जोखिम",

  "dash.banner_title": "राष्ट्रीय कोयला क्षेत्र एआई जोखिम निगरानी",
  "dash.banner_badge": "एन्सेम्बल 97.67%",
  "dash.banner_desc": "कोल इंडिया लिमिटेड (ईसीएल, बीसीसीएल, सीसीएल, डब्ल्यूसीएल, एसईसीएल, एमसीएल, एनसीएल) में सक्रिय एआई निगरानी · 2 खदानें उच्च स्वतःस्फूर्त दहन जोखिम के साथ चिन्हित",
  "dash.audit_jharia": "झरिया डीप का ऑडिट करें (बीसीसीएल)",
  "dash.national_gis": "राष्ट्रीय जीआईएस मानचित्र",

  "dash.total_mines": "कुल सक्रिय खदानें", "dash.total_mines_change": "+1 इस माह",
  "dash.portfolio_compliance": "पोर्टफोलियो अनुपालन", "dash.portfolio_compliance_change": "+3.2% पिछली तिमाही की तुलना में",
  "dash.critical_alerts": "गंभीर खतरा चेतावनियाँ", "dash.critical_alerts_change": "-12% पिछले सप्ताह की तुलना में",
  "dash.dgms_audits": "डीजीएमएस ऑडिट संपन्न", "dash.dgms_audits_change": "+8 इस सप्ताह",

  "dash.subsidiary_index": "सहायक अनुपालन सूचकांक", "dash.trend_2026": "(2026 प्रवृत्ति)",
  "dash.portfolio_avg": "पोर्टफोलियो औसत", "dash.risk_breakdown": "एआई जोखिम समूह विवरण", "dash.mines_label": "खदानें",

  "dash.flagship_telemetry": "प्रमुख खदान सुरक्षा टेलीमेट्री", "dash.depth": "गहराई", "dash.workers": "कर्मचारी",
  "dash.priority_incidents": "प्राथमिकता सुरक्षा घटनाएँ", "dash.live_feed": "लाइव सीआईएल फीड",

  "notif.tooltip": "सूचनाएं एवं सांविधिक चेतावनियाँ", "notif.panel_title": "सांविधिक चेतावनियाँ एवं प्रसारण",
  "notif.test": "+ परीक्षण", "notif.mark_read": "पढ़ा हुआ चिह्नित करें", "notif.all": "सभी", "notif.unread": "अपठित",
  "notif.all_clear": "सब ठीक है! कोई लंबित चेतावनी नहीं।", "notif.footer": "डीजीएमएस सांविधिक घटना विनिमय से जुड़ा हुआ",
  "notif.marked_all_read": "सभी सूचनाएं पढ़ी हुई चिह्नित की गईं!", "notif.acknowledged": "स्वीकार किया गया",
  "notif.test_fired": "नई गंभीर सूचना कंसोल पर भेजी गई!", "notif.dismiss": "हटाएं",

  "lang.tooltip": "भाषा बदलें", "lang.select_portal": "पोर्टल भाषा चुनें", "lang.switched_to": "भाषा बदल दी गई",

  // Statutory Cadre & Manager Console
  "Corporate Overview": "कॉरपोरेट अवलोकन",
  "Portfolio-wide safety & compliance across all mines": "सभी खदानों में पोर्टफोलियो-व्यापी सुरक्षा और अनुपालन",
  "All Mines": "सभी खदानें",
  "Sample DGMS Form IV": "नमूना DGMS फॉर्म IV",
  "Corporate Governance": "कॉरपोरेट प्रशासन",
  "Statutory Cadre & Manager Allocation": "सांविधिक संवर्ग एवं प्रबंधक आवंटन",
  "CMR 2017 Reg. 27 Statutory Manager Allocation Console": "CMR 2017 नियम 27 सांविधिक प्रबंधक आवंटन कंसोल",
  "Monitored Collieries": "निगरानी की गई खदानें",
  "CIL Operating Pits": "CIL परिचालन खदानें",
  "Statutory Appointments": "सांविधिक नियुक्तियां",
  "Colliery Vacancies": "खदान रिक्तियां",
  "Certified Manager Pool": "प्रमाणित प्रबंधक पूल",
  "National Colliery Manager Cadre Roster": "राष्ट्रीय खदान प्रबंधक संवर्ग रोस्टर",
  "Appoint Manager": "प्रबंधक नियुक्त करें",
  "Reassign / Transfer": "पुनर्निदेश / स्थानांतरण",

  // Login & Authentication
  "Officer sign in": "अधिकारी साइन इन",
  "New registration": "नया पंजीकरण",
  "Sign in": "साइन इन करें",
  "Register": "पंजीकरण करें",
  "Access your allocated mine portal.": "अपने आवंटित खदान पोर्टल तक पहुंचें।",
  "Register as a statutory officer.": "सांविधिक अधिकारी के रूप में पंजीकरण करें।",
  "Corporate Director": "कॉरपोरेट निदेशक",
  "Mine Manager": "खदान प्रबंधक",
  "Safety Inspector": "सुरक्षा निरीक्षक",
  "Official Email / Mobile": "आधिकारिक ईमेल / मोबाइल",
  "Password": "पासवर्ड",
  "Remember this console session": "इस सत्र को याद रखें",
  "Forgot statutory access key?": "सांविधिक एक्सेस कुंजी भूल गए?",
  "Sign in to Console": "कंसोल में साइन इन करें",
  "Quick Statutory Demo Personas": "त्वरित सांविधिक डेमो व्यक्ति",
  "Select a persona to test the platform": "मंच का परीक्षण करने के लिए व्यक्ति चुनें",

  // Mine Manager & Operations
  "Welcome back": "वापसी पर स्वागत है",
  "Ongoing Operations": "चल रहे कार्य",
  "Today's Status": "आज की स्थिति",
  "3 / 5 Completed": "3 / 5 पूर्ण",
  "Field Inspector Dashboard": "फील्ड निरीक्षक डैशबोर्ड",
  "Safety Inspections": "सुरक्षा निरीक्षण",
  "Hazard & Violation Reports": "जोखिम और उल्लंघन रिपोर्ट",
  "Corrective Actions": "सुधारात्मक कार्रवाइयां",
  "Inspector Profile & Settings": "निरीक्षक प्रोफ़ाइल और सेटिंग्स",
};

const bn: Dict = {
  "nav.dashboard": "ড্যাশবোর্ড (প্রধান পাতা)", "nav.mines": "খনি ও কোলিয়ারি", "nav.inspections": "নিরাপত্তা পরিদর্শন",
  "nav.violations": "আইন লঙ্ঘন ও বিপদ", "nav.actions": "প্রতিকারমূলক পদক্ষেপ", "nav.compliance": "বিধিমালা ও সিএমআর",
  "nav.reports": "রিপোর্ট ও নথি", "nav.gis": "জিআইএস খনি মানচিত্র", "nav.ai": "এআই ঝুঁকি বিশ্লেষণ",
  "nav.ocr": "ওসিআর ডিজিটাইজার", "nav.documents": "নথিপত্র সংরক্ষণাগার", "nav.equipment": "ভারী যন্ত্রপাতি বহর",
  "nav.team": "কর্মী ও কারিগরি দল", "nav.assignment": "ম্যানেজার নিয়োগ", "nav.settings": "সেটিংস ও তথ্য", "nav.logout": "লগ আউট",

  "btn.log_violation": "+ লঙ্ঘন নথিভুক্ত করুন", "btn.add_action": "+ পদক্ষেপ যোগ করুন", "btn.generate_report": "+ রিপোর্ট তৈরি করুন",
  "btn.upload_document": "+ নথি আপলোড করুন", "btn.add_equipment": "+ যন্ত্রপাতি নিবন্ধন করুন", "btn.save_changes": "পরিবর্তন সংরক্ষণ করুন",
  "btn.conduct_inspection": "নতুন পরিদর্শন শুরু করুন", "btn.download": "ডাউনলোড", "btn.cancel": "বাতিল",
  "btn.submit": "জমা দিন", "btn.search": "অনুসন্ধান...", "btn.filter": "ফিল্টার", "btn.view_all": "সব দেখুন", "btn.ai_audit": "এআই অডিট",

  "title.corporate_overview": "কর্পোরেট ওভারভিউ",
  "subtitle.corporate_overview": "সমস্ত খনি জুড়ে পোর্টফোলিও-ব্যাপী নিরাপত্তা ও সম্মতি।",
  "filter.all_mines": "সমস্ত খনি", "profile.corp_admin": "কর্প. অ্যাডমিন", "profile.administrator": "প্রশাসক",

  "status.high": "উচ্চ ঝুঁকি", "status.medium": "মাঝারি", "status.low": "স্বল্প", "status.open": "চলমান",
  "status.in_progress": "প্রক্রিয়াধীন", "status.resolved": "সমাধান হয়েছে", "status.operational": "সক্রিয়",
  "status.maintenance": "রক্ষণাবেক্ষণ", "status.compliant": "সম্মত", "status.non_compliant": "অসম্মত", "status.risk_suffix": "ঝুঁকি",

  "dash.banner_title": "জাতীয় কয়লাক্ষেত্র এআই ঝুঁকি নজরদারি",
  "dash.banner_badge": "এনসেম্বল 97.67%",
  "dash.banner_desc": "কোল ইন্ডিয়া লিমিটেড (ইসিএল, বিসিসিএল, সিসিএল, ডব্লিউসিএল, এসইসিএল, এমসিএল, এনসিএল) জুড়ে সক্রিয় এআই পর্যবেক্ষণ · উচ্চ স্বতঃস্ফূর্ত দহন ঝুঁকিতে ২টি খনি চিহ্নিত",
  "dash.audit_jharia": "ঝরিয়া ডিপ অডিট করুন (বিসিসিএল)",
  "dash.national_gis": "জাতীয় জিআইএস মানচিত্র",

  "dash.total_mines": "মোট সক্রিয় খনি", "dash.total_mines_change": "+১ এই মাসে",
  "dash.portfolio_compliance": "পোর্টফোলিও সম্মতি", "dash.portfolio_compliance_change": "+৩.২% গত প্রান্তিকের তুলনায়",
  "dash.critical_alerts": "গুরুতর বিপদ সতর্কতা", "dash.critical_alerts_change": "-১২% গত সপ্তাহের তুলনায়",
  "dash.dgms_audits": "সম্পন্ন ডিজিএমএস অডিট", "dash.dgms_audits_change": "+৮ এই সপ্তাহে",

  "dash.subsidiary_index": "সহায়ক সম্মতি সূচক", "dash.trend_2026": "(২০২৬ প্রবণতা)",
  "dash.portfolio_avg": "পোর্টফোলিও গড়", "dash.risk_breakdown": "এআই ঝুঁকি ক্লাস্টার বিভাজন", "dash.mines_label": "খনি",

  "dash.flagship_telemetry": "প্রধান খনি নিরাপত্তা টেলিমেট্রি", "dash.depth": "গভীরতা", "dash.workers": "শ্রমিক",
  "dash.priority_incidents": "অগ্রাধিকার নিরাপত্তা ঘটনা", "dash.live_feed": "লাইভ সিআইএল ফিড",

  "notif.tooltip": "বিজ্ঞপ্তি ও বিধিবদ্ধ সতর্কতা", "notif.panel_title": "বিধিবদ্ধ সতর্কতা ও সম্প্রচার",
  "notif.test": "+ পরীক্ষা", "notif.mark_read": "পঠিত চিহ্নিত করুন", "notif.all": "সব", "notif.unread": "অপঠিত",
  "notif.all_clear": "সব ঠিক আছে! কোনো মুলতুবি সতর্কতা নেই।", "notif.footer": "ডিজিএমএস বিধিবদ্ধ ঘটনা বিনিময়ের সাথে সংযুক্ত",
  "notif.marked_all_read": "সমস্ত বিজ্ঞপ্তি পঠিত হিসাবে চিহ্নিত!", "notif.acknowledged": "স্বীকৃত",
  "notif.test_fired": "কনসোলে নতুন গুরুতর বিজ্ঞপ্তি পাঠানো হয়েছে!", "notif.dismiss": "খারিজ করুন",

  "lang.tooltip": "ভাষা পরিবর্তন করুন", "lang.select_portal": "পোর্টাল ভাষা নির্বাচন করুন", "lang.switched_to": "ভাষা পরিবর্তিত হয়েছে",
};

const or: Dict = {
  "nav.dashboard": "ଡ୍ୟାସବୋର୍ଡ (ମୁଖ୍ୟ ପୃଷ୍ଠା)", "nav.mines": "ଖଣି ଏବଂ କୋଇଲା ଖାଦାନ", "nav.inspections": "ସୁରକ୍ଷା ଯାଞ୍ଚ",
  "nav.violations": "ନିୟମ ଉଲ୍ଲଂଘନ", "nav.actions": "ସଂଶୋଧନ ପଦକ୍ଷେପ", "nav.compliance": "ଅନୁପାଳନ ଓ ସିଏମଆର",
  "nav.reports": "ସୁରକ୍ଷା ରିପୋର୍ଟ", "nav.gis": "ଜିଆଇଏସ ଖଣି ମାନଚିତ୍ର", "nav.ai": "ଏଆଇ ବିପଦ ବିଶ୍ଳେଷଣ",
  "nav.ocr": "ଓସିଆର ଡିଜିଟାଇଜର", "nav.documents": "ଦସ୍ତାବିଜ ଭଣ୍ଡାର", "nav.equipment": "ଭାରୀ ଯନ୍ତ୍ରପାତି",
  "nav.team": "ଖଣି କର୍ମଚାରୀ ଦଳ", "nav.assignment": "ପରିଚାଳକ ନିଯୁକ୍ତି", "nav.settings": "ସେଟିଙ୍ଗ୍ସ ଓ ପ୍ରୋଫାଇଲ", "nav.logout": "ଲଗ ଆଉଟ",

  "btn.log_violation": "+ ଉଲ୍ଲଂଘନ ଲଗ୍ କରନ୍ତୁ", "btn.add_action": "+ କାର୍ଯ୍ୟ ଯୋଡନ୍ତୁ", "btn.generate_report": "+ ରିପୋର୍ଟ ପ୍ରସ୍ତୁତ କରନ୍ତୁ",
  "btn.upload_document": "+ ଦଲିଲ ଅପଲୋଡ କରନ୍ତୁ", "btn.add_equipment": "+ ଯନ୍ତ୍ରପାତି ପଞ୍ଜିକରଣ", "btn.save_changes": "ପରିବର୍ତ୍ତନ ସଂରକ୍ଷଣ କରନ୍ତୁ",
  "btn.conduct_inspection": "ନୂଆ ଯାଞ୍ଚ କରନ୍ତୁ", "btn.download": "ଡାଉନଲୋଡ", "btn.cancel": "ବାତିଲ",
  "btn.submit": "ଦାଖଲ କରନ୍ତୁ", "btn.search": "ଖୋଜନ୍ତୁ...", "btn.filter": "ଫିଲ୍ଟର", "btn.view_all": "ସବୁ ଦେଖନ୍ତୁ", "btn.ai_audit": "ଏଆଇ ଅଡିଟ",

  "title.corporate_overview": "କର୍ପୋରେଟ ଓଭରଭ୍ୟୁ",
  "subtitle.corporate_overview": "ସମସ୍ତ ଖଣିରେ ପୋର୍ଟଫୋଲିଓ-ବ୍ୟାପୀ ସୁରକ୍ଷା ଓ ଅନୁପାଳନ।",
  "filter.all_mines": "ସମସ୍ତ ଖଣି", "profile.corp_admin": "କର୍ପ. ଆଡମିନ", "profile.administrator": "ପ୍ରଶାସକ",

  "status.high": "ଅତ୍ୟଧିକ ବିପଦ", "status.medium": "ମଧ୍ୟମ", "status.low": "କମ ବିପଦ", "status.open": "ମୁକ୍ତ ଅଛି",
  "status.in_progress": "ଚାଲୁଅଛି", "status.resolved": "ସମାଧାନ ହୋଇଛି", "status.operational": "ଚାଲୁ ଅବସ୍ଥା",
  "status.maintenance": "ମରାମତି ଚାଲିଛି", "status.compliant": "ଅନୁମୋଦିତ", "status.non_compliant": "ଅନନୁମୋଦିତ", "status.risk_suffix": "ବିପଦ",

  "dash.banner_title": "ଜାତୀୟ କୋଇଲା କ୍ଷେତ୍ର ଏଆଇ ବିପଦ ନିରୀକ୍ଷଣ",
  "dash.banner_badge": "ଏନସେମ୍ବଲ 97.67%",
  "dash.banner_desc": "କୋଲ ଇଣ୍ଡିଆ ଲିମିଟେଡରେ ସକ୍ରିୟ ଏଆଇ ନିରୀକ୍ଷଣ (ଇସିଏଲ, ବିସିସିଏଲ, ସିସିଏଲ, ଡବ୍ଲୁସିଏଲ, ଏସଇସିଏଲ, ଏମସିଏଲ, ଏନସିଏଲ) · ୨ଟି ଖଣି ଉଚ୍ଚ ସ୍ଵତଃସ୍ଫୂର୍ତ ଦହନ ବିପଦରେ ଚିହ୍ନିତ",
  "dash.audit_jharia": "ଝରିଆ ଡିପ ଅଡିଟ କରନ୍ତୁ (ବିସିସିଏଲ)",
  "dash.national_gis": "ଜାତୀୟ ଜିଆଇଏସ ମାନଚିତ୍ର",

  "dash.total_mines": "ମୋଟ ସକ୍ରିୟ ଖଣି", "dash.total_mines_change": "+୧ ଏହି ମାସରେ",
  "dash.portfolio_compliance": "ପୋର୍ଟଫୋଲିଓ ଅନୁପାଳନ", "dash.portfolio_compliance_change": "+୩.୨% ଗତ ତ୍ରୈମାସିକ ତୁଳନାରେ",
  "dash.critical_alerts": "ଗମ୍ଭୀର ବିପଦ ସତର୍କତା", "dash.critical_alerts_change": "-୧୨% ଗତ ସପ୍ତାହ ତୁଳନାରେ",
  "dash.dgms_audits": "ଡିଜିଏମଏସ ଅଡିଟ ସମ୍ପନ୍ନ", "dash.dgms_audits_change": "+୮ ଏହି ସପ୍ତାହରେ",

  "dash.subsidiary_index": "ସହାୟକ ଅନୁପାଳନ ସୂଚକ", "dash.trend_2026": "(୨୦୨୬ ଧାରା)",
  "dash.portfolio_avg": "ପୋର୍ଟଫୋଲିଓ ହାରାହାରି", "dash.risk_breakdown": "ଏଆଇ ବିପଦ ଗୁଚ୍ଛ ବିଭାଜନ", "dash.mines_label": "ଖଣି",

  "dash.flagship_telemetry": "ମୁଖ୍ୟ ଖଣି ସୁରକ୍ଷା ଟେଲିମେଟ୍ରି", "dash.depth": "ଗଭୀରତା", "dash.workers": "ଶ୍ରମିକ",
  "dash.priority_incidents": "ପ୍ରାଥମିକତା ସୁରକ୍ଷା ଘଟଣା", "dash.live_feed": "ଲାଇଭ ସିଆଇଏଲ ଫିଡ",

  "notif.tooltip": "ବିଜ୍ଞପ୍ତି ଓ ବିଧିବଦ୍ଧ ସତର୍କତା", "notif.panel_title": "ବିଧିବଦ୍ଧ ସତର୍କତା ଓ ପ୍ରସାରଣ",
  "notif.test": "+ ପରୀକ୍ଷା", "notif.mark_read": "ପଢ଼ାଯାଇଛି ବୋଲି ଚିହ୍ନଟ କରନ୍ତୁ", "notif.all": "ସବୁ", "notif.unread": "ଅପଠିତ",
  "notif.all_clear": "ସବୁ ଠିକ ଅଛି! କୌଣସି ବିଚାରାଧୀନ ସତର୍କତା ନାହିଁ।", "notif.footer": "ଡିଜିଏମଏସ ବିଧିବଦ୍ଧ ଘଟଣା ବିନିମୟ ସହିତ ସଂଯୁକ୍ତ",
  "notif.marked_all_read": "ସମସ୍ତ ବିଜ୍ଞପ୍ତି ପଠିତ ଭାବେ ଚିହ୍ନଟ ହେଲା!", "notif.acknowledged": "ସ୍ୱୀକୃତ",
  "notif.test_fired": "କନସୋଲକୁ ନୂଆ ଗମ୍ଭୀର ବିଜ୍ଞପ୍ତି ପଠାଗଲା!", "notif.dismiss": "ହଟାନ୍ତୁ",

  "lang.tooltip": "ଭାଷା ବଦଳାନ୍ତୁ", "lang.select_portal": "ପୋର୍ଟାଲ ଭାଷା ଚୟନ କରନ୍ତୁ", "lang.switched_to": "ଭାଷା ବଦଳାଗଲା",
};

const mr: Dict = {
  "nav.dashboard": "डॅशबोर्ड (मुख्य पान)", "nav.mines": "कोळसा खाणी", "nav.inspections": "सुरक्षा तपासणी",
  "nav.violations": "उल्लंघन व धोके", "nav.actions": "सुधारात्मक कृती", "nav.compliance": "अनुपालन व सीएमआर",
  "nav.reports": "वैधानिक अहवाल", "nav.gis": "जीआयएस खाण नकाशा", "nav.ai": "एआय जोखीम विश्लेषण",
  "nav.ocr": "ओसीआर डिजिटायझर", "nav.documents": "कागदपत्रे", "nav.equipment": "यंत्रसामग्री ताफा",
  "nav.team": "कर्मचारी व संघ", "nav.assignment": "व्यवस्थापक नियुक्ती", "nav.settings": "सेटिंग्ज", "nav.logout": "साइन आउट",

  "btn.log_violation": "+ उल्लंघन नोंदवा", "btn.add_action": "+ कृती जोडा", "btn.generate_report": "+ अहवाल तयार करा",
  "btn.upload_document": "+ दस्तऐवज अपलोड करा", "btn.add_equipment": "+ यंत्र नोंदणी करा", "btn.save_changes": "बदल जतन करा",
  "btn.conduct_inspection": "नवीन तपासणी करा", "btn.download": "डाउनलोड करा", "btn.cancel": "रद्द करा",
  "btn.submit": "सबमिट करा", "btn.search": "शोधा...", "btn.filter": "फिल्टर", "btn.view_all": "सर्व पहा", "btn.ai_audit": "एआय ऑडिट",

  "title.corporate_overview": "कॉर्पोरेट विहंगावलोकन",
  "subtitle.corporate_overview": "सर्व खाणींमध्ये पोर्टफोलिओ-व्यापी सुरक्षा व अनुपालन.",
  "filter.all_mines": "सर्व खाणी", "profile.corp_admin": "कॉर्प. अ‍ॅडमिन", "profile.administrator": "प्रशासक",

  "status.high": "उच्च", "status.medium": "मध्यम", "status.low": "कमी", "status.open": "खुले आहे",
  "status.in_progress": "प्रगतीपथावर", "status.resolved": "निकाली काढले", "status.operational": "कार्यरत",
  "status.maintenance": "देखभालीत", "status.compliant": "अनुपालित", "status.non_compliant": "अनुपालन नाही", "status.risk_suffix": "धोका",

  "dash.banner_title": "राष्ट्रीय कोळसा क्षेत्र एआय जोखीम निरीक्षण",
  "dash.banner_badge": "एन्सेम्बल 97.67%",
  "dash.banner_desc": "कोल इंडिया लिमिटेड (ईसीएल, बीसीसीएल, सीसीएल, डब्ल्यूसीएल, एसईसीएल, एमसीएल, एनसीएल) मध्ये सक्रिय एआय निरीक्षण · २ खाणींना उच्च स्वयं-ज्वलन धोका असल्याचे चिन्हांकित",
  "dash.audit_jharia": "झरिया डीपचे ऑडिट करा (बीसीसीएल)",
  "dash.national_gis": "राष्ट्रीय जीआयएस नकाशा",

  "dash.total_mines": "एकूण सक्रिय खाणी", "dash.total_mines_change": "+१ या महिन्यात",
  "dash.portfolio_compliance": "पोर्टफोलिओ अनुपालन", "dash.portfolio_compliance_change": "+३.२% मागील तिमाहीच्या तुलनेत",
  "dash.critical_alerts": "गंभीर धोका सूचना", "dash.critical_alerts_change": "-१२% मागील आठवड्याच्या तुलनेत",
  "dash.dgms_audits": "डीजीएमएस ऑडिट पूर्ण", "dash.dgms_audits_change": "+८ या आठवड्यात",

  "dash.subsidiary_index": "उपकंपनी अनुपालन निर्देशांक", "dash.trend_2026": "(२०२६ कल)",
  "dash.portfolio_avg": "पोर्टफोलिओ सरासरी", "dash.risk_breakdown": "एआय जोखीम गट विभाजन", "dash.mines_label": "खाणी",

  "dash.flagship_telemetry": "प्रमुख खाण सुरक्षा टेलिमेट्री", "dash.depth": "खोली", "dash.workers": "कामगार",
  "dash.priority_incidents": "प्राधान्य सुरक्षा घटना", "dash.live_feed": "लाइव्ह सीआयएल फीड",

  "notif.tooltip": "सूचना व वैधानिक इशारे", "notif.panel_title": "वैधानिक इशारे व प्रसारण",
  "notif.test": "+ चाचणी", "notif.mark_read": "वाचले म्हणून चिन्हांकित करा", "notif.all": "सर्व", "notif.unread": "न वाचलेले",
  "notif.all_clear": "सर्व काही ठीक आहे! कोणतीही प्रलंबित सूचना नाही.", "notif.footer": "डीजीएमएस वैधानिक घटना विनिमयाशी जोडलेले",
  "notif.marked_all_read": "सर्व सूचना वाचल्या म्हणून चिन्हांकित!", "notif.acknowledged": "स्वीकारले",
  "notif.test_fired": "नवीन गंभीर सूचना कन्सोलवर पाठवली!", "notif.dismiss": "काढून टाका",

  "lang.tooltip": "भाषा बदला", "lang.select_portal": "पोर्टल भाषा निवडा", "lang.switched_to": "भाषा बदलली",

  // Statutory Cadre & Manager Console
  "Corporate Overview": "कॉर्पोरेट विहंगावलोकन",
  "Portfolio-wide safety & compliance across all mines": "सर्व खाणींमधील सुरक्षा आणि अनुपालन",
  "All Mines": "सर्व खाणी",
  "Sample DGMS Form IV": "नमुना DGMS फॉर्म IV",
  "Corporate Governance": "कॉर्पोरेट प्रशासन",
  "Statutory Cadre & Manager Allocation": "वैधानिक संवर्ग आणि व्यवस्थापक वाटप",
  "CMR 2017 Reg. 27 Statutory Manager Allocation Console": "CMR 2017 नियम 27 वैधानिक व्यवस्थापक वाटप कन्सोल",
  "Pan-India oversight for Coal India Limited. Evaluates Manager competency, enforces single-mine statutory mandates, and generates DGMS Form IV appointment notices.": "कोल इंडिया लिमिटेडसाठी अखिल भारतीय देखरेख. व्यवस्थापक सक्षमतेचे मूल्यांकन करते, एकल-खाण वैधानिक आदेश लागू करते आणि DGMS फॉर्म IV नियुक्ती सूचना तयार करते.",
  "Monitored Collieries": "निरीक्षण केलेल्या खाणी",
  "MONITORED COLLIERIES": "निरीक्षण केलेल्या खाणी",
  "CIL Operating Pits": "CIL कार्यरत खड्डे",
  "Statutory Appointments": "वैधानिक नियुक्त्या",
  "STATUTORY APPOINTMENTS": "वैधानिक नियुक्त्या",
  "CMR Reg 27 Active": "CMR नियम 27 सक्रिय",
  "Colliery Vacancies": "खाण रिक्त पदे",
  "COLLIERY VACANCIES": "खाण रिक्त पदे",
  "Requires Immediate Order": "तातडीच्या आदेशाची आवश्यकता",
  "Certified Manager Pool": "प्रमाणित व्यवस्थापक पूल",
  "CERTIFIED MANAGER POOL": "प्रमाणित व्यवस्थापक पूल",
  "DGMS First/Second Class": "DGMS प्रथम/द्वितीय श्रेणी",
  "DGMS Statutory Assignment Protocol (Coal Mines Regulations 2017)": "DGMS वैधानिक वाटप प्रोटोकॉल (कोळसा खाण नियमन 2017)",
  "National Colliery Manager Cadre Roster": "राष्ट्रीय खाण व्यवस्थापक संवर्ग रोस्टर",
  "Real-time appointment and vacancy status for all monitored CIL pits": "सर्व निरीक्षण केलेल्या CIL खड्ड्यांसाठी रिअल-टाइम नियुक्ती आणि रिक्त स्थिती",
  "Showing 4 collieries": "4 खाणी दर्शवित आहे",
  "Search colliery, basin, or coalfield...": "खाण, खोरे किंवा कोळसा क्षेत्र शोधा...",
  "Subsidiary:": "उपकंपनी:",
  "Colliery / Pit": "खाण / खड्डा",
  "Type & Capacity": "प्रकार आणि क्षमता",
  "Mandated Qualification": "अनिवार्य पात्रता",
  "Statutory Manager (CMR 27)": "वैधानिक व्यवस्थापक (CMR 27)",
  "Cadre Status": "संवर्ग स्थिती",
  "Actions": "कृती",
  "No Manager Appointed": "कोणताही व्यवस्थापक नियुक्त नाही",
  "Vacant Cadre": "रिक्त संवर्ग",
  "Statutory Charge Active": "वैधानिक प्रभार सक्रिय",
  "Appoint Manager": "व्यवस्थापक नियुक्त करा",
  "Reassign / Transfer": "पुनर्नियुक्ती / बदली",
  "Certified Mining Officers Directory (DGMS Certified Pool)": "प्रमाणित खाण अधिकारी निर्देशिका (DGMS प्रमाणित पूल)",
  "5 Certified Officers in System": "प्रणालीमध्ये 5 प्रमाणित अधिकारी",

  // Login & Authentication
  "Officer sign in": "अधिकारी साइन इन",
  "New registration": "नवीन नोंदणी",
  "Sign in": "साइन इन करा",
  "Register": "नोंदणी करा",
  "Access your allocated mine portal.": "तुमच्या वाटप केलेल्या खाण पोर्टलमध्ये प्रवेश करा.",
  "Register as a statutory officer.": "वैधानिक अधिकारी म्हणून नोंदणी करा.",
  "Corporate Director": "कॉर्पोरेट संचालक",
  "Mine Manager": "खाण व्यवस्थापक",
  "Safety Inspector": "सुरक्षा निरीक्षक",
  "Official Email / Mobile": "अधिकृत ईमेल / मोबाइल",
  "Password": "पासवर्ड",
  "Remember this console session": "हे सत्र लक्षात ठेवा",
  "Forgot statutory access key?": "वैधानिक प्रवेश की विसरलात?",
  "Sign in to Console": "कन्सोलमध्ये साइन इन करा",
  "Quick Statutory Demo Personas": "जलद वैधानिक डेमो व्यक्ती",
  "Select a persona to test the platform": "प्लॅटफॉर्म तपासण्यासाठी व्यक्ती निवडा",

  // Mine Manager & Operations
  "Welcome back": "पुन्हा स्वागत आहे",
  "Ongoing Operations": "सुरू असलेली कामे",
  "Active Inspections": "सक्रिय तपासणी",
  "Open Violations": "खुली उल्लंघने",
  "Pending Actions": "प्रलंबित कृती",
  "High Risk Hazards": "उच्च जोखीम धोके",
  "Shift Logbook": "पाळी नोंदवही",
  "Safety Compliance Index": "सुरक्षा अनुपालन निर्देशांक",
  "Equipment Fleet": "यंत्रसामग्री ताफा",
  "Digitize Logbook": "नोंदवही डिजिटायझ करा",

  // Field Inspector
  "Field Inspector Dashboard": "फील्ड निरीक्षक डॅशबोर्ड",
  "Today's Status": "आजची स्थिती",
  "Safety Inspections": "सुरक्षा तपासणी",
  "Hazard & Violation Reports": "धोका आणि उल्लंघन अहवाल",
  "Corrective Actions": "सुधारात्मक कृती",
  "Inspector Profile & Settings": "निरीक्षक प्रोफाइल आणि सेटिंग्ज",
  "Conduct Inspection": "तपासणी करा",
  "Schedule Inspection": "तपासणी नियोजित करा",
  "Log Violation": "उल्लंघन नोंदवा",
};

// Remaining 13 languages: seed with the same key set copied from English.
// t() will auto-detect these are identical to English defaults and queue
// them for AI translation on first render, then cache the real result —
// so the app is fully functional immediately and gets progressively more
// accurate for these languages after the first visit in each one.
function seedFromEnglish(): Dict {
  return { ...en };
}

export const TRANSLATIONS: Record<LanguageCode, Dict> = {
  en, hi, bn, or, mr,
  ta: seedFromEnglish(),
  te: seedFromEnglish(),
  kn: seedFromEnglish(),
  ml: seedFromEnglish(),
  gu: seedFromEnglish(),
  pa: seedFromEnglish(),
  ur: seedFromEnglish(),
  as: seedFromEnglish(),
  kok: seedFromEnglish(),
  ne: seedFromEnglish(),
  sa: seedFromEnglish(),
  ks: seedFromEnglish(),
  sat: seedFromEnglish(),
};

// Languages whose static dictionary is hand-authored and should NOT be
// re-queued for AI translation just because the value matches English.
const HAND_AUTHORED: LanguageCode[] = ["en", "hi", "bn", "or", "mr"];

/* -------------------------------------------------------------------- */
/* AI fallback translation (Claude API)                                 */
/* -------------------------------------------------------------------- */

const AI_CACHE_PREFIX = "mineguard_ai_tx_";

function readAiCache(lang: LanguageCode): Record<string, string> {
  try {
    const raw = localStorage.getItem(AI_CACHE_PREFIX + lang);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAiCache(lang: LanguageCode, cache: Record<string, string>) {
  try {
    localStorage.setItem(AI_CACHE_PREFIX + lang, JSON.stringify(cache));
  } catch { }
}

async function aiTranslateBatch(texts: string[], targetLangCode: string): Promise<string[]> {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, targetLang: targetLangCode }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.translated)) {
        return data.translated;
      }
    }
  } catch (err: any) {
    if (err?.name !== "AbortError" && !err?.message?.toLowerCase().includes("aborted")) {
      console.error("aiTranslateBatch error:", err);
    }
  }
  return texts;
}

/* -------------------------------------------------------------------- */
/* Context                                                              */
/* -------------------------------------------------------------------- */

interface LanguageContextType {
  currentLang: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, defaultText?: string) => string;
  translateText: (text: string) => Promise<string>;
  languages: LanguageInfo[];
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLangState] = useState<LanguageCode>("en");
  const [aiCache, setAiCache] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const pendingKeys = useRef<Set<string>>(new Set());
  const batchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mineguard_language") as LanguageCode;
      if (saved && TRANSLATIONS[saved]) {
        setCurrentLangState(saved);
        setAiCache(readAiCache(saved));
      }
    } catch (e) { }

    const handleLangEvent = (e: any) => {
      const code = e.detail?.lang as LanguageCode;
      if (code && TRANSLATIONS[code]) {
        setCurrentLangState(code);
        setAiCache(readAiCache(code));
      }
    };

    window.addEventListener("mineguard_lang_changed", handleLangEvent);
    return () => window.removeEventListener("mineguard_lang_changed", handleLangEvent);
  }, []);

  const setLanguage = useCallback((code: LanguageCode) => {
    setCurrentLangState(code);
    setAiCache(readAiCache(code));
    try {
      localStorage.setItem("mineguard_language", code);
      window.dispatchEvent(new CustomEvent("mineguard_lang_changed", { detail: { lang: code } }));
    } catch (e) { }
  }, []);

  const flushBatch = useCallback(async (lang: LanguageCode) => {
    const keys = Array.from(pendingKeys.current);
    pendingKeys.current.clear();
    if (keys.length === 0) return;

    setIsTranslating(true);
    try {
      const englishTexts = keys.map((k) => en[k] || k);
      const translated = await aiTranslateBatch(englishTexts, lang);
      const updated = { ...readAiCache(lang) };
      keys.forEach((k, i) => { updated[k] = translated[i]; });
      writeAiCache(lang, updated);
      setAiCache((prev) => (lang === currentLang ? updated : prev));
    } catch (err) {
      console.error("AI translation failed:", err);
    } finally {
      setIsTranslating(false);
    }
  }, [currentLang]);

  const queueAiTranslation = useCallback((key: string, lang: LanguageCode) => {
    pendingKeys.current.add(key);
    if (batchTimer.current) clearTimeout(batchTimer.current);
    batchTimer.current = setTimeout(() => {
      flushBatch(lang);
    }, 250);
  }, [flushBatch]);

  const t = useCallback(
    (keyOrText: string, defaultText?: string): string => {
      if (currentLang === "en") return defaultText || keyOrText;

      const dict = TRANSLATIONS[currentLang] || en;
      // 1. Direct dictionary match by key
      if (dict[keyOrText]) return dict[keyOrText];
      // 2. Direct dictionary match by defaultText
      if (defaultText && dict[defaultText]) return dict[defaultText];

      // 3. Check client-side AI cache
      const cached = aiCache[keyOrText] || (defaultText ? aiCache[defaultText] : undefined);
      if (cached) return cached;

      // 4. Queue for AI translation
      queueAiTranslation(keyOrText, currentLang);
      return defaultText || en[keyOrText] || keyOrText;
    },
    [currentLang, aiCache, queueAiTranslation]
  );

  const translateText = useCallback(
    async (text: string): Promise<string> => {
      if (currentLang === "en" || !text) return text;
      const cache = readAiCache(currentLang);
      if (cache[text]) return cache[text];

      setIsTranslating(true);
      try {
        const [translated] = await aiTranslateBatch([text], currentLang);
        if (translated) {
          const updated = { ...readAiCache(currentLang), [text]: translated };
          writeAiCache(currentLang, updated);
          setAiCache(updated);
          return translated;
        }
      } catch (err) {
        console.error("AI translation failed:", err);
      } finally {
        setIsTranslating(false);
      }
      return text;
    },
    [currentLang]
  );

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t, translateText, languages: LANGUAGES, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      currentLang: "en" as LanguageCode,
      setLanguage: () => { },
      t: (k: string, d?: string) => d || k,
      translateText: async (text: string) => text,
      languages: LANGUAGES,
      isTranslating: false,
    };
  }
  return context;
}

/* -------------------------------------------------------------------- */
/* <AiText/> — drop-in translator for dynamic/data-driven strings       */
/* (mine names, incident descriptions, notification bodies, etc.)      */
/* Renders the original text immediately, swaps in the translation      */
/* once the AI call resolves (and it's cached after that).             */
/* -------------------------------------------------------------------- */

export function AiText({ text, as: As = "span" }: { text: string; as?: any }) {
  const { translateText, currentLang } = useTranslation();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let cancelled = false;
    if (currentLang === "en") {
      setDisplay(text);
      return;
    }
    setDisplay(text); // show original while translating
    translateText(text).then((translated) => {
      if (!cancelled) setDisplay(translated);
    });
    return () => { cancelled = true; };
  }, [text, currentLang, translateText]);

  return <As>{display}</As>;
}