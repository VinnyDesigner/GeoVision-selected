import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useAppState } from '../../context/AppStateContext';
import { GEO_FEATURES } from '../../data/mockAbuDhabiData';
import type { DrawnShape, GeoFeature } from '../../types';
import { MapToolbar } from './MapToolbar';
import { BasemapGallery } from './BasemapGallery';
import { MapLegend } from './MapLegend';
import { BufferTool } from './BufferTool';
import { PrintMapModal } from './PrintMapModal';
import { SketchAOITool } from './SketchAOITool';
import { GeoVisionPanel } from '../ai/GeoVisionPanel';
import { SmartFilterPanel } from '../filters/SmartFilterPanel';
import { createGeoVisionMarkerIcon, getCategoryColor } from '../../utils/markerUtils';
import { Sparkles, X, Layers, ChevronUp } from 'lucide-react';

export const MapWorkspace: React.FC = () => {
  const {
    language,
    activeBasemap,
    activeTool,
    selectedFeature,
    setSelectedFeature,
    mapCenter,
    mapZoom,
    setMapCenterAndZoom,
    filteredFeatures,
    bufferRadiusKm,
    aoiResult,
    showToast,
    filterDrawerOpen,
    setFilterDrawerOpen,
    drawTool,
    userDrawnShapes,
    setUserDrawnShapes,
    sendAIMessage,
    addFavorite,
    isFavorite,
    pureMapMode,
    userLocation,
    favorites,
    removeFavorite,
    user,
    setGuestPromptOpen,
    navigationTarget,
  } = useAppState();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.Layer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
  const standalonePopupRef = useRef<L.Popup | null>(null);
  const drawnLayersGroupRef = useRef<L.LayerGroup | null>(null);
  const bufferCircleRef = useRef<L.Circle | null>(null);
  const aoiPolygonRef = useRef<L.Polygon | null>(null);
  const activeRouteLineRef = useRef<L.Polyline | null>(null);
  const activeRouteStartMarkerRef = useRef<L.Marker | null>(null);

  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [panelWidth, setPanelWidth] = useState<number>(480);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const handleStartResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      let newWidth = isRtl ? e.clientX : window.innerWidth - e.clientX;
      newWidth = Math.max(340, Math.min(850, newWidth));
      setPanelWidth(newWidth);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize({ animate: false });
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Coordinate Format Dropdown State & Ref
  const [coordFormat, setCoordFormat] = useState<'DD' | 'DDM' | 'DMS' | 'UTM'>('DD');
  const [coordMenuOpen, setCoordMenuOpen] = useState(false);
  const coordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (coordRef.current && !coordRef.current.contains(e.target as Node)) {
        setCoordMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatCoordinates = (lat: number, lng: number, fmt: 'DD' | 'DDM' | 'DMS' | 'UTM'): string => {
    const absLat = Math.abs(lat);
    const absLng = Math.abs(lng);
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';

    if (fmt === 'DDM') {
      const latDeg = Math.floor(absLat);
      const latMin = ((absLat - latDeg) * 60).toFixed(3);
      const lngDeg = Math.floor(absLng);
      const lngMin = ((absLng - lngDeg) * 60).toFixed(3);
      return `${latDeg}° ${latMin}' ${latDir}, ${lngDeg}° ${lngMin}' ${lngDir}`;
    }

    if (fmt === 'DMS') {
      const latDeg = Math.floor(absLat);
      const latMinTotal = (absLat - latDeg) * 60;
      const latMin = Math.floor(latMinTotal);
      const latSec = ((latMinTotal - latMin) * 60).toFixed(1);

      const lngDeg = Math.floor(absLng);
      const lngMinTotal = (absLng - lngDeg) * 60;
      const lngMin = Math.floor(lngMinTotal);
      const lngSec = ((lngMinTotal - lngMin) * 60).toFixed(1);

      return `${latDeg}° ${latMin}' ${latSec}" ${latDir}, ${lngDeg}° ${lngMin}' ${lngSec}" ${lngDir}`;
    }

    if (fmt === 'UTM') {
      const easting = Math.round(233750 + (lng - 54.3773) * 92000);
      const northing = Math.round(2706300 + (lat - 24.4539) * 110500);
      return `39R ${easting}mE ${northing}mN`;
    }

    return `${lat.toFixed(4)}° ${latDir}, ${lng.toFixed(4)}° ${lngDir}`;
  };

  // Abu Dhabi DGE & ArcGIS Basemap Tile URLs
  const basemapUrls: Record<string, string> = {
    dge: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  const createBasemapLayer = (map: L.Map, type: string): L.Layer => {
    if (type === 'dge') {
      const primaryUrl = 'https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_GCS/MapServer/tile/{z}/{y}/{x}';
      const fallbackUrl = basemapUrls['dge'];

      const layer = L.tileLayer(primaryUrl, {
        maxZoom: 19,
        attribution: '&copy; DGE Abu Dhabi Spatial Infrastructure (SDI)',
      });

      let fallbackDone = false;
      layer.on('tileerror', () => {
        if (!fallbackDone) {
          fallbackDone = true;
          try {
            map.removeLayer(layer);
            const fallback = L.tileLayer(fallbackUrl, {
              maxZoom: 19,
              attribution: '&copy; DGE Abu Dhabi Spatial Infrastructure (SDI)',
            });
            fallback.addTo(map);
            tileLayerRef.current = fallback;
          } catch {
            // ignore
          }
        }
      });

      return layer.addTo(map);
    }

    const tileUrl = basemapUrls[type] || basemapUrls['dge'];
    return L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; ArcGIS / DGE Abu Dhabi Spatial Infrastructure (SDI)',
    }).addTo(map);
  };

  const isProgrammaticMoveRef = useRef(false);
  const lastCenteredFeatureIdRef = useRef<string | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: mapCenter,
        zoom: mapZoom,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        dragging: true,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        wheelDebounceTime: 40,
        wheelPxPerZoomLevel: 60,
      });

      // Forward mouse wheel scrolling over popup pane so zooming works even when mouse is over popup cards
      const panes = map.getPanes();
      if (panes.popupPane) {
        panes.popupPane.addEventListener(
          'wheel',
          (e: WheelEvent) => {
            if (mapInstanceRef.current) {
              const delta = e.deltaY;
              if (delta < 0) {
                mapInstanceRef.current.zoomIn(0.5);
              } else if (delta > 0) {
                mapInstanceRef.current.zoomOut(0.5);
              }
            }
          },
          { passive: true }
        );
      }

      map.on('moveend zoomend', () => {
        if (isProgrammaticMoveRef.current) {
          isProgrammaticMoveRef.current = false;
          return;
        }
        const center = map.getCenter();
        const zoom = map.getZoom();
        if (center && zoom) {
          setMapCenterAndZoom([center.lat, center.lng], zoom);
        }
      });

      const layer = createBasemapLayer(map, activeBasemap);
      tileLayerRef.current = layer as any;

      markersGroupRef.current = L.layerGroup().addTo(map);
      drawnLayersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 300);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap Tiles
  useEffect(() => {
    if (mapInstanceRef.current) {
      if (tileLayerRef.current) {
        tileLayerRef.current.remove();
        tileLayerRef.current = null;
      }

      const layer = createBasemapLayer(mapInstanceRef.current, activeBasemap);
      tileLayerRef.current = layer as any;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 50);
    }
  }, [activeBasemap]);

  // React to Zoom In, Zoom Out, Home, and Location updates safely without interrupting mouse scroll
  useEffect(() => {
    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();

      const latDiff = Math.abs(currentCenter.lat - mapCenter[0]);
      const lngDiff = Math.abs(currentCenter.lng - mapCenter[1]);
      const zoomDiff = Math.abs(currentZoom - mapZoom);

      if (latDiff > 0.0001 || lngDiff > 0.0001 || zoomDiff > 0.05) {
        isProgrammaticMoveRef.current = true;
        map.setView(mapCenter, mapZoom, { animate: true });
      }
    }
  }, [mapCenter, mapZoom]);

  const buildFeaturePopupHtml = (feat: GeoFeature) => {
    const color = getCategoryColor(feat.category);
    const title = language === 'ar' ? feat.nameAr : feat.nameEn;
    const address = language === 'ar' ? feat.addressAr : feat.addressEn;
    const categoryLabel = `${feat.category.toUpperCase()} • ${feat.subcategory.toUpperCase()}`;
    const isFav = isFavorite(feat.nameEn);

    let contactHtml = '';
    if (feat.phone || feat.website) {
      contactHtml = `
        <div style="margin-top: 5px; font-size: 11px; display: flex; flex-direction: column; gap: 3px;">
          ${feat.phone ? `<div style="display:flex;align-items:center;gap:5px;"><span style="color:#7DA1C4;">📞</span><a href="tel:${feat.phone}" style="color:#215A9E;font-weight:800;text-decoration:none;">${feat.phone}</a></div>` : ''}
          ${feat.website ? `<div style="display:flex;align-items:center;gap:5px;"><span style="color:#7DA1C4;">🌐</span><a href="${feat.website}" target="_blank" rel="noreferrer" style="color:#215A9E;font-weight:800;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:230px;">${feat.website}</a></div>` : ''}
        </div>
      `;
    }

    let metadataHtml = '';
    if (feat.metadata && Object.keys(feat.metadata).length > 0) {
      const rows = Object.entries(feat.metadata)
        .map(([k, v]) => `
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10.5px; margin-top: 2.5px;">
            <span class="popup-text-sub" style="font-weight: 700;">${k}:</span>
            <span class="popup-meta-val" style="font-weight: 900;">${String(v)}</span>
          </div>
        `).join('');
      metadataHtml = `
        <div class="popup-meta-box">
          <span style="font-size: 8.5px; font-weight: 900; color: #7DA1C4; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
            ${language === 'ar' ? 'الخصائص المكانية الموثوقة' : 'Authoritative GIS Attributes'}
          </span>
          ${rows}
        </div>
      `;
    }

    return `
      <div style="font-family: var(--font-dge, sans-serif); padding: 2px; min-width: 260px; max-width: 315px; max-height: 390px; overflow-y: auto;" class="custom-scrollbar">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
          <span style="font-size: 9px; font-weight: 900; background-color: ${color}20; color: ${color}; padding: 2px 7px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid ${color}30;">
            ${categoryLabel}
          </span>
          ${feat.isAuthoritative ? `<span style="font-size: 9.5px; font-weight: 800; color: #10B981; display:flex; align-items:center; gap:2px;">🛡️ ${language === 'ar' ? 'موثوق SDI' : 'Verified SDI'}</span>` : ''}
        </div>
        
        <h4 class="popup-title" style="font-size: 13px; font-weight: 900; margin: 0 0 3px 0; line-height: 1.3;">
          ${title}
        </h4>
        
        <p class="popup-text-sub" style="font-size: 10.5px; font-weight: 600; margin: 0 0 3px 0; line-height: 1.3;">
          📍 ${address}
        </p>

        ${contactHtml}
        ${metadataHtml}

        <div style="border-top: 1px solid rgba(125, 161, 196, 0.2); margin-top: 8px; padding-top: 6px; display: flex; align-items: center; justify-content: space-between; gap: 6px;">
          <button
            id="pop-details-${feat.id}"
            style="flex: 1; padding: 7px 12px; font-size: 11.5px; font-weight: 900; background: #215A9E; color: white; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;"
          >
            📋 ${language === 'ar' ? 'عرض التفاصيل (4 تبويبات)' : 'View Details (4-Tab Analysis)'}
          </button>
          <button
            id="pop-fav-${feat.id}"
            class="popup-fav-btn"
            style="padding: 6px 11px; border: 1px solid ${isFav ? '#F59E0B' : 'rgba(125, 161, 196, 0.3)'}; background: ${isFav ? '#FEF3C7' : 'rgba(255,255,255,0.8)'}; color: ${isFav ? '#D97706' : '#545860'}; font-size: 14px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;"
            title="${language === 'ar' ? (isFav ? 'إزالة من المفضلة' : 'حفظ في المفضلة') : (isFav ? 'Remove from Favorites' : 'Save to Favorites')}"
          >
            ${isFav ? '★' : '☆'}
          </button>
        </div>
      </div>
    `;
  };

  const attachPopupEvents = (feat: GeoFeature) => {
    const detailsBtn = document.getElementById(`pop-details-${feat.id}`);
    if (detailsBtn) {
      detailsBtn.onclick = (e) => {
        e.stopPropagation();
        setAiPanelOpen(true);
        setSelectedFeature(feat);
        sendAIMessage(language === 'ar' ? `عرض تفاصيل ${feat.nameAr}` : `View details for ${feat.nameEn}`);
      };
    }

    const favBtn = document.getElementById(`pop-fav-${feat.id}`);
    if (favBtn) {
      favBtn.onclick = (e) => {
        e.stopPropagation();
        if (user.isGuest) {
          setGuestPromptOpen(true);
          return;
        }
        const currentlyFav = isFavorite(feat.nameEn);
        if (currentlyFav) {
          const item = favorites.find((f) => f.nameEn === feat.nameEn);
          if (item) removeFavorite(item.id);
          favBtn.innerHTML = '☆';
          favBtn.style.background = 'rgba(255,255,255,0.8)';
          favBtn.style.color = '#545860';
          favBtn.style.borderColor = 'rgba(125, 161, 196, 0.3)';
          showToast(language === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from Favorites');
        } else {
          addFavorite({
            type: 'location',
            nameEn: feat.nameEn,
            nameAr: feat.nameAr,
            categoryEn: feat.category,
            categoryAr: feat.category,
            lat: feat.lat,
            lng: feat.lng,
          });
          favBtn.innerHTML = '★';
          favBtn.style.background = '#FEF3C7';
          favBtn.style.color = '#D97706';
          favBtn.style.borderColor = '#F59E0B';
          showToast(language === 'ar' ? 'تمت الإضافة إلى المفضلة' : 'Added to Favorites');
        }
      };
    }
  };

  // Global Event Delegation for Leaflet Map Popup Action Buttons
  useEffect(() => {
    const handleGlobalPopupClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Handle "View Details (4-Tab Analysis)" popup button click
      const detailsBtn = target.closest<HTMLButtonElement>('[id^="pop-details-"]');
      if (detailsBtn) {
        e.stopPropagation();
        e.preventDefault();
        const featId = detailsBtn.id.replace('pop-details-', '');
        const feat = GEO_FEATURES.find((f) => f.id === featId) || filteredFeatures.find((f) => f.id === featId);
        if (feat) {
          setAiPanelOpen(true);
          setSelectedFeature(feat);
          sendAIMessage(language === 'ar' ? `عرض تفاصيل ${feat.nameAr}` : `View details for ${feat.nameEn}`);
          showToast(language === 'ar' ? `جاري فتح تفاصيل ${feat.nameAr} في المحادثة` : `Opening details for ${feat.nameEn} in AI Chat`);
        }
        return;
      }

      // 2. Handle "Star / Favorite" popup button click
      const favBtn = target.closest<HTMLButtonElement>('[id^="pop-fav-"]');
      if (favBtn) {
        e.stopPropagation();
        e.preventDefault();
        if (user.isGuest) {
          setGuestPromptOpen(true);
          return;
        }
        const featId = favBtn.id.replace('pop-fav-', '');
        const feat = GEO_FEATURES.find((f) => f.id === featId) || filteredFeatures.find((f) => f.id === featId);
        if (feat) {
          const currentlyFav = isFavorite(feat.nameEn);
          if (currentlyFav) {
            const item = favorites.find((f) => f.nameEn === feat.nameEn);
            if (item) removeFavorite(item.id);
            favBtn.innerHTML = '☆';
            favBtn.style.background = 'rgba(255,255,255,0.8)';
            favBtn.style.color = '#545860';
            favBtn.style.borderColor = 'rgba(125, 161, 196, 0.3)';
            showToast(language === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from Favorites');
          } else {
            addFavorite({
              type: 'location',
              nameEn: feat.nameEn,
              nameAr: feat.nameAr,
              categoryEn: feat.category,
              categoryAr: feat.category,
              lat: feat.lat,
              lng: feat.lng,
            });
            favBtn.innerHTML = '★';
            favBtn.style.background = '#FEF3C7';
            favBtn.style.color = '#D97706';
            favBtn.style.borderColor = '#F59E0B';
            showToast(language === 'ar' ? 'تمت الإضافة إلى المفضلة' : 'Added to Favorites');
          }
        }
        return;
      }
    };

    document.addEventListener('click', handleGlobalPopupClick, true);
    return () => {
      document.removeEventListener('click', handleGlobalPopupClick, true);
    };
  }, [language, isFavorite, favorites, removeFavorite, addFavorite, showToast, setAiPanelOpen, setSelectedFeature, sendAIMessage, filteredFeatures, user, setGuestPromptOpen]);

  // Update Feature Markers & Layer Clusters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    const newMarkersMap = new Map<string, L.Marker>();

    filteredFeatures.forEach((feat) => {
      const customIcon = createGeoVisionMarkerIcon(feat.category, feat.subcategory);
      const popupHtml = buildFeaturePopupHtml(feat);

      const marker = L.marker([feat.lat, feat.lng], { icon: customIcon });
      marker.bindPopup(popupHtml, {
        maxWidth: 320,
        className: 'geovision-map-popup',
        autoPan: false,
        autoClose: false,
        closeOnClick: false,
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedFeature(feat);
      });

      marker.on('popupopen', () => {
        attachPopupEvents(feat);
      });

      markersGroupRef.current?.addLayer(marker);
      newMarkersMap.set(feat.id, marker);
    });

    markersMapRef.current = newMarkersMap;

    if (!selectedFeature || filteredFeatures.length === 0 || !newMarkersMap.has(selectedFeature.id)) {
      mapInstanceRef.current?.closePopup();
    } else if (selectedFeature && newMarkersMap.has(selectedFeature.id)) {
      const openMarker = newMarkersMap.get(selectedFeature.id);
      openMarker?.openPopup();
    }
  }, [filteredFeatures, language, selectedFeature]);

  // Open map popup directly on selected feature & draw route polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // 1. Remove existing route polyline, origin marker & standalone popup
    if (activeRouteLineRef.current) {
      activeRouteLineRef.current.remove();
      activeRouteLineRef.current = null;
    }
    if (activeRouteStartMarkerRef.current) {
      activeRouteStartMarkerRef.current.remove();
      activeRouteStartMarkerRef.current = null;
    }
    if (standalonePopupRef.current) {
      standalonePopupRef.current.remove();
      standalonePopupRef.current = null;
    }

    // 2. If no selected feature OR zero filtered features, close any popup and return
    if (!selectedFeature || filteredFeatures.length === 0) {
      lastCenteredFeatureIdRef.current = null;
      map.closePopup();
      return;
    }

    // Verify selected feature is present in active filtered results
    const isFeatureValid = filteredFeatures.some((f) => f.id === selectedFeature.id);
    if (!isFeatureValid) {
      lastCenteredFeatureIdRef.current = null;
      map.closePopup();
      return;
    }

    // 3. Draw dashed route line from origin to target feature ONLY IF navigation was explicitly requested
    const isNavTargetActive = navigationTarget && navigationTarget.id === selectedFeature.id;

    if (isNavTargetActive) {
      const origin: [number, number] = userLocation || [24.4539, 54.3773];
      const destination: [number, number] = [selectedFeature.lat, selectedFeature.lng];

      const polyline = L.polyline([origin, destination], {
        color: '#2563eb',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 8',
        interactive: false,
      }).addTo(map);

      const distanceKm = selectedFeature.distanceKm || (
        Math.hypot(selectedFeature.lat - origin[0], selectedFeature.lng - origin[1]) * 111
      ).toFixed(1);

      polyline.bindTooltip(
        `<div style="font-family:sans-serif;font-weight:900;font-size:11px;color:#1e40af;padding:3px 8px;background:rgba(255,255,255,0.95);border-radius:8px;border:1.5px solid #2563eb;box-shadow:0 4px 12px rgba(37,99,235,0.25);">
          📍 Route to ${language === 'ar' ? selectedFeature.nameAr : selectedFeature.nameEn}: <b>${distanceKm} km</b>
        </div>`,
        { permanent: true, direction: 'center', interactive: false }
      );

      activeRouteLineRef.current = polyline;

      // Add origin pin marker
      const startIcon = L.divIcon({
        className: 'route-origin-marker',
        html: `<div style="width:22px;height:22px;background:#2563eb;border:3.5px solid white;border-radius:50%;box-shadow:0 4px 14px rgba(37,99,235,0.6);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      const startMarker = L.marker(origin, { icon: startIcon }).addTo(map);
      startMarker.bindTooltip(
        `<div style="font-family:sans-serif;font-weight:900;font-size:10.5px;color:#1e3a8a;padding:2px 6px;">📍 ${language === 'ar' ? 'موقعي الحالي' : 'Current Area Origin'}</div>`,
        { permanent: false, direction: 'top', interactive: false }
      );
      activeRouteStartMarkerRef.current = startMarker;
    }

    // 4. Position Map View ONCE centered on feature when newly selected
    if (selectedFeature.id !== lastCenteredFeatureIdRef.current) {
      lastCenteredFeatureIdRef.current = selectedFeature.id;
      const targetZoom = Math.max(map.getZoom(), 14);
      isProgrammaticMoveRef.current = true;
      map.setView([selectedFeature.lat + 0.0035, selectedFeature.lng], targetZoom, { animate: true });
    }

    // 5. Open Popup on target marker or standalone popup
    const targetMarker = markersMapRef.current.get(selectedFeature.id);

    if (targetMarker) {
      targetMarker.openPopup();
      attachPopupEvents(selectedFeature);
    } else {
      const popup = L.popup({
        maxWidth: 320,
        className: 'geovision-map-popup',
        autoPan: false,
        autoClose: false,
        closeOnClick: false,
      })
        .setLatLng([selectedFeature.lat, selectedFeature.lng])
        .setContent(buildFeaturePopupHtml(selectedFeature));

      popup.on('add', () => {
        attachPopupEvents(selectedFeature);
      });

      popup.openOn(map);
      standalonePopupRef.current = popup;
    }
  }, [selectedFeature, filteredFeatures, userLocation, language, navigationTarget]);

  // Render Selected Focused Area Ring geometry for AI & Map Interactions
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (bufferCircleRef.current) {
      bufferCircleRef.current.remove();
      bufferCircleRef.current = null;
    }

    if (bufferRadiusKm && bufferRadiusKm > 0) {
      const circle = L.circle(mapCenter, {
        radius: bufferRadiusKm * 1000,
        color: '#215A9E',
        fillColor: '#215A9E',
        fillOpacity: 0.14,
        weight: 2.5,
        dashArray: '6, 6',
      }).addTo(mapInstanceRef.current);

      circle.bindTooltip(
        `<div style="font-family:sans-serif;font-weight:900;font-size:11px;color:#063360;padding:2px 6px;">
          📍 Selected Focused Area (${bufferRadiusKm} km)
        </div>`,
        { permanent: false, direction: 'top', className: 'glass-tooltip' }
      );

      bufferCircleRef.current = circle;
    }
  }, [bufferRadiusKm, mapCenter]);

  // Render AOI Polygon geometry
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (aoiPolygonRef.current) {
      aoiPolygonRef.current.remove();
      aoiPolygonRef.current = null;
    }

    if (activeTool === 'sketch' && aoiResult) {
      const polygon = L.polygon(aoiResult.bounds, {
        color: '#176BFF',
        fillColor: '#176BFF',
        fillOpacity: 0.22,
        weight: 3,
      }).addTo(mapInstanceRef.current);

      aoiPolygonRef.current = polygon;
    }
  }, [activeTool, aoiResult]);

  // Render User Drawn Shapes (Point, Circle, Polygon, Rectangle)
  useEffect(() => {
    if (!mapInstanceRef.current || !drawnLayersGroupRef.current) return;

    drawnLayersGroupRef.current.clearLayers();



    userDrawnShapes.forEach((shape) => {
      if (shape.type === 'point') {
        const customPin = L.divIcon({
          className: 'custom-leaflet-marker-pin',
          html: `<div style="width:28px;height:28px;background:#176BFF;border:2.5px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(23,107,255,0.5);color:white;font-size:13px;font-weight:900;">📍</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([shape.lat, shape.lng], { icon: customPin });
        marker.bindPopup(`
          <div style="padding:4px;font-family:sans-serif;">
            <strong style="color:#176BFF;font-size:12px;">📍 User Point Marker</strong><br/>
            <span style="font-size:11px;">${shape.lat.toFixed(4)}°N, ${shape.lng.toFixed(4)}°E</span>
          </div>
        `);
        drawnLayersGroupRef.current?.addLayer(marker);
      } else if (shape.type === 'circle') {
        const circle = L.circle([shape.lat, shape.lng], {
          radius: shape.radius || 2000,
          color: '#176BFF',
          fillColor: '#176BFF',
          fillOpacity: 0.2,
          weight: 2.5,
        });
        circle.bindPopup(`
          <div style="padding:4px;font-family:sans-serif;">
            <strong style="color:#176BFF;font-size:12px;">⭕ User Circle Buffer (2 km)</strong>
          </div>
        `);
        drawnLayersGroupRef.current?.addLayer(circle);
      } else if (shape.type === 'polygon') {
        const polyPoints = shape.points || [
          [shape.lat + 0.015, shape.lng],
          [shape.lat, shape.lng + 0.018],
          [shape.lat - 0.015, shape.lng],
          [shape.lat, shape.lng - 0.018],
        ];
        const polygon = L.polygon(polyPoints, {
          color: '#4F46E5',
          fillColor: '#4F46E5',
          fillOpacity: 0.25,
          weight: 2.5,
        });
        polygon.bindPopup(`
          <div style="padding:4px;font-family:sans-serif;">
            <strong style="color:#4F46E5;font-size:12px;">⬡ User Polygon Area</strong>
          </div>
        `);
        drawnLayersGroupRef.current?.addLayer(polygon);
      } else if (shape.type === 'rect') {
        const bounds: [[number, number], [number, number]] = shape.bounds || [
          [shape.lat - 0.012, shape.lng - 0.018],
          [shape.lat + 0.012, shape.lng + 0.018],
        ];
        const rect = L.rectangle(bounds, {
          color: '#059669',
          fillColor: '#059669',
          fillOpacity: 0.22,
          weight: 2.5,
        });
        rect.bindPopup(`
          <div style="padding:4px;font-family:sans-serif;">
            <strong style="color:#059669;font-size:12px;">█ User Bounding Box</strong>
          </div>
        `);
        drawnLayersGroupRef.current?.addLayer(rect);
      }
    });
  }, [userDrawnShapes]);

  const tempShapeRef = useRef<L.Layer | null>(null);
  const tempPointsRef = useRef<L.LatLng[]>([]);
  const isDrawingRef = useRef<boolean>(false);
  const startLatLngRef = useRef<L.LatLng | null>(null);

  // Handle Map Click for Identify / Select Tool
  useEffect(() => {
    if (!mapInstanceRef.current || activeTool !== 'identify') return;

    const map = mapInstanceRef.current;
    const handleIdentifyMapClick = (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;
      let closestFeat: GeoFeature | null = null;
      let minD = Infinity;

      for (const f of GEO_FEATURES) {
        const d = Math.hypot(f.lat - latlng.lat, f.lng - latlng.lng);
        if (d < minD) {
          minD = d;
          closestFeat = f;
        }
      }

      if (closestFeat && minD < 0.25) {
        const feat: GeoFeature = closestFeat;
        setSelectedFeature(feat);
        showToast(language === 'ar' ? `تم تحديد المعلم: ${feat.nameAr}` : `Selected GIS Feature: ${feat.nameEn}`);
        map.flyTo([feat.lat, feat.lng], 15);
      }
    };

    map.on('click', handleIdentifyMapClick);
    return () => {
      map.off('click', handleIdentifyMapClick);
    };
  }, [activeTool, language, setSelectedFeature, showToast, GEO_FEATURES]);

  // Handle Freehand Interactive Map Drawing for All Tools (Circle, Rect, Polygon, Point)
  useEffect(() => {
    if (!mapInstanceRef.current || activeTool !== 'sketch') {
      if (tempShapeRef.current) {
        tempShapeRef.current.remove();
        tempShapeRef.current = null;
      }
      isDrawingRef.current = false;
      startLatLngRef.current = null;
      tempPointsRef.current = [];
      return;
    }

    const map = mapInstanceRef.current;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;

      // 1. POINT TOOL
      if (drawTool === 'point') {
        const shapeId = `shape-${Date.now()}`;
        const newShape: DrawnShape = {
          id: shapeId,
          type: 'point',
          lat: latlng.lat,
          lng: latlng.lng,
          radius: 1000,
        };
        setUserDrawnShapes((prev) => [...prev, newShape]);
        showToast(`Point dropped at ${latlng.lat.toFixed(3)}°N, ${latlng.lng.toFixed(3)}°E`);
        setAiPanelOpen(true);
        sendAIMessage(`Analyze drawn Point Marker at ${latlng.lat.toFixed(3)}°N, ${latlng.lng.toFixed(3)}°E`);
        return;
      }

      // 2. CIRCLE TOOL (Click 1 sets center, MouseMove expands radius, Click 2 fixes size)
      if (drawTool === 'circle') {
        if (!isDrawingRef.current || !startLatLngRef.current) {
          isDrawingRef.current = true;
          startLatLngRef.current = latlng;
          const tempCircle = L.circle(latlng, {
            radius: 200,
            color: '#176BFF',
            fillColor: '#176BFF',
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '6, 6',
          }).addTo(map);
          tempShapeRef.current = tempCircle;
          showToast('Move cursor to adjust circle radius size, then click to complete');
        } else {
          const center = startLatLngRef.current;
          const radiusMeters = center.distanceTo(latlng);
          const radiusKm = Math.max(0.5, radiusMeters / 1000);

          if (tempShapeRef.current) {
            tempShapeRef.current.remove();
            tempShapeRef.current = null;
          }
          isDrawingRef.current = false;
          startLatLngRef.current = null;

          const shapeId = `shape-${Date.now()}`;
          const newShape: DrawnShape = {
            id: shapeId,
            type: 'circle',
            lat: center.lat,
            lng: center.lng,
            radius: radiusMeters,
          };
          setUserDrawnShapes((prev) => [...prev, newShape]);
          showToast(`Created Circle Buffer: ${radiusKm.toFixed(1)} km radius`);
          setAiPanelOpen(true);
          sendAIMessage(`Analyze drawn Circle Buffer (${radiusKm.toFixed(1)} km radius)`);
        }
        return;
      }

      // 3. RECTANGLE TOOL (Click 1 sets corner 1, MouseMove expands box, Click 2 fixes box)
      if (drawTool === 'rect') {
        if (!isDrawingRef.current || !startLatLngRef.current) {
          isDrawingRef.current = true;
          startLatLngRef.current = latlng;
          const bounds = L.latLngBounds(latlng, latlng);
          const tempRect = L.rectangle(bounds, {
            color: '#10B981',
            fillColor: '#10B981',
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '6, 6',
          }).addTo(map);
          tempShapeRef.current = tempRect;
          showToast('Move cursor to adjust rectangle size, then click to complete');
        } else {
          const p1 = startLatLngRef.current;
          const p2 = latlng;
          const bounds = L.latLngBounds(p1, p2);
          const center = bounds.getCenter();

          if (tempShapeRef.current) {
            tempShapeRef.current.remove();
            tempShapeRef.current = null;
          }
          isDrawingRef.current = false;
          startLatLngRef.current = null;

          const shapeId = `shape-${Date.now()}`;
          const newShape: DrawnShape = {
            id: shapeId,
            type: 'rect',
            lat: center.lat,
            lng: center.lng,
            radius: p1.distanceTo(p2) / 2,
            bounds: [
              [bounds.getSouth(), bounds.getWest()],
              [bounds.getNorth(), bounds.getEast()],
            ],
          };
          setUserDrawnShapes((prev) => [...prev, newShape]);
          showToast('Created Rectangle Bounding Box');
          setAiPanelOpen(true);
          sendAIMessage(`Analyze drawn Rectangle Bounding Box`);
        }
        return;
      }

      // 4. POLYGON TOOL (Click points to add vertices, double click to finish)
      if (drawTool === 'polygon') {
        tempPointsRef.current.push(latlng);
        showToast(`Added vertex ${tempPointsRef.current.length}. Double-click when finished!`);

        if (tempPointsRef.current.length >= 2) {
          if (tempShapeRef.current) {
            tempShapeRef.current.remove();
          }
          const tempPoly = L.polygon(tempPointsRef.current, {
            color: '#8B5CF6',
            fillColor: '#8B5CF6',
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '6, 6',
          }).addTo(map);
          tempShapeRef.current = tempPoly;
        }
      }
    };

    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      if (!isDrawingRef.current || !startLatLngRef.current) return;
      const latlng = e.latlng;

      if (drawTool === 'circle' && tempShapeRef.current && tempShapeRef.current instanceof L.Circle) {
        const radiusMeters = Math.max(100, startLatLngRef.current.distanceTo(latlng));
        tempShapeRef.current.setRadius(radiusMeters);
      } else if (drawTool === 'rect' && tempShapeRef.current && tempShapeRef.current instanceof L.Rectangle) {
        const bounds = L.latLngBounds(startLatLngRef.current, latlng);
        tempShapeRef.current.setBounds(bounds);
      }
    };

    const handleDblClick = () => {
      if (drawTool === 'polygon' && tempPointsRef.current.length >= 3) {
        const points = [...tempPointsRef.current];
        const latSum = points.reduce((sum, p) => sum + p.lat, 0);
        const lngSum = points.reduce((sum, p) => sum + p.lng, 0);
        const centerLat = latSum / points.length;
        const centerLng = lngSum / points.length;

        if (tempShapeRef.current) {
          tempShapeRef.current.remove();
          tempShapeRef.current = null;
        }
        tempPointsRef.current = [];

        const shapeId = `shape-${Date.now()}`;
        const newShape: DrawnShape = {
          id: shapeId,
          type: 'polygon',
          lat: centerLat,
          lng: centerLng,
          radius: 2000,
          points: points.map((p) => [p.lat, p.lng] as [number, number]),
        };
        setUserDrawnShapes((prev) => [...prev, newShape]);
        showToast('Created Polygon Boundary AOI');
        setAiPanelOpen(true);
        sendAIMessage(`Analyze drawn Polygon Boundary AOI`);
      }
    };

    map.on('click', handleMapClick);
    map.on('mousemove', handleMouseMove);
    map.on('dblclick', handleDblClick);

    return () => {
      map.off('click', handleMapClick);
      map.off('mousemove', handleMouseMove);
      map.off('dblclick', handleDblClick);
    };
  }, [activeTool, drawTool, setUserDrawnShapes, sendAIMessage, showToast]);


  // Invalidate Leaflet Map Size on AI Panel toggle, panel width change, and window resize
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize({ animate: false });
      const timer1 = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize({ animate: false });
      }, 100);
      const timer2 = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize({ animate: false });
      }, 350);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [aiPanelOpen, panelWidth]);

  useEffect(() => {
    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`relative w-full overflow-hidden flex flex-col md:flex-row bg-spatial-canvas ${pureMapMode ? 'h-screen pt-0' : 'h-screen pt-[84px] sm:pt-[88px]'}`}>

      {/* Main Visual Canvas Map */}
      <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden">

        {/* Primary Interactive Map Canvas for All Basemaps (DGE, Streets, Light, Satellite) */}
        <div
          ref={mapContainerRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-auto bg-[#F4F3F0] dark:bg-slate-900"
        />



        {/* Floating Tool Dock */}
        {!pureMapMode && <MapToolbar />}

        {/* Floating Data & Filter Drawer */}
        {!pureMapMode && filterDrawerOpen && (
          <div className="absolute top-4 sm:top-6 left-[72px] sm:left-[80px] z-[600] w-64 sm:w-72 h-[408px] max-h-[calc(100vh-160px)] glass-level-3 rounded-3xl p-3 sm:p-3.5 shadow-2xl border border-white/80 dark:border-slate-800 animate-slide-in flex flex-col overflow-hidden pointer-events-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2 shrink-0">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-geovision-blue" />
                GIS Categories
              </h3>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <SmartFilterPanel />
          </div>
        )}

        {/* Active Floating Tool Panels */}
        {!pureMapMode && activeTool === 'basemap' && <BasemapGallery />}
        {!pureMapMode && activeTool === 'legend' && <MapLegend />}
        {!pureMapMode && activeTool === 'buffer' && <BufferTool />}
        {!pureMapMode && activeTool === 'sketch' && <SketchAOITool />}

        {/* Print Modal */}
        {!pureMapMode && <PrintMapModal />}

        {/* Bottom Coordinates & Scale Capsule Status Bar */}
        {!pureMapMode && (
          <div className="hidden sm:block absolute bottom-3 left-16 sm:left-20 rtl:left-auto rtl:right-16 sm:rtl:right-20 z-[600]" ref={coordRef}>
            {coordMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2.5 z-[9999] w-44 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/90 shadow-2xl shadow-slate-950/20 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1 pb-1 border-b border-slate-100 dark:border-slate-800">
                  Coordinate Format
                </div>
                {[
                  { id: 'DD', label: 'DD (Decimal Deg)' },
                  { id: 'DDM', label: 'DDM (Deg Dec Min)' },
                  { id: 'DMS', label: 'DMS (Deg Min Sec)' },
                  { id: 'UTM', label: 'UTM (Grid Proj)' },
                ].map((opt) => {
                  const isSelected = coordFormat === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        setCoordFormat(opt.id as any);
                        setCoordMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0 ${isSelected
                          ? 'border-2 border-geovision-blue'
                          : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                          }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-geovision-blue" />}
                      </div>
                      <span className={`text-xs ${isSelected ? 'font-black text-geovision-blue dark:text-blue-300' : 'font-extrabold text-slate-700 dark:text-slate-300'}`}>
                        {opt.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-3 glass-level-1 px-4 py-2 rounded-2xl border border-white/70 dark:border-slate-800 text-[11px] font-black text-slate-800 dark:text-slate-200 shadow-lg">
              <button
                type="button"
                onClick={() => setCoordMenuOpen(!coordMenuOpen)}
                className="flex items-center gap-1 font-black text-slate-900 dark:text-white hover:text-geovision-blue dark:hover:text-geovision-blue cursor-pointer"
              >
                <span>{coordFormat}</span>
                <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-200 ${coordMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <span className="font-extrabold">{formatCoordinates(mapCenter[0], mapCenter[1], coordFormat)}</span>
              <span className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
              <span>Scale: 1:{Math.round(250000 / mapZoom)}</span>
            </div>
          </div>
        )}

      </div>

      {/* Right Side Docked GeoVision AI Panel */}
      {!pureMapMode && (
        <div
          style={{
            width: aiPanelOpen ? `${panelWidth}px` : '0px',
            maxWidth: '90vw',
          }}
          className={`transition-all ${isResizing ? 'duration-0 select-none' : 'duration-300'} ${
            aiPanelOpen
              ? 'fixed md:relative inset-x-0 bottom-0 top-auto z-[700] md:z-20 h-[65vh] max-h-[500px] md:max-h-none md:h-full rounded-t-3xl md:rounded-none shadow-2xl border-t md:border-t-0 border-slate-200 dark:border-slate-800'
              : 'w-0 h-0 overflow-hidden hidden'
          } shrink-0`}
        >
          <GeoVisionPanel
            onClose={() => setAiPanelOpen(false)}
            panelWidth={panelWidth}
            setPanelWidth={setPanelWidth}
            onStartResize={handleStartResize}
            isResizing={isResizing}
          />
        </div>
      )}

      {/* AI Panel Toggle Button */}
      {!pureMapMode && !aiPanelOpen && (
        <button
          onClick={() => setAiPanelOpen(true)}
          className="absolute bottom-3 sm:bottom-4 right-4 rtl:right-auto rtl:left-4 z-[600] flex items-center gap-2 px-4 py-2.5 rounded-full bg-geovision-blue text-white shadow-xl shadow-blue-500/35 hover:bg-blue-600 active:scale-95 transition-all cursor-pointer border border-white/30 text-xs font-black tracking-tight"
          title="Open GeoVision AI Assistant"
        >
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <span>{language === 'ar' ? 'مساعد GeoVision AI' : 'GeoVision AI'}</span>
        </button>
      )}

    </div>
  );
};
