export interface LocationBoundary {
  id: string;
  nameEn: string;
  nameAr: string;
  typeEn: string;
  typeAr: string;
  center: [number, number];
  coordinates: [number, number][]; // [latitude, longitude]
  areaKm2: number;
  strokeColor?: string;
  fillColor?: string;
}

/**
 * Authentic Abu Dhabi District & Community Boundaries
 * Defined in WGS84 coordinates [latitude, longitude]
 */
export const ABU_DHABI_DISTRICT_BOUNDARIES: Record<string, LocationBoundary> = {
  khalifa_city: {
    id: 'khalifa_city',
    nameEn: 'Khalifa City Sector Boundary',
    nameAr: 'نطاق قطاع مدينة خليفة',
    typeEn: 'Residential Community District',
    typeAr: 'منطقة سكنية مجتمعية',
    center: [24.4217, 54.5828],
    areaKm2: 18.5,
    strokeColor: '#2563EB',
    fillColor: '#3B82F6',
    coordinates: [
      [24.444, 54.562],
      [24.448, 54.588],
      [24.438, 54.612],
      [24.415, 54.620],
      [24.398, 54.605],
      [24.395, 54.575],
      [24.412, 54.558],
      [24.444, 54.562],
    ],
  },
  yas_island: {
    id: 'yas_island',
    nameEn: 'Yas Island Zone Boundary',
    nameAr: 'نطاق جزيرة ياس الترفيهية',
    typeEn: 'Tourism & Entertainment Island',
    typeAr: 'جزيرة سياحية وترفيهية',
    center: [24.4881, 54.6074],
    areaKm2: 25.0,
    strokeColor: '#0284C7',
    fillColor: '#0EA5E9',
    coordinates: [
      [24.535, 54.598],
      [24.526, 54.628],
      [24.498, 54.636],
      [24.468, 54.625],
      [24.458, 54.595],
      [24.475, 54.572],
      [24.502, 54.570],
      [24.528, 54.582],
      [24.535, 54.598],
    ],
  },
  al_reem_island: {
    id: 'al_reem_island',
    nameEn: 'Al Reem Island District Boundary',
    nameAr: 'نطاق جزيرة الريم',
    typeEn: 'Commercial & Residential Island',
    typeAr: 'جزيرة تجارية وسكنية',
    center: [24.4965, 54.3986],
    areaKm2: 8.4,
    strokeColor: '#059669',
    fillColor: '#10B981',
    coordinates: [
      [24.516, 54.402],
      [24.512, 54.422],
      [24.488, 54.418],
      [24.478, 54.405],
      [24.482, 54.388],
      [24.506, 54.388],
      [24.516, 54.402],
    ],
  },
  saadiyat_island: {
    id: 'saadiyat_island',
    nameEn: 'Saadiyat Cultural District Boundary',
    nameAr: 'نطاق جزيرة السعديات الثقافية',
    typeEn: 'Cultural & Heritage District',
    typeAr: 'المنطقة الثقافية والتراثية',
    center: [24.5262, 54.4363],
    areaKm2: 27.0,
    strokeColor: '#7C3AED',
    fillColor: '#8B5CF6',
    coordinates: [
      [24.562, 54.428],
      [24.558, 54.478],
      [24.532, 54.485],
      [24.508, 54.458],
      [24.505, 54.420],
      [24.528, 54.408],
      [24.562, 54.428],
    ],
  },
  al_maryah_island: {
    id: 'al_maryah_island',
    nameEn: 'Al Maryah Island Financial Freezone',
    nameAr: 'نطاق جزيرة الماريه المالي',
    typeEn: 'Financial & Healthcare District',
    typeAr: 'المنطقة المالية والرعاية الصحية',
    center: [24.4981, 54.3892],
    areaKm2: 2.1,
    strokeColor: '#D97706',
    fillColor: '#F59E0B',
    coordinates: [
      [24.509, 54.385],
      [24.506, 54.394],
      [24.487, 54.392],
      [24.489, 54.383],
      [24.509, 54.385],
    ],
  },
  corniche: {
    id: 'corniche',
    nameEn: 'Corniche Waterfront Promenade Boundary',
    nameAr: 'نطاق كورنيش أبوظبي البحري',
    typeEn: 'Coastal Waterfront Corridor',
    typeAr: 'المحور البحري السياحي',
    center: [24.4715, 54.3361],
    areaKm2: 6.2,
    strokeColor: '#0EA5E9',
    fillColor: '#38BDF8',
    coordinates: [
      [24.489, 54.318],
      [24.494, 54.358],
      [24.480, 54.365],
      [24.462, 54.340],
      [24.468, 54.315],
      [24.489, 54.318],
    ],
  },
  city_center: {
    id: 'city_center',
    nameEn: 'Abu Dhabi Downtown / Al Dana Boundary',
    nameAr: 'نطاق وسط مدينة أبوظبي (الدانا)',
    typeEn: 'Metropolitan Core District',
    typeAr: 'قلب العاصمة الحضري',
    center: [24.4539, 54.3773],
    areaKm2: 12.0,
    strokeColor: '#1D70B8',
    fillColor: '#2563EB',
    coordinates: [
      [24.498, 54.355],
      [24.498, 54.388],
      [24.465, 54.385],
      [24.462, 54.350],
      [24.498, 54.355],
    ],
  },
  al_bateen: {
    id: 'al_bateen',
    nameEn: 'Al Bateen Waterfront District Boundary',
    nameAr: 'نطاق منطقة البطين البحرية',
    typeEn: 'Waterfront & Diplomatic District',
    typeAr: 'منطقة سياحية ودبلوماسية',
    center: [24.4520, 54.3410],
    areaKm2: 7.8,
    strokeColor: '#0D9488',
    fillColor: '#14B8A6',
    coordinates: [
      [24.468, 54.322],
      [24.466, 54.356],
      [24.436, 54.348],
      [24.438, 54.318],
      [24.468, 54.322],
    ],
  },
  al_raha_beach: {
    id: 'al_raha_beach',
    nameEn: 'Al Raha Beach Community Boundary',
    nameAr: 'نطاق شاطئ الراحة المجتمعي',
    typeEn: 'Coastal Residential District',
    typeAr: 'منطقة شاطئية وسكنية',
    center: [24.4450, 54.5900],
    areaKm2: 9.6,
    strokeColor: '#4F46E5',
    fillColor: '#6366F1',
    coordinates: [
      [24.462, 54.560],
      [24.456, 54.615],
      [24.432, 54.605],
      [24.438, 54.558],
      [24.462, 54.560],
    ],
  },
  masdar_city: {
    id: 'masdar_city',
    nameEn: 'Masdar City Clean-Tech Boundary',
    nameAr: 'نطاق مدينة مصدر المستدامة',
    typeEn: 'Sustainable Tech & Research District',
    typeAr: 'منطقة التكنولوجيا والبحوث المستدامة',
    center: [24.4250, 54.6150],
    areaKm2: 6.0,
    strokeColor: '#16A34A',
    fillColor: '#22C55E',
    coordinates: [
      [24.438, 54.608],
      [24.438, 54.632],
      [24.412, 54.628],
      [24.415, 54.604],
      [24.438, 54.608],
    ],
  },
  musaffah: {
    id: 'musaffah',
    nameEn: 'Musaffah Industrial Sector Boundary',
    nameAr: 'نطاق منطقة مصفح الصناعية',
    typeEn: 'Industrial & Trade Zone',
    typeAr: 'المنطقة الصناعية والتجارية',
    center: [24.3541, 54.4981],
    areaKm2: 24.5,
    strokeColor: '#EA580C',
    fillColor: '#F97316',
    coordinates: [
      [24.380, 54.475],
      [24.375, 54.535],
      [24.332, 54.525],
      [24.338, 54.470],
      [24.380, 54.475],
    ],
  },
  zayed_sports_city: {
    id: 'zayed_sports_city',
    nameEn: 'Zayed Sports City Campus Boundary',
    nameAr: 'نطاق مدينة زايد الرياضية',
    typeEn: 'Sports, Events & Recreation Campus',
    typeAr: 'مجمع رياضي وترفيهي',
    center: [24.4178, 54.4539],
    areaKm2: 3.8,
    strokeColor: '#E11D48',
    fillColor: '#F43F5E',
    coordinates: [
      [24.428, 54.442],
      [24.428, 54.468],
      [24.408, 54.462],
      [24.410, 54.438],
      [24.428, 54.442],
    ],
  },
  al_manhal: {
    id: 'al_manhal',
    nameEn: 'Al Manhal / Al Karama District Boundary',
    nameAr: 'نطاق قطاع المنحل والكرامة',
    typeEn: 'Healthcare & Cultural District',
    typeAr: 'منطقة الرعاية الصحية والثقافة',
    center: [24.4680, 54.3720],
    areaKm2: 5.4,
    strokeColor: '#2563EB',
    fillColor: '#3B82F6',
    coordinates: [
      [24.482, 54.360],
      [24.482, 54.384],
      [24.454, 54.384],
      [24.454, 54.360],
      [24.482, 54.360],
    ],
  },
};

