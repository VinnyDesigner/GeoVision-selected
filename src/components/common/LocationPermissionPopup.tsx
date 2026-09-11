import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { ensureAbuDhabiLocation } from '../../utils/locationUtils';
import { MapPin, X } from 'lucide-react';

const PERMISSION_KEY = 'geovision_location_permission_handled';

export const LocationPermissionPopup: React.FC = () => {
  const { currentView, setUserLocation, setMapCenterAndZoom, showToast, language } = useAppState();
  const [isOpen, setIsOpen] = useState(false);

  const displayDomain =
    typeof window !== 'undefined' && window.location.host
      ? window.location.host
      : 'smartmap-phase2-s.vercel.app';

  useEffect(() => {
    // Popup must ONLY appear when opening the Explore Map tab
    if (currentView !== 'map') {
      setIsOpen(false);
      return;
    }

    // Check if user has already made a choice (allowed, blocked, or dismissed)
    const localStatus = localStorage.getItem(PERMISSION_KEY);
    const sessionStatus = sessionStorage.getItem(PERMISSION_KEY);
    const handledStatus = localStatus || sessionStatus;

    if (handledStatus) {
      setIsOpen(false);

      // If user previously allowed location, silently update map center without showing popup UI
      if (handledStatus === 'allowed' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const validLoc = ensureAbuDhabiLocation(pos.coords.latitude, pos.coords.longitude);
            setUserLocation(validLoc);
            setMapCenterAndZoom(validLoc, 14);
          },
          () => {}, // Silent fallback
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
        );
      }
      return;
    }

    // Check native browser permissions API if available
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          localStorage.setItem(PERMISSION_KEY, 'allowed');
          setIsOpen(false);
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const validLoc = ensureAbuDhabiLocation(pos.coords.latitude, pos.coords.longitude);
              setUserLocation(validLoc);
              setMapCenterAndZoom(validLoc, 14);
            },
            () => {},
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
          );
        } else if (result.state === 'denied') {
          localStorage.setItem(PERMISSION_KEY, 'blocked');
          setIsOpen(false);
        } else {
          // 'prompt': show popup once on Explore Map view
          setIsOpen(true);
        }
      }).catch(() => {
        setIsOpen(true);
      });
    } else {
      setIsOpen(true);
    }
  }, [currentView, setUserLocation, setMapCenterAndZoom]);

  const requestLocationPermission = (isJustOnce: boolean = false) => {
    if (isJustOnce) {
      sessionStorage.setItem(PERMISSION_KEY, 'just_once');
    } else {
      localStorage.setItem(PERMISSION_KEY, 'allowed');
    }
    setIsOpen(false);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const validLoc = ensureAbuDhabiLocation(pos.coords.latitude, pos.coords.longitude);
          setUserLocation(validLoc);
          setMapCenterAndZoom(validLoc, 14);
          showToast(
            language === 'ar'
              ? isJustOnce
                ? 'تم تحديد موقع أبوظبي لهذه المرة'
                : 'تم تحديد موقعك في أبوظبي بنجاح'
              : isJustOnce
              ? 'Abu Dhabi location enabled for this session'
              : 'Abu Dhabi location active'
          );
        },
        () => {
          const defaultLoc = ensureAbuDhabiLocation(0, 0);
          setUserLocation(defaultLoc);
          setMapCenterAndZoom(defaultLoc, 14);
          showToast(language === 'ar' ? 'تم ضبط الموقع الافتراضي في أبوظبي' : 'Defaulted to Abu Dhabi central position');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      const defaultLoc = ensureAbuDhabiLocation(0, 0);
      setUserLocation(defaultLoc);
      setMapCenterAndZoom(defaultLoc, 14);
    }
  };

  const handleAllow = () => {
    requestLocationPermission(false);
  };

  const handleJustThisTime = () => {
    requestLocationPermission(true);
  };

  const handleBlock = () => {
    localStorage.setItem(PERMISSION_KEY, 'blocked');
    showToast(language === 'ar' ? 'تم حظر الوصول للموقع' : 'Location permission blocked');
    setIsOpen(false);
  };

  const handleClose = () => {
    localStorage.setItem(PERMISSION_KEY, 'dismissed');
    setIsOpen(false);
  };

  if (!isOpen || currentView !== 'map') return null;

  return (
    <div className="fixed top-3 left-3 sm:left-6 z-[9999] animate-fade-in pointer-events-auto">
      <div className="w-[310px] sm:w-[350px] bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200/90 dark:border-slate-800 space-y-4 ring-1 ring-black/5">
        
        {/* Domain Header Row with Close X */}
        <div className="flex items-start justify-between gap-2">
          <div className="pr-2">
            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight break-all">
              {displayDomain} {language === 'ar' ? 'يريد الوصول لـ' : 'wants to access'}
            </h4>
            <p className="text-[11px] font-extrabold text-geovision-blue dark:text-blue-400 mt-0.5">
              📍 {language === 'ar' ? 'موقع أبوظبي، الإمارات العربية المتحدة' : 'Abu Dhabi, UAE Location'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Location Icon + Know your location text */}
        <div className="flex items-center gap-3 py-1">
          <div className="w-8.5 h-8.5 rounded-full bg-blue-50 dark:bg-slate-800 text-geovision-blue dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-slate-700 shadow-2xs">
            <MapPin className="w-4 h-4 text-geovision-blue dark:text-blue-400" />
          </div>
          <div>
            <span className="text-sm font-black text-slate-900 dark:text-slate-100 block">
              {language === 'ar' ? 'معرفة موقعك الحالي في أبوظبي' : 'Know your current location in Abu Dhabi'}
            </span>
            <span className="text-[10.5px] font-bold text-slate-400 block">
              {language === 'ar' ? 'مركز أبوظبي للبيانات المكانية (SDI)' : 'Abu Dhabi SDI Spatial Hub (EPSG:32639)'}
            </span>
          </div>
        </div>

        {/* 3 Pill Action Buttons: Block | Just this time | Allow */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={handleBlock}
            className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs border border-slate-300 dark:border-slate-700 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            {language === 'ar' ? 'حظر' : 'Block'}
          </button>

          <button
            type="button"
            onClick={handleJustThisTime}
            className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs border border-slate-300 dark:border-slate-700 shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            {language === 'ar' ? 'هذه المرة فقط' : 'Just this time'}
          </button>

          <button
            type="button"
            onClick={handleAllow}
            className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-xs border border-slate-300 dark:border-slate-700 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            {language === 'ar' ? 'سماح' : 'Allow'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LocationPermissionPopup;

