
'use client';
import 'mapbox-gl/dist/mapbox-gl.css';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import type { Project, ProjectFile, ReviewCard } from '@/lib/types';
import { db } from '@/lib/firebase/config';
import { collection, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import React, { useEffect, useState, useMemo } from 'react'; 
import { ControlSidebar } from '@/components/project/ControlSidebar';
import dynamic from 'next/dynamic';

// Define the correct props type for the page
type ProjectPageProps = {
  params: { projectId: string };
};

// Main component for the project page logic
function ProjectPageContents({ params }: ProjectPageProps) {
  const { projectId } = params; 
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [reviews, setReviews] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLayerIds, setActiveLayerIds] = useState<string[]>([]);
  
  const MapComponent = useMemo(() => dynamic(() => import('@/components/project/MapComponent'), {
      loading: () => <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white"><Loader2 /></div>,
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
          ownerId: data.ownerId,
          createdAt: data.createdAt?.toDate(),
        });
      } else {
        setProject(null);
      }
      setLoading(false);
    });
    
    const qFiles = query(collection(db, 'projects', projectId, 'files'), orderBy('createdAt', 'desc'));
    const unsubFiles = onSnapshot(qFiles, (snapshot) => {
      const newFiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectFile));
      setFiles(newFiles);
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
    return <div className="flex h-screen w-screen items-center justify-center bg-background">Project not found or you do not have access.</div>;
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
        onUploadComplete={() => { /* Can be used to trigger refetches if needed */ }}
      />
    </div>
  );
}

// The default export for the page, which handles the Next.js props
export default function GuardedProjectPage({ params }: { params: { projectId: string } }) {
    const mapboxApiKey = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!mapboxApiKey) {
      return <div className="h-screen w-screen flex items-center justify-center bg-background"><p>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not configured.</p></div>
    }
    return (
      <ProtectedRoute>
        <ProjectPageContents params={params} />
      </ProtectedRoute>
    );
}
