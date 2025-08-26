
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Skeleton } from '@/components/ui/skeleton';
import FileUpload from '@/components/project/FileUpload';
import DocumentList from '@/components/project/DocumentList';
import GeospatialLayerList from './GeospatialLayerList';
import ReviewList from './ReviewList';
import StrategicAnalysis from './StrategicAnalysis';
import SidebarHeader from './SidebarHeader';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

interface Project {
  name: string;
}

interface ControlSidebarProps {
  projectId: string;
}

export default function ControlSidebar({ projectId }: ControlSidebarProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    const docRef = doc(db, 'projects', projectId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProject(docSnap.data() as Project);
      } else {
        console.log("No such document!");
        setProject(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  return (
    <div 
      className="absolute top-0 left-0 z-10 w-[300px] h-screen flex flex-col bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)] shadow-2xl"
    >
      <SidebarHeader project={project} loading={loading} />
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
            {/* Datasets Panel */}
            <div className="bg-transparent rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Datasets</h2>
                <FileUpload projectId={projectId} />
                <Separator className="my-3 bg-sidebar-border" />
                <DocumentList projectId={projectId} />
            </div>

             {/* Layers Panel */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Layers</h2>
                <GeospatialLayerList projectId={projectId} />
            </div>

            <Separator className="my-3 bg-sidebar-border" />

             {/* HITL Review Panel */}
             <ReviewList projectId={projectId} />

            <Separator className="my-3 bg-sidebar-border" />

            {/* Strategic Analysis Panel */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Strategic Analysis</h2>
                <StrategicAnalysis />
            </div>
        </div>
      </ScrollArea>
    </div>
  );
}
