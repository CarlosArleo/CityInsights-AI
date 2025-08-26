import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProjectWorkspace from '@/components/project/ProjectWorkspace';
import { MapProvider } from '@/context/MapContext';

export default function ProjectPage() {
  return (
    <ProtectedRoute>
      <MapProvider>
        <ProjectWorkspace />
      </MapProvider>
    </ProtectedRoute>
  );
}
