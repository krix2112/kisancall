'use client';

import React, { useEffect, useState, useRef } from 'react';
import { farmerApi } from '@/services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export interface MandiLocation {
  id: string;
  name: string;
  district: string;
  daily_capacity?: number;
  working_hours?: string;
  latitude: number | null;
  longitude: number | null;
}

interface MandiMapProps {
  farmerMandi?: MandiLocation | null;
  farmerMandiName?: string;
}

// Custom Leaflet DivIcon helpers
function createFarmerIcon() {
  return L.divIcon({
    className: 'custom-farmer-pin',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #00450d;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 4px 14px rgba(0, 69, 13, 0.5);
        cursor: pointer;
      ">
        <span style="font-size: 16px;">⭐</span>
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid #00450d;
        "></div>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -40],
  });
}

function createStandardIcon() {
  return L.divIcon({
    className: 'custom-mandi-pin',
    html: `
      <div style="
        position: relative;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0284c7;
        border: 2px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(2, 132, 199, 0.4);
        cursor: pointer;
      ">
        <span style="font-size: 13px;">🌾</span>
        <div style="
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid #0284c7;
        "></div>
      </div>
    `,
    iconSize: [28, 33],
    iconAnchor: [14, 33],
    popupAnchor: [0, -31],
  });
}

