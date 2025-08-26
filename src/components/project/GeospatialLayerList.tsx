
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useMap } from '@/context/MapContext';

interface GeoJsonFile {
  id: string;
  name: string;
  url: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  createdAt: Timestamp;
}

interface GeospatialLayerListProps {
  projectId: string;
}

const layerColors = ['#F44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#FF9800'];

export default function GeospatialLayerList({ projectId }: GeospatialLayerListProps) {
  const [files, setFiles] = useState<GeoJsonFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleLayer, activeLayers } = useMap();

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    const filesQuery = query(
      collection(db, 'projects', projectId, 'files'),
      where('type', '==', 'geojson'),
      where('status', '==', 'completed'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(filesQuery, (querySnapshot) => {
      const filesData: GeoJsonFile[] = [];
      querySnapshot.forEach((doc) => {
        filesData.push({ id: doc.id, ...doc.data() } as GeoJsonFile);
      });
      setFiles(filesData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching geospatial layers:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full bg-gray-700/50" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
       <p className="text-sm text-gray-400 px-2 py-4 text-center">No map layers uploaded.</p>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file, index) => {
        const isVisible = activeLayers[file.id]?.visible || false;
        const color = layerColors[index % layerColors.length];
        
        return (
          <div key={file.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5">
            <Checkbox
              id={`layer-${file.id}`}
              checked={isVisible}
              onCheckedChange={() => toggleLayer(file.id, file.url, color)}
              className="border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor={`layer-${file.id}`} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <div className="w-4 h-4 rounded-sm border border-white/50" style={{ backgroundColor: color }} />
              <span>{file.name}</span>
            </Label>
          </div>
        )
      })}
    </div>
  );
}
