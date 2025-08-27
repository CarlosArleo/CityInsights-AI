import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProjectWorkspace from '@/components/project/ProjectWorkspace';
import { MapProvider } from '@/context/MapContext';

// This page now correctly receives the dynamic projectId from the URL and is an async component
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
