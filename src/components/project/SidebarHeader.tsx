
'use client';

import { Building, Filter, Layers3, Code } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface Project {
  name: string;
}

interface SidebarHeaderProps {
    project: Project | null;
    loading: boolean;
}

export default function SidebarHeader({ project, loading }: SidebarHeaderProps) {

  return (
    <div className="p-4 space-y-4 border-b border-sidebar-border">
        {/* Top Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-primary/80 p-1.5 rounded-md">
                    <Building className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white">CityInsights AI</h1>
                    <p className="text-xs text-gray-400">3.2.0</p>
                </div>
            </div>
            {/* Action Icons can go here */}
        </div>

        {/* Project Name */}
        <div>
            {loading ? (
                <Skeleton className="h-6 w-3/4 bg-gray-700/50" />
            ) : project ? (
                <h2 className="text-xl font-semibold text-gray-200">{project.name}</h2>
            ) : (
                <h2 className="text-xl font-semibold text-gray-400">Project not found</h2>
            )}
        </div>
        
        {/* Tool Icons */}
        <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-md cursor-pointer">
                <Layers3 className="h-5 w-5 text-white" />
            </div>
             <div className="p-2 rounded-md cursor-pointer hover:bg-white/10">
                <Filter className="h-5 w-5 text-gray-300" />
            </div>
             <div className="p-2 rounded-md cursor-pointer hover:bg-white/10">
                <Code className="h-5 w-5 text-gray-300" />
            </div>
        </div>
    </div>
  );
}
