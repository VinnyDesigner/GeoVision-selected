import React, { useState } from 'react';
import { AISearchBar } from '../ai/AISearchBar';
import { useAppState } from '../../context/AppStateContext';
import { getAssetUrl } from '../../utils/assetUtils';
import { useAbuDhabiTimeTheme } from '../../hooks/useAbuDhabiTimeTheme';
import { GeoAILightTrailsOverlay } from '../common/GeoAILightTrailsOverlay';
import {
  MapPin,
  GraduationCap,
  BarChart3,
  Building2,
  Trees,
  Bus,
  ShieldCheck,
  Landmark,
  Zap,
  Compass,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Map,
  Layers,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { language, theme, setCurrentView, sendAIMessage } = useAppState();
  const [examplesExpanded, setExamplesExpanded] = useState(false);

  // Dynamic Real-Time Abu Dhabi Time Theme synced with Header Light/Dark Selection
  const { activeTheme } = useAbuDhabiTimeTheme(theme);

  const EXAMPLE_QUESTIONS = [
    {
      id: 'parks',
      icon: Trees,
      textEn: 'Parks near me',
      textAr: 'الحدائق القريبة مني',
      queryEn: 'Show public parks near me in Abu Dhabi',
      queryAr: 'عرض الحدائق العامة القريبة مني في أبوظبي',
    },
    {
      id: 'schools',
      icon: GraduationCap,
      textEn: 'Schools near bus stations',
      textAr: 'المدارس القريبة من محطات الحافلات',
      queryEn: 'Show schools near bus stations in Abu Dhabi',
      queryAr: 'عرض المدارس بالقرب من محطات الحافلات في أبوظبي',
    },
    {
      id: 'compare',
      icon: BarChart3,
      textEn: 'Compare facilities by district',
      textAr: 'مقارنة المرافق حسب المنطقة',
      queryEn: 'Compare facilities by district in Abu Dhabi',
      queryAr: 'مقارنة المرافق والخدمات حسب القطاع والمنطقة في أبوظبي',
    },
    {
      id: 'tamm',
      icon: Building2,
      textEn: 'TAMM customer centers',
      textAr: 'مراكز تم الحكومية',
      queryEn: 'Show TAMM customer happiness centers in Abu Dhabi',
      queryAr: 'عرض مراكز تم لخدمة المتعاملين في أبوظبي',
    },
    {
      id: 'hospitals',
      icon: MapPin,
      textEn: 'Hospitals near me',
      textAr: 'المستشفيات القريبة مني',
      queryEn: 'Find hospitals near me in Abu Dhabi',
      queryAr: 'عرض المستشفيات القريبة مني في أبوظبي',
    },
    {
      id: 'transit',
      icon: Bus,
      textEn: 'Bus stations & transit hubs',
      textAr: 'محطات الحافلات ومراكز النقل',
      queryEn: 'Show bus stations and transit hubs in Abu Dhabi',
      queryAr: 'عرض محطات الحافلات ومراكز النقل في أبوظبي',
    },
    {
      id: 'safety',
      icon: ShieldCheck,
      textEn: 'Police & civil defense',
      textAr: 'مراكز الشرطة والدفاع المدني',
      queryEn: 'Show police and civil defense stations in Abu Dhabi',
      queryAr: 'عرض مراكز الشرطة والدفاع المدني في أبوظبي',
    },
    {
      id: 'culture',
      icon: Landmark,
      textEn: 'Cultural & heritage sites',
      textAr: 'المعالم الثقافية والتراثية',
      queryEn: 'Show cultural and heritage landmarks in Abu Dhabi',
      queryAr: 'عرض المعالم الثقافية والتراثية في أبوظبي',
    },
    {
      id: 'charging',
      icon: Zap,
      textEn: 'EV charging stations',
      textAr: 'محطات شحن السيارات الكهربائية',
      queryEn: 'Show EV charging stations in Abu Dhabi',
      queryAr: 'عرض محطات شحن المركبات الكهربائية في أبوظبي',
    },
    {
      id: 'nature',
      icon: Compass,
      textEn: 'Mangrove & nature reserves',
      textAr: 'محميات القرم والطبيعة',
      queryEn: 'Show mangrove parks and nature reserves in Abu Dhabi',
      queryAr: 'عرض منتزهات القرم والمحميات الطبيعية في أبوظبي',
    },
    {
      id: 'pharmacy',
      icon: Stethoscope,
      textEn: '24/7 pharmacies',
      textAr: 'صيدليات تعمل 24 ساعة',
      queryEn: 'Show 24/7 pharmacies in Abu Dhabi',
      queryAr: 'عرض الصيدليات التي تعمل 24 ساعة في أبوظبي',
    },
  ];

  const displayedExamples = examplesExpanded ? EXAMPLE_QUESTIONS : EXAMPLE_QUESTIONS.slice(0, 3);

  const handleExampleClick = (queryEn: string, queryAr: string) => {
    const q = language === 'ar' ? queryAr : queryEn;
    sendAIMessage(q);
    setCurrentView('map');
  };

  return (
    <div className="relative w-full min-h-screen pt-16 sm:pt-20 lg:pt-22 pb-8 sm:pb-12 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col items-start justify-between bg-spatial-canvas dark:bg-[#041F3B] overflow-y-auto overflow-x-hidden transition-all duration-1000">
      
      {/* Dynamic Time-Based Abu Dhabi Background Image Layer */}
      <img
        src={getAssetUrl(activeTheme.bgImage)}
        alt="GeoVision Abu Dhabi Spatial Canvas"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 pointer-events-none z-0 opacity-100 ${
          language === 'ar' ? '-scale-x-100' : ''
        }`}
      />

      {/* Atmospheric Lighting Overlay for Morning, Afternoon, Sunset, Evening, & Night */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000"
        style={{ background: activeTheme.overlayGradient }}
      />

      {/* Animated GeoAI Light Trails & GIS Beacons */}
      <GeoAILightTrailsOverlay theme={activeTheme} />

      {/* Smooth Legibility Scrim Gradient for Hero Content */}
      <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} w-full sm:w-3/4 md:w-3/5 lg:w-[55%] ${activeTheme.scrimGradient} pointer-events-none z-0 transition-all duration-1000`} />

      {/* Hero & Search Launchpad */}
      <div className="relative z-10 w-full max-w-5xl text-left rtl:text-right space-y-3 sm:space-y-4 my-auto flex flex-col items-start rtl:items-start">

        {/* GeoVision Hero Brand Logo with Dynamic Animated Globe & Tagline */}
        <div className="flex flex-col items-start w-full py-1">
          {/* Main GeoVision Title with Dynamic Time Theme Colors */}
          <div className="flex items-center flex-nowrap text-3xl xs:text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-sans tracking-tight select-none leading-none min-w-0">
            {/* "Ge" text */}
            <span
              className="geovision-title-ge relative z-10 shrink-0 transition-all duration-700"
              style={{ background: activeTheme.titleGeGradient }}
            >
              Ge
            </span>

            {/* Animated GeoVision Globe GIF */}
            <div className="relative inline-flex items-center justify-center shrink-0 w-[1.1em] h-[1.1em] self-center overflow-hidden -ml-0.5 sm:-ml-1 md:-ml-1.5 -mr-2 sm:-mr-3.5 md:-mr-5">
              <img
                src={getAssetUrl('GioVision Loading Gif without gradient.gif')}
                alt="GeoVision Globe Animation"
                className="w-full h-full object-cover object-center scale-[2.15] pointer-events-none select-none drop-shadow-md"
              />
            </div>

            {/* "Vision" text */}
            <span
              className="geovision-title-vision shrink-0 transition-all duration-700"
              style={{ background: activeTheme.titleVisionGradient }}
            >
              Vision
            </span>
          </div>

          {/* Tagline Strip in vibrant blue color with white glow blur effect */}
          <div className="flex items-center gap-1.5 sm:gap-3 w-full max-w-xl sm:max-w-2xl mt-2 sm:mt-3">
            <div
              className="flex-1 h-[2px] rounded-full opacity-90 bg-gradient-to-r from-transparent via-[#022054] to-[#0849A3] dark:via-[#38BDF8] dark:to-[#60A5FA]"
            />
            <span className={`shrink-0 text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.16em] xs:tracking-[0.22em] sm:tracking-[0.28em] ${activeTheme.isDarkBase ? 'text-sky-300' : 'text-[#022054]'}`}>
              {language === 'ar' ? activeTheme.taglineTextAr : activeTheme.taglineTextEn}
            </span>
            <div
              className="flex-1 h-[2px] rounded-full opacity-90 bg-gradient-to-r from-[#0849A3] via-[#0093A8] to-transparent dark:from-[#60A5FA] dark:via-[#38BDF8]"
            />
          </div>
        </div>

        {/* Small Elegant Sub-Headline */}
        <h2 className={`text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight mt-1 sm:mt-2 ${activeTheme.subheadColor}`}>
          {language === 'ar' ? (
            <>
              استكشف البيانات المكانية في <span className="text-[#0849A3] dark:text-[#38BDF8] font-black underline underline-offset-4 decoration-[#0849A3]/40">أبوظبي</span>
            </>
          ) : (
            <>
              Explore Public Data Across <span className="text-[#0849A3] dark:text-[#38BDF8] font-black underline underline-offset-4 decoration-[#0849A3]/40">Abu Dhabi</span>
            </>
          )}
        </h2>

        {/* Description Subtitle */}
        <p className={`text-xs sm:text-sm max-w-2xl font-semibold leading-relaxed ${activeTheme.subtitleColor}`}>
          {language === 'ar'
            ? 'ابحث عن أسئلة باللغة الطبيعية، واكتشف البيانات المكانية الموثوقة، واستكشف الخرائط التفاعلية في جميع أنحاء الإمارة.'
            : 'Search natural language questions, discover authoritative public datasets, and explore interactive maps across the emirate.'}
        </p>

        {/* Main Glass AI Search Bar */}
        <div className="pt-0.5 w-full">
          <AISearchBar hideThemes={true} />
        </div>

        {/* Try an example Section with Expandable Options */}
        <div className="w-full space-y-1.5 pt-0.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <span>{language === 'ar' ? 'جرب مثالاً:' : 'Try an example:'}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100/90 dark:bg-blue-950/80 text-[#0849A3] dark:text-sky-300 border border-blue-200/80 dark:border-sky-800/60">
                {examplesExpanded ? EXAMPLE_QUESTIONS.length : `3 of ${EXAMPLE_QUESTIONS.length}`}
              </span>
            </span>
          </div>

          <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 transition-all duration-300 ${
            examplesExpanded ? 'max-h-48 sm:max-h-56 overflow-y-auto pr-1 py-0.5' : ''
          }`}>
            {displayedExamples.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleExampleClick(item.queryEn, item.queryAr)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-slate-900/85 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/80 hover:border-[#0849A3] hover:text-[#0849A3] dark:hover:border-sky-400 dark:hover:text-sky-300 shadow-2xs hover:shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
                >
                  <IconComp className="w-3.5 h-3.5 text-[#0849A3] dark:text-sky-400 shrink-0" />
                  <span>{language === 'ar' ? item.textAr : item.textEn}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setExamplesExpanded(prev => !prev)}
              className="inline-flex items-center gap-1 px-3 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold text-[#215A9E] dark:text-sky-300 bg-sky-50/80 dark:bg-sky-950/60 border border-dashed border-sky-300 dark:border-sky-700 hover:bg-sky-100 dark:hover:bg-sky-900/80 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              {examplesExpanded ? (
                <>
                  <span>{language === 'ar' ? 'عرض أقل' : 'Show less'}</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>{language === 'ar' ? `المزيد (${EXAMPLE_QUESTIONS.length - 3}+)...` : `More (${EXAMPLE_QUESTIONS.length - 3}+)...`}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Explore by theme Section — Hidden for now */}
        {/*
        <div className="w-full space-y-1 pt-0.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#063360] dark:text-slate-200">
            <span>{language === 'ar' ? 'استكشاف حسب الموضوع:' : 'Explore by theme:'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 transition-all duration-300">
            {displayedThemes.map((item) => {
              const IconComp = item.icon;
              const label = language === 'ar' ? item.labelAr : item.labelEn;
              return (
                <button
                  key={item.id}
                  onClick={() => handleThemeQueryClick(item.queryEn, item.queryAr)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold bg-white/75 dark:bg-slate-900/80 text-[#063360] dark:text-slate-100 border border-sky-200/70 dark:border-slate-700/80 hover:border-[#215A9E] hover:bg-[#215A9E] hover:text-white dark:hover:bg-[#215A9E] dark:hover:text-white shadow-2xs transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md group animate-in fade-in zoom-in-95 duration-150"
                >
                  <IconComp className="w-3.5 h-3.5 text-[#215A9E] group-hover:text-white shrink-0 transition-colors" />
                  <span>{label}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setShowAllThemes(prev => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-extrabold shadow-2xs transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md ${
                showAllThemes
                  ? 'bg-[#215A9E] text-white border border-[#215A9E]'
                  : 'bg-white/75 dark:bg-slate-900/80 text-[#063360] dark:text-slate-100 border border-sky-200/70 dark:border-slate-700/80 hover:border-[#215A9E] hover:bg-[#215A9E] hover:text-white'
              }`}
            >
              {showAllThemes ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'ar' ? 'عرض أقل' : 'Show less'}</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-3.5 h-3.5 text-[#215A9E] group-hover:text-white shrink-0 transition-colors" />
                  <span>{language === 'ar' ? 'جميع الموضوعات' : 'All themes'}</span>
                </>
              )}
            </button>
          </div>
        </div>
        */}

        {/* 3 Main Quick-Launch Cards Row (Static presentation cards) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-1 sm:pt-1.5">
          
          {/* Card 1: Ask GeoVision */}
          <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex items-center min-h-[84px] sm:min-h-[92px] cursor-default select-none">
            <div className="relative z-10 flex items-center gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E6ADB] via-[#215A9E] to-[#0A3B73] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-black text-[#001D40] dark:text-white">
                  {language === 'ar' ? 'اسأل GeoVision' : 'Ask GeoVision'}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-[#052447] dark:text-slate-200 leading-snug max-w-[210px]">
                  {language === 'ar'
                    ? 'احصل على إجابات فورية للأماكن والخدمات والبيانات المكانية.'
                    : 'Get instant answers about places, services and spatial data.'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Explore Map */}
          <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex items-center min-h-[84px] sm:min-h-[92px] cursor-default select-none">
            <div className="relative z-10 flex items-center gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E6ADB] via-[#215A9E] to-[#0A3B73] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Map className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-black text-[#001D40] dark:text-white">
                  {language === 'ar' ? 'استكشاف الخريطة' : 'Explore Map'}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-[#052447] dark:text-slate-200 leading-snug max-w-[210px]">
                  {language === 'ar'
                    ? 'تصفح وابحث وحلل البيانات في كافة أنحاء أبوظبي.'
                    : 'Browse, search and analyse data across Abu Dhabi.'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Discover Data */}
          <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex items-center min-h-[84px] sm:min-h-[92px] cursor-default select-none">
            <div className="relative z-10 flex items-center gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E6ADB] via-[#215A9E] to-[#0A3B73] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-black text-[#001D40] dark:text-white">
                  {language === 'ar' ? 'اكتشاف البيانات' : 'Discover Data'}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-[#052447] dark:text-slate-200 leading-snug max-w-[210px]">
                  {language === 'ar'
                    ? 'ابحث واستكشف المجموعات الموثوقة للبيانات العامة.'
                    : 'Find and explore authoritative public datasets.'}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LandingPage;
