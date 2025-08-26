
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProjectWorkspace from '@/components/project/ProjectWorkspace';
import { MapProvider } from '@/context/MapContext';

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

// This is now a Server Component
export default function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = params;

  return (
    <ProtectedRoute>
      <MapProvider>
        <ProjectWorkspace projectId={projectId} />
      </MapProvider>
    </ProtectedRoute>
  );
}