/**
 * Generate a realistic facility plot/parcel boundary perimeter around specific coordinates
 */
export function generateParcelBoundary(
  centerLat: number,
  centerLng: number,
  nameEn: string,
  nameAr: string,
  radiusKm = 0.25
): LocationBoundary {
  const dLat = (radiusKm / 111);
  const dLng = (radiusKm / (111 * Math.cos(centerLat * (Math.PI / 180))));

  const coordinates: [number, number][] = [
    [centerLat + dLat * 0.95, centerLng - dLng * 0.75],
    [centerLat + dLat * 0.90, centerLng + dLng * 0.85],
    [centerLat + dLat * 0.25, centerLng + dLng * 1.15],
    [centerLat - dLat * 0.85, centerLng + dLng * 0.95],
    [centerLat - dLat * 1.05, centerLng - dLng * 0.65],
    [centerLat - dLat * 0.35, centerLng - dLng * 1.10],
    [centerLat + dLat * 0.95, centerLng - dLng * 0.75],
  ];

  return {
    id: `parcel-${nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    nameEn: `${nameEn} (Plot Boundary)`,
    nameAr: `${nameAr} (مخطط القسيمة)`,
    typeEn: 'Facility Parcel / Campus Perimeter',
    typeAr: 'مخطط القسيمة وحرم المنشأة',
    center: [centerLat, centerLng],
    areaKm2: Number((Math.PI * radiusKm * radiusKm).toFixed(2)),
    strokeColor: '#0284C7',
    fillColor: '#38BDF8',
    coordinates,
  };
}

/**
 * Resolves the primary location boundary for any given feature or location name.
 */
export function resolveLocationBoundary(
  target: { lat?: number; lng?: number; nameEn?: string; nameAr?: string; addressEn?: string } | string
): { districtBoundary: LocationBoundary | null; parcelBoundary: LocationBoundary | null } {
  const queryStr = typeof target === 'string'
    ? target.toLowerCase()
    : `${target.nameEn || ''} ${target.addressEn || ''}`.toLowerCase();

  const lat = typeof target !== 'string' ? target.lat : undefined;
  const lng = typeof target !== 'string' ? target.lng : undefined;

  let matchedKey: string | null = null;

  // 1. Check address or name keyword matching
  if (queryStr.includes('manhal') || queryStr.includes('منهل') || queryStr.includes('karama') || queryStr.includes('كرامة') || queryStr.includes('skmc') || (queryStr.includes('khalifa') && (queryStr.includes('medical') || queryStr.includes('hospital')))) {
    matchedKey = 'al_manhal';
  } else if (queryStr.includes('khalifa city') || queryStr.includes('مدينة خليفة')) {
    matchedKey = 'khalifa_city';
  } else if (queryStr.includes('yas') || queryStr.includes('ياس')) {
    matchedKey = 'yas_island';
  } else if (queryStr.includes('reem') || queryStr.includes('الريم')) {
    matchedKey = 'al_reem_island';
  } else if (queryStr.includes('saadiyat') || queryStr.includes('سعديات')) {
    matchedKey = 'saadiyat_island';
  } else if (queryStr.includes('maryah') || queryStr.includes('ماريه') || queryStr.includes('cleveland') || queryStr.includes('adgm')) {
    matchedKey = 'al_maryah_island';
  } else if (queryStr.includes('corniche') || queryStr.includes('كورنيش')) {
    matchedKey = 'corniche';
  } else if (queryStr.includes('bateen') || queryStr.includes('بطين')) {
    matchedKey = 'al_bateen';
  } else if (queryStr.includes('raha') || queryStr.includes('راحة')) {
    matchedKey = 'al_raha_beach';
  } else if (queryStr.includes('masdar') || queryStr.includes('مصدر')) {
    matchedKey = 'masdar_city';
  } else if (queryStr.includes('musaffah') || queryStr.includes('مصفح')) {
    matchedKey = 'musaffah';
  } else if (queryStr.includes('sports city') || queryStr.includes('رياضية')) {
    matchedKey = 'zayed_sports_city';
  } else if (queryStr.includes('downtown') || queryStr.includes('dana') || queryStr.includes('وسط') || queryStr.includes('wahda') || queryStr.includes('murour')) {
    matchedKey = 'city_center';
  }

  // 2. Spatial proximity fallback: cap max distance threshold to ~5 km (0.055 degrees)
  if (!matchedKey && lat !== undefined && lng !== undefined) {
    let nearestDist = Infinity;
    for (const [key, b] of Object.entries(ABU_DHABI_DISTRICT_BOUNDARIES)) {
      const d = Math.hypot(b.center[0] - lat, b.center[1] - lng);
      if (d < nearestDist && d < 0.055) {
        nearestDist = d;
        matchedKey = key;
      }
    }
  }

  const districtBoundary = matchedKey ? ABU_DHABI_DISTRICT_BOUNDARIES[matchedKey] : null;

  // 3. Generate parcel plot boundary at exact coordinates
  let parcelBoundary: LocationBoundary | null = null;
  if (lat !== undefined && lng !== undefined && typeof target !== 'string') {
    parcelBoundary = generateParcelBoundary(
      lat,
      lng,
      target.nameEn || 'Selected Location',
      target.nameAr || 'الموقع المحدد',
      0.30
    );
  }

  return { districtBoundary, parcelBoundary };
}
