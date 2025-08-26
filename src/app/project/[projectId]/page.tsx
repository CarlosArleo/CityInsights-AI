
'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';
import ControlSidebar from '@/components/project/ControlSidebar';
import MapComponent from '@/components/project/MapComponent';

interface ProjectPageParams {
  params: {
    projectId: string;
  };
}

export default function ProjectPage({ params }: ProjectPageParams) {
  const { projectId } = params;

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full flex-col bg-background">
        <Header />
        <main className="relative flex-1">
          {/* The MapComponent and ControlSidebar are sibling components,
              allowing for a clean, layered layout without complex nesting. */}
          <MapComponent />
          <ControlSidebar projectId={projectId} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
