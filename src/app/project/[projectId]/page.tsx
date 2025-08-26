
'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
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
        <div className="relative h-screen w-screen bg-gray-900">
          <MapComponent />
          <ControlSidebar projectId={projectId} />
        </div>
      </MapProvider>
    </ProtectedRoute>
  );
}
