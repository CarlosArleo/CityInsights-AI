
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProjectWorkspace from '@/components/project/ProjectWorkspace';
import { MapProvider } from '@/context/MapContext';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

// This is now a Server Component
export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = params;

  return (
    <ProtectedRoute>
      <MapProvider>
        <ProjectWorkspace projectId={id} />
      </MapProvider>
    </ProtectedRoute>
  );
}