// 1. Embedded Mini Map Component
function EmbeddedMiniMap({
  coords,
  mandiName,
  district,
}: {
  coords: [number, number] | null;
  mandiName: string;
  district: string;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const defaultCenter: [number, number] = coords || [29.6857, 76.9905]; // Default Karnal
    const zoomLevel = coords ? 12 : 7;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: zoomLevel,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    if (coords) {
      const marker = L.marker(coords, { icon: createFarmerIcon() }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
          <strong style="color: #00450d; font-size: 13px; display: block;">${mandiName}</strong>
          <span style="color: #475569;">District: ${district}</span>
        </div>
      `);
    }

    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [coords, mandiName, district]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}

// 2. Full-Screen Modal Map Component
function FullScreenModalMap({
  farmerCoords,
  farmerMandi,
  farmerMandiName,
  allMandis,
}: {
  farmerCoords: [number, number] | null;
  farmerMandi?: MandiLocation | null;
  farmerMandiName?: string;
  allMandis: MandiLocation[];
}) {
  const modalMapContainerRef = useRef<HTMLDivElement>(null);
  const modalMapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!modalMapContainerRef.current) return;

    const validMandis = allMandis.filter((m) => m.latitude !== null && m.longitude !== null);
    const center: [number, number] = farmerCoords || [29.6857, 76.9905]; // Karnal fallback
    const zoomLevel = farmerCoords ? 9 : 7;

    const map = L.map(modalMapContainerRef.current, {
      center: center,
      zoom: zoomLevel,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add farmer mandi marker
    if (farmerCoords) {
      const farmerMarker = L.marker(farmerCoords, { icon: createFarmerIcon() }).addTo(map);
      farmerMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.5; padding: 2px;">
          <span style="background: #dcfce7; color: #166534; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; display: inline-block; margin-bottom: 4px;">
            ⭐ YOUR DESIGNATED MANDI
          </span>
          <strong style="color: #00450d; font-size: 13px; display: block;">${farmerMandi?.name || farmerMandiName || 'Designated Mandi'}</strong>
          <span style="color: #475569; display: block;">District: <strong>${farmerMandi?.district || 'Karnal'}</strong></span>
          <span style="color: #475569; display: block;">Daily Capacity: <strong>${farmerMandi?.daily_capacity || 200} Qtl</strong></span>
          <span style="color: #475569; display: block;">Working Hours: <strong>${farmerMandi?.working_hours || '09:00 - 18:00'}</strong></span>
        </div>
      `).openPopup();
    }

    // Add all other mandis
    validMandis.forEach((m) => {
      if (
        (farmerMandi?.id && m.id === farmerMandi.id) ||
        (farmerCoords && m.latitude === farmerCoords[0] && m.longitude === farmerCoords[1])
      ) {
        return; // Skip duplicate of farmer's mandi
      }

      if (m.latitude && m.longitude) {
        const marker = L.marker([m.latitude, m.longitude], { icon: createStandardIcon() }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; line-height: 1.5; padding: 2px;">
            <span style="background: #e0f2fe; color: #0369a1; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; display: inline-block; margin-bottom: 4px;">
              APMC MANDI
            </span>
            <strong style="color: #0f172a; font-size: 13px; display: block;">${m.name}</strong>
            <span style="color: #475569; display: block;">District: <strong>${m.district}</strong></span>
            <span style="color: #475569; display: block;">Daily Capacity: <strong>${m.daily_capacity || 200} Qtl</strong></span>
            <span style="color: #475569; display: block;">Working Hours: <strong>${m.working_hours || '09:00 - 18:00'}</strong></span>
          </div>
        `);
      }
    });

    modalMapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      modalMapInstanceRef.current = null;
    };
  }, [farmerCoords, farmerMandi, farmerMandiName, allMandis]);

  return <div ref={modalMapContainerRef} className="w-full h-full" />;
}

export default function MandiMap({ farmerMandi, farmerMandiName }: MandiMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allMandis, setAllMandis] = useState<MandiLocation[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function loadAllMandis() {
      try {
        const mandis = await farmerApi.getMandis();
        setAllMandis(mandis || []);
      } catch (err) {
        console.error('Failed to load mandis for map:', err);
      }
    }
    loadAllMandis();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const farmerCoords: [number, number] | null =
    farmerMandi?.latitude && farmerMandi?.longitude
      ? [farmerMandi.latitude, farmerMandi.longitude]
      : null;

  const validMandis = allMandis.filter((m) => m.latitude !== null && m.longitude !== null);

  if (!isClient) {
    return (
      <div className="w-full h-44 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-500 animate-pulse border border-slate-200">
        🗺️ Loading Mandi Map (नक्शा लोड हो रहा है)...
      </div>
    );
  }

  return (
    <>
      {/* 1. Embedded Dashboard Map Container */}
      <div className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-white">
        {/* Header Overlay */}
        <div className="p-3 bg-white/95 backdrop-blur-xs border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700 text-base">📍</span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {farmerMandi?.name || farmerMandiName || 'Designated Mandi Location'}
              </h4>
              <p className="text-[11px] text-slate-500">
                District: {farmerMandi?.district || 'Karnal'} • Real-Time Geo-Location
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <span>🔍</span>
            <span>Tap to expand (बड़ा नक्शा)</span>
          </button>
        </div>

        {/* Interactive Mini Map */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="h-44 w-full cursor-pointer relative"
          title="Click to expand full screen map"
        >
          <EmbeddedMiniMap
            coords={farmerCoords}
            mandiName={farmerMandi?.name || farmerMandiName || 'Designated Mandi'}
            district={farmerMandi?.district || 'Karnal'}
          />

          {/* Hover Overlay Hint */}
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
            <span className="bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md backdrop-blur-xs flex items-center gap-1.5">
              <span>🗺️</span> Click to view all {validMandis.length || 10} Geocoded Mandis
            </span>
          </div>
        </div>
      </div>

      {/* 2. Full-Screen Modal Overlay Map */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs p-3 sm:p-6 flex flex-col items-center justify-center animate-fadeIn">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🗺️</span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    All APMC Mandis Explorer (समस्त कृषि उपज मंडी नक्शा)
                  </h3>
                  <span className="bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] px-2 py-0.5 rounded-full font-mono">
                    {validMandis.length} Mandis Mapped
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Click any marker to view mandi capacity, operational hours, and district details.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white p-2 sm:px-4 sm:py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                aria-label="Close modal"
              >
                <span>✕</span>
                <span className="hidden sm:inline">Close (बंद करें)</span>
              </button>
            </div>

            {/* Map Legend Banner */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-4">
                {farmerCoords && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#00450d] border border-white inline-block shadow-xs" />
                    <span className="font-semibold text-slate-800">
                      Your Assigned Mandi: <strong className="text-emerald-900">{farmerMandi?.name || 'Karnal Central'}</strong>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#0284c7] border border-white inline-block shadow-xs" />
                  <span className="text-slate-600">APMC Mandis ({validMandis.length})</span>
                </div>
              </div>

              <span className="text-[11px] text-slate-500">
                Press <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-700 font-mono">ESC</kbd> to return
              </span>
            </div>

            {/* Modal Map View */}
            <div className="flex-1 w-full relative">
              <FullScreenModalMap
                farmerCoords={farmerCoords}
                farmerMandi={farmerMandi}
                farmerMandiName={farmerMandiName}
                allMandis={allMandis}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
