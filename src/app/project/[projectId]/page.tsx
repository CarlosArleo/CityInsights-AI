
'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';
import ControlSidebar from '@/components/project/ControlSidebar';
import MapComponent from '@/components/project/MapComponent';
import { MapProvider } from '@/context/MapContext';

interface ProjectPageParams {
  params: {
    projectId: string;
  };
}

export default function ProjectPage({ params }: ProjectPageParams) {
  const { projectId } = params;

  return (
    <ProtectedRoute>
      <MapProvider>
        <div className="flex h-screen w-full flex-col bg-background">
          <Header />
          <main className="relative flex-1">
            <MapComponent />
            <ControlSidebar projectId={projectId} />
          </main>
        </div>
      </MapProvider>
    </ProtectedRoute>
  );
}
