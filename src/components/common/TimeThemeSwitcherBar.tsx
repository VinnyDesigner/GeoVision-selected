import React from 'react';
import { TIME_THEMES, type TimeThemeId, type TimeThemeConfig } from '../../utils/timeThemeUtils';
import { Clock, Sparkles } from 'lucide-react';

interface TimeThemeSwitcherBarProps {
  formattedTime: string;
  activeTheme: TimeThemeConfig;
  isAutoMode: boolean;
  language: string;
  onSetThemeOverride: (themeId: TimeThemeId) => void;
  onResetToAuto: () => void;
}

export const TimeThemeSwitcherBar: React.FC<TimeThemeSwitcherBarProps> = ({
  formattedTime,
  activeTheme,
  isAutoMode,
  language,
  onSetThemeOverride,
  onResetToAuto
}) => {
  const themesList: TimeThemeId[] = ['morning', 'afternoon', 'sunset', 'evening', 'night'];

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-2.5 py-2 px-3 rounded-2xl bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm transition-all duration-300">
      
      {/* Real-Time Abu Dhabi Clock & Active Theme Indicator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 text-white text-xs font-mono font-bold shadow-xs">
          <Clock className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>{formattedTime} GST</span>
        </div>

        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-extrabold border ${activeTheme.badgeStyle} transition-all duration-500`}>
          <span>{activeTheme.icon}</span>
          <span>{language === 'ar' ? activeTheme.nameAr : activeTheme.nameEn}</span>
          <span className="opacity-75 font-mono text-[10px] hidden sm:inline">
            ({language === 'ar' ? activeTheme.timeRangeAr : activeTheme.timeRangeEn})
          </span>
        </div>
      </div>

      {/* Interactive 5-Time Theme Switcher Controls */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
        <button
          onClick={onResetToAuto}
          title={language === 'ar' ? 'التزامن مع التوقيت الفعلي' : 'Auto Real-Time Sync'}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
            isAutoMode
              ? 'bg-[#0849A3] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
          <span>{language === 'ar' ? 'تلقائي (توقيت النظام)' : 'Auto Sync'}</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-0.5 shrink-0" />

        {themesList.map((id) => {
          const theme = TIME_THEMES[id];
          const isSelected = !isAutoMode && activeTheme.id === id;
          return (
            <button
              key={id}
              onClick={() => onSetThemeOverride(id)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-extrabold transition-all duration-200 cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-xs scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{theme.icon}</span>
              <span className="hidden md:inline">{language === 'ar' ? theme.nameAr.split(' ')[0] : id.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
