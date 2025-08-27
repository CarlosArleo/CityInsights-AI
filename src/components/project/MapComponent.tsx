
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
  const [lng] = useState(-74.0060);
  const [lat] = useState(40.7128);
  const [zoom] = useState(9);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const activeLayerIds = activeLayers.map(l => l.id);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    
    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
        console.error("Mapbox access token is not set!");
        return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('load', () => {
        setIsMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !map.current) return;

    const currentMapLayerIds = map.current.getStyle().layers
        .map(l => l.id)
        .filter(id => id.startsWith('layer-paint-'))
        .map(id => id.replace('layer-paint-', ''));

    // Remove layers that are no longer active
    currentMapLayerIds.forEach(mapLayerId => {
        if (!activeLayerIds.includes(mapLayerId)) {
            const sourceId = `source-${mapLayerId}`;
            if (map.current?.getLayer(mapLayerId)) {
                map.current.removeLayer(mapLayerId);
            }
            if (map.current?.getSource(sourceId)) {
                map.current.removeSource(sourceId);
            }
        }
    });

    // Add new active layers
    activeLayers.forEach((layerInfo, index) => {
        const sourceId = `source-${layerInfo.id}`;
        const layerPaintId = `layer-paint-${layerInfo.id}`;

        if (!map.current?.getSource(sourceId)) {
            map.current?.addSource(sourceId, {
                type: 'geojson',
                data: layerInfo.url
            });
            map.current?.addLayer({
                id: layerPaintId,
                type: 'fill',
                source: sourceId,
                paint: {
                    'fill-color': layerColors[index % layerColors.length],
                    'fill-opacity': 0.6
                }
            });
        }
    });

  }, [activeLayers, activeLayerIds, isMapLoaded]);


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

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
}
