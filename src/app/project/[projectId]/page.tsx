
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProjectWorkspace from '@/components/project/ProjectWorkspace';
import { MapProvider } from '@/context/MapContext';
import * as React from 'react';

// Define the type for the component's props to satisfy Next.js type checking
type ProjectPageProps = {
  params: {
    projectId: string;
  };
};

// This server component is now a standard async function to correctly handle params.
export default async function ProjectPage({ params }: ProjectPageProps) {
  
  return (
    <ProtectedRoute>
      <MapProvider>
        {/* The projectId is passed down as a prop for stability */}
        <ProjectWorkspace projectId={params.projectId} />
      </MapProvider>
    </ProtectedRoute>
  );
}
