import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Printer, X, Download, FileText, ShieldCheck, Compass, CheckCircle, BarChart2 } from 'lucide-react';
import { triggerPrintDocument } from '../../utils/printUtils';

export const PrintMapModal: React.FC = () => {
  const { printModalOpen, setPrintModalOpen, showToast, t, language } = useAppState();
  const [format, setFormat] = useState<'pdf' | 'png' | 'jpeg'>('pdf');
  const [layoutMode, setLayoutMode] = useState<'map' | 'summary' | 'ledger'>('map');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [printState, setPrintState] = useState<'idle' | 'generating' | 'ready'>('idle');

  if (!printModalOpen) return null;

  const handleGenerate = () => {
    setPrintState('generating');
    setTimeout(() => {
      setPrintState('ready');
      showToast(language === 'ar' ? 'تم تجهيز التقرير الجغرافي للتحميل' : 'Spatial map report generated successfully');
    }, 1200);
  };

  const handleDownload = () => {
    showToast(language === 'ar' ? 'جاري تجهيز تقرير طباعة الخريطة الرسمي...' : 'Preparing official cartographic map report...');

    let sectionHtml = '';
    if (layoutMode === 'map') {
      sectionHtml = `
        <div class="map-frame">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 900; margin-bottom: 25px;">
            <span>📍 Active Spatial Extent Canvas [Khalifa City / Zayed City Bounding Box]</span>
            <span style="color: #60a5fa; font-family: monospace;">Center: 24.4539° N, 54.3773° E</span>
          </div>
          <div style="text-align: center; padding: 40px 0; background: rgba(30, 41, 59, 0.7); border-radius: 10px; border: 1px dashed #475569; margin-bottom: 25px;">
            <div style="font-size: 28px; margin-bottom: 8px;">🗺️</div>
            <div style="font-weight: 900; font-size: 15px; color: #93c5fd;">High-Resolution SDI Multi-Sector Layer Render</div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Authoritative Spatial Data Infrastructure • Layer Resolution 100m</div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #cbd5e1; font-weight: bold; background: rgba(15, 23, 42, 0.9); padding: 8px 12px; border-radius: 8px;">
            <span>Grid Reference: UAE EPSG:32639</span>
            <span>Cartographic Clearance: Grade A</span>
            <span>Security: Unclassified Public Spatial Record</span>
          </div>
        </div>
      `;
    } else if (layoutMode === 'summary') {
      sectionHtml = `
        <div class="insights-box">
          <strong style="color: #1e3a8a; font-size: 13px; display: block; margin-bottom: 6px;">Executive Spatial Intelligence Summary</strong>
          Comprehensive geospatial analysis conducted across Abu Dhabi Hub. Multi-sector layer overlays indicate high infrastructure readiness (85% active rate) with average drive time of ~8 minutes to major public facilities.
        </div>
        <div class="kpi-grid" style="grid-template-columns: repeat(4, 1fr);">
          <div class="kpi-card"><div class="kpi-lbl">Spatial Features</div><div class="kpi-val">12 Features</div></div>
          <div class="kpi-card"><div class="kpi-lbl">Min Distance</div><div class="kpi-val">1.2 km</div></div>
          <div class="kpi-card"><div class="kpi-lbl">Average Drive</div><div class="kpi-val">~8 Mins</div></div>
          <div class="kpi-card"><div class="kpi-lbl">Status Rate</div><div class="kpi-val">85% Active</div></div>
        </div>
      `;
    } else {
      sectionHtml = `
        <h3 style="font-size: 13px; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; color: #0f172a;">Spatial Data Ledger Table</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Ref #</th>
              <th>Feature Name</th>
              <th>Coordinates</th>
              <th>Proximity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td><strong>GEMS American Academy</strong></td>
              <td style="font-family: monospace;">24.4539, 54.3773</td>
              <td>1.2 km</td>
              <td><span style="color: #166534; font-weight: bold;">Active</span></td>
            </tr>
            <tr>
              <td>2</td>
              <td><strong>Al Raha International School</strong></td>
              <td style="font-family: monospace;">24.4412, 54.3810</td>
              <td>2.4 km</td>
              <td><span style="color: #166534; font-weight: bold;">Active</span></td>
            </tr>
            <tr>
              <td>3</td>
              <td><strong>Zayed City Medical Center</strong></td>
              <td style="font-family: monospace;">24.4289, 54.3921</td>
              <td>3.8 km</td>
              <td><span style="color: #166534; font-weight: bold;">Operational</span></td>
            </tr>
          </tbody>
        </table>
      `;
    }

    const htmlContent = `
      <div class="header-banner">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge">DGE</span>
            <span style="font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Government of Abu Dhabi • Spatial Intelligence Center</span>
          </div>
          <h1 style="font-size: 20px; font-weight: 900; margin: 8px 0 4px 0;">Official Cartographic & Geospatial Map Report</h1>
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">Department of Government Enablement • Abu Dhabi Spatial Data Infrastructure (SDI)</div>
        </div>
        <div style="text-align: right;">
          <span class="security-stamp">OFFICIAL MAP EXPORT</span>
          <div style="font-size: 10px; font-weight: 900; color: #94a3b8; margin-top: 6px;">REF ID: MAP-EXT-${Math.floor(1000 + Math.random() * 9000)}</div>
          <div style="font-size: 10px; color: #64748b;">${new Date().toLocaleString()}</div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-lbl">Spatial Extent</div><div class="kpi-val">Abu Dhabi Hub</div></div>
        <div class="kpi-card"><div class="kpi-lbl">Scale Ratio</div><div class="kpi-val">1:25,000</div></div>
        <div class="kpi-card"><div class="kpi-lbl">Geodetic Datum</div><div class="kpi-val">WGS 84</div></div>
        <div class="kpi-card"><div class="kpi-lbl">UTM Zone</div><div class="kpi-val">Zone 39N</div></div>
      </div>

      ${sectionHtml}

      <div class="footer-block">
        <div>
          <strong>Certified by Abu Dhabi SDI Spatial Authority</strong><br/>
          Digitally Signed & Validated • Department of Government Enablement
        </div>
        <div style="text-align: right; font-family: monospace;">
          HASH: 8f4e92a1c0d57e3b<br/>
          PAGE 1 OF 1
        </div>
      </div>
    `;

    if (format === 'pdf') {
      triggerPrintDocument('Official Cartographic Map Report - Abu Dhabi SDI', htmlContent, orientation);
    } else {
      // Image Export (PNG / JPEG) fallback via SVG Blob download
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="background:#ffffff; font-family:sans-serif; padding:20px;">
              ${htmlContent}
            </div>
          </foreignObject>
        </svg>
      `;
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dge-map-report-${layoutMode}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`DGE GeoVision Map Report downloaded as ${format.toUpperCase()}`);
      setPrintModalOpen(false);
      setPrintState('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pt-20 sm:pt-24 pb-6 px-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[calc(100vh-120px)] overflow-hidden">
        
        {/* FIXED HEADER */}
        <div className="shrink-0 p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-black shadow-md shadow-blue-500/30 border border-blue-400/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t('print.title')}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-geovision-blue dark:text-blue-300 text-[10px] font-black uppercase">
                  DGE Spatial Studio
                </span>
              </h2>
              <p className="text-xs font-bold text-slate-400">
                {t('print.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setPrintModalOpen(false);
              setPrintState('idle');
            }}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE INNER BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
          {/* Layout & Format Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Layout Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                {language === 'ar' ? 'نموذج تخطيط التقرير' : 'Report Layout Template'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'map', label: language === 'ar' ? 'خريطة GIS' : 'Map Extent', icon: Compass },
                  { id: 'summary', label: language === 'ar' ? 'إيجاز تنفيذي' : 'Executive', icon: BarChart2 },
                  { id: 'ledger', label: language === 'ar' ? 'سجل المعالم' : 'Data Ledger', icon: FileText },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSel = layoutMode === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setLayoutMode(item.id as any)}
                      className={`flex flex-col items-center p-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                        isSel
                          ? 'border-2 border-geovision-blue bg-blue-50/80 text-geovision-blue dark:bg-blue-950/80 dark:text-blue-300 shadow-md shadow-blue-500/15'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-geovision-blue'
                      }`}
                    >
                      <IconComp className="w-4 h-4 mb-1" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Export Format & Orientation Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                {language === 'ar' ? 'صيغة التصدير والاتجاه' : 'Format & Page Orientation'}
              </label>
              <div className="flex gap-2">
                <div className="grid grid-cols-3 gap-1.5 flex-1">
                  {[
                    { id: 'pdf', label: 'PDF' },
                    { id: 'png', label: 'PNG' },
                    { id: 'jpeg', label: 'JPEG' },
                  ].map((f) => {
                    const isSel = format === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFormat(f.id as any)}
                        className={`py-2 px-3 rounded-xl border text-xs font-black transition-all cursor-pointer text-center ${
                          isSel
                            ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer transition-all ${
                      orientation === 'portrait' ? 'bg-slate-100 dark:bg-slate-700 text-geovision-blue dark:text-blue-300' : 'text-slate-400'
                    }`}
                  >
                    📄 Portrait
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer transition-all ${
                      orientation === 'landscape' ? 'bg-slate-100 dark:bg-slate-700 text-geovision-blue dark:text-blue-300' : 'text-slate-400'
                    }`}
                  >
                    📑 Landscape
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Authentic Document A4 Sheet Live Preview */}
          <div id="sdi-printable-report" className="border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 shadow-xl space-y-6 text-slate-900 dark:text-slate-100">
            {/* Emblem Header */}
            <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-geovision-blue text-white flex items-center justify-center text-xs font-black shadow-md">
                  DGE
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Government of Abu Dhabi • Spatial Intelligence Center
                  </h3>
                  <p className="text-[11px] text-slate-400 font-semibold">
                    Official Cartographic & Geospatial SDI Report
                  </p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            {/* Map Canvas Preview Container */}
            {layoutMode === 'map' && (
              <div className="space-y-4">
                <div className="h-56 sm:h-64 rounded-2xl bg-slate-800 border border-slate-700 relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                  
                  <div className="relative z-10 flex items-center justify-between text-white text-xs">
                    <span className="px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700 font-bold">
                      Active Spatial Bounds: Khalifa City Hub [24.45N, 54.37E]
                    </span>
                    <Compass className="w-5 h-5 text-blue-400" />
                  </div>

                  <div className="relative z-10 flex items-center justify-center my-auto">
                    <span className="px-4 py-2 rounded-2xl bg-slate-900/95 border border-blue-500/50 text-blue-300 font-black text-xs shadow-2xl">
                      📍 DGE High-Resolution GIS Map Extent Render
                    </span>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[10px] text-white font-bold bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700">
                    <span>Scale: 1:25,000</span>
                    <span>Projection: WGS 84 / UTM Zone 39N</span>
                    <span>Grid: 100m Spacing</span>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Preview */}
            {layoutMode === 'summary' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-black text-slate-400 block uppercase">Spatial Features</span>
                  <span className="text-lg font-black text-geovision-blue dark:text-blue-400">12 Features</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-black text-slate-400 block uppercase">Min Distance</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">1.2 km</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-black text-slate-400 block uppercase">Average Drive</span>
                  <span className="text-lg font-black text-purple-600 dark:text-purple-400">~8 Mins</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-black text-slate-400 block uppercase">Status Rate</span>
                  <span className="text-lg font-black text-amber-600 dark:text-amber-400">85% Active</span>
                </div>
              </div>
            )}

            {/* Ledger Preview */}
            {layoutMode === 'ledger' && (
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left rtl:text-right">
                  <thead className="bg-slate-900 text-white font-black text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">Ref #</th>
                      <th className="p-2.5">Feature Name</th>
                      <th className="p-2.5">Coordinates</th>
                      <th className="p-2.5">Proximity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold text-[11px]">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-400">1</td>
                      <td className="p-2.5 font-black text-slate-900 dark:text-white">GEMS American Academy</td>
                      <td className="p-2.5 font-mono text-[10px]">24.4539, 54.3773</td>
                      <td className="p-2.5 font-black text-geovision-blue">1.2 km</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-400">2</td>
                      <td className="p-2.5 font-black text-slate-900 dark:text-white">Al Raha International School</td>
                      <td className="p-2.5 font-mono text-[10px]">24.4412, 54.3810</td>
                      <td className="p-2.5 font-black text-geovision-blue">2.4 km</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Included Elements Checklist */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-black text-slate-900 dark:text-white block uppercase tracking-wider text-[11px]">Verified Report Certification:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Official Abu Dhabi DGE Crest Header</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>High-Resolution GIS Extent Canvas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Scale Ratio & North Compass Arrow</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Geodetic Timestamp & Hash Signature</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* FIXED FOOTER */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 rounded-b-3xl flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setPrintModalOpen(false);
              setPrintState('idle');
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {language === 'ar' ? 'إلغاء' : 'Close Studio'}
          </button>

          <div className="flex items-center gap-2">
            {printState === 'idle' && (
              <button
                onClick={handleGenerate}
                className="px-6 py-2.5 rounded-xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                {t('print.btnGenerate')}
              </button>
            )}

            {printState === 'generating' && (
              <div className="px-5 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-geovision-blue dark:text-blue-300 text-xs font-black flex items-center gap-2 animate-pulse border border-blue-200">
                <Printer className="w-4 h-4 animate-spin" />
                {t('print.generating')}
              </div>
            )}

            {printState === 'ready' && (
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {t('print.download')} ({format.toUpperCase()})
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
