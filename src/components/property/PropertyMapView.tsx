import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  ArrowUpRight, 
  CheckCircle2, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { Property } from '../../types/property';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface PropertyMapViewProps {
  properties: Property[];
  hoveredPropertyId?: string | null;
  onHoverProperty?: (id: string | null) => void;
}

export const PropertyMapView: React.FC<PropertyMapViewProps> = ({
  properties,
  hoveredPropertyId,
  onHoverProperty,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState<'voyager' | 'light'>('voyager');

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || null;

  // Format short price tag for map pill marker
  const formatShortPrice = (prop: Property): string => {
    if (prop.listingType === 'rent') {
      if (prop.price >= 1000) {
        return `$${(prop.price / 1000).toFixed(prop.price % 1000 === 0 ? 0 : 1)}k/mo`;
      }
      return `$${prop.price}/mo`;
    }
    if (prop.price >= 1_000_000) {
      const millions = prop.price / 1_000_000;
      return `$${millions.toFixed(millions >= 10 ? 1 : 2).replace(/\.0+$/, '')}M`;
    }
    if (prop.price >= 1000) {
      return `$${(prop.price / 1000).toFixed(0)}k`;
    }
    return `$${prop.price}`;
  };

  // Helper to create HTML for marker icon
  const createMarkerHtml = useCallback((prop: Property, isSelected: boolean, isHovered: boolean) => {
    const priceText = formatShortPrice(prop);
    const active = isSelected || isHovered;
    
    return `
      <div class="group relative cursor-pointer select-none transition-transform duration-200 ${active ? 'scale-110 z-50' : 'scale-100 z-10'}">
        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 ${
          active 
            ? 'bg-stone-950 text-white shadow-xl ring-2 ring-stone-900 border border-stone-800' 
            : 'bg-white text-stone-900 shadow-md border border-stone-300 hover:border-stone-900 hover:bg-stone-50'
        }">
          <span class="w-1.5 h-1.5 rounded-full ${prop.verified ? 'bg-emerald-500' : 'bg-stone-400'}"></span>
          <span>${priceText}</span>
        </div>
        <div class="w-2 h-2 rotate-45 mx-auto -mt-1 ${
          active ? 'bg-stone-950' : 'bg-white border-r border-b border-stone-300'
        }"></div>
      </div>
    `;
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center across continental US or first property
      const initialLat = properties[0]?.location.coordinates.lat || 37.7749;
      const initialLng = properties[0]?.location.coordinates.lng || -122.4194;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Voyager or Light tiles
      const tileUrl = mapStyle === 'voyager'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile layer if style changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl = mapStyle === 'voyager'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);
  }, [mapStyle]);

  // Synchronize Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    if (properties.length === 0) return;

    const bounds = L.latLngBounds([]);

    properties.forEach((property) => {
      const { lat, lng } = property.location.coordinates;
      if (typeof lat !== 'number' || typeof lng !== 'number') return;

      const isSelected = selectedPropertyId === property.id;
      const isHovered = hoveredPropertyId === property.id;

      const customIcon = L.divIcon({
        className: 'custom-property-marker-wrapper',
        html: createMarkerHtml(property, isSelected, isHovered),
        iconSize: [80, 36],
        iconAnchor: [40, 34],
      });

      const marker = L.marker([lat, lng], { icon: customIcon, zIndexOffset: isSelected ? 1000 : 0 });

      marker.on('click', () => {
        setSelectedPropertyId(property.id);
        map.panTo([lat, lng], { animate: true, duration: 0.5 });
      });

      marker.on('mouseover', () => {
        if (onHoverProperty) onHoverProperty(property.id);
      });

      marker.on('mouseout', () => {
        if (onHoverProperty) onHoverProperty(null);
      });

      marker.addTo(map);
      markersRef.current.set(property.id, marker);
      bounds.extend([lat, lng]);
    });

    // Fit map bounds to encompass all visible properties
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
        animate: true,
      });
    }

    // Invalidate size in case container dimensions updated
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [properties, createMarkerHtml]);

  // Update marker icons on hover/select without rebuilding entire map
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const prop = properties.find((p) => p.id === id);
      if (!prop) return;

      const isSelected = selectedPropertyId === id;
      const isHovered = hoveredPropertyId === id;

      const newIcon = L.divIcon({
        className: 'custom-property-marker-wrapper',
        html: createMarkerHtml(prop, isSelected, isHovered),
        iconSize: [80, 36],
        iconAnchor: [40, 34],
      });

      marker.setIcon(newIcon);
      if (isSelected || isHovered) {
        marker.setZIndexOffset(1000);
      } else {
        marker.setZIndexOffset(0);
      }
    });
  }, [hoveredPropertyId, selectedPropertyId, properties, createMarkerHtml]);

  // Handle fit bounds reset
  const handleResetBounds = () => {
    const map = mapInstanceRef.current;
    if (!map || properties.length === 0) return;

    const bounds = L.latLngBounds([]);
    properties.forEach((p) => {
      bounds.extend([p.location.coordinates.lat, p.location.coordinates.lng]);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  // Toggle map height
  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  };

  return (
    <div className="relative border border-stone-200 bg-stone-100 overflow-hidden shadow-sm transition-all duration-300">
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2">
        <div className="bg-white/95 backdrop-blur-sm border border-stone-200/80 px-3 py-1.5 shadow-sm text-xs font-medium text-stone-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-stone-900">{properties.length}</span>
          <span className="text-stone-500">
            {properties.length === 1 ? 'Location Listed' : 'Locations Listed'}
          </span>
        </div>

        {/* Style switcher */}
        <button
          type="button"
          onClick={() => setMapStyle((s) => (s === 'voyager' ? 'light' : 'voyager'))}
          className="bg-white/95 backdrop-blur-sm border border-stone-200/80 hover:bg-white text-stone-700 hover:text-stone-950 px-2.5 py-1.5 shadow-sm text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Switch map theme"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline capitalize">{mapStyle}</span>
        </button>
      </div>

      {/* Right Map Action Controls */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5">
        <div className="bg-white/95 backdrop-blur-sm border border-stone-200/80 shadow-sm flex flex-col">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-50 border-b border-stone-100 font-semibold text-sm transition-colors"
            title="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-50 font-semibold text-sm transition-colors"
            title="Zoom out"
          >
            −
          </button>
        </div>

        <button
          type="button"
          onClick={handleResetBounds}
          className="w-8 h-8 bg-white/95 backdrop-blur-sm border border-stone-200/80 shadow-sm flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-50 transition-colors"
          title="Fit all markers"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleToggleExpand}
          className="w-8 h-8 bg-white/95 backdrop-blur-sm border border-stone-200/80 shadow-sm flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-50 transition-colors"
          title={isExpanded ? 'Collapse map' : 'Expand map height'}
        >
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div
        ref={mapContainerRef}
        className={`w-full transition-all duration-300 z-0 ${
          isExpanded ? 'h-[620px] sm:h-[720px]' : 'h-[440px] sm:h-[500px]'
        }`}
      />

      {/* Interactive Selected Property Overlay Card */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-[400] bg-white border border-stone-300 shadow-2xl p-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                {selectedProperty.category} · {selectedProperty.location.city}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPropertyId(null)}
              className="text-stone-400 hover:text-stone-900 p-0.5"
              title="Close card"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-3 pt-2.5">
            <div className="w-24 h-20 shrink-0 bg-stone-100 overflow-hidden relative border border-stone-200">
              <ImageWithFallback
                src={selectedProperty.images[0]}
                alt={selectedProperty.title}
                fallbackTitle={selectedProperty.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 bg-stone-900/90 text-white text-[9px] px-1 font-mono">
                {selectedProperty.listingType === 'buy' ? 'SALE' : 'LEASE'}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-stone-950 truncate">
                {selectedProperty.title}
              </h4>
              <p className="text-[11px] text-stone-500 truncate mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0 text-stone-400" />
                <span>{selectedProperty.location.neighborhood}, {selectedProperty.location.city}</span>
              </p>
              <div className="text-xs font-bold text-stone-900 mt-1 font-mono">
                {selectedProperty.priceDisplay}
              </div>

              {/* Specs row */}
              <div className="flex items-center gap-2 text-[10px] text-stone-600 mt-1.5 font-mono">
                {selectedProperty.specs.beds > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Bed className="w-3 h-3 text-stone-400" />
                    <span>{selectedProperty.specs.beds}b</span>
                  </span>
                )}
                {selectedProperty.specs.baths > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Bath className="w-3 h-3 text-stone-400" />
                    <span>{selectedProperty.specs.baths}ba</span>
                  </span>
                )}
                {selectedProperty.specs.sqft > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Square className="w-3 h-3 text-stone-400" />
                    <span>{selectedProperty.specs.sqft.toLocaleString()}sf</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
            {selectedProperty.verified && (
              <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Digentic Verified</span>
              </span>
            )}
            <Link
              to={`/properties/${selectedProperty.slug}`}
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-stone-700 underline"
            >
              <span>Explore Property</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Subtle bottom footer attribution & tip */}
      <div className="absolute bottom-2 right-3 z-[400] text-[10px] font-mono text-stone-400/90 pointer-events-none hidden sm:block">
        Click marker to preview · Scroll to zoom
      </div>
    </div>
  );
};
