export type TimeThemeId = 'morning' | 'afternoon' | 'sunset' | 'evening' | 'night';

export interface TimeThemeConfig {
  id: TimeThemeId;
  nameEn: string;
  nameAr: string;
  timeRangeEn: string;
  timeRangeAr: string;
  icon: string;
  bgImage: string;
  isDarkBase: boolean;
  overlayGradient: string;
  scrimGradient: string;
  titleGeGradient: string;
  titleVisionGradient: string;
  subheadColor: string;
  subtitleColor: string;
  taglineTextEn: string;
  taglineTextAr: string;
  badgeStyle: string;
  gisGlowColor: string;
  roadTrailColor: string;
}

export const TIME_THEMES: Record<TimeThemeId, TimeThemeConfig> = {
  morning: {
    id: 'morning',
    nameEn: 'Morning Atmosphere',
    nameAr: 'أجواء الصباح',
    timeRangeEn: '6:00 AM – 11:59 AM',
    timeRangeAr: '6:00 ص – 11:59 ص',
    icon: '🌅',
    bgImage: 'bg3white.png',
    isDarkBase: false,
    overlayGradient: 'linear-gradient(135deg, rgba(255, 243, 200, 0.35) 0%, rgba(186, 230, 253, 0.2) 100%)',
    scrimGradient: 'from-amber-50/95 via-sky-50/85 to-transparent dark:from-[#031B33]/95 dark:via-[#031B33]/85 dark:to-transparent',
    titleGeGradient: 'linear-gradient(135deg, #022054 0%, #0849A3 100%)',
    titleVisionGradient: 'linear-gradient(135deg, #0849A3 0%, #0093A8 50%, #05B386 100%)',
    subheadColor: 'text-slate-900 dark:text-white',
    subtitleColor: 'text-slate-700 dark:text-slate-200',
    taglineTextEn: 'SPATIAL INTELLIGENCE FOR A SMARTER TOMORROW',
    taglineTextAr: 'الذكاء المكاني لغدٍ أكثر ذكاءً',
    badgeStyle: 'bg-amber-100/90 text-amber-900 border-amber-300/80 shadow-amber-500/10',
    gisGlowColor: 'rgba(245, 158, 11, 0.6)',
    roadTrailColor: '#F59E0B'
  },
  afternoon: {
    id: 'afternoon',
    nameEn: 'Afternoon Daylight',
    nameAr: 'ضوء النهار',
    timeRangeEn: '12:00 PM – 4:59 PM',
    timeRangeAr: '12:00 م – 4:59 م',
    icon: '☀️',
    bgImage: 'bg3white.png',
    isDarkBase: false,
    overlayGradient: 'linear-gradient(180deg, rgba(56, 189, 248, 0.12) 0%, rgba(255, 255, 255, 0) 100%)',
    scrimGradient: 'from-white/95 via-white/80 to-transparent dark:from-[#041F3B]/95 dark:via-[#041F3B]/85 dark:to-transparent',
    titleGeGradient: 'linear-gradient(135deg, #022054 0%, #0849A3 100%)',
    titleVisionGradient: 'linear-gradient(135deg, #0849A3 0%, #0093A8 50%, #05B386 100%)',
    subheadColor: 'text-slate-900 dark:text-white',
    subtitleColor: 'text-slate-700 dark:text-slate-200',
    taglineTextEn: 'SPATIAL INTELLIGENCE FOR A SMARTER TOMORROW',
    taglineTextAr: 'الذكاء المكاني لغدٍ أكثر ذكاءً',
    badgeStyle: 'bg-sky-100/90 text-sky-900 border-sky-300/80 shadow-sky-500/10',
    gisGlowColor: 'rgba(14, 165, 233, 0.6)',
    roadTrailColor: '#0EA5E9'
  },
  sunset: {
    id: 'sunset',
    nameEn: 'Golden Hour Sunset',
    nameAr: 'غروب الشمس الذهبي',
    timeRangeEn: '5:00 PM – 7:00 PM',
    timeRangeAr: '5:00 م – 7:00 م',
    icon: '🌇',
    bgImage: 'homepage bg light-new.png',
    isDarkBase: true,
    overlayGradient: 'linear-gradient(135deg, rgba(255, 115, 60, 0.32) 0%, rgba(168, 85, 247, 0.25) 50%, rgba(15, 23, 42, 0.4) 100%)',
    scrimGradient: 'from-[#2B1028]/95 via-[#1D0C27]/85 to-transparent',
    titleGeGradient: 'linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%)',
    titleVisionGradient: 'linear-gradient(135deg, #FEB47B 0%, #F43F5E 50%, #C084FC 100%)',
    subheadColor: 'text-amber-100',
    subtitleColor: 'text-amber-200/90',
    taglineTextEn: 'SPATIAL INTELLIGENCE FOR A SMARTER TOMORROW',
    taglineTextAr: 'الذكاء المكاني لغدٍ أكثر ذكاءً',
    badgeStyle: 'bg-gradient-to-r from-orange-500/30 to-purple-600/30 text-amber-200 border-amber-400/50 shadow-orange-500/20',
    gisGlowColor: 'rgba(249, 115, 22, 0.8)',
    roadTrailColor: '#F97316'
  },
  evening: {
    id: 'evening',
    nameEn: 'Twilight Evening',
    nameAr: 'أجواء المساء',
    timeRangeEn: '7:01 PM – 10:00 PM',
    timeRangeAr: '7:01 م – 10:00 م',
    icon: '🌆',
    bgImage: 'bg3dark.png',
    isDarkBase: true,
    overlayGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 58, 138, 0.4) 50%, rgba(14, 165, 233, 0.2) 100%)',
    scrimGradient: 'from-[#0B172B]/95 via-[#0B172B]/85 to-transparent',
    titleGeGradient: 'linear-gradient(135deg, #60A5FA 0%, #38BDF8 100%)',
    titleVisionGradient: 'linear-gradient(135deg, #38BDF8 0%, #2DD4BF 50%, #34D399 100%)',
    subheadColor: 'text-white',
    subtitleColor: 'text-slate-200',
    taglineTextEn: 'SPATIAL INTELLIGENCE FOR A SMARTER TOMORROW',
    taglineTextAr: 'الذكاء المكاني لغدٍ أكثر ذكاءً',
    badgeStyle: 'bg-indigo-950/80 text-indigo-200 border-indigo-500/50 shadow-indigo-500/20',
    gisGlowColor: 'rgba(99, 102, 241, 0.8)',
    roadTrailColor: '#6366F1'
  },
  night: {
    id: 'night',
    nameEn: 'Night Digital Twin',
    nameAr: 'التوأم الرقمي الليلي',
    timeRangeEn: '10:01 PM – 5:59 AM',
    timeRangeAr: '10:01 م – 5:59 ص',
    icon: '🌙',
    bgImage: 'bg3dark.png',
    isDarkBase: true,
    overlayGradient: 'linear-gradient(135deg, rgba(2, 6, 23, 0.65) 0%, rgba(3, 31, 59, 0.45) 100%)',
    scrimGradient: 'from-[#020D1A]/95 via-[#041B33]/85 to-transparent',
    titleGeGradient: 'linear-gradient(135deg, #93C5FD 0%, #38BDF8 100%)',
    titleVisionGradient: 'linear-gradient(135deg, #38BDF8 0%, #00F5D4 60%, #00E676 100%)',
    subheadColor: 'text-white',
    subtitleColor: 'text-slate-300',
    taglineTextEn: 'SPATIAL INTELLIGENCE FOR A SMARTER TOMORROW',
    taglineTextAr: 'الذكاء المكاني لغدٍ أكثر ذكاءً',
    badgeStyle: 'bg-slate-950/90 text-cyan-300 border-cyan-500/50 shadow-cyan-500/20',
    gisGlowColor: 'rgba(0, 245, 212, 0.85)',
    roadTrailColor: '#00F5D4'
  }
};

/**
 * Calculates Abu Dhabi time (GMT+4 / Asia/Dubai) from any date
 */
export function getAbuDhabiDate(): Date {
  const now = new Date();
  // Format as GMT+4 ISO string
  const abuDhabiTimeString = now.toLocaleString('en-US', { timeZone: 'Asia/Dubai' });
  return new Date(abuDhabiTimeString);
}

/**
 * Determines current theme based on Abu Dhabi hour (0-23) and header theme selection ('light' | 'dark')
 */
export function getThemeIdForHourAndHeader(hour: number, headerTheme: 'light' | 'dark'): TimeThemeId {
  if (headerTheme === 'dark') {
    if (hour >= 17 && hour <= 21) {
      return 'evening';
    } else {
      return 'night';
    }
  } else {
    if (hour >= 6 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 17) {
      return 'afternoon';
    } else if (hour >= 17 && hour < 19) {
      return 'sunset';
    } else {
      return 'afternoon';
    }
  }
}

export function getThemeIdForHour(hour: number): TimeThemeId {
  if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 19) {
    return 'sunset';
  } else if (hour >= 19 && hour < 22) {
    return 'evening';
  } else {
    return 'night';
  }
}
