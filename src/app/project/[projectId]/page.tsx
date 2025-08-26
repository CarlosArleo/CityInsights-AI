import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProjectWorkspace from '@/components/project/ProjectWorkspace';
import { MapProvider } from '@/context/MapContext';

// Correctly type the props for a dynamic Next.js page
interface ProjectPageProps {
  params: { projectId: string };
}

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
