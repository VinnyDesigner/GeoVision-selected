import L from 'leaflet';

export const getCategoryColor = (category: string): string => {
  const catColors: Record<string, string> = {
    healthcare: '#215A9E', // DGE Tech Blue
    education: '#063360',  // DGE Reliable Blue
    transport: '#7DA1C4',  // DGE Light Blue
    parks: '#215A9E',      // DGE Tech Blue
    government: '#063360', // DGE Reliable Blue
    utilities: '#7DA1C4',  // DGE Light Blue
  };
  return catColors[category] || '#215A9E';
};

export const getCategorySvgIcon = (category: string, subcategory?: string, name?: string): string => {
  const subLower = (subcategory || '').toLowerCase();
  const nameLower = (name || '').toLowerCase();

  // Plant Nurseries, Greenhouses & Botanical Centers (Sprout Icon)
  if (
    subLower.includes('nurser') ||
    subLower.includes('plant') ||
    subLower.includes('botanic') ||
    nameLower.includes('nursery') ||
    nameLower.includes('plant') ||
    nameLower.includes('مشتل') ||
    nameLower.includes('مشاتل')
  ) {
    return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/></svg>`;
  }

  switch (category) {
    case 'healthcare':
      if (subLower.includes('pharm') || subcategory === 'pharmacies') {
        return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`;
      }
      if (subLower.includes('clinic') || subcategory === 'clinics') {
        return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 0 0 4.5 2.6v5.8a4.5 4.5 0 0 0 9 0V2.6a.3.3 0 0 0-.3-.3"/><path d="M9 12.9v7.6a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5V14"/></svg>`;
      }
      return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h12M6 7h12M6 17h12"/><path d="M10 22v-4h4v4"/></svg>`;

    case 'education':
      if (subLower.includes('universit') || subcategory === 'universities') {
        return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
      }
      if (subLower.includes('school') || subcategory === 'schools') {
        return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>`;
      }
      return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>`;

    case 'transport':
      if (subcategory === 'parking') {
        return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>`;
      }
      if (subcategory === 'taxi_hubs') {
        return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 12 10s-6.7.6-8.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 10l2-4h10l2 4"/></svg>`;
      }
      return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 10h18M7 14h.01M17 14h.01M6 18v2M18 18v2"/></svg>`;

    case 'government':
      if (subcategory === 'tamm_centers') {
        return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;
      }
      return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M6 12h12M6 7h12M6 17h12"/></svg>`;

    case 'parks':
      if (subcategory === 'beaches') {
        return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
      }
      if (subcategory === 'sports_fields') {
        return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18M3 12h18"/></svg>`;
      }
      return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0z"/><path d="M7 16v6M17 14v8"/><path d="M13 14v.2a3 3 0 0 1-1.1 5.8h-3.9a3 3 0 0 1-1-5.8V14a3 3 0 0 1 6 0z"/></svg>`;

    case 'utilities':
      if (subcategory === 'recycling') {
        return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5M11 19h8.2a1.8 1.8 0 0 0 1.557-.9 1.76 1.76 0 0 0 0-1.76L17.2 10.5"/></svg>`;
      }
      return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;

    default:
      return `<svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
  }
};

export const createGeoVisionMarkerIcon = (
  category: string,
  subcategory?: string,
  compact = false,
  isSelected = false,
  name?: string
): L.DivIcon => {
  const color = getCategoryColor(category);
  const iconSvg = getCategorySvgIcon(category, subcategory, name);

  const headSize = isSelected ? (compact ? 34 : 40) : (compact ? 28 : 32);
  const totalWidth = isSelected ? (compact ? 36 : 42) : (compact ? 30 : 34);
  const totalHeight = isSelected ? (compact ? 44 : 52) : (compact ? 36 : 42);
  const arrowSize = isSelected ? (compact ? 7 : 10) : (compact ? 6 : 8);

  const pulseRingHtml = isSelected
    ? `<div style="
        position: absolute;
        top: -8px;
        left: -8px;
        width: ${headSize + 16}px;
        height: ${headSize + 16}px;
        border-radius: 50%;
        background: ${color}40;
        border: 2px solid ${color};
        box-shadow: 0 0 24px ${color};
        animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        z-index: 0;
      "></div>`
    : '';

  const markerHtml = `
    <div class="geovision-map-pointer category-${category} ${isSelected ? 'selected-pin' : ''}" style="
      position: relative;
      width: ${totalWidth}px;
      height: ${totalHeight}px;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      filter: drop-shadow(0 8px 20px ${color}88);
      z-index: ${isSelected ? 9999 : 1};
    ">
      ${pulseRingHtml}
      <div style="
        width: ${headSize}px;
        height: ${headSize}px;
        border-radius: 50%;
        background: ${color};
        border: ${isSelected ? '3.5px solid #ffffff' : '2.5px solid #ffffff'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        box-shadow: ${isSelected ? `0 0 0 3px #176BFF, 0 8px 24px ${color}90` : `0 4px 12px ${color}50, inset 0 1px 0 rgba(255, 255, 255, 0.4)`};
        z-index: 2;
      ">
        ${iconSvg}
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: ${arrowSize}px solid ${color};
        margin-top: -3px;
        z-index: 1;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
      "></div>
    </div>
  `;

  return L.divIcon({
    className: `custom-leaflet-marker-pin ${isSelected ? 'is-selected-marker' : ''}`,
    html: markerHtml,
    iconSize: [totalWidth, totalHeight],
    iconAnchor: [totalWidth / 2, totalHeight],
    popupAnchor: [0, -totalHeight],
  });
};
