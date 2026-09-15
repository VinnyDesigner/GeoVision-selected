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
import { createGeoVisionMarkerIcon } from '../../utils/markerUtils';
import { X, Layers, ChevronUp } from 'lucide-react';

export const MapWorkspace: React.FC = () => {
  const {
    language,
    activeBasemap,
    activeTool,
    selectedFeature,
    setSelectedFeature,
    mapCenter,
    mapZoom,
    filteredFeatures,
    selectedCategoryIds,
    selectedSubcategoryIds,
    bufferRadiusKm,
    aoiResult,
    showToast,
    filterDrawerOpen,
    setFilterDrawerOpen,
    drawTool,
    userDrawnShapes,
    setUserDrawnShapes,
    sendAIMessage,
    pureMapMode,
    userLocation,
    navigationTarget,
    aiMessages,
  } = useAppState();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.Layer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
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
    dge: 'https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_GCS/MapServer',
    light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  const createBasemapLayer = (map: L.Map, type: string): L.Layer => {
    if (type === 'dge') {
      // Dynamic TileLayer that tiles official Abu Dhabi DGE_Color_Basemap_GCS via export
      const DGEArcGISTileLayer = (L.TileLayer as any).extend({
        getTileUrl: function (coords: L.Coords) {
          const origin = -20037508.342789244;
          const totalSize = 20037508.342789244 * 2;
          const numTiles = Math.pow(2, coords.z);
          const tileMercSize = totalSize / numTiles;

          const minX = origin + coords.x * tileMercSize;
          const maxX = origin + (coords.x + 1) * tileMercSize;
          const maxY = -origin - coords.y * tileMercSize;
          const minY = -origin - (coords.y + 1) * tileMercSize;

          return `https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_GCS/MapServer/export?bbox=${minX},${minY},${maxX},${maxY}&bboxSR=3857&imageSR=3857&size=256,256&f=image&format=png32`;
        },

        createTile: function (coords: L.Coords, done: (error: any, tile: HTMLImageElement) => void) {
          const tile = document.createElement('img');
          tile.alt = '';
          tile.setAttribute('role', 'presentation');

          const primaryUrl = this.getTileUrl(coords);
          const fallbackUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${coords.z}/${coords.y}/${coords.x}`;

          tile.onload = () => {
            done(null, tile);
          };

          tile.onerror = () => {
            // If individual tile request times out or is outside coverage, fallback only this tile
            if (tile.src !== fallbackUrl) {
              tile.src = fallbackUrl;
            } else {
              done(new Error('Tile error'), tile);
            }
          };

          tile.src = primaryUrl;
          return tile;
        },
      });

      const layer = new DGEArcGISTileLayer('', {
        maxZoom: 19,
        attribution: '&copy; DGE Abu Dhabi Spatial Data Infrastructure (AD-SDI)',
      });

      return layer.addTo(map);
    }

    const tileUrl = basemapUrls[type] || basemapUrls['dge'];
    return L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; ArcGIS / DGE Abu Dhabi Spatial Infrastructure (SDI)',
    }).addTo(map);
  };

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
        zoomSnap: 1,
        zoomDelta: 1,
        wheelDebounceTime: 40,
        wheelPxPerZoomLevel: 60,
        preferCanvas: true,
      });

      const layer = createBasemapLayer(map, activeBasemap);
      tileLayerRef.current = layer as any;

      markersGroupRef.current = L.layerGroup().addTo(map);
      drawnLayersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Immediate size recalculation for instant non-blocking map rendering
      map.invalidateSize();
      requestAnimationFrame(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
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

  // Listen to custom zoom & navigation events from toolbar
  useEffect(() => {
    const handleZoomInEvent = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.zoomIn(1);
      }
    };
    const handleZoomOutEvent = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.zoomOut(1);
      }
    };
    const handleResetHomeEvent = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([24.4539, 54.3773], 12, { animate: true, duration: 1.2 });
      }
    };
    const handleFlyToEvent = (e: any) => {
      if (mapInstanceRef.current && e.detail && e.detail.center) {
        mapInstanceRef.current.invalidateSize();
        mapInstanceRef.current.flyTo(e.detail.center, e.detail.zoom || 15, { animate: true, duration: 1.2 });
      }
    };

    window.addEventListener('geovision:zoomIn', handleZoomInEvent);
    window.addEventListener('geovision:zoomOut', handleZoomOutEvent);
    window.addEventListener('geovision:resetHome', handleResetHomeEvent);
    window.addEventListener('geovision:flyTo', handleFlyToEvent);

    return () => {
      window.removeEventListener('geovision:zoomIn', handleZoomInEvent);
      window.removeEventListener('geovision:zoomOut', handleZoomOutEvent);
      window.removeEventListener('geovision:resetHome', handleResetHomeEvent);
      window.removeEventListener('geovision:flyTo', handleFlyToEvent);
    };
  }, []);

  // Update Feature Markers & Layer Clusters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    const newMarkersMap = new Map<string, L.Marker>();

    // ALWAYS include matchedFeatures from active AI message stream & selectedFeature
    const displayFeatures = [...filteredFeatures];

    const lastMsgWithFeatures = [...aiMessages].reverse().find(m => m.matchedFeatures && m.matchedFeatures.length > 0);
    if (lastMsgWithFeatures && lastMsgWithFeatures.matchedFeatures) {
      lastMsgWithFeatures.matchedFeatures.forEach((feat: GeoFeature) => {
        if (!displayFeatures.some((f) => f.id === feat.id || f.nameEn === feat.nameEn)) {
          displayFeatures.push(feat);
        }
      });
    }

    if (selectedFeature) {
      const exists = displayFeatures.some(
        (f) =>
          f.id === selectedFeature.id ||
          f.nameEn === selectedFeature.nameEn ||
          (f.lat === selectedFeature.lat && f.lng === selectedFeature.lng)
      );
      if (!exists) {
        displayFeatures.push(selectedFeature);
      }
    }

    displayFeatures.forEach((feat) => {
      const isSelected =
        selectedFeature &&
        (selectedFeature.id === feat.id || selectedFeature.nameEn === feat.nameEn);
      const customIcon = createGeoVisionMarkerIcon(feat.category, feat.subcategory, false, !!isSelected);
      const marker = L.marker([feat.lat, feat.lng], { icon: customIcon, zIndexOffset: isSelected ? 1000 : 0 });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedFeature(feat);
      });

      markersGroupRef.current?.addLayer(marker);
      newMarkersMap.set(feat.id, marker);
    });

    markersMapRef.current = newMarkersMap;

    if (!selectedFeature) {
      mapInstanceRef.current?.closePopup();
    }

    // If user filtered by category and features exist but none are in current view, frame them smoothly (only when no selected feature is active)
    if (!selectedFeature && mapInstanceRef.current && (selectedCategoryIds.length > 0 || selectedSubcategoryIds.length > 0) && displayFeatures.length > 0) {
      const bounds = mapInstanceRef.current.getBounds();
      const anyInView = displayFeatures.some(f => bounds.contains([f.lat, f.lng]));
      if (!anyInView) {
        const featureBounds = L.latLngBounds(displayFeatures.map(f => [f.lat, f.lng]));
        mapInstanceRef.current.fitBounds(featureBounds, { padding: [60, 60], maxZoom: 14 });
      }
    }
  }, [filteredFeatures, language, selectedFeature, selectedCategoryIds, selectedSubcategoryIds]);

  // Single Unified Map Camera Control Effect with Frame Coalescing
  const flyToTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (flyToTimeoutRef.current) {
      clearTimeout(flyToTimeoutRef.current);
    }

    flyToTimeoutRef.current = setTimeout(() => {
      if (!mapInstanceRef.current) return;
      const mapInst = mapInstanceRef.current;
      mapInst.invalidateSize();

      if (navigationTarget && selectedFeature && navigationTarget.id === selectedFeature.id) {
        const origin: [number, number] = userLocation || [24.4539, 54.3773];
        const destination: [number, number] = [selectedFeature.lat, selectedFeature.lng];
        const routeBounds = L.latLngBounds([origin, destination]);
        mapInst.flyToBounds(routeBounds, { padding: [90, 90], maxZoom: 15, duration: 1.2 });
      } else if (selectedFeature) {
        mapInst.flyTo([selectedFeature.lat, selectedFeature.lng], 15, { animate: true, duration: 1.2 });
      } else if (mapCenter && mapCenter.length === 2) {
        mapInst.flyTo(mapCenter, mapZoom || 15, { animate: true, duration: 1.2 });
      }
    }, 25);

    return () => {
      if (flyToTimeoutRef.current) {
        clearTimeout(flyToTimeoutRef.current);
      }
    };
  }, [selectedFeature, navigationTarget, userLocation, mapCenter, mapZoom]);

  // Draw Dashed Navigation Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // 1. Remove existing route polyline & origin marker
    if (activeRouteLineRef.current) {
      activeRouteLineRef.current.remove();
      activeRouteLineRef.current = null;
    }
    if (activeRouteStartMarkerRef.current) {
      activeRouteStartMarkerRef.current.remove();
      activeRouteStartMarkerRef.current = null;
    }

    if (!selectedFeature) return;

    const isNavTargetActive = navigationTarget && navigationTarget.id === selectedFeature.id;

    if (isNavTargetActive) {
      const origin: [number, number] = userLocation || [24.4539, 54.3773];
      const destination: [number, number] = [selectedFeature.lat, selectedFeature.lng];

      const polyline = L.polyline([origin, destination], {
        color: '#2563eb',
        weight: 5,
        opacity: 0.95,
        dashArray: '8, 8',
        className: 'animated-route-polyline',
        interactive: false,
      }).addTo(map);

      const distanceKm = selectedFeature.distanceKm || (
        Math.hypot(selectedFeature.lat - origin[0], selectedFeature.lng - origin[1]) * 111
      ).toFixed(1);

      polyline.bindTooltip(
        `<div style="font-family:sans-serif;font-weight:900;font-size:11px;color:#1e40af;padding:4px 10px;background:rgba(255,255,255,0.95);border-radius:10px;border:1.5px solid #2563eb;box-shadow:0 4px 14px rgba(37,99,235,0.3);">
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
  }, [selectedFeature, userLocation, language, navigationTarget]);

  // Render Highlighted Circle around Selected Feature ONLY
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (!selectedFeature) {
      if (bufferCircleRef.current) {
        bufferCircleRef.current.remove();
        bufferCircleRef.current = null;
      }
      return;
    }

    const radiusMeters = (bufferRadiusKm && bufferRadiusKm > 0 ? bufferRadiusKm : 1.5) * 1000;
    const centerLatLng: [number, number] = [selectedFeature.lat, selectedFeature.lng];

    if (bufferCircleRef.current) {
      bufferCircleRef.current.setLatLng(centerLatLng);
      bufferCircleRef.current.setRadius(radiusMeters);
    } else {
      const circle = L.circle(centerLatLng, {
        radius: radiusMeters,
        color: '#215A9E',
        fillColor: '#215A9E',
        fillOpacity: 0.14,
        weight: 2.5,
        dashArray: '6, 6',
        interactive: false,
      }).addTo(mapInstanceRef.current);

      bufferCircleRef.current = circle;
    }
  }, [selectedFeature, bufferRadiusKm]);

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
        interactive: false,
      }).addTo(mapInstanceRef.current);

      aoiPolygonRef.current = polygon;
    }
  }, [activeTool, aoiResult]);

  const tempShapeRef = useRef<L.Layer | null>(null);
  const tempPointsRef = useRef<L.LatLng[]>([]);
  const isDrawingRef = useRef<boolean>(false);
  const startLatLngRef = useRef<L.LatLng | null>(null);

  // Render User Drawn Shapes (Point, Circle, Polygon, Rectangle)
  useEffect(() => {
    if (!mapInstanceRef.current || !drawnLayersGroupRef.current) return;

    drawnLayersGroupRef.current.clearLayers();

    if (tempShapeRef.current) {
      tempShapeRef.current.remove();
      tempShapeRef.current = null;
    }
    tempPointsRef.current = [];
    isDrawingRef.current = false;
    startLatLngRef.current = null;

    if (userDrawnShapes.length === 0 && aoiPolygonRef.current) {
      aoiPolygonRef.current.remove();
      aoiPolygonRef.current = null;
    }

    userDrawnShapes.forEach((shape) => {
      if (shape.type === 'point') {
        const customPin = L.divIcon({
          className: 'custom-leaflet-marker-pin',
          html: `<div style="width:28px;height:28px;background:#176BFF;border:2.5px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(23,107,255,0.5);color:white;font-size:13px;font-weight:900;">📍</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([shape.lat, shape.lng], { icon: customPin });
        drawnLayersGroupRef.current?.addLayer(marker);
      } else if (shape.type === 'circle') {
        const circle = L.circle([shape.lat, shape.lng], {
          radius: shape.radius || 2000,
          color: '#176BFF',
          fillColor: '#176BFF',
          fillOpacity: 0.2,
          weight: 2.5,
        });
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
        drawnLayersGroupRef.current?.addLayer(rect);
      }
    });
  }, [userDrawnShapes]);

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
          <img
            src="/assets/logos/geovision-ai-avatar.png"
            alt="GeoVision AI"
            className="w-4 h-4 object-contain shrink-0 filter drop-shadow-xs"
          />
          <span>{language === 'ar' ? 'مساعد GeoVision AI' : 'GeoVision AI'}</span>
        </button>
      )}

    </div>
  );
};
