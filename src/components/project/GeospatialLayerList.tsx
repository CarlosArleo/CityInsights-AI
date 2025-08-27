
'use client';

import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import type { ProjectFile } from '@/lib/types';

interface GeospatialLayerListProps {
  files: ProjectFile[];
  activeLayers: string[];
  onLayerToggle: (fileId: string) => void;
}

const layerColors = ['#F44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#FF9800'];

export default function GeospatialLayerList({ files, activeLayers, onLayerToggle }: GeospatialLayerListProps) {

  if (files.length === 0) {
    return (
       <div className="flex items-center justify-center p-4 bg-black/20 rounded-md">
        <p className="text-sm text-gray-400">No map layers uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 bg-black/20 p-2 rounded-md">
      {files.map((file, index) => {
        const isVisible = activeLayers.includes(file.id);
        const color = layerColors[index % layerColors.length];
        
        return (
          <div key={file.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5">
            <Checkbox
              id={`layer-${file.id}`}
              checked={isVisible}
              onCheckedChange={() => onLayerToggle(file.id)}
              className="border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor={`layer-${file.id}`} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <div className="w-3 h-3 rounded-sm border border-white/50" style={{ backgroundColor: color }} />
              <span className="truncate" title={file.name}>{file.name}</span>
            </Label>
          </div>
        )
      })}
    </div>
  );
}
