
'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from '@/context/MapContext';

if (process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
}

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = useState(-74.0060);
  const [lat] = useState(40.7128);
  const [zoom] = useState(9);
  const { activeLayers } = useMap();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

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

    Object.keys(activeLayers).forEach(layerId => {
        const layerInfo = activeLayers[layerId];
        const sourceId = `source-${layerId}`;
        const layerPaintId = `layer-paint-${layerId}`;

        const source = map.current!.getSource(sourceId);

        if (layerInfo.visible) {
            if (!source) {
                // Add new source and layer
                map.current!.addSource(sourceId, {
                    type: 'geojson',
                    data: layerInfo.url
                });
                map.current!.addLayer({
                    id: layerPaintId,
                    type: 'fill',
                    source: sourceId,
                    paint: {
                        'fill-color': layerInfo.color,
                        'fill-opacity': 0.6
                    }
                });
            }
        } else {
            // Remove layer and source if it exists and should be hidden
            if (source) {
                if (map.current!.getLayer(layerPaintId)) {
                    map.current!.removeLayer(layerPaintId);
                }
                map.current!.removeSource(sourceId);
            }
        }
    });

    // Clean up layers that are no longer in activeLayers
    const currentMapLayers = map.current.getStyle().layers;
    if(currentMapLayers){
        currentMapLayers.forEach(mapLayer => {
            if (mapLayer.id.startsWith('layer-paint-')) {
                const layerId = mapLayer.id.replace('layer-paint-', '');
                if (!activeLayers[layerId] || !activeLayers[layerId].visible) {
                    const sourceId = `source-${layerId}`;
                    if (map.current!.getLayer(mapLayer.id)) map.current!.removeLayer(mapLayer.id);
                    if (map.current!.getSource(sourceId)) map.current!.removeSource(sourceId);
                }
            }
        });
    }


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

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
}
