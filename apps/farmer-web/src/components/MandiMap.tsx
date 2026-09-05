'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { farmerApi } from '@/services/api';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to ensure 100% SSR safety in Next.js
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Recenter component to adjust view when coords or expansion changes
function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    // Invalidate map size after animation/modal render
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [center, zoom, map]);
  return null;
}

export default function MandiMap({ farmerMandi, farmerMandiName }: MandiMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allMandis, setAllMandis] = useState<MandiLocation[]>([]);
  const [isLoadingMandis, setIsLoadingMandis] = useState(false);

  // Set isClient true only in browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch all mandis when modal opens or component mounts
  useEffect(() => {
    async function loadAllMandis() {
      setIsLoadingMandis(true);
      try {
        const mandis = await farmerApi.getMandis();
        setAllMandis(mandis || []);
      } catch (err) {
        console.error('Failed to load mandis for map:', err);
      } finally {
        setIsLoadingMandis(false);
      }
    }
    loadAllMandis();
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Determine farmer mandi coordinates (null if not geocoded in DB)
  const farmerCoords: [number, number] | null = useMemo(() => {
    if (
      farmerMandi?.latitude !== undefined &&
      farmerMandi?.latitude !== null &&
      farmerMandi?.longitude !== undefined &&
      farmerMandi?.longitude !== null
    ) {
      return [farmerMandi.latitude, farmerMandi.longitude];
    }
    return null;
  }, [farmerMandi]);

  // Filter out any mandis with null lat or long from DB
  const validMandis = useMemo(() => {
    return allMandis.filter(
      (m) => m.latitude !== null && m.latitude !== undefined && m.longitude !== null && m.longitude !== undefined
    );
  }, [allMandis]);

  // Default center for map viewport (centered on North India / first valid mandi)
  const defaultCenter: [number, number] = useMemo(() => {
    if (farmerCoords) return farmerCoords;
    if (validMandis.length > 0 && validMandis[0].latitude && validMandis[0].longitude) {
      return [validMandis[0].latitude, validMandis[0].longitude];
    }
    return [28.6139, 77.2090]; // National center reference (New Delhi)
  }, [farmerCoords, validMandis]);

  // Custom Leaflet Icons using SVG/HTML divIcon to avoid Next.js asset path bugs
  const farmerIcon = useMemo(() => {
    if (!isClient) return undefined;
    return L.divIcon({
      className: 'custom-farmer-pin',
      html: `
        <div style="
          position: relative;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #00450d;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 4px 14px rgba(0, 69, 13, 0.45);
          cursor: pointer;
        ">
          <span style="font-size: 18px;">⭐</span>
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
      iconSize: [38, 44],
      iconAnchor: [19, 44],
      popupAnchor: [0, -42],
    });
  }, [isClient]);

  const standardMandiIcon = useMemo(() => {
    if (!isClient) return undefined;
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
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="w-full h-48 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-500 animate-pulse border border-slate-200">
        Loading Mandi Location Map...
      </div>
    );
  }

  return (
    <>
      {/* 1. EMBEDDED DASHBOARD MAP CONTAINER */}
      <div className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
        {/* Map Header Overlay */}
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
            className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
          >
            <span>🔍</span>
            <span>Tap to expand (बड़ा नक्शा)</span>
          </button>
        </div>

        {/* Small Interactive Map View */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="h-44 w-full cursor-pointer relative"
          title="Click to expand full screen map"
        >
          <MapContainer
            center={farmerCoords || defaultCenter}
            zoom={farmerCoords ? 12 : 6}
            scrollWheelZoom={false}
            dragging={false}
            zoomControl={false}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {farmerCoords && farmerIcon && (
              <Marker position={farmerCoords} icon={farmerIcon}>
                <Popup>
                  <div className="text-xs font-sans">
                    <strong className="text-emerald-900 block font-bold">
                      {farmerMandi?.name || farmerMandiName || 'Your Designated Mandi'}
                    </strong>
                    <span className="text-slate-600">District: {farmerMandi?.district || 'Karnal'}</span>
                  </div>
                </Popup>
              </Marker>
            )}
            <MapRecenter center={farmerCoords || defaultCenter} zoom={farmerCoords ? 12 : 6} />
          </MapContainer>

          {/* Hover Overlay Hint */}
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
            <span className="bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md backdrop-blur-xs flex items-center gap-1.5">
              <span>🗺️</span> Click to view all {validMandis.length} Geocoded Mandis
            </span>
          </div>
        </div>
      </div>

      {/* 2. FULL-SCREEN MODAL / OVERLAY MAP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 flex flex-col items-center justify-center animate-fadeIn">
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
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white p-2 sm:px-4 sm:py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
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

            {/* Full Leaflet Map View */}
            <div className="flex-1 w-full relative">
              <MapContainer
                center={farmerCoords || defaultCenter}
                zoom={farmerCoords ? 8 : 6}
                scrollWheelZoom={true}
                zoomControl={true}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render Farmer Mandi Marker if coordinates exist */}
                {farmerCoords && farmerIcon && (
                  <Marker position={farmerCoords} icon={farmerIcon}>
                    <Popup>
                      <div className="p-1 max-w-[220px]">
                        <div className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                          ⭐ YOUR DESIGNATED MANDI
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {farmerMandi?.name || farmerMandiName || 'Karnal Mandi'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          District: <strong>{farmerMandi?.district || 'Karnal'}</strong>
                        </p>
                        <p className="text-xs text-slate-600">
                          Capacity: {farmerMandi?.daily_capacity || 200} Qtl / day
                        </p>
                        <p className="text-xs text-slate-600">
                          Hours: {farmerMandi?.working_hours || '09:00-18:00'}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Render All Other Mandis */}
                {validMandis.map((m) => {
                  // Skip if it's the farmer's mandi to avoid duplicate marker
                  const isCurrentFarmerMandi =
                    (farmerMandi?.id && m.id === farmerMandi.id) ||
                    (farmerCoords !== null && m.latitude === farmerCoords[0] && m.longitude === farmerCoords[1]);

                  if (isCurrentFarmerMandi) return null;

                  return (
                    <Marker
                      key={m.id}
                      position={[m.latitude!, m.longitude!]}
                      icon={standardMandiIcon}
                    >
                      <Popup>
                        <div className="p-1 max-w-[220px]">
                          <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                            APMC Market
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{m.name}</h4>
                          <p className="text-xs text-slate-600 mt-0.5">
                            District: <strong>{m.district}</strong>
                          </p>
                          <p className="text-xs text-slate-600">
                            Capacity: {m.daily_capacity || 200} Qtl / day
                          </p>
                          <p className="text-xs text-slate-600">
                            Hours: {m.working_hours || '09:00-18:00'}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                <MapRecenter center={farmerCoords || defaultCenter} zoom={farmerCoords ? 8 : 6} />
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
