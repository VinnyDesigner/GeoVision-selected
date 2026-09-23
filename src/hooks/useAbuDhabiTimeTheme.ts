import { useState, useEffect } from 'react';
import {
  TIME_THEMES,
  getAbuDhabiDate,
  getThemeIdForHourAndHeader,
  type TimeThemeId,
  type TimeThemeConfig
} from '../utils/timeThemeUtils';

export function useAbuDhabiTimeTheme(headerTheme: 'light' | 'dark' = 'light') {
  const [abuDhabiTime, setAbuDhabiTime] = useState<Date>(getAbuDhabiDate());

  // Update real-time clock every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAbuDhabiTime(getAbuDhabiDate());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = abuDhabiTime.getHours();
  const activeThemeId: TimeThemeId = getThemeIdForHourAndHeader(currentHour, headerTheme);
  const activeTheme: TimeThemeConfig = TIME_THEMES[activeThemeId];

  // Format Abu Dhabi time string (e.g., 05:42 PM)
  const formattedTime = abuDhabiTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return {
    abuDhabiTime,
    formattedTime,
    activeThemeId,
    activeTheme
  };
}
