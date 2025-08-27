'use client'; // This remains a client component because of the hooks

import React, { useEffect, useState, useMemo } from 'react'; // Import React
import 'mapbox-gl/dist/mapbox-gl.css';

import AuthRoute from '@/components/auth/AuthRoute';
import { Loader2 } from 'lucide-react';
import type { Project, ProjectFile, ReviewCard } from '@/lib/types';
import { db } from '@/lib/firebase/config';
import { collection, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { ControlSidebar } from '@/components/project/ControlSidebar'; 
import dynamic from 'next/dynamic';

// This is the main component that will be rendered by the page
function ProjectWorkspace() {
  // We use useParams() here, which is the standard hook for client components
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [reviews, setReviews] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLayerIds, setActiveLayerIds] = useState<string[]>([]);
  
  const MapComponent = useMemo(() => dynamic(() => import('@/components/project/MapComponent'), {
      loading: () => <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white"><Loader2 className="h-8 w-8 animate-spin" /></div>,
      ssr: false
  }), []);

  useEffect(() => {
    if (!projectId || !db) return;

    setLoading(true);
    const unsubProject = onSnapshot(doc(db, 'projects', projectId), (doc) => {
      if (doc.exists()) {
        setProject({ id: doc.id, ...doc.data() } as Project);
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
    return <div className="flex h-screen w-screen items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  if (!project) {
    return <div className="flex h-screen w-screen items-center justify-center bg-background">Project not found.</div>;
  }

  const activeLayers = files.filter(f => activeLayerIds.includes(f.id));

  return (
    <div className="relative w-screen h-screen overflow-hidden">
       <div className="w-full h-full">
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


// This is the default export for the page. It handles the auth guard.
export default function GuardedProjectPage() {
    return (
      <AuthRoute>
        <ProjectWorkspace />
      </AuthRoute>
    );
}
