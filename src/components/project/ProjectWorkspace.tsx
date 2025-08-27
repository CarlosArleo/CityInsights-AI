'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Project, ProjectFile, ReviewCard } from '@/lib/types';
import { Loader2 as LoadingSpinner } from 'lucide-react';
import { ControlSidebar } from '@/components/project/ControlSidebar'; // Correct NAMED import

type ProjectWorkspaceProps = {
  projectId: string;
};

export default function ProjectWorkspace({ projectId }: ProjectWorkspaceProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [reviews, setReviews] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLayerIds, setActiveLayerIds] = useState<string[]>([]);
  
  const MapComponent = useMemo(() => dynamic(() => import('@/components/project/MapComponent'), {
      loading: () => <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white"><LoadingSpinner className="animate-spin" /></div>,
      ssr: false
  }), []);

  useEffect(() => {
    if (!projectId || !db) return;

    setLoading(true);
    const unsubProject = onSnapshot(doc(db, 'projects', projectId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProject({
            id: doc.id,
            name: data.name,
            description: data.description,
            ownerId: data.ownerId,
            createdAt: data.createdAt?.toDate(),
         } as Project);
      } else {
        setProject(null);
      }
      setLoading(false);
    });
    
    const qFiles = query(collection(db, 'projects', projectId, 'files'), orderBy('createdAt', 'desc'));
    const unsubFiles = onSnapshot(qFiles, (snapshot) => {
      setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectFile)));
    });

    const qReviews = query(collection(db, 'projects', projectId, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubReviews = onSnapshot(qReviews, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReviewCard)));
    });

    return () => {
      unsubProject();
      unsubFiles();
      unsubReviews();
    };
  }, [projectId]);

  const handleLayerToggle = (fileId: string) => {
      setActiveLayerIds(prev => 
          prev.includes(fileId) 
          ? prev.filter(id => id !== fileId) 
          : [...prev, fileId]
      );
  };
  
  if (loading) {
    return <div className="flex h-screen w-screen items-center justify-center bg-background"><LoadingSpinner className="h-12 w-12 animate-spin" /></div>;
  }

  if (!project) {
    return <div className="flex h-screen w-screen items-center justify-center bg-background">Project not found.</div>;
  }

  // This line is crucial for calculating the prop
  const activeLayers = files.filter(f => activeLayerIds.includes(f.id));

  return (
    <div className="relative w-screen h-screen overflow-hidden">
       <div className="w-full h-full">
         {/* This line now correctly passes the required prop */}
         <MapComponent activeLayers={activeLayers} />
       </div>

      <ControlSidebar
        project={project}
        files={files}
        reviews={reviews}
        activeLayers={activeLayerIds}
        onLayerToggle={handleLayerToggle}
        onUploadComplete={() => {}}
      />
    </div>
  );
}
