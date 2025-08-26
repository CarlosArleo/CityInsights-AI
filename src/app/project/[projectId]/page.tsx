import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProjectWorkspace from '@/components/project/ProjectWorkspace';
import { MapProvider } from '@/context/MapContext';

// This is a Server Component, so its props are passed directly by Next.js.
// We define the shape of the `params` object it will receive.
export default function ProjectPage({ params }: { params: { projectId: string } }) {
  const { projectId } = params;

  return (
    <ProtectedRoute>
      <MapProvider>
        <ProjectWorkspace projectId={projectId} />
      </MapProvider>
    </ProtectedRoute>
  );
}
