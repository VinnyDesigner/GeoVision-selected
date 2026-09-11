import React from 'react';
import { AISearchBar } from '../ai/AISearchBar';
import { useAppState } from '../../context/AppStateContext';

export const LandingPage: React.FC = () => {
  const { language, theme } = useAppState();

  return (
    <div className="relative w-full min-h-screen pt-24 sm:pt-28 pb-10 px-4 sm:px-12 md:px-16 flex flex-col items-start justify-between bg-spatial-canvas dark:bg-[#041F3B] overflow-hidden">
      
      {/* Crisp Homepage Background Image Layer */}
      <img
        src={theme === 'dark' ? '/homepage bg dark.png' : '/homepage bg light.png'}
        alt="GeoVision Abu Dhabi Spatial Canvas"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 pointer-events-none z-0 opacity-100 ${
          language === 'ar' ? '-scale-x-100' : ''
        }`}
      />

      {/* Hero & Search Launchpad */}
      <div className="relative z-10 w-full max-w-3xl text-left rtl:text-right space-y-4 my-auto flex flex-col items-start rtl:items-start">
        
        {/* BIG GeoVision Hero Brand Logo */}
        <div className="flex items-start justify-start w-full mb-1">
          <img
            src={theme === 'dark' ? '/assets/logos/geovision-logo-brand-dark.png' : '/assets/logos/geovision-logo-brand-light.png'}
            alt="GeoVision"
            className="h-20 sm:h-28 md:h-36 lg:h-40 max-w-full object-contain object-left rtl:object-right transition-all duration-300 drop-shadow-md -ml-1 rtl:-ml-0 rtl:-mr-1"
          />
        </div>

        {/* Small Elegant Sub-Headline */}
        <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#063360] dark:text-white tracking-tight drop-shadow-sm">
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
        <p className="text-xs sm:text-sm sm:text-base text-[#545860] dark:text-slate-200 max-w-xl font-bold leading-relaxed drop-shadow-xs">
          {language === 'ar'
            ? 'ابحث عن أسئلة باللغة الطبيعية، واكتشف البيانات المكانية الموثوقة، واستكشف الخرائط التفاعلية في جميع أنحاء الإمارة.'
            : 'Search natural language questions, discover authoritative public datasets, and explore interactive maps across the emirate.'}
        </p>

        {/* Main Glass AI Search Bar */}
        <div className="pt-2 w-full">
          <AISearchBar />
        </div>

      </div>

    </div>
  );
};

export default LandingPage;
