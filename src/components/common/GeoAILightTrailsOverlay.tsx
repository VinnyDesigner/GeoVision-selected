import React from 'react';
import type { TimeThemeConfig } from '../../utils/timeThemeUtils';

interface GeoAILightTrailsOverlayProps {
  theme: TimeThemeConfig;
}

export const GeoAILightTrailsOverlay: React.FC<GeoAILightTrailsOverlayProps> = ({ theme }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated SVG Road Light Trails & Network Beacons */}
      <svg
        className="w-full h-full opacity-60 dark:opacity-75 transition-opacity duration-1000"
        viewBox="0 0 1400 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Pulsing Light Trail Gradient */}
          <linearGradient id="roadTrailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.roadTrailColor} stopOpacity="0.2" />
            <stop offset="50%" stopColor={theme.roadTrailColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={theme.roadTrailColor} stopOpacity="0.2" />
          </linearGradient>

          {/* Node Glow Filter */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated Road Light Trails across Abu Dhabi Highway Network */}
        <g stroke="url(#roadTrailGrad)" strokeWidth="2" fill="none">
          {/* Sheikh Zayed Bridge to Corniche Corridor */}
          <path
            d="M 950 650 Q 820 520 720 420 T 550 320"
            strokeDasharray="20 120"
            className="animate-road-trail-1"
          />
          {/* Saadiyat Highway & Louvre Link */}
          <path
            d="M 680 220 Q 780 260 880 340 T 1100 480"
            strokeDasharray="15 90"
            className="animate-road-trail-2"
          />
          {/* Al Reem & Al Maryah Arterial Route */}
          <path
            d="M 620 380 Q 720 350 820 320 T 980 280"
            strokeDasharray="25 150"
            className="animate-road-trail-3"
          />
        </g>

        {/* Floating GeoAI Intelligence Nodes over Abu Dhabi Key Locations */}
        {/* Node 1: Saadiyat Island */}
        <g transform="translate(750, 240)" filter="url(#nodeGlow)">
          <circle r="4" fill={theme.roadTrailColor} className="animate-ping opacity-75" />
          <circle r="3" fill={theme.roadTrailColor} />
        </g>

        {/* Node 2: Al Maryah Island */}
        <g transform="translate(680, 360)" filter="url(#nodeGlow)">
          <circle r="5" fill={theme.roadTrailColor} className="animate-pulse" />
          <circle r="2.5" fill="#FFFFFF" />
        </g>

        {/* Node 3: Mangroves Reserve */}
        <g transform="translate(920, 210)" filter="url(#nodeGlow)">
          <circle r="4" fill={theme.roadTrailColor} className="animate-ping opacity-60" />
          <circle r="3" fill={theme.roadTrailColor} />
        </g>

        {/* Node 4: Khalifa City / Airport */}
        <g transform="translate(1120, 520)" filter="url(#nodeGlow)">
          <circle r="4" fill={theme.roadTrailColor} className="animate-pulse" />
          <circle r="2" fill="#FFFFFF" />
        </g>

        {/* Subtle Network Constellation Lines */}
        <path
          d="M 750 240 L 680 360 L 920 210 L 1120 520"
          stroke={theme.roadTrailColor}
          strokeWidth="0.75"
          strokeDasharray="4 6"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};
