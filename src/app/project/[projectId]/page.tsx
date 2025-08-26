
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';
import ControlSidebar from '@/components/project/ControlSidebar';
import MapComponent from '@/components/project/MapComponent';

interface Project {
  name: string;
}

interface ProjectPageParams {
  params: {
    projectId: string;
  };
}

export default function ProjectPage({ params }: ProjectPageParams) {
  const { projectId } = params;
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
    <ProtectedRoute>
      <div className="flex h-screen w-full flex-col">
        <Header />
        <main className="relative flex-1">
          <div className="relative h-full w-full">
            <MapComponent />
            <ControlSidebar project={project} projectId={projectId} loading={loading} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
