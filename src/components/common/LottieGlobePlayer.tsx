import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { getAssetUrl } from '../../utils/assetUtils';

interface LottieGlobePlayerProps {
  className?: string;
}

export const LottieGlobePlayer: React.FC<LottieGlobePlayerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: getAssetUrl('hupng-mp4-to-lottie-1790162378630.json')
    });

    return () => {
      anim.destroy();
    };
  }, []);

  return <div ref={containerRef} className={`relative flex items-center justify-center pointer-events-none select-none ${className}`} />;
};
