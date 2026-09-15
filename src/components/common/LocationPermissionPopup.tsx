import React, { useEffect, useRef } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { ensureAbuDhabiLocation } from '../../utils/locationUtils';

const PERMISSION_KEY = 'geovision_location_permission_handled';

export const LocationPermissionPopup: React.FC = () => {
  const { currentView, setUserLocation, setMapCenterAndZoom, showToast, language } = useAppState();
  const hasPromptedRef = useRef(false);

  useEffect(() => {
    // Location permission request must ONLY execute when user opens Explore Map tab
    if (currentView !== 'map') return;

    // Prevent duplicate triggers in the same render lifecycle
    if (hasPromptedRef.current) return;

    const localStatus = localStorage.getItem(PERMISSION_KEY);
    const sessionStatus = sessionStorage.getItem(PERMISSION_KEY);
    const handledStatus = localStatus || sessionStatus;

    if (handledStatus) {
      // If user previously allowed location, update position silently without showing any popup
      if ((handledStatus === 'allowed' || handledStatus === 'just_once') && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const validLoc = ensureAbuDhabiLocation(pos.coords.latitude, pos.coords.longitude);
            setUserLocation(validLoc);
          },
          () => {
            setUserLocation([24.4539, 54.3773]);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
        );
      }
      return;
    }

    // Mark as prompted in session memory so user is NEVER prompted twice
    hasPromptedRef.current = true;
    sessionStorage.setItem(PERMISSION_KEY, 'prompted');

    // Trigger browser native location permission prompt EXACTLY ONCE when opening Explore Map
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          localStorage.setItem(PERMISSION_KEY, 'allowed');
          const validLoc = ensureAbuDhabiLocation(pos.coords.latitude, pos.coords.longitude);
          setUserLocation(validLoc);
          setMapCenterAndZoom(validLoc, 14);
          showToast(
            language === 'ar'
              ? 'تم تحديد موقعك في أبوظبي بنجاح'
              : 'Abu Dhabi location active'
          );
        },
        (err) => {
          sessionStorage.setItem(PERMISSION_KEY, 'denied');
          const defaultLoc: [number, number] = [24.4539, 54.3773];
          setUserLocation(defaultLoc);
          if (err.code !== err.PERMISSION_DENIED) {
            showToast(
              language === 'ar'
                ? 'تم التوجيه لمركز أبوظبي الرئيسي'
                : 'Centered on Abu Dhabi location'
            );
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      const defaultLoc: [number, number] = [24.4539, 54.3773];
      setUserLocation(defaultLoc);
    }
  }, [currentView, setUserLocation, setMapCenterAndZoom, showToast, language]);

  return null;
};
