
'use client';

import ControlSidebar from '@/components/project/ControlSidebar';
import MapComponent from '@/components/project/MapComponent';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Loader2 } from 'lucide-react';

// The component now accepts projectId as a prop instead of using useParams
interface ProjectWorkspaceProps {
  projectId: string;
}

export default function ProjectWorkspace({ projectId }: ProjectWorkspaceProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const checkProjectExists = async () => {
      try {
        const projectRef = doc(db, 'projects', projectId);
        const projectSnap = await getDoc(projectRef);
        if (!projectSnap.exists()) {
          setError('Project not found.');
        }
      } catch (err) {
        setError('Failed to fetch project data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkProjectExists();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading Project Workspace...</p>
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-gray-900 overflow-hidden">
      <MapComponent />
      <ControlSidebar projectId={projectId} />
    </div>
  );
}
