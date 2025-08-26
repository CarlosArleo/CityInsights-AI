
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayerInfo {
  url: string;
  visible: boolean;
  color: string;
}

interface ActiveLayers {
  [id: string]: LayerInfo;
}

interface MapContextType {
  activeLayers: ActiveLayers;
  toggleLayer: (id: string, url: string, color: string) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [activeLayers, setActiveLayers] = useState<ActiveLayers>({});

  const toggleLayer = (id: string, url: string, color: string) => {
    setActiveLayers(prev => {
      const newLayers = { ...prev };
      if (newLayers[id]) {
        // Toggle visibility
        newLayers[id].visible = !newLayers[id].visible;
      } else {
        // Add new layer, initially visible
        newLayers[id] = { url, visible: true, color };
      }
      return newLayers;
    });
  };

  return (
    <MapContext.Provider value={{ activeLayers, toggleLayer }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};
