import React, { useState } from 'react';
import { AISearchBar } from '../ai/AISearchBar';
import { useAppState } from '../../context/AppStateContext';
import { getAssetUrl } from '../../utils/assetUtils';
import {
  MapPin,
  GraduationCap,
  BarChart3,
  Stethoscope,
  Bus,
  Leaf,
  Map,
  LayoutGrid,
  Sparkles,
  Layers,
  ShieldCheck,
  Compass,
  Zap,
  Building,
  Landmark,
  Waves,
  Mountain,
  Building2,
  Trees,
  ChevronUp,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { language, theme, setCurrentView, sendAIMessage } = useAppState();
  const [showAllThemes, setShowAllThemes] = useState(false);

  const SPATIAL_THEMES = [
    { id: 'education', labelEn: 'Education', labelAr: 'التعليم', icon: GraduationCap, queryEn: 'Show all schools in Abu Dhabi.', queryAr: 'عرض جميع المدارس في أبوظبي.' },
    { id: 'healthcare', labelEn: 'Healthcare', labelAr: 'الرعاية الصحية', icon: Stethoscope, queryEn: 'Show all hospitals in Abu Dhabi.', queryAr: 'عرض جميع المستشفيات في أبوظبي.' },
    { id: 'transportation', labelEn: 'Transportation', labelAr: 'النقل والمواصلات', icon: Bus, queryEn: 'Show bus stops near me.', queryAr: 'عرض محطات الحافلات في أبوظبي.' },
    { id: 'environment', labelEn: 'Environment', labelAr: 'البيئة والمحميات', icon: Leaf, queryEn: 'Show protected areas in Abu Dhabi.', queryAr: 'عرض المحميات الطبيعية في أبوظبي.' },
    { id: 'land_use', labelEn: 'Land Use', labelAr: 'استخدامات الأراضي', icon: Map, queryEn: 'Show land-use categories in Abu Dhabi.', queryAr: 'عرض تصنيفات استخدامات الأراضي.' },
    { id: 'public_safety', labelEn: 'Public Safety', labelAr: 'الأمن والسلامة العامة', icon: ShieldCheck, queryEn: 'Show police stations in Abu Dhabi.', queryAr: 'عرض مراكز الشرطة في أبوظبي.' },
    { id: 'tourism', labelEn: 'Tourism', labelAr: 'السياحة وثقافة', icon: Compass, queryEn: 'Show tourist attractions in Abu Dhabi.', queryAr: 'عرض الوجهات السياحية في أبوظبي.' },
    { id: 'utilities', labelEn: 'Utilities', labelAr: 'الخدمات والمرافق', icon: Zap, queryEn: 'Show petrol stations in Abu Dhabi.', queryAr: 'عرض محطات الوقود في أبوظبي.' },
    { id: 'urban', labelEn: 'Urban Planning', labelAr: 'التخطيط العمراني', icon: Building, queryEn: 'Show urban development projects.', queryAr: 'عرض مشاريع التطوير العمراني.' },
    { id: 'administrative', labelEn: 'Administrative', labelAr: 'الحدود الإدارية', icon: Landmark, queryEn: 'Show municipality boundaries.', queryAr: 'عرض حدود بلديات أبوظبي.' },
    { id: 'hydrography', labelEn: 'Hydrography', labelAr: 'السطوح المائية', icon: Waves, queryEn: 'Show hydrography features.', queryAr: 'عرض المعالم المائية والهيدروغرافية.' },
    { id: 'geology', labelEn: 'Geology', labelAr: 'الجيولوجيا', icon: Mountain, queryEn: 'Show geological features.', queryAr: 'عرض المعالم الجيولوجية.' },
    { id: 'government', labelEn: 'Government Services', labelAr: 'الخدمات الحكومية', icon: Building2, queryEn: 'Show TAMM customer happiness centers in Abu Dhabi.', queryAr: 'عرض مراكز خدمة تم الحكومية في أبوظبي.' },
    { id: 'parks', labelEn: 'Parks & Spaces', labelAr: 'الحدائق والمساحات العامة', icon: Trees, queryEn: 'Show public parks in Abu Dhabi.', queryAr: 'عرض الحدائق العامة في أبوظبي.' },
  ];

  const displayedThemes = showAllThemes ? SPATIAL_THEMES : SPATIAL_THEMES.slice(0, 5);

  const handleExampleClick = (queryEn: string, queryAr: string) => {
    const q = language === 'ar' ? queryAr : queryEn;
    sendAIMessage(q);
    setCurrentView('map');
  };

  const handleThemeQueryClick = (queryEn: string, queryAr: string) => {
    const q = language === 'ar' ? queryAr : queryEn;
    sendAIMessage(q);
    setCurrentView('map');
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] sm:min-h-screen pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col items-start justify-between bg-spatial-canvas dark:bg-[#041F3B] overflow-hidden">
      
      {/* Crisp Homepage Background Image Layer */}
      <img
        src={getAssetUrl(theme === 'dark' ? 'homepage-bg-dark (2).png' : 'homepage-bg-light (2).png')}
        alt="GeoVision Abu Dhabi Spatial Canvas"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 pointer-events-none z-0 opacity-100 ${
          language === 'ar' ? '-scale-x-100' : ''
        }`}
      />

      {/* Hero & Search Launchpad */}
      <div className="relative z-10 w-full max-w-5xl text-left rtl:text-right space-y-4 sm:space-y-4.5 my-auto flex flex-col items-start rtl:items-start">
        
        {/* GeoVision Hero Brand Logo */}
        <div className="flex items-start justify-start w-full mb-0.5">
          <img
            src={getAssetUrl(theme === 'dark' ? 'assets/logos/geovision-logo-brand-dark.png' : 'assets/logos/geovision-logo-brand-light.png')}
            alt="GeoVision"
            className="h-14 sm:h-20 md:h-26 lg:h-28 max-w-full object-contain object-left rtl:object-right transition-all duration-300 drop-shadow-md -ml-1 rtl:-ml-0 rtl:-mr-1"
          />
        </div>

        {/* Small Elegant Sub-Headline */}
        <h2 className="text-base sm:text-xl md:text-2xl font-extrabold text-[#063360] dark:text-white tracking-tight drop-shadow-sm">
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
        <div className="w-full space-y-1.5 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#063360] dark:text-slate-200">
            <span>{language === 'ar' ? 'جرب مثالاً:' : 'Try an example:'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => handleExampleClick('Find hospitals near me', 'عرض المستشفيات القريبة مني')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/75 dark:bg-slate-900/80 text-[#063360] dark:text-slate-100 border border-sky-200/70 dark:border-slate-700/80 hover:border-[#215A9E] hover:bg-white dark:hover:bg-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md"
            >
              <MapPin className="w-3.5 h-3.5 text-[#215A9E] shrink-0" />
              <span>{language === 'ar' ? 'البحث عن المستشفيات القريبة مني' : 'Find hospitals near me'}</span>
            </button>

            <button
              onClick={() => handleExampleClick('Show schools near bus stations in Abu Dhabi', 'عرض المدارس بالقرب من محطات الحافلات في أبوظبي')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/75 dark:bg-slate-900/80 text-[#063360] dark:text-slate-100 border border-sky-200/70 dark:border-slate-700/80 hover:border-[#215A9E] hover:bg-white dark:hover:bg-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#215A9E] shrink-0" />
              <span>{language === 'ar' ? 'المدارس القريبة من محطات الحافلات' : 'Schools near bus stations'}</span>
            </button>

            <button
              onClick={() => handleExampleClick('Compare facilities by district in Abu Dhabi', 'مقارنة المرافق والخدمات حسب القطاع والمنطقة')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/75 dark:bg-slate-900/80 text-[#063360] dark:text-slate-100 border border-sky-200/70 dark:border-slate-700/80 hover:border-[#215A9E] hover:bg-white dark:hover:bg-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#215A9E] shrink-0" />
              <span>{language === 'ar' ? 'مقارنة المرافق حسب المنطقة' : 'Compare facilities by district'}</span>
            </button>
          </div>
        </div>

        {/* Explore by theme Section */}
        <div className="w-full space-y-1.5 pt-1">
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/75 dark:bg-slate-900/80 text-[#063360] dark:text-slate-100 border border-sky-200/70 dark:border-slate-700/80 hover:border-[#215A9E] hover:bg-[#215A9E] hover:text-white dark:hover:bg-[#215A9E] dark:hover:text-white shadow-2xs transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md group animate-in fade-in zoom-in-95 duration-150"
                >
                  <IconComp className="w-3.5 h-3.5 text-[#215A9E] group-hover:text-white shrink-0 transition-colors" />
                  <span>{label}</span>
                </button>
              );
            })}

            {/* Expand / Collapse Toggle Button */}
            <button
              type="button"
              onClick={() => setShowAllThemes(prev => !prev)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-2xs transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md ${
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

        {/* 3 Main Quick-Launch Cards Row */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 pt-2">
          
          {/* Card 1: Ask GeoVision */}
          <div className="relative glass-panel rounded-3xl p-4.5 sm:p-5 flex items-center min-h-[100px] sm:min-h-[108px] transition-all">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E6ADB] via-[#215A9E] to-[#0A3B73] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-[#063360] dark:text-white">
                  {language === 'ar' ? 'اسأل GeoVision' : 'Ask GeoVision'}
                </h3>
                <p className="text-xs font-semibold text-[#545860] dark:text-slate-300 leading-snug max-w-[210px]">
                  {language === 'ar'
                    ? 'احصل على إجابات فورية للأماكن والخدمات والبيانات المكانية.'
                    : 'Get instant answers about places, services and spatial data.'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Explore Map */}
          <div className="relative glass-panel rounded-3xl p-4.5 sm:p-5 flex items-center min-h-[100px] sm:min-h-[108px] transition-all">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E6ADB] via-[#215A9E] to-[#0A3B73] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-[#063360] dark:text-white">
                  {language === 'ar' ? 'استكشاف الخريطة' : 'Explore Map'}
                </h3>
                <p className="text-xs font-semibold text-[#545860] dark:text-slate-300 leading-snug max-w-[210px]">
                  {language === 'ar'
                    ? 'تصفح وابحث وحلل البيانات في كافة أنحاء أبوظبي.'
                    : 'Browse, search and analyse data across Abu Dhabi.'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Discover Data */}
          <div className="relative glass-panel rounded-3xl p-4.5 sm:p-5 flex items-center min-h-[100px] sm:min-h-[108px] transition-all">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E6ADB] via-[#215A9E] to-[#0A3B73] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-[#063360] dark:text-white">
                  {language === 'ar' ? 'اكتشاف البيانات' : 'Discover Data'}
                </h3>
                <p className="text-xs font-semibold text-[#545860] dark:text-slate-300 leading-snug max-w-[210px]">
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
