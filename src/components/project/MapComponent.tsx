'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { ProjectFile } from '@/lib/types';

if (process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
}

interface MapComponentProps {
    activeLayers: ProjectFile[];
}

const layerColors = ['#F44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#FF9800'];

export default function MapComponent({ activeLayers }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current || !process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-95.9345, 41.2565],
      zoom: 3
    });

    map.current.on('load', () => setIsMapLoaded(true));

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Sync layers with activeLayers prop
  useEffect(() => {
    if (!isMapLoaded || !map.current) return;

    const currentMap = map.current;
    const activeLayerIds = activeLayers.map(l => l.id);

    // Get all layers currently on the map that our app manages
    const existingAppLayerIds = currentMap.getStyle().layers
        .map(l => l.id)
        .filter(id => id.startsWith('layer-paint-'));

    // --- CLEANUP LOGIC ---
    // 1. Remove layers that are no longer active
    existingAppLayerIds.forEach(layerId => {
        const fileId = layerId.replace('layer-paint-', '');
        if (!activeLayerIds.includes(fileId)) {
            const sourceId = `source-${fileId}`;
            // Correct order: Remove layer, THEN remove source
            if (currentMap.getLayer(layerId)) {
                currentMap.removeLayer(layerId);
            }
            if (currentMap.getSource(sourceId)) {
                currentMap.removeSource(sourceId);
            }
        }
    });

    // --- ADD NEW LAYERS LOGIC ---
    // 2. Add new active layers that are not yet on the map
    activeLayers.forEach((layerInfo, index) => {
        const sourceId = `source-${layerInfo.id}`;
        const layerPaintId = `layer-paint-${layerInfo.id}`;

        if (!currentMap.getSource(sourceId)) {
            currentMap.addSource(sourceId, {
                type: 'geojson',
                data: layerInfo.url
            });
            currentMap.addLayer({
                id: layerPaintId,
                type: 'fill',
                source: sourceId,
                paint: {
                    'fill-color': layerColors[index % layerColors.length],
                    'fill-opacity': 0.6,
                    'fill-outline-color': '#FFFFFF'
                }
            });
        }
    });

  }, [activeLayers, isMapLoaded]);


  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center p-4 bg-red-900/50 rounded-lg border border-red-500 text-white">
                <h2 className="text-xl font-bold">Map Configuration Error</h2>
                <p>Mapbox access token is not set.</p>
                <p className="text-sm mt-2">Please add `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` to your environment variables.</p>
            </div>
        </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full" />;
}
