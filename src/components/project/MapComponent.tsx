
'use client';

import { useEffect, useRef, useState } from 'react';

// NOTE: You'll need to install mapbox-gl and its types
// npm install mapbox-gl
// npm install @types/mapbox-gl --save-dev
// You will also need to add your Mapbox access token to your environment variables
// NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here

// Since this is a prototype, we will just show a static placeholder image
// of a map for now. A real implementation would use the code below.

import Image from 'next/image';

export default function MapComponent() {
  return (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
       <Image
            src="https://picsum.photos/1600/1200"
            alt="Placeholder map"
            layout="fill"
            objectFit="cover"
            data-ai-hint="map dark"
        />
        <div className="absolute inset-0 bg-black/50" />
      <p className="text-white z-10">Map Component Placeholder</p>
    </div>
  );
}


/*
// --- REAL MAPBOX IMPLEMENTATION EXAMPLE ---
// Use this code once you are ready to integrate Mapbox for real.

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-74.0060);
  const [lat, setLat] = useState(40.7128);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once
    
    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
        console.error("Mapbox access token is not set!");
        return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Dark theme
      center: [lng, lat],
      zoom: zoom
    });

     map.current.on('move', () => {
        if(map.current){
            setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
            setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
            setZoom(parseFloat(map.current.getZoom().toFixed(2)));
        }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lng, lat, zoom]);

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
}
*/
