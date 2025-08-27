
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProjectWorkspace from '@/components/project/ProjectWorkspace';
import { MapProvider } from '@/context/MapContext';
import * as React from 'react';

// This server component is now a standard async function to correctly handle params.
export default async function ProjectPage({ params }: { params: { projectId: string } }) {
  
  return (
    <ProtectedRoute>
      <MapProvider>
        {/* The projectId is passed down as a prop for stability */}
        <ProjectWorkspace projectId={params.projectId} />
      </MapProvider>
    </ProtectedRoute>
  );
}
