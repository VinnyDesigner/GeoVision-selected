import React from 'react';
import { AISearchBar } from '../ai/AISearchBar';
import { useAppState } from '../../context/AppStateContext';
import { getAssetUrl } from '../../utils/assetUtils';
import {
  MapPin,
  GraduationCap,
  BarChart3,
  Sparkles,
  Map,
  Layers,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { language, theme, setCurrentView, sendAIMessage } = useAppState();

  const handleExampleClick = (queryEn: string, queryAr: string) => {
    const q = language === 'ar' ? queryAr : queryEn;
    sendAIMessage(q);
    setCurrentView('map');
  };

  return (
    <div className="relative w-full h-screen max-h-screen pt-16 sm:pt-20 lg:pt-22 pb-4 sm:pb-6 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col items-start justify-between bg-spatial-canvas dark:bg-[#041F3B] overflow-hidden">
      
      {/* Crisp Homepage Background Image Layer */}
      <img
        src={getAssetUrl(theme === 'dark' ? 'homepage-bg-dark (3).png' : 'homepage-bg-light (3).png')}
        alt="GeoVision Abu Dhabi Spatial Canvas"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 pointer-events-none z-0 opacity-100 ${
          language === 'ar' ? '-scale-x-100' : ''
        }`}
      />

      {/* Hero & Search Launchpad */}
      <div className="relative z-10 w-full max-w-5xl text-left rtl:text-right space-y-2.5 sm:space-y-3.5 my-auto flex flex-col items-start rtl:items-start">
        
        {/* GeoVision Hero Brand Logo */}
        <div className="flex items-start justify-start w-full -mb-3 sm:-mb-5 md:-mb-6">
          <img
            src={getAssetUrl(theme === 'dark' ? 'assets/logos/geovision-logo-brand-dark.png' : 'assets/logos/geovision-logo-brand-light.png')}
            alt="GeoVision"
            className="h-20 sm:h-28 md:h-36 lg:h-44 xl:h-48 max-w-full object-contain object-left rtl:object-right transition-all duration-300 drop-shadow-md -ml-1 rtl:-ml-0 rtl:-mr-1"
          />
        </div>

        {/* Small Elegant Sub-Headline */}
        <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-[#063360] dark:text-white tracking-tight drop-shadow-sm">
          {language === 'ar' ? (
            <>
              استكشف البيانات المكانية في <span className="text-[#215A9E] font-black underline underline-offset-4 decoration-[#7DA1C4]">أبوظبي</span>
            </>
          ) : (
            <>
              Explore Public Data Across <span className="text-[#215A9E] font-black underline underline-offset-4 decoration-[#7DA1C4]">Abu Dhabi</span>
            </>
          )}
        </h2>

        {/* Description Subtitle */}
        <p className="text-xs sm:text-sm text-[#545860] dark:text-slate-200 max-w-2xl font-semibold leading-relaxed drop-shadow-xs">
          {language === 'ar'
            ? 'ابحث عن أسئلة باللغة الطبيعية، واكتشف البيانات المكانية الموثوقة، واستكشف الخرائط التفاعلية في جميع أنحاء الإمارة.'
            : 'Search natural language questions, discover authoritative public datasets, and explore interactive maps across the emirate.'}
        </p>

        {/* Main Glass AI Search Bar */}
        <div className="pt-0.5 w-full">
          <AISearchBar hideThemes={true} />
        </div>

        {/* Try an example Section */}
        <div className="w-full space-y-1 pt-0.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#063360] dark:text-slate-200">
            <span>{language === 'ar' ? 'جرب مثالاً:' : 'Try an example:'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => handleExampleClick('Find hospitals near me', 'عرض المستشفيات القريبة مني')}
              className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold bg-white/75 dark:bg-slate-900/80 text-[#063360] dark:text-slate-100 border border-sky-200/70 dark:border-slate-700/80 hover:border-[#215A9E] hover:bg-white dark:hover:bg-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md"
            >
              <MapPin className="w-3.5 h-3.5 text-[#215A9E] shrink-0" />
              <span>{language === 'ar' ? 'البحث عن المستشفيات القريبة مني' : 'Find hospitals near me'}</span>
            </button>

            <button
              onClick={() => handleExampleClick('Show schools near bus stations in Abu Dhabi', 'عرض المدارس بالقرب من محطات الحافلات في أبوظبي')}
              className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold bg-white/75 dark:bg-slate-900/80 text-[#063360] dark:text-slate-100 border border-sky-200/70 dark:border-slate-700/80 hover:border-[#215A9E] hover:bg-white dark:hover:bg-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#215A9E] shrink-0" />
              <span>{language === 'ar' ? 'المدارس القريبة من محطات الحافلات' : 'Schools near bus stations'}</span>
            </button>

            <button
              onClick={() => handleExampleClick('Compare facilities by district in Abu Dhabi', 'مقارنة المرافق والخدمات حسب القطاع والمنطقة')}
              className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold bg-white/75 dark:bg-slate-900/80 text-[#063360] dark:text-slate-100 border border-sky-200/70 dark:border-slate-700/80 hover:border-[#215A9E] hover:bg-white dark:hover:bg-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#215A9E] shrink-0" />
              <span>{language === 'ar' ? 'مقارنة المرافق حسب المنطقة' : 'Compare facilities by district'}</span>
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

        {/* 3 Main Quick-Launch Cards Row */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-1 sm:pt-1.5">
          
          {/* Card 1: Ask GeoVision */}
          <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex items-center min-h-[84px] sm:min-h-[92px] transition-all">
            <div className="relative z-10 flex items-center gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E6ADB] via-[#215A9E] to-[#0A3B73] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-extrabold text-[#063360] dark:text-white">
                  {language === 'ar' ? 'اسأل GeoVision' : 'Ask GeoVision'}
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-[#545860] dark:text-slate-300 leading-snug max-w-[210px]">
                  {language === 'ar'
                    ? 'احصل على إجابات فورية للأماكن والخدمات والبيانات المكانية.'
                    : 'Get instant answers about places, services and spatial data.'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Explore Map */}
          <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex items-center min-h-[84px] sm:min-h-[92px] transition-all">
            <div className="relative z-10 flex items-center gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E6ADB] via-[#215A9E] to-[#0A3B73] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Map className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-extrabold text-[#063360] dark:text-white">
                  {language === 'ar' ? 'استكشاف الخريطة' : 'Explore Map'}
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-[#545860] dark:text-slate-300 leading-snug max-w-[210px]">
                  {language === 'ar'
                    ? 'تصفح وابحث وحلل البيانات في كافة أنحاء أبوظبي.'
                    : 'Browse, search and analyse data across Abu Dhabi.'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Discover Data */}
          <div className="relative glass-panel rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex items-center min-h-[84px] sm:min-h-[92px] transition-all">
            <div className="relative z-10 flex items-center gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E6ADB] via-[#215A9E] to-[#0A3B73] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-extrabold text-[#063360] dark:text-white">
                  {language === 'ar' ? 'اكتشاف البيانات' : 'Discover Data'}
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-[#545860] dark:text-slate-300 leading-snug max-w-[210px]">
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
